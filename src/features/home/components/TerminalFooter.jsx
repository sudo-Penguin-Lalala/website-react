import Icon from "../../../components/Icon";
import { useLogoSpin } from "../hooks/useLogoSpin";

const TerminalFooter = ({ isVi }) => {
  const {
    spinDeg,
    spinCount,
    isSpinBadgeVisible,
    isSpinBadgeLeaving,
    handleSpinLogo,
    getSpinAchievement,
  } = useLogoSpin();
  return (
    <footer className="nc-footer">
      <div className="nc-footer-copy">
        <button
          type="button"
          className="nc-footer-logo-btn"
          onClick={handleSpinLogo}
          style={{ transform: `rotate(${spinDeg}deg)` }}
          title={isVi ? "Bấm để xoay logo chơi :D" : "Click to spin logo :D"}
          aria-label={isVi ? "Logo NNT, bấm để xoay" : "NNT logo, click to spin"}
        >
          <Icon name="nnt" />
        </button>
        <span>© 2026 Thien Nguyen</span>
        {isSpinBadgeVisible && (
          <span
            className={`nc-spin-badge ${isSpinBadgeLeaving ? "is-leaving" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true">
              {getSpinAchievement(spinCount, isVi).icon}
            </span>
            <span style={{ opacity: 0.75 }}>[{spinCount}]</span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {getSpinAchievement(spinCount, isVi).badge}
            </span>
            <span>{getSpinAchievement(spinCount, isVi).title}</span>
          </span>
        )}
      </div>
      <div>
        <a
          href="https://github.com/sudo-Penguin-Lalala/website-react"
          target="_blank"
          rel="noopener noreferrer"
          className="nc-footer-repo-link"
          aria-label={
            isVi
              ? "Xem mã nguồn trang web trên GitHub"
              : "View website source code on GitHub"
          }
        >
          <Icon name="github" />
          <span>[source: website-react ↗]</span>
        </a>
      </div>
    </footer>
  );
};

export default TerminalFooter;
