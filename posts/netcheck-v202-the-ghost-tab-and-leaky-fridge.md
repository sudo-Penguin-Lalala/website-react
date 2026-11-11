---
title: "I Forgot an Entire Feature in My Own Rewrite (and Other Plumbing Disasters :D)"
date: "2026-11-11T20:15:00+08:00"
tags: ["Golang", "Networking", "Silly", "Security", "Bugs"]
summary: "Forgetting to register routes in main.go, a DNS tool that acted like an overly friendly golden retriever, and leaving the socket fridge door wide open."
---

You know that feeling when you spend an entire week building a custom sports car from scratch? You hand-craft the engine, polish the paint job, tune the exhaust to perfection, invite your friends over to admire it, get into the driver's seat, look up... and realize you completely forgot to install the steering wheel?

Yeah. That was me with NetCheck v2.0.2.

---

### The Mystery of the 404 Ghost Tab

After releasing v2.0.0 and v2.0.1, I was strutting around like a proud peacock. The Go rewrite was glorious: 8.5MB Docker image, 7.6MB idle RAM, sub-millisecond responses. I was basically a wizard.

Then somebody opened NetCheck, clicked on the **Request Headers** tab, clicked "Run"... and NetCheck calmly looked them in the eye and said:

```json
{"error": "404 Not Found"}
```

I stared at my screen. I checked the frontend code: button was there. Checked the CSS: beautiful. Checked `internal/handlers`: wait... the Go function was literally sitting in the codebase, fully written, fully compiled... 

**And I had completely forgotten to wire it into the HTTP router in `main.go`.**

It wasn't broken. It wasn't crashing. It literally did not exist in the eyes of the web server because I forgot one single line of code lol:

```go
// The line that my sleep-deprived brain forgot for two whole minor versions :D
mux.HandleFunc("GET /api/headers", handlers.HeadersHandler)
```

Two whole releases went by with an entire UI tab pointing into the cold, empty void of cyberspace. Peak software engineering.

---

### The DNS Resolver Was an Overly Friendly Golden Retriever

Once I recovered from the humiliation of the 404 tab, I decided to aggressively test the rest of NetCheck to see what other stupid things I had done.

My Ping and Port tools had strict SSRF security. They acted like grumpy bouncers outside an exclusive nightclub: if anyone tried to ping `127.0.0.1` or internal subnets (`192.168.1.1`), the bouncer slammed the door in their face.

**Except the custom DNS resolver.**

The DNS resolver was not a bouncer. The DNS resolver was an overly friendly golden retriever who loved everyone.

If a curious user typed `127.0.0.1:53` or AWS cloud metadata `169.254.169.254` into the DNS server field, the resolver would wag its tail happily and say: *"Oh boy! A new friend! Let me go knock on that door right now and ask for names! :D"*

No. Bad dog. Sit.

I had to put a bouncer in front of the golden retriever. Any custom DNS query trying to talk to loopback, private LANs, or link-local cloud metadata now gets thrown out the window with a crisp `403 Forbidden`.

---

### Leaving the Fridge Door Wide Open (Socket Leaks)

Next up on my tour of questionable life choices: the IP lookup tool.

Whenever NetCheck checks who owns an IP address, it queries upstream APIs. In my infinite wisdom, I wrote the cleanup logic like this:

> *"If the external API returns 200 OK, close the response body! Good job!"*

...Do you see the problem?

If the external API got angry and returned `429 Too Many Requests` or `502 Bad Gateway`, NetCheck simply... walked away. It left the TCP socket connection hanging open in memory like someone opening the refrigerator, seeing there are no snacks, and walking into the living room while leaving the fridge door wide open.

Do that a couple hundred times during a network hiccup, and your Linux kernel runs out of file descriptors and starts questioning why it was ever booted. Now the fridge door gets slammed shut immediately on every single request, success or failure.

---

### Paranoia Level 999: Timing Attacks on Passwords

NetCheck lets you set an `AUTH_TOKEN` so random strangers on the Internet can't abuse your diagnostic server.

To prevent hackers from guessing your token using nanosecond timing attacks, I used Go's official `crypto/subtle.ConstantTimeCompare`. Because I am a security professional.

Except Go's `ConstantTimeCompare` has a tiny, hilarious caveat: **it checks string lengths first**. If your secret token is 32 characters long and an attacker sends a 5-character string, it bails out immediately without doing the constant-time comparison.

Now, could someone with a god-tier 0.1ms ping and an atomic clock actually measure a 0.00000002 millisecond difference over the public Internet to guess the character count of my secret password? 

Probably not. But the thought kept me awake at night anyway.

So in v2.0.2, NetCheck hashes both tokens into 32-byte SHA-256 digests first before comparing them. Now both sides are always exactly 32 bytes long. Take that, theoretical quantum physicists with oscilloscopes :D.

---

### Also: Rate Limiter on an All-Salad Diet

Previously, the rate limiter tracked every visitor IP in a Go map. If a botnet rotated through 500,000 fake IPs, the map just grew and grew like a Tamagotchi that never stops eating.

I slapped a hard ceiling of 10,000 IPs with automatic LRU eviction. Now when memory reaches ~5MB, it stays at ~5MB forever. No more memory bloat.

---

### The Moral of the Story

1. Always check if you actually registered your routes in `main.go`.
2. Do not let your DNS resolver talk to strangers.
3. Close the fridge door.
4. If you clicked on the Headers tab in v2.0.0 or v2.0.1 and thought your browser was broken: it wasn't you, it was me :D.

v2.0.2 is live, all leaky pipes are welded shut, and the Headers tab actually does things now!

---

* **GitHub:** [sudo-Penguin-Lalala/netcheck](https://github.com/sudo-Penguin-Lalala/netcheck)
* **Docker Image:** `nnt25/netcheck:v2.0.2` (or `:latest`)
