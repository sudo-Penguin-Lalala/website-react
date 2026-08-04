# website-react

Personal portfolio and links website built with **React 19**, **Vite**, and **Cloudflare**.

---

## ⚡ Features

- **Modern Bento Grid Layout**: Dynamic, responsive cards with subtle glassmorphism, glowing brand accents, and clean typography using JetBrains Mono.
- **Interactive WebGL & Canvas Effects**:
  - `ShapeGrid` — High-performance WebGL geometry mesh using OGL & GSAP.
  - `ClickSpark` — Responsive particle spark interactions with device-tier performance scaling.
  - `ShinyText` & `Reveal` — Subtle text sheen and smooth entry animations powered by `motion`.
- **Bilingual (i18n)**: Seamless English (`en`) and Vietnamese (`vi`) language switching with cross-platform inline SVG flags.
- **Adaptive Performance**: Built-in hardware & connection tier detection (`deviceTier.js`) with reduced-motion support.
- **Accessibility & Privacy Focused**: Semantic markup, ARIA compliance, and strict privacy without tracking bloat.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Animations & Graphics**: Motion, GSAP, OGL (WebGL)
- **Styling**: Vanilla CSS with modern design tokens
- **Typography**: JetBrains Mono
- **Deployment & Hosting**: Cloudflare Pages / Workers via Wrangler

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/sudo-Penguin-Lalala/website-react.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` — Starts the local Vite development server
- `npm run build` — Builds the optimized production bundle
- `npm run lint` — Runs ESLint checks
- `npm run preview` — Builds and previews locally using Wrangler
- `npm run deploy` — Builds and deploys directly to Cloudflare

---

## 📄 License

© 2026 Thien Nguyen. All rights reserved.
