import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./markdownRenderer";

describe("markdownRenderer - marked@18 Token Renderer & XSS Hardening", () => {
  it("renders GFM tables cleanly without [object Object]", () => {
    const md = `| Metric | Before | After |
| :--- | :---: | ---: |
| **Memory** | 48 MB | 7.6 MB |`;

    const html = renderMarkdown(md);
    expect(html).not.toContain("[object Object]");
    expect(html).toContain("<table");
    expect(html).toContain('<th align="left">Metric</th>');
    expect(html).toContain("<strong>Memory</strong>");
    expect(html).toContain('<td align="right">7.6 MB</td>');
  });

  it("renders standard blockquotes with inline formatting and GitHub callouts", () => {
    const quoteHtml = renderMarkdown('> *"200 OK"* check');
    expect(quoteHtml).toContain("nc-callout-quote");
    expect(quoteHtml).toContain("<em>");
    expect(quoteHtml).not.toContain('*"200 OK"*');

    const alertHtml = renderMarkdown("> [!WARNING]\n> Watch **out**!");
    expect(alertHtml).toContain("nc-callout-warning");
    expect(alertHtml).toContain("<strong>out</strong>");
  });

  it("renders nested lists without crashing and avoids mutating href attributes", () => {
    const md = `- Parent item -> 10ms (-75%)
  - Nested child item
- [Link (-50%)](https://example.com/a->b)`;

    const html = renderMarkdown(md);
    expect(html).toContain("<ul>");
    expect(html).toContain("Nested child item");
    expect(html).toContain("nc-metric-arrow");
    expect(html).toContain("nc-metric-pill");
    expect(html).toContain('href="https://example.com/a-&gt;b"');
  });

  it("escapes HTML inside inline codespan and prevents DOM breakout", () => {
    const html = renderMarkdown("Use `Vec<T>` or `</code><button>fake</button>` safely.");
    expect(html).toContain("&lt;T&gt;");
    expect(html).not.toContain("<button>fake</button>");
  });

  it("strips XSS vectors, style tags, forms, enforces noopener, and prevents DOM clobbering", () => {
    const dirty = `
# main-content
<script>alert(1)</script>
<img src=x onerror="alert(1)">
<style>body { display: none; }</style>
<form><input type="text"></form>
<div style="position:fixed;inset:0">overlay</div>
<a href="https://evil.example" target="_blank" rel="opener">ext</a>
`;
    const html = renderMarkdown(dirty);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain('style="');
    expect(html).toContain('id="user-content-main-content"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
