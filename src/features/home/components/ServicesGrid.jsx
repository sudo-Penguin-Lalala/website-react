import { useState } from "react";
import Icon from "../../../components/Icon";

const ServicesGrid = ({ isSudo, isVi }) => {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyDiscord = (e) => {
    e?.preventDefault();
    navigator.clipboard?.writeText("nnt2589");
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleCopyEmail = (e) => {
    e?.preventDefault();
    navigator.clipboard?.writeText("contact@nnt25.io.vn");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
      <header className="nc-card-head">
        <h2 className="nc-card-title">
          <span className="nc-prompt-glyph">&gt;</span> projects_and_connect {isSudo ? "--root-access" : ""}
        </h2>
      </header>
      <div className="nc-card-body">
        <div className="nc-services-grid">
          {/* 1. NetCheck */}
          <a
            href="https://netcheck.nnt25.io.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-netcheck"
            aria-label={
              isVi
                ? "NetCheck - Công cụ kiểm tra mạng"
                : "NetCheck - Network diagnostics tool"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="netcheck" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT DIRECT</span>
              ) : (
                <span className="nc-badge-running nc-badge-netcheck">RUNNING</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>NetCheck</span>
              <span className="nc-arrow">↗</span>
            </div>
            <div className="nc-service-desc">
              {isVi
                ? "Gom hết mấy trò test mạng vào một trang cho đỡ phải mở chục tab terminal mỗi khi Wi-Fi giở chứng."
                : "Every network test on one page: DNS, ping, traceroute, ports. Handy whenever the Wi-Fi acts weird."}
            </div>
            <div className="nc-service-footer">
              <span>netcheck.nnt25.io.vn</span>
              <span className="nc-svc-action-label">[open ↵]</span>
            </div>
          </a>

          {/* 2. NNT's Storage */}
          <a
            href="https://storage.nnt25.io.vn/apps/registration/"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-storage"
            aria-label={
              isVi
                ? "NNT's Storage - Đăng ký lưu trữ đám mây cá nhân"
                : "NNT's Storage - Personal cloud storage registration"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="telecloud" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT DIRECT</span>
              ) : (
                <span className="nc-badge-running nc-badge-storage">RUNNING</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>NNT's Storage</span>
              <span className="nc-arrow">↗</span>
            </div>
            <div className="nc-service-desc">
              {isVi
                ? "Ổ đám mây tự chạy bằng Nextcloud cho bạn bè lưu ảnh với file linh tinh. Đăng ký cái là có sẵn 10GB xài luôn."
                : "Personal Nextcloud box for backups and random files. Instant 10GB quota for friends."}
            </div>
            <div className="nc-service-footer">
              <span>storage.nnt25.io.vn</span>
              <span className="nc-svc-action-label">[register ↵]</span>
            </div>
          </a>

          {/* 3. MeTube */}
          <a
            href="https://metube.nnt25.io.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-metube"
            aria-label={
              isVi
                ? "MeTube - Tải video YouTube, TikTok, Facebook"
                : "MeTube - Video downloader"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="metube" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT DIRECT</span>
              ) : (
                <span className="nc-badge-running nc-badge-metube">RUNNING</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>MeTube</span>
              <span className="nc-arrow">↗</span>
            </div>
            <div className="nc-service-desc">
              {isVi
                ? "Cứ dán link YouTube, TikTok hay Facebook vào là kéo video về máy. Không quảng cáo, không chuyển hướng rác."
                : "Paste any video link from YouTube, TikTok, or Facebook and grab the file cleanly. No junk ads."}
            </div>
            <div className="nc-service-footer">
              <span>metube.nnt25.io.vn</span>
              <span className="nc-svc-action-label">[download ↵]</span>
            </div>
          </a>

          {/* 4. GitHub */}
          <a
            href="https://github.com/sudo-Penguin-Lalala"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-github"
            aria-label={
              isVi
                ? "GitHub - Kho mã nguồn của NNT"
                : "GitHub - NNT's code repositories"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="github" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT REPO</span>
              ) : (
                <span className="nc-badge-running nc-badge-github">CODE REPOS</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>GitHub</span>
              <span className="nc-arrow">↗</span>
            </div>
            <div className="nc-service-desc">
              {isVi
                ? "Mấy món mã nguồn mở với đống repo nghịch cuối tuần. Có cái xài được, có cái sống sót qua ngày thứ Hai."
                : "Open-source stuff and weekend code experiments. Some work, some barely made it past Monday."}
            </div>
            <div className="nc-service-footer">
              <span>github.com/sudo-Penguin-Lalala</span>
              <span className="nc-svc-action-label">[browse repos ↗]</span>
            </div>
          </a>

          {/* 5. Discord */}
          <div className="nc-service-cell nc-service-cell-discord" style={{ cursor: "default" }}>
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="discord" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT COMM LINK</span>
              ) : (
                <span className="nc-badge-running nc-badge-discord">DIRECT DM</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>Discord</span>
            </div>
            <div className="nc-service-desc">
              <strong className="nc-svc-highlight">nnt2589</strong>
              <p>
                {isVi
                  ? "Chỗ dễ lôi đầu tôi ra nhất. Cứ ping hoặc ném tin nhắn thẳng vào DM."
                  : "Best place to reach me. Just ping or drop a message in DMs."}
              </p>
            </div>
            <div className="nc-service-footer nc-service-footer-actions">
              <button
                type="button"
                className="nc-btn nc-svc-action-btn"
                onClick={handleCopyDiscord}
                aria-label={
                  isVi
                    ? "Sao chép username Discord nnt2589"
                    : "Copy Discord username nnt2589"
                }
              >
                {copiedDiscord ? "✓ copied" : "copy username"}
              </button>
              <a
                href="https://discord.com/users/873873496814538803"
                target="_blank"
                rel="noopener noreferrer"
                className="nc-btn nc-btn-accent nc-svc-action-btn nc-svc-btn-discord"
                aria-label={
                  isVi
                    ? "Mở tin nhắn trực tiếp Discord với nnt2589"
                    : "Open direct message with nnt2589 on Discord"
                }
              >
                open dm ↗
              </a>
            </div>
          </div>

          {/* 6. Email */}
          <div className="nc-service-cell nc-service-cell-email" style={{ cursor: "default" }}>
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="nnt" />
              </div>
              {isSudo ? (
                <span className="nc-badge-running nc-badge-root"># ROOT MAIL SERVER</span>
              ) : (
                <span className="nc-badge-running nc-badge-email">INBOX</span>
              )}
            </div>
            <div className="nc-service-name">
              <span>Email</span>
            </div>
            <div className="nc-service-desc">
              <strong className="nc-svc-highlight">contact@nnt25.io.vn</strong>
              <p>
                {isVi
                  ? "Dành cho chuyện gì đó cần nghiêm túc hơn Discord. Thường check mail mỗi ngày."
                  : "For anything that actually needs to be an email. I usually check it daily."}
              </p>
            </div>
            <div className="nc-service-footer nc-service-footer-actions">
              <button
                type="button"
                className="nc-btn nc-svc-action-btn"
                onClick={handleCopyEmail}
                aria-label={
                  isVi
                    ? "Sao chép địa chỉ email contact@nnt25.io.vn"
                    : "Copy email address contact@nnt25.io.vn"
                }
              >
                {copiedEmail ? "✓ copied" : "copy email"}
              </button>
              <a
                href="mailto:contact@nnt25.io.vn"
                className="nc-btn nc-btn-accent nc-svc-action-btn nc-svc-btn-email"
                aria-label={
                  isVi
                    ? "Gửi email tới contact@nnt25.io.vn"
                    : "Send email to contact@nnt25.io.vn"
                }
              >
                send ↵
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
