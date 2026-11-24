# Domain Docs: nnt25.io.vn (website-react)

How engineering subagents should understand and consume this repo's domain concepts and architecture.

## Before exploring, read these
- **`README.md`** and **`AGENTS.md`** at the repo root.
- **`graphify-out/`** — query component hierarchy, hooks, and routes via `graphify`.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

If any of these files don't exist, proceed silently. Don't flag their absence; don't suggest creating them upfront.

---

## Architecture & Core Modules
- **Identity**: Personal website, portfolio, links hub, and tech blog for `nnt25.io.vn`.
- **Tech Stack**: Preact 11 (`preact/compat`) + Vite 7 + `@cloudflare/vite-plugin` + Cloudflare Pages.
- **Feature Structure**:
  - `src/features/home/`: Home screen (`HomeV2.jsx`), avatar assets (WebP/PNG), social links hub (`config/links.js`).
  - `src/features/blog/`: Markdown post reader. Pipeline: Raw Markdown $\rightarrow$ `marked.parse` $\rightarrow$ `DOMPurify.sanitize` $\rightarrow$ `prismjs` highlighting.
  - `src/i18n/`: Bilingual Vietnamese / English support via `I18nProvider` and `useI18n`.
  - `src/hooks/useRouter.js`: Minimalist client-side router.
- **Design System**: Strict `:root` design tokens in `src/App.css`, Hallmark floor (0 generic gradients, 0 icon emojis), fluid Emil spring motion (`transform`/`opacity` GPU only).
- **Deployment**: Edge delivery on Cloudflare Pages (`npm run build && wrangler deploy`).

---

## Glossary & Vocabulary
When referencing parts of the codebase in issues, refactoring proposals, or PRDs:
- **Pages**: `HomeV2`, `BlogPost`, `BlogList`.
- **Features**: `home`, `blog`, `i18n`.
- **Hooks**: `useRouter`, `useI18n`.
- **Security**: `DOMPurify` XSS boundary, Aikido SAST / secret audits.
