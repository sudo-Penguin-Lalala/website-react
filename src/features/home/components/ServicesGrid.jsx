import { useState, useRef, useEffect } from "preact/hooks";
import Icon from "../../../components/Icon";
import { getContactEmail } from "../../../config/links";

const ServicesGrid = ({ isSudo, isVi }) => {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const discordTimerRef = useRef(null);
  const emailTimerRef = useRef(null);
  const contactEmail = getContactEmail();

  useEffect(() => {
    return () => {
      if (discordTimerRef.current) clearTimeout(discordTimerRef.current);
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current);
    };
  }, []);

  const handleCopyDiscord = (e) => {
    e?.preventDefault();
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText("nnt2589")
      .then(() => {
        setCopiedDiscord(true);
        if (discordTimerRef.current) clearTimeout(discordTimerRef.current);
        discordTimerRef.current = setTimeout(() => setCopiedDiscord(false), 2000);
      })
      .catch((err) => {
        console.warn("Clipboard write failed for Discord:", err);
      });
  };

  const handleCopyEmail = (e) => {
    e?.preventDefault();
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(contactEmail)
      .then(() => {
        setCopiedEmail(true);
        if (emailTimerRef.current) clearTimeout(emailTimerRef.current);
        emailTimerRef.current = setTimeout(() => setCopiedEmail(false), 2000);
      })
      .catch((err) => {
        console.warn("Clipboard write failed for Email:", err);
      });
  };

  const handleCellMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
      <header className="nc-card-head">
        <div className="nc-card-head-left">
          <div className="nc-window-controls" aria-hidden="true">
            <span className="nc-win-dot nc-win-close" />
            <span className="nc-win-dot nc-win-min" />
            <span className="nc-win-dot nc-win-max" />
          </div>
          <h2
            className="nc-card-title"
            style={{ overflowWrap: "break-word", minWidth: 0 }}
          >
            <span className="nc-prompt-glyph">&gt;</span> projects_and_connect {isSudo ? "--root-access" : ""}
          </h2>
        </div>
      </header>
      <div className="nc-card-body">
        <div className="nc-services-grid">
          {/* 1. NetCheck */}
          <a
            href="https://netcheck.nnt25.io.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-netcheck"
            onMouseMove={handleCellMouseMove}
            aria-label={
              isVi
                ? "NetCheck - Công cụ kiểm tra mạng"
                : "NetCheck - Network diagnostics tool"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="netcheck" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>NetCheck</span>
              <span className="nc-arrow">↗</span>
            </h3>
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
            href="https://storage.nnt25.io.vn/accounts/register"
            target="_blank"
            rel="noopener noreferrer"
            className="nc-service-cell nc-service-cell-storage"
            onMouseMove={handleCellMouseMove}
            aria-label={
              isVi
                ? "NNT's Storage - Đăng ký lưu trữ đám mây cá nhân"
                : "NNT's Storage - Personal cloud storage registration"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="telecloud" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>NNT’s Storage</span>
              <span className="nc-arrow">↗</span>
            </h3>
            <div className="nc-service-desc">
              {isVi
                ? "Ổ đám mây cá nhân cho bạn bè lưu ảnh với file linh tinh. Đăng ký nhận dung lượng lưu trữ an toàn."
                : "Personal cloud storage for backups and files. Instant private storage for friends."}
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
            onMouseMove={handleCellMouseMove}
            aria-label={
              isVi
                ? "MeTube - Tải video YouTube, TikTok, Facebook"
                : "MeTube - Video downloader"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="metube" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>MeTube</span>
              <span className="nc-arrow">↗</span>
            </h3>
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
            onMouseMove={handleCellMouseMove}
            aria-label={
              isVi
                ? "GitHub - Kho mã nguồn của NNT"
                : "GitHub - NNT's code repositories"
            }
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="github" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>GitHub</span>
              <span className="nc-arrow">↗</span>
            </h3>
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
          <div
            className="nc-service-cell nc-service-cell-discord"
            onMouseMove={handleCellMouseMove}
            style={{ cursor: "default" }}
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="discord" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>Discord</span>
            </h3>
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
                className={`nc-btn nc-svc-action-btn nc-svc-copy-btn nc-svc-copy-discord ${
                  copiedDiscord ? "is-copied" : ""
                }`}
                onClick={handleCopyDiscord}
                aria-label={
                  isVi
                    ? "Sao chép username Discord nnt2589"
                    : "Copy Discord username nnt2589"
                }
                aria-live="polite"
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
          <div
            className="nc-service-cell nc-service-cell-email"
            onMouseMove={handleCellMouseMove}
            style={{ cursor: "default" }}
          >
            <div className="nc-service-top">
              <div className="nc-service-icon">
                <Icon name="nnt" width="22" height="22" />
              </div>
            </div>
            <h3 className="nc-service-name">
              <span>Email</span>
            </h3>
            <div className="nc-service-desc">
              <strong className="nc-svc-highlight">{contactEmail}</strong>
              <p>
                {isVi
                  ? "Dành cho chuyện gì đó cần nghiêm túc hơn Discord. Thường check mail mỗi ngày."
                  : "For anything that actually needs to be an email. I usually check it daily."}
              </p>
            </div>
            <div className="nc-service-footer nc-service-footer-actions">
              <button
                type="button"
                className={`nc-btn nc-svc-action-btn nc-svc-copy-btn nc-svc-copy-email ${
                  copiedEmail ? "is-copied" : ""
                }`}
                onClick={handleCopyEmail}
                aria-label={
                  isVi
                    ? `Sao chép địa chỉ email ${contactEmail}`
                    : `Copy email address ${contactEmail}`
                }
                aria-live="polite"
              >
                {copiedEmail ? "✓ copied" : "copy email"}
              </button>
              <a
                href={`mailto:${contactEmail}`}
                className="nc-btn nc-btn-accent nc-svc-action-btn nc-svc-btn-email"
                aria-label={
                  isVi
                    ? `Gửi email tới ${contactEmail}`
                    : `Send email to ${contactEmail}`
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
