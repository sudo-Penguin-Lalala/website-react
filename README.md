# website-react

Personal portfolio & links hub ([nnt25.net](https://nnt25.net/)), inspired by NetCheck and terminal aesthetics.

## Features

- 🖥️ **NetCheck-Flavored Terminal**: Sharp corners, charcoal dark palette, signature amber outlines, and monospace typography (`JetBrains Mono`).
- ⚡ **Homelab Architecture Dashboard**: System specs via `fastfetch`, Oracle Cloud A1 details, and curated self-hosted services (NetCheck, NNT's Storage, MeTube).
- 🌐 **Bilingual Support (EN / VI)**: Instant English and Vietnamese switching with auto-detection and persistence.
- 🥚 **Interactive Easter Eggs**:
  - Privilege escalation: Click `[NNT_]` 5 times to enter superuser mode (`# root@reactor`) with an interactive command line.
  - Fish evolution: Click the fish emoji in shell output to cycle species into sushi.
  - Kinetic logo spinner: Spin the footer logo to unlock achievement levels.
  - Terminal commands: `matrix`, `glitch`, `flip`, `invert`, `party`, `free -h`, `cat classified.env`, and more.

## Tech Stack

- **Framework**: React 19 + Vite 7
- **Deployment**: Cloudflare Pages / Workers
- **Styling**: Vanilla CSS with custom properties & keyframe animations
- **Typography**: JetBrains Mono

## Development

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Lint code
npm run lint

# Build production bundle
npm run build

# Preview locally with Cloudflare Wrangler
npm run preview

# Deploy to Cloudflare
npm run deploy
```

## License

[The Unlicense](LICENSE) — public domain.
