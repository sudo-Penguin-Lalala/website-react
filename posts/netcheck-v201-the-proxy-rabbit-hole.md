---
title: "Why My Own App Accused Me of Being a Cloudflare Datacenter (and Fixing It at 2 AM :D)"
date: "2026-11-10T18:23:18+08:00"
tags: ["Docker", "Networking", "Silly", "Cloudflare"]
summary: "A comedy of errors with Docker bridge gateways, getting rate limited by my own software, and turning GitHub Actions from a hamster wheel into a 94-second rocket."
---

About two hours after happily flexing the v2.0.0 Go rewrite, I pulled the shiny new image onto my server, opened NetCheck through my Cloudflare Tunnel domain, and looked up at the "Your connection" badge expecting to see my cozy home WiFi.

Instead, my own app looked right through me with dead eyes and said:

```
Your connection: Oracle Corporation / Hetzner Datacenter (ASxxxxx)
```

Excuse me? I was sitting on my chair in my pajamas, but according to my app, I was a 42U rack-mounted server humming inside a Frankfurt datacenter with redundant diesel generators.

Classic. The rewrite was barely 120 minutes old and already having a full-blown existential crisis lol.

---

### The Mystery of the Paranoid App

NetCheck has strict anti-spoofing logic: it only trusts client IP headers (`CF-Connecting-IP`, `X-Forwarded-For`) if the incoming TCP socket matches an address range declared in `TRUSTED_PROXIES`.

Here was the comedy of errors that unfolded:
1. Cloudflare Tunnel (`cloudflared`) forwarded traffic to the NetCheck container **locally**.
2. Because it was local, Linux decided to use IPv6 loopback (`::1`), while Docker's bridge network routed traffic through gateway `172.17.0.1`.
3. My config was strictly trusting `127.0.0.1`.
4. NetCheck saw `::1`, panicked, shouted *"IMPOSTOR! UNTRUSTED PEER!"*, and tossed my real home IP straight into the shredder.
5. Seeing a private IP, it then politely asked an external whoami service *"Hey bro, who am I?"*—which dutifully reported the public egress IP of the VPS host!

Result: NetCheck thought I was the server it was currently running on. Poetic, but deeply unhelpful :D.

Fixing it took a few lines: cleanly unmap IPv6 `::1`, support wildcard `*`, and automatically trust standard Docker bridge subnets by default so nobody else has to endure this identity crisis.

---

### Getting Rate-Limited by My Own App (Peak Developer Moment)

While rapidly clicking between tabs to test the IP fix (DNS -> Ping -> SSL -> WHOIS at 300 APM), the screen suddenly went pitch black and slapped me with:

```
HTTP 429: Rate Limit Exceeded
```

**I managed to get rate-limited by my own app on my own server :D.**

Turns out the old code had hardcoded a strict 10 requests/minute with a burst of 5. That's great for public anti-DDoS, but terrible when you are an over-caffeinated developer frantically spamming buttons to see if things work.

So I un-hardcoded the whole thing:
* Bumped the default to **60 req/min (burst 20)** so normal human clicking stays smooth.
* Made it configurable via `RATE_LIMIT_RPM` and `RATE_LIMIT_BURST`.
* Added `RATE_LIMIT_RPM=0` (or `off`) so anyone running NetCheck in a private homelab can disable rate limits entirely and click like an absolute maniac without getting scolded by their own computer.

---

### Slashing CI Build Times: From Hamster Wheel to Rocket (7m -> 94s)

While pushing the hotfix, watching GitHub Actions spend **7 minutes** cross-compiling multi-arch Docker images via QEMU software emulation was testing my remaining sanity. A single CPU core was sweating bullets trying to translate ARM64 instructions on an x86 runner like a calculator trying to run Crysis.

So I moved the `build-and-push` pipeline to a dedicated ARM64 runner with a persistent cache:
* Native compilation takes **31 seconds** instead of 5 minutes under QEMU software translation.
* Mounted the vulnerability scanner database to a local cache volume—dropping security scans from 1m 30s down to **6 seconds**.

Total CI time plummeted from **~7 minutes down to 1 minute 34 seconds** (4.5x faster). Now the build finishes before I can even walk to the kitchen to grab water.

---

### The Final Compose (Chef's Kiss)

```yaml
services:
  netcheck:
    image: nnt25/netcheck:v2.0.1 # or :latest
    container_name: netcheck
    restart: unless-stopped
    ports:
      # Bound strictly to localhost so it is never exposed directly to the WAN
      - "127.0.0.1:7070:7070"
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    environment:
      - PORT=7070
      - TRUSTED_PROXIES=127.0.0.1,::1,172.16.0.0/12,10.0.0.0/8,192.168.0.0/16
      - ALLOW_PRIVATE_TARGETS=0
      - RATE_LIMIT_RPM=60 # Or set to 0 for unlimited chaos mode :D
      - RATE_LIMIT_BURST=20
```

v2.0.1 is live, my home ISP shows up properly, and I can spam-click buttons as fast as my caffeine levels allow :D.

---

If you want to check it out, update your Compose file, or steal the CI configuration for your own projects :D:
* **GitHub:** [sudo-Penguin-Lalala/netcheck](https://github.com/sudo-Penguin-Lalala/netcheck)
* **Docker Image:** `nnt25/netcheck:v2.0.1` (or `:latest`)
