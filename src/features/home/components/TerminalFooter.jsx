import Icon from "../../../components/Icon";
import { useLogoSpin } from "../hooks/useLogoSpin";

const TerminalFooter = ({ isVi }) => {
  const {
    spinDeg,
    spinCount,
    isSpinBadgeVisible,
    isSpinBadgeLeaving,
    copied,
    handleSpinLogo,
    copyReceipt,
    getSpinAchievement,
  } = useLogoSpin();

  const achievement = getSpinAchievement(spinCount, isVi);

  return (
    <footer className="nc-footer">
      <div className="nc-footer-copy">
        <button
          type="button"
          className="nc-footer-logo-btn"
          onClick={handleSpinLogo}
          style={{ transform: `rotate(${spinDeg}deg)` }}
          title={
            isVi
              ? "Bấm để quay rotor tạo điện nuôi server! :D"
              : "Click to spin rotor and power the server! :D"
          }
          aria-label={
            isVi
              ? `Logo NNT, máy phát điện homelab, đã quay ${spinCount} vòng`
              : `NNT logo, homelab kinetic generator, spun ${spinCount} times`
          }
        >
          <Icon name="nnt" />
        </button>
        <span>© 2026 Thien Nguyen</span>
        {isSpinBadgeVisible && (
          <button
            type="button"
            className={`nc-spin-badge ${isSpinBadgeLeaving ? "is-leaving" : ""} ${copied ? "is-copied" : ""}`}
            onClick={() => copyReceipt(isVi)}
            title={
              isVi
                ? "Chạm để sao chép kết quả khoe Discord!"
                : "Tap to copy receipt to Discord!"
            }
            aria-label={
              isVi
                ? `Đạt ${achievement.badge}: ${achievement.title}. Chạm để sao chép kết quả.`
                : `Achieved ${achievement.badge}: ${achievement.title}. Tap to copy receipt.`
            }
          >
            <span aria-hidden="true">{copied ? "📋" : achievement.icon}</span>
            <span style={{ opacity: 0.8 }}>
              [{spinCount} revs · {achievement.wh}]
            </span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {achievement.badge}
            </span>
            <span>
              {copied
                ? (isVi ? "Đã chép kết quả khoe Discord!" : "Receipt copied!")
                : achievement.title}
            </span>
          </button>
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
