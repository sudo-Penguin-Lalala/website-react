const BrandHeader = ({
  isSudo,
  handleBrandClick,
  sudoHint,
  toggle,
  flag,
  isVi,
  languageToggleAria,
  cycleTheme,
  currentTheme,
  navigate,
}) => {
  return (
    <header className="nc-hdr">
      <div className="nc-brand-wrap">
        <h1 className="nc-brand-title">
          <button
            type="button"
            className={`nc-brand-btn ${isSudo ? "is-sudo" : ""}`}
            onClick={handleBrandClick}
            aria-label={
              isSudo
                ? (isVi
                  ? "Tên thương hiệu NNT, chế độ root đang hoạt động"
                  : "NNT brand, root mode active")
                : (isVi
                  ? "Tên thương hiệu NNT, chạm nhiều lần để leo quyền root"
                  : "NNT brand, tap multiple times to escalate to root")
            }
            title={
              isSudo
                ? (isVi
                  ? "Chế độ root đang kích hoạt! Bấm nút 'exit' để thoát"
                  : "Root mode active! Use 'exit' button to exit")
                : (isVi
                  ? "Chạm 5 lần để leo quyền root (sudo)"
                  : "Tap 5 times to escalate to root (sudo)")
            }
            translate="no"
          >
            <span className="nc-brand">
              <span className="nc-bracket">[</span>
              {isSudo ? (
                <span className="nc-brand-root">root#reactor</span>
              ) : (
                <span>NNT</span>
              )}
              <span className={`nc-cursor ${isSudo ? "nc-cursor-root" : ""}`}>_</span>
              <span className="nc-bracket">]</span>
            </span>
          </button>
        </h1>
        {sudoHint && <span className="nc-sudo-hint">{sudoHint}</span>}
      </div>

      <div className="nc-hdr-actions">
        <a
          href="/blog"
          className="nc-btn nc-blog-nav-btn"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            if (navigate) {
              e.preventDefault();
              navigate("/blog");
            }
          }}
          aria-label={isVi ? "Xem NNT's blog" : "View NNT's blog"}
          title={isVi ? "NNT's blog" : "NNT's blog"}
        >
          <span>blog</span>
        </a>

        {currentTheme && (
          <button
            type="button"
            className="nc-btn nc-theme-btn"
            onClick={cycleTheme}
            aria-label={
              isVi
                ? `Bảng màu: ${currentTheme.name}. Chạm hoặc nhấn T để đổi.`
                : `Palette: ${currentTheme.name}. Tap or press T to switch.`
            }
            title={
              isVi
                ? `Chuyển sang ${currentTheme.id === "nord" ? "Forest (🌲)" : "Nord (🏔️)"} [Phím tắt: T]`
                : `Switch to ${currentTheme.id === "nord" ? "Forest (🌲)" : "Nord (🏔️)"} [Hotkey: T]`
            }
          >
            <span aria-hidden="true">{currentTheme.icon}</span>
            <span>{currentTheme.name}</span>
          </button>
        )}

        <button
          type="button"
          className="nc-btn nc-lang-btn"
          onClick={toggle}
          aria-label={
            languageToggleAria ||
            (isVi
              ? "Chuyển ngôn ngữ sang tiếng Anh (phím tắt L)"
              : "Switch language to Vietnamese (hotkey L)")
          }
          title={isVi ? "Chuyển sang English [Phím tắt: L]" : "Switch to Tiếng Việt [Hotkey: L]"}
        >
          <span>{flag}</span>
          <span>{isVi ? "VI" : "EN"}</span>
        </button>
      </div>
    </header>
  );
};

export default BrandHeader;
