/**
 * File-based Markdown Blog Engine for Preact + Vite
 * Zero-maintenance: Reads all .md files from /posts/ or /src/posts/
 */

// Glob markdown files directly via Vite's raw query
const rootPosts = import.meta.glob("/posts/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
});

const srcPosts = import.meta.glob("/src/posts/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
});

const allPostFiles = { ...rootPosts, ...srcPosts };

/**
 * Parses YAML Frontmatter and body content without external dependencies
 */
export function parseFrontmatter(raw) {
  if (!raw || typeof raw !== "string") {
    return { data: {}, content: "" };
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw.trim() };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const data = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();

    // Parse quoted strings
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    } else if (val.startsWith("[") && val.endsWith("]")) {
      // Parse array syntax [ "A", "B" ]
      try {
        val = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        val = val
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    } else if (val === "true") {
      val = true;
    } else if (val === "false") {
      val = false;
    }

    data[key] = val;
  }

  return { data, content };
}

/**
 * Calculates estimated reading time in minutes
 */
export function calculateReadingTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Formats date string to clean ISO date (YYYY-MM-DD)
 */
export function formatPostDate(dateStr) {
  if (!dateStr) return "";
  const trimmed = String(dateStr).trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  try {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return trimmed;
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return trimmed;
  }
}

/**
 * Retrieves all posts sorted by date descending (newest first)
 */
export function getAllPosts() {
  const posts = [];
  const seenSlugs = new Set();

  for (const [path, rawContent] of Object.entries(allPostFiles)) {
    // Derive slug from file name: e.g. /posts/netcheck-v2.md -> netcheck-v2
    const filename = path.split("/").pop() || "";
    const slug = filename.replace(/\.md$/, "");

    if (!slug || seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const { data, content } = parseFrontmatter(rawContent);
    const readingTime = calculateReadingTime(content);

    posts.push({
      slug,
      path,
      title: data.title || slug,
      date: data.date || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || data.description || "",
      readingTime,
      wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      content,
    });
  }

  // Sort newest first
  posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });

  return posts;
}

/**
 * Retrieves a single post by slug
 */
export function getPostBySlug(slug) {
  if (!slug) return null;
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Retrieves all unique tags with count
 */
export function getAllTags() {
  const posts = getAllPosts();
  const tagMap = new Map();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
