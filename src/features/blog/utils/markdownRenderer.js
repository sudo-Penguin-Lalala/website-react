import { marked } from "marked";
import Prism from "prismjs";
import DOMPurify from "dompurify";

// Syntax highlighters
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-docker.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-ini.js";

// Aliases
if (Prism.languages.bash) {
  Prism.languages.sh = Prism.languages.bash;
  Prism.languages.shell = Prism.languages.bash;
  Prism.languages.zsh = Prism.languages.bash;
}
if (Prism.languages.yaml) {
  Prism.languages.yml = Prism.languages.yaml;
}
if (Prism.languages.docker) {
  Prism.languages.dockerfile = Prism.languages.docker;
}
if (Prism.languages.go) {
  Prism.languages.golang = Prism.languages.go;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTags(html) {
  return String(html).replace(/<[^>]+>/g, "");
}

/**
 * Generates URL-friendly heading anchor IDs (Unicode-safe)
 */
function slugifyHeading(text) {
  const slug = stripTags(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug || "section";
}

// Enhance only text nodes (outside HTML tags) to avoid mutating href/title attributes
// and keep regex linear O(N) without nested backtracking.
function enhanceMetricText(html) {
  return html
    .split(/(<[^>]*>)/g)
    .map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part
        .replace(/\s-&gt;\s|\s->\s/g, ' <span class="nc-metric-arrow">→</span> ')
        .replace(
          /\((-?\d+(?:\.\d+)?%|-?\d+(?:\.\d+)?x\s+faster)\)/gi,
          '<span class="nc-metric-pill">$1</span>'
        );
    })
    .join("");
}

// Configure DOMPurify hook once: enforce noopener noreferrer on external target="_blank"
let hooksRegistered = false;
if (typeof DOMPurify?.addHook === "function" && !hooksRegistered) {
  hooksRegistered = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/**
 * Configure marked@18 token-based dev renderer
 */
const renderer = new marked.Renderer();

// Code blocks with terminal controls, language tag, and copy button
renderer.code = function ({ text, lang }) {
  const rawLang = (lang || "text").toLowerCase().trim().split(/\s+/)[0] || "text";
  const safeLang = escapeHtml(rawLang);
  const grammar =
    Object.hasOwn(Prism.languages, rawLang) &&
    typeof Prism.languages[rawLang] === "object"
      ? Prism.languages[rawLang]
      : Prism.languages.text;

  let highlighted;
  try {
    highlighted = grammar ? Prism.highlight(text, grammar, rawLang) : escapeHtml(text);
  } catch (err) {
    console.warn(`[Prism] Failed to highlight ${rawLang}:`, err);
    highlighted = escapeHtml(text);
  }

  let encoded = "";
  try {
    encoded = encodeURIComponent(text);
  } catch (err) {
    console.warn("[Markdown] Failed to encode code snippet:", err);
  }

  return `
<div class="nc-code-block" data-lang="${safeLang}">
  <div class="nc-code-header">
    <div class="nc-code-controls" aria-hidden="true">
      <span class="nc-code-dot nc-dot-red"></span>
      <span class="nc-code-dot nc-dot-yellow"></span>
      <span class="nc-code-dot nc-dot-green"></span>
    </div>
    <span class="nc-code-lang">${safeLang}</span>
    <button type="button" class="nc-code-copy-btn" data-code="${escapeHtml(encoded)}" aria-label="Copy code snippet">
      <span class="nc-copy-glyph" aria-hidden="true">⎘</span>
      <span class="nc-copy-text">copy</span>
    </button>
  </div>
  <pre class="nc-code-pre"><code class="language-${safeLang}">${highlighted}</code></pre>
</div>`;
};

// Headings with anchor link (marked@18 passes tokens + text)
renderer.heading = function ({ tokens, text, depth }) {
  const innerHtml = tokens ? this.parser.parseInline(tokens) : escapeHtml(text || "");
  const id = slugifyHeading(innerHtml);
  const targetId = `user-content-${id}`;
  return `
<h${depth} id="${targetId}" class="nc-blog-h${depth}">
  <span class="nc-heading-text">${innerHtml}</span>
  <a href="#${targetId}" class="nc-heading-anchor" aria-label="Direct link to ${id}">#</a>
</h${depth}>`;
};

// External links open in new tab with secure rel (case-insensitive & protocol-relative)
renderer.link = function ({ href, title, tokens, text }) {
  const rawHref = href || "";
  const isExternal = /^(https?:)?\/\//i.test(rawHref);
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
  const innerHtml = tokens ? this.parser.parseInline(tokens) : escapeHtml(text || "");
  return `<a href="${escapeHtml(rawHref)}"${target}${titleAttr} class="nc-blog-link">${innerHtml}</a>`;
};

// Inline code styling (HTML-escaped to prevent tag breakout)
renderer.codespan = function ({ text }) {
  return `<code class="nc-inline-code">${escapeHtml(text)}</code>`;
};

// Blockquotes & Callout Boxes (marked@18 passes tokens array)
renderer.blockquote = function ({ tokens, text }) {
  const bodyHtml = tokens ? this.parser.parse(tokens) : `<p>${escapeHtml(text || "")}</p>`;
  const trimmed = bodyHtml.trim();
  const alertMatch = trimmed.match(
    /^<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\](?:\s|<br\s*\/?>)*([\s\S]*?)<\/p>([\s\S]*)$/i
  );

  if (alertMatch) {
    const type = alertMatch[1].toLowerCase();
    const firstPara = alertMatch[2];
    const restHtml = alertMatch[3] || "";
    const labels = {
      note: "Note",
      tip: "Tip",
      warning: "Warning",
      important: "Important",
      caution: "Caution",
    };
    return `
<aside class="nc-callout nc-callout-${type}">
  <div class="nc-callout-header">
    <span class="nc-callout-glyph" aria-hidden="true">›</span>
    <span class="nc-callout-title">${labels[type] || "Note"}</span>
  </div>
  <div class="nc-callout-body"><p>${firstPara}</p>${restHtml}</div>
</aside>`;
  }

  return `
<aside class="nc-callout nc-callout-quote">
  <div class="nc-callout-glyph" aria-hidden="true">“</div>
  <div class="nc-callout-body">${bodyHtml}</div>
</aside>`;
};

