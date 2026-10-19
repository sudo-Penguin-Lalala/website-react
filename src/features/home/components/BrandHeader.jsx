const BrandHeader = ({
  isSudo,
  handleBrandClick,
  sudoHint,
  toggle,
  flag,
  isVi,
  languageToggleAria,
}) => {
  return (
    <header className="nc-hdr">
      <div className="nc-brand-wrap">
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
          <h1 className="nc-brand">
            <span className="nc-bracket">[</span>
            {isSudo ? (
              <span className="nc-brand-root">root#reactor</span>
            ) : (
              <span>NNT</span>
            )}
            <span className={`nc-cursor ${isSudo ? "nc-cursor-root" : ""}`}>_</span>
            <span className="nc-bracket">]</span>
          </h1>
        </button>
        {sudoHint && <span className="nc-sudo-hint">{sudoHint}</span>}
      </div>

      <div className="nc-hdr-actions">
        <button
          type="button"
          className="nc-btn nc-lang-btn"
          onClick={toggle}
          aria-label={
            languageToggleAria ||
            (isVi
              ? "Chuyển ngôn ngữ sang tiếng Anh"
              : "Switch language to Vietnamese")
          }
          title={isVi ? "Chuyển sang English" : "Switch to Tiếng Việt"}
        >
          <span>{flag}</span>
          <span>{isVi ? "VI" : "EN"}</span>
        </button>
      </div>
    </header>
  );
};

export default BrandHeader;
