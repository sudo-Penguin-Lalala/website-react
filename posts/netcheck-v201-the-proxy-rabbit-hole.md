---
title: "Why My Brand New App Thought I Was a Datacenter (and Fixing It in 2 Hours :D)"
date: "2026-11-10T18:23:18+08:00"
tags: ["Docker", "Networking", "Silly", "Cloudflare"]
summary: "A comedy of errors with Docker bridge gateways, getting rate limited by my own app, and slashing CI build times to 94 seconds."
---

About two hours after happily flexing the v2.0.0 Go rewrite, I pulled the new image onto my server, opened NetCheck through my Cloudflare Tunnel domain, and looked at the shiny "Your connection" banner expecting to see my home WiFi.

Instead, my own app proudly greeted me with:
`Your connection: Hosting Provider Network (ASxxxxx)`

Classic. The rewrite was barely two hours old and already having an identity crisis lol.

### The Mystery of the Missing Client IP
NetCheck has strict anti-spoofing logic: it only trusts client IP headers (`CF-Connecting-IP`, `X-Forwarded-For`) if the incoming connection arrives from an IP declared in `TRUSTED_PROXIES`.

Here was the comedy of errors:
1. `cloudflared` proxies requests to the container **locally**.
2. On Linux, `localhost` often resolves to IPv6 loopback (`::1`), while Docker's bridge network routes traffic through gateway `172.17.0.1`.
3. Because my config strictly trusted `127.0.0.1`, NetCheck went: *"Stranger danger! Untrusted peer!"* and tossed my real IP straight into the trash.
4. Seeing a private IP, it asked an external whoami service *"who am I?"*—which dutifully reported the public IP of my hosting server!

Fixing it took a few minutes: cleanly unmap IPv6 `::1`, support wildcard `*`, and whitelist Docker's `172.16.0.0/12` subnet.

### Bonus Silly Bug: Getting Rate Limited by Myself :D
While rapidly clicking between tabs to test the fix (DNS -> Ping -> SSL in like 5 seconds), the screen suddenly went red with:
`HTTP 429: Rate Limit Exceeded`

**I got rate limited by my own app on my own server lol.**

Turns out the old code had hardcoded a strict 10 requests/minute (burst of 5). That's great for public anti-spam, but terrible when you're an excited dev frantically clicking buttons.

So I un-hardcoded the whole thing:
* Bumped the default to **60 req/min (burst 20)** so rapid clicking stays smooth.
* Made it configurable via `RATE_LIMIT_RPM` and `RATE_LIMIT_BURST`.
* Added `RATE_LIMIT_RPM=0` so anyone running in a homelab can disable rate limits entirely and go wild :D

### Bonus Round: Slashing CI Build Times to 94 Seconds
While pushing the hotfix, waiting 7 minutes for GitHub Actions to cross-compile multi-arch images via QEMU emulation was testing my patience.

So I moved the `build-and-push` job to a dedicated self-hosted runner:
* Native compilation takes 31 seconds instead of 5 minutes under QEMU.
* Mounted the vulnerability scanner database to a persistent local cache—dropping security scans from 1m 30s down to **6 seconds**.

Total CI build time went from **~7 minutes down to 1 minute 34 seconds** (4.5x faster).

### The Final Compose (Chef's Kiss)

```yaml
services:
  netcheck:
    image: nnt25/netcheck:latest # or :v2.0.1
    container_name: netcheck
    restart: unless-stopped
    ports:
      # Bound strictly to localhost so it is never exposed to the public WAN
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
      - RATE_LIMIT_RPM=60 # Or set to 0 for unlimited mode :D
      - RATE_LIMIT_BURST=20
```

v2.0.1 is live, my home IP shows up properly, and I can spam-click buttons as fast as I want without getting rate limited by myself :D

---

If you want to check it out, update your Compose file, or steal the CI configuration for your own projects :D:
* **GitHub:** [sudo-Penguin-Lalala/netcheck](https://github.com/sudo-Penguin-Lalala/netcheck)
* **Docker Image:** `nnt25/netcheck:v2.0.1` (or `:latest`)
