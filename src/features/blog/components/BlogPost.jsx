import { useMemo, useState, useEffect, useRef } from "preact/hooks";
import DOMPurify from "dompurify";
import { getPostBySlug, formatPostDate } from "../utils/postLoader";
import { renderMarkdown } from "../utils/markdownRenderer";
import { useBlogTheme } from "../hooks/useBlogTheme";
import avatar224 from "../../../assets/avatar-224.png";
import avatar224Webp from "../../../assets/avatar-224.webp";
import "../styles/Blog.css";

export default function BlogPost({
  slug,
  navigate,
}) {
  const { theme, toggleTheme, isDark } = useBlogTheme();
  const [copiedLink, setCopiedLink] = useState(false);
  const progressBarRef = useRef(null);
  const copyTimerRef = useRef(null);

  const post = useMemo(() => getPostBySlug(slug), [slug]);

  // Memoize sanitized HTML strictly on post change: NEVER re-run DOMPurify on scroll or re-render
  const sanitizedHtml = useMemo(() => {
    if (!post) return "";
    const raw = renderMarkdown(post.content);
    return DOMPurify.sanitize(raw, {
      ADD_TAGS: ["aside", "button"],
      ADD_ATTR: [
        "data-code",
        "data-lang",
        "target",
        "rel",
        "aria-hidden",
        "aria-label",
      ],
    });
  }, [post]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Track reading progress directly via DOM transform (zero component re-renders on scroll)
  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / total));
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleBackToBlog = (e) => {
    e.preventDefault();
    navigate("/blog");
  };

  const handleBackHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedLink(false), 2000);
  };

  // Delegated event listener for copying code blocks
  const handleBodyClick = (e) => {
    const copyBtn = e.target.closest(".nc-code-copy-btn");
    if (!copyBtn) return;

    e.preventDefault();
    const encoded = copyBtn.getAttribute("data-code");
    if (!encoded) return;

    const rawCode = decodeURIComponent(encoded);
    navigator.clipboard?.writeText(rawCode);

    const textEl = copyBtn.querySelector(".nc-copy-text");
    const glyphEl = copyBtn.querySelector(".nc-copy-glyph");
    const origText = textEl ? textEl.textContent : "copy";

    copyBtn.classList.add("is-copied");
    if (textEl) textEl.textContent = "copied!";
    if (glyphEl) glyphEl.textContent = "✓";

    setTimeout(() => {
      copyBtn.classList.remove("is-copied");
      if (textEl) textEl.textContent = origText;
      if (glyphEl) glyphEl.textContent = "⎘";
    }, 2000);
  };

  if (!post) {
    return (
      <div className="nc-blog-page" data-theme={theme}>
        <main id="main-content" className="nc-blog-container">
          <nav className="nc-blog-nav">
            <a href="/blog" onClick={handleBackToBlog} className="nc-blog-back-btn">
              &lt; /blog
            </a>
          </nav>
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <h1 className="nc-article-title">404: Post Not Found</h1>
            <p style={{ color: "var(--text-dim)" }}>
              The article “{slug}” does not exist or has been moved.
            </p>
            <a
              href="/blog"
              onClick={handleBackToBlog}
              className="nc-blog-back-btn"
              style={{ marginTop: "1rem" }}
            >
              Return to blog archive
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="nc-blog-page" data-theme={theme}>
      {/* Reading scroll progress bar */}
      <div
        ref={progressBarRef}
        className="nc-reading-progress"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      <main id="main-content" className="nc-blog-container">
        {/* Navigation */}
        <nav className="nc-blog-nav" aria-label="Article navigation">
          <div className="nc-blog-nav-left">
            <a
              href="/blog"
              onClick={handleBackToBlog}
              className="nc-blog-back-btn"
              aria-label="Back to blog archive"
            >
              <span aria-hidden="true">&lt;</span>
              <span>/blog</span>
            </a>
            <a
              href="/"
              onClick={handleBackHome}
              className="nc-blog-back-btn"
              aria-label="Back to terminal"
            >
              <span>terminal</span>
            </a>
          </div>

          <div className="nc-blog-nav-right">
            <button
              type="button"
              className="nc-btn nc-blog-theme-btn"
              onClick={toggleTheme}
              aria-label={`Current theme: ${theme}. Tap to switch to ${isDark ? "light" : "dark"} mode.`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              <span>{isDark ? "[ dark ]" : "[ light ]"}</span>
            </button>
          </div>
        </nav>

        {/* Tactile Technical Article Chassis */}
        <article className="nc-reading-chassis">
          {/* Top Chassis Toolbar */}
          <div className="nc-chassis-topbar">
            <div className="nc-chassis-dots" aria-hidden="true">
              <span className="nc-chassis-dot nc-dot-red"></span>
              <span className="nc-chassis-dot nc-dot-yellow"></span>
              <span className="nc-chassis-dot nc-dot-green"></span>
            </div>
            <div className="nc-chassis-path">
              <span>~/posts/{post.slug}.md</span>
            </div>
            <div className="nc-chassis-stats">
              <span>{post.wordCount} words, {post.readingTime}m read</span>
            </div>
          </div>

          <div className="nc-chassis-content">
            {/* Article Header */}
            <header className="nc-article-header">
              <div className="nc-article-meta-row">
                <time dateTime={post.date} className="nc-article-date">
                  {formatPostDate(post.date)}
                </time>
                <span className="nc-article-chip">
                  {post.readingTime} min read
                </span>
                <span className="nc-article-chip">
                  {post.wordCount} words
                </span>
              </div>

              <h1 className="nc-article-title">{post.title}</h1>

              {post.tags.length > 0 && (
                <div className="nc-article-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="nc-article-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* TL;DR / Summary Lead Box */}
            {post.summary && (
              <aside className="nc-article-lead-box" aria-label="Article summary">
                <div className="nc-lead-badge">
                  <span className="nc-lead-glyph" aria-hidden="true">›</span>
                  <span>tldr / context</span>
                </div>
                <p className="nc-lead-text">{post.summary}</p>
              </aside>
            )}

            {/* Rendered Markdown Body */}
            <div
              className="nc-article-body"
              dangerouslySetInnerHTML={{
                __html: sanitizedHtml,
              }}
              onClick={handleBodyClick}
            />

            {/* Author Signature Box */}
            <div className="nc-author-card">
              <div className="nc-author-avatar-wrap">
                <picture>
                  <source type="image/webp" srcSet={avatar224Webp} />
                  <img
                    src={avatar224}
                    alt="Thien Nguyen"
                    className="nc-author-avatar"
                    width="48"
                    height="48"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="nc-author-info">
                <div className="nc-author-name-row">
                  <span className="nc-author-name">Thien Nguyen</span>
                  <span className="nc-author-handle">@nnt2589</span>
                </div>
                <p className="nc-author-bio">
                  the most annoying person :D
                </p>
              </div>
            </div>

            {/* Article Footer */}
            <footer className="nc-article-footer">
              <a href="/blog" onClick={handleBackToBlog} className="nc-blog-back-btn">
                &lt; all articles
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="nc-blog-back-btn"
                aria-label="Copy article link"
                aria-live="polite"
              >
                <span>
                  {copiedLink ? "✓ link copied!" : "copy link"}
                </span>
              </button>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