// List items (use parse() for nested/loose lists + tag-safe metric enhancement)
renderer.listitem = function (token) {
  let itemBody = token.tokens
    ? this.parser.parse(token.tokens)
    : escapeHtml(token.text || "");
  itemBody = enhanceMetricText(itemBody);
  return `<li>${itemBody}</li>`;
};

// Tables (marked@18 passes TableCell[] header & TableCell[][] rows)
renderer.table = function ({ header, rows }) {
  const headerHtml = Array.isArray(header)
    ? `<tr>${header
        .map((cell) => {
          const content = cell.tokens
            ? this.parser.parseInline(cell.tokens)
            : escapeHtml(cell.text || "");
          const alignAttr = cell.align ? ` align="${escapeHtml(cell.align)}"` : "";
          return `<th${alignAttr}>${content}</th>`;
        })
        .join("")}</tr>`
    : "";

  const rowsHtml = Array.isArray(rows)
    ? rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => {
                const content = cell.tokens
                  ? this.parser.parseInline(cell.tokens)
                  : escapeHtml(cell.text || "");
                const alignAttr = cell.align ? ` align="${escapeHtml(cell.align)}"` : "";
                return `<td${alignAttr}>${content}</td>`;
              })
              .join("")}</tr>`
        )
        .join("")
    : "";

  return `
<div class="nc-table-wrapper">
  <table class="nc-blog-table">
    <thead>${headerHtml}</thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</div>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

/**
 * Render Markdown content to safe HTML string with DOMPurify sanitization
 */
export function renderMarkdown(markdownText) {
  if (!markdownText || typeof markdownText !== "string") return "";
  const rawHtml = marked.parse(markdownText);
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ["aside", "button"],
    ADD_ATTR: ["data-code", "data-lang", "target", "rel", "aria-hidden", "aria-label", "align"],
    FORBID_TAGS: ["style", "form", "input", "textarea", "select", "dialog"],
    FORBID_ATTR: ["style"],
    SANITIZE_NAMED_PROPS: true,
  });
}
