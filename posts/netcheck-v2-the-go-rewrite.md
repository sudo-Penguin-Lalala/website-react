---
title: "I Spent All Day Rewriting NetCheck in Go Just to Save 40MB of RAM :D"
date: "2026-11-10T16:07:13+08:00"
tags: ["Golang", "Docker", "Silly", "Optimization"]
summary: "Tearing down a working 34MB Python app to build an 8.5MB bare scratch container. Did ping get any faster? Absolutely not lol."
---

When I first built NetCheck, Python and FastAPI felt like the easiest way to get things done. You glue together a couple of libraries, bind an SQLite database to disk, and boom—you have a working network diagnostic tool.

Except it sat on my server taking ~48MB of idle RAM just doing nothing. And SQLite kept throwing file permission tantrums every time Docker restarted unless I babysat host volume mounts. In v1.7.0, even after spending hours trimming the Docker image down with Alpine multi-stage builds, it was still hauling around 33.8MB of interpreters and dependencies.

So naturally, instead of doing normal human things, I spent my entire day tearing out the Python backend and rewriting everything from scratch in native Go 1.27 :D

### What "Zero-Disk" Actually Means
In v2.0.0, NetCheck literally holds zero state on disk:
- **In-Memory LRU with Singleflight:** Instead of writing cache to SQLite, lookups live purely in RAM. And using `singleflight` means if 10 people test the same domain at the exact same moment, only 1 probe actually fires.
- **Bare `scratch` Container:** The entire production image contains only the statically compiled binary, public SSL certs, and a tiny `/etc/passwd` file. No shell (`/bin/sh`), no curl, no package manager.
- **Lockdown Mode:** It runs as unprivileged UID 10001 with `read_only: true` and all Linux capabilities dropped (`cap_drop: [ALL]`).

### The Cold Hard Numbers
* **Container Size:** 33.8 MB -> **8.5 MB** (-75% smaller!)
* **Idle RAM:** ~48 MB -> **~7.6 MB** (-84% drop!)
* **Disk State:** Annoying volume mounts -> **Zero disk mounts needed**

### The Big Reality Check
The container starts in 12 milliseconds and idles like a ghost. 

Did the actual ping or traceroute get any faster? 

**Absolutely not lol.** Turns out, light still travels through undersea fiber optic cables at the exact same speed regardless of whether your backend is written in Python or Go :D

But hey, 7MB of RAM idle is 7MB of RAM idle, and watching an 8.5MB container spin up in the blink of an eye is deeply satisfying!

---

If you want to check it out, self-host it on your own server, or just stare at the 7MB RAM idle for yourself :D:
* **GitHub:** [sudo-Penguin-Lalala/netcheck](https://github.com/sudo-Penguin-Lalala/netcheck)
* **Docker:** `docker run -d -p 7070:7070 nnt25/netcheck:latest`
