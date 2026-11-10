import { useState, useMemo } from "preact/hooks";
import { getAllPosts, getAllTags, formatPostDate } from "../utils/postLoader";
import { useBlogTheme } from "../hooks/useBlogTheme";
import "../styles/Blog.css";

export default function BlogList({ navigate }) {
  const { theme, toggleTheme, isDark } = useBlogTheme();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const posts = useMemo(() => getAllPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchTag = activeTag ? post.tags.includes(activeTag) : true;
      const q = search.trim().toLowerCase();
      const matchSearch = q
        ? post.title.toLowerCase().includes(q) ||
          post.summary.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q))
        : true;
      return matchTag && matchSearch;
    });
  }, [posts, activeTag, search]);

  const handlePostClick = (e, slug) => {
    e.preventDefault();
    navigate(`/blog/${slug}`);
  };

  const handleBackHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const toggleTag = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="nc-blog-page" data-theme={theme}>
      <div className="nc-blog-container">
        {/* Navigation bar */}
        <nav className="nc-blog-nav" aria-label="Blog navigation">
          <div className="nc-blog-nav-left">
            <a
              href="/"
              onClick={handleBackHome}
              className="nc-blog-back-btn"
              aria-label="Back to terminal"
            >
              <span aria-hidden="true">&lt;</span>
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

        {/* Page Header */}
        <header className="nc-blog-header">
          <h1 className="nc-blog-brand-title">
            <span className="nc-bracket">[</span>
            <span>nnt’s blog</span>
            <span className="nc-cursor">_</span>
            <span className="nc-bracket">]</span>
          </h1>
          <p className="nc-blog-brand-sub">
            where i post all silly stuff :D
          </p>

          <div className="nc-blog-stats-bar">
            <span>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
            {activeTag && (
              <span className="nc-blog-stats-tag">
                tag: #{activeTag}{" "}
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: "0 0.2rem",
                  }}
                  aria-label="Clear active tag"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </header>

        {/* Search & Tag Toolbar */}
        <div className="nc-blog-toolbar">
          <div className="nc-blog-search-box">
            <span className="nc-blog-search-glyph" aria-hidden="true">&gt;</span>
            <input
              type="text"
              value={search}
              onInput={(e) => setSearch(e.target.value)}
              placeholder="Filter posts by keyword or tag..."
              className="nc-blog-search-input"
              aria-label="Filter posts"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-dim)",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
                aria-label="Clear search"
              >
                esc
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="nc-blog-tag-chips" role="group" aria-label="Filter by tag">
              {allTags.map(({ tag, count }) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`nc-blog-chip ${isActive ? "is-active" : ""}`}
                    aria-pressed={isActive}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="nc-blog-posts-list">
          {filteredPosts.length === 0 ? (
            <div
              style={{
                padding: "2.5rem 1rem",
                textAlign: "center",
                color: "var(--text-dim)",
                background: "var(--bg-elev)",
                border: "1px dashed var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <p style={{ margin: "0 0 0.5rem 0" }}>
                No posts matching current filter.
              </p>
              {(search || activeTag) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveTag(null);
                  }}
                  className="nc-blog-chip is-active"
                  style={{ marginTop: "0.5rem" }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={(e) => handlePostClick(e, post.slug)}
                className="nc-blog-post-card"
              >
                <div className="nc-blog-card-meta">
                  <time dateTime={post.date} className="nc-blog-card-date">
                    {formatPostDate(post.date)}
                  </time>
                  <span className="nc-blog-card-readtime">
                    {post.readingTime} min read
                  </span>
                </div>

                <h2 className="nc-blog-card-title">{post.title}</h2>

                {post.summary && (
                  <p className="nc-blog-card-summary">{post.summary}</p>
                )}

                {post.tags.length > 0 && (
                  <div className="nc-blog-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="nc-blog-card-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
