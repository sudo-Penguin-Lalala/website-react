import { marked } from "marked";
import Prism from "prismjs";

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

/**
 * Generates URL-friendly heading anchor IDs
 */
function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Configure marked with technical dev renderer
 */
const renderer = new marked.Renderer();

// Code blocks with terminal controls, language tag, and copy button
renderer.code = function ({ text, lang }) {
  const language = (lang || "text").toLowerCase().trim();
  const grammar = Prism.languages[language] || Prism.languages.text;
  let highlighted = text;

  try {
    if (grammar) {
      highlighted = Prism.highlight(text, grammar, language);
    }
  } catch (err) {
    console.warn(`[Prism] Failed to highlight ${language}:`, err);
    highlighted = text;
  }

  const encoded = encodeURIComponent(text);

  return `
<div class="nc-code-block" data-lang="${language}">
  <div class="nc-code-header">
    <div class="nc-code-controls" aria-hidden="true">
      <span class="nc-code-dot nc-dot-red"></span>
      <span class="nc-code-dot nc-dot-yellow"></span>
      <span class="nc-code-dot nc-dot-green"></span>
    </div>
    <span class="nc-code-lang">${language}</span>
    <button type="button" class="nc-code-copy-btn" data-code="${encoded}" aria-label="Copy code snippet">
      <span class="nc-copy-glyph" aria-hidden="true">⎘</span>
      <span class="nc-copy-text">copy</span>
    </button>
  </div>
  <pre class="nc-code-pre"><code class="language-${language}">${highlighted}</code></pre>
</div>`;
};

// Headings with anchor link
renderer.heading = function ({ text, depth }) {
  const id = slugifyHeading(text);
  return `
<h${depth} id="${id}" class="nc-blog-h${depth}">
  <span class="nc-heading-text">${text}</span>
  <a href="#${id}" class="nc-heading-anchor" aria-label="Direct link to ${id}">#</a>
</h${depth}>`;
};

// External links open in new tab with secure rel
renderer.link = function ({ href, title, text }) {
  const isExternal = /^https?:\/\//.test(href);
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${href}"${target}${titleAttr} class="nc-blog-link">${text}</a>`;
};

// Inline code styling
renderer.codespan = function ({ text }) {
  return `<code class="nc-inline-code">${text}</code>`;
};

// Blockquotes & Callout Boxes (GitHub / Dev style)
renderer.blockquote = function ({ text }) {
  const trimmed = text.trim();
  // Check for [!NOTE], [!TIP], [!WARNING], [!IMPORTANT], [!CAUTION]
  const alertMatch = trimmed.match(/^<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*([\s\S]*?)<\/p>$/i);

  if (alertMatch) {
    const type = alertMatch[1].toLowerCase();
    const body = alertMatch[2];
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
  <div class="nc-callout-body"><p>${body}</p></div>
</aside>`;
  }

  return `
<aside class="nc-callout nc-callout-quote">
  <div class="nc-callout-glyph" aria-hidden="true">“</div>
  <div class="nc-callout-body">${text}</div>
</aside>`;
};

// List items with metric badge & arrow enhancement
renderer.listitem = function (token) {
  let processed = token.tokens ? this.parser.parseInline(token.tokens) : (token.text || "");

  // Highlight metric arrows: -> into →
  processed = processed.replace(/\s-&gt;\s|\s->\s/g, ' <span class="nc-metric-arrow">→</span> ');

  // Highlight percent deltas like (-75%) or (-84%) or (4.5x faster)
  processed = processed.replace(
    /\((-?\d+[\d.]*%|-?\d+[\d.]*x\s+faster)\)/gi,
    '<span class="nc-metric-pill">$1</span>'
  );

  return `<li>${processed}</li>`;
};

// Tables
renderer.table = function ({ header, rows }) {
  return `
<div class="nc-table-wrapper">
  <table class="nc-blog-table">
    <thead>${header}</thead>
    <tbody>${rows}</tbody>
  </table>
</div>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

/**
 * Render Markdown content to safe HTML string
 */
export function renderMarkdown(markdownText) {
  if (!markdownText) return "";
  return marked.parse(markdownText);
}
