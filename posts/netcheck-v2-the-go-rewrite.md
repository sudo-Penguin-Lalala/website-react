---
title: "I Spent An Entire Saturday Rewriting NetCheck in Go Just to Save 40MB of RAM (Worth It :D)"
date: "2026-11-10T16:07:13+08:00"
tags: ["Golang", "Docker", "Silly", "Optimization"]
summary: "Tearing down a perfectly working 34MB Python app to build an 8.5MB bare scratch container. Did ping get any faster? Absolutely not lol."
---

When I first built NetCheck, Python and FastAPI felt like the ultimate life hack. You glue together `dnspython` and `python-whois`, bind a cute little SQLite database to disk for caching, and boom—you are a 10x network engineer before dinner.

It worked. People self-hosted it. It solved the core problem: running network diagnostics from independent vantage points without exposing your own IP address.

Except reality is rude.

My little diagnostic tool spent 99% of its day doing literally nothing, yet was comfortably sitting in Docker eating ~48MB of RAM like an open Chrome tab with one YouTube video paused. Worse: SQLite kept having emotional breakdowns over Linux file permissions every time Docker restarted unless I held its hand with host volume mounts.

Even after I spent hours sweating over multi-stage Alpine builds to trim the image down in v1.7.0, it was still dragging around 33.8MB of Python interpreters, C libraries, and emotional baggage.

So naturally, instead of doing normal human activities like going outside or sleeping, I spent my entire weekend tearing out the Python backend and rewriting everything from scratch in native Go 1.27 :D

---

### The "Zero-Disk" Cult: Deleting the Filesystem Entirely

In v2.0.0, NetCheck literally holds zero state on disk. You can run the container with `read_only: true` and Docker will just nod respectfully:

* **In-Memory LRU with Singleflight (Stop Stampeding Me):** Instead of wrestling SQLite locks on disk, lookups live in an expirable RAM cache. And by using Go's `singleflight`, if 10 users query `example.com` at the exact same millisecond, NetCheck fires exactly 1 DNS lookup and tells the other 9 people to share the homework.
* **The Bare `scratch` Container:** The entire production image contains only the statically compiled binary, public SSL root certs, and a tiny `/etc/passwd` file. There is no `/bin/sh`. There is no package manager. There is no `curl`. If an attacker somehow breaches the container, they can't even run `ls` because `ls` literally does not exist. It's just a single lonely binary vibing in the void.
* **Fewer Privileges Than a Houseplant:** It runs as unprivileged UID 10001 with all Linux capabilities dropped (`cap_drop: [ALL]`). It cannot do anything dangerous even if it wanted to.

---

### The Cold Hard Numbers (For People Who Like Percentages)

Before getting into the networking guts, here is what the rewrite did to the production footprint:

| Metric | NetCheck v1.7.0 (Python) | NetCheck v2.0.0 (Go) | Delta |
| :--- | :--- | :--- | :--- |
| **Container Size** | 33.8 MB (Alpine) | **8.5 MB (`scratch`)** | **-75% smaller!** |
| **Idle Memory** | ~48 MB RAM | **~7.6 MB RAM** | **-84% drop!** |
| **Disk State** | Volume mounts & SQLite | **Zero disk mounts (`read_only: true`)** | Deleted forever |
| **Privileges** | Standard Docker set | **`cap_drop: [ALL]`** | Zero capabilities |

---

### The Big Reality Check (Did Ping Get Any Faster?)

The container starts in 12 milliseconds flat. Idle memory sits at a jaw-dropping 7.6MB.

So... did the actual ping or traceroute get any faster?

**Absolutely not lol.**

Turns out, light traveling through undersea fiber optic cables across the Pacific Ocean does not care about my shiny Go concurrency models :D. Packets still hit latency. Physics remains undefeated.

Did I save the planet? No. Did I save 40MB of RAM on a 16GB server that was already 90% idle? Yes. Was it worth 14 hours of debugging Go pointers and DNS flag day buffer sizes? **100% absolutely.**

---

If you want to check it out, self-host it on your own server, or just stare at the 7MB RAM idle for yourself :D:
* **GitHub:** [sudo-Penguin-Lalala/netcheck](https://github.com/sudo-Penguin-Lalala/netcheck)
* **Docker:** `docker run -d -p 7070:7070 nnt25/netcheck:latest`
