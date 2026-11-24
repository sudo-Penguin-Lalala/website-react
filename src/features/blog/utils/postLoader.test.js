import { describe, it, expect } from "vitest";
import {
  parseFrontmatter,
  formatPostDate,
  formatDateStr,
  calculateReadingTime,
} from "./postLoader";

describe("postLoader - Markdown Frontmatter & Date Utilities", () => {
  describe("parseFrontmatter", () => {
    it("extracts title, date, and tags from standard YAML frontmatter", () => {
      const rawMarkdown = `---
title: "Hardening Linux Homelab"
date: "2026-11-25"
tags: ["linux", "security", "homelab"]
summary: "Production security setup for personal homelab"
---

# Heading 1
This is the body content of the blog post.`;

      const { data, content } = parseFrontmatter(rawMarkdown);

      expect(data.title).toBe("Hardening Linux Homelab");
      expect(data.date).toBe("2026-11-25");
      expect(data.tags).toEqual(["linux", "security", "homelab"]);
      expect(data.summary).toBe("Production security setup for personal homelab");
      expect(content).toBe("# Heading 1\nThis is the body content of the blog post.");
    });

    it("handles single-quoted frontmatter values and boolean flags", () => {
      const rawMarkdown = `---
title: 'Edge Ingress Node'
featured: true
draft: false
tags: ['cloudflare', 'workers']
---
Content here`;

      const { data, content } = parseFrontmatter(rawMarkdown);

      expect(data.title).toBe("Edge Ingress Node");
      expect(data.featured).toBe(true);
      expect(data.draft).toBe(false);
      expect(data.tags).toEqual(["cloudflare", "workers"]);
      expect(content).toBe("Content here");
    });

    it("gracefully degrades when frontmatter is missing or malformed", () => {
      // Missing frontmatter delimiters
      const noFrontmatter = "Just raw markdown content without header.";
      const res1 = parseFrontmatter(noFrontmatter);
      expect(res1.data).toEqual({});
      expect(res1.content).toBe(noFrontmatter);

      // Malformed array in frontmatter (fallback regex/split parser kicks in)
      const malformedYaml = `---
title: Broken Array Post
tags: [ unclosed, quotes', "mixed
---
Body text`;
      const res2 = parseFrontmatter(malformedYaml);
      expect(res2.data.title).toBe("Broken Array Post");
      expect(Array.isArray(res2.data.tags)).toBe(true);
      expect(res2.content).toBe("Body text");

      // Non-string or null input
      expect(parseFrontmatter(null)).toEqual({ data: {}, content: "" });
      expect(parseFrontmatter(undefined)).toEqual({ data: {}, content: "" });
    });
  });

  describe("formatPostDate & formatDateStr", () => {
    it("formats ISO date strings directly to YYYY-MM-DD", () => {
      expect(formatPostDate("2026-11-25")).toBe("2026-11-25");
      expect(formatDateStr("2026-01-05T12:00:00Z")).toBe("2026-01-05");
    });

    it("formats parseable date strings to YYYY-MM-DD via Date fallback", () => {
      const formatted = formatDateStr("Nov 25, 2026 UTC");
      expect(formatted).toBe("2026-11-25");
    });

    it("returns safe fallback on invalid date string without throwing", () => {
      expect(formatPostDate("not-a-date")).toBe("not-a-date");
      expect(formatPostDate("")).toBe("");
      expect(formatDateStr(null)).toBe("");
    });
  });

  describe("calculateReadingTime", () => {
    it("estimates reading time with minimum of 1 minute", () => {
      expect(calculateReadingTime("")).toBe(1);
      expect(calculateReadingTime("A short sentence.")).toBe(1);

      // 450 words should be ~3 minutes (Math.ceil(450 / 200) = 3)
      const longText = Array(450).fill("word").join(" ");
      expect(calculateReadingTime(longText)).toBe(3);
    });
  });
});
