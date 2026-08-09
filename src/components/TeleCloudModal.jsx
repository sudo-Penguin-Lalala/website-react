import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useI18n } from "../i18n/useI18n";
import "./TeleCloudModal.css";

const TeleCloudModal = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const modalText = t.telecloudModal;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    reason: "",
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError("");
      setCopied(false);
      const timer = setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const generateFormattedMessage = () => {
    const username = formData.username.trim();
    const email = formData.email.trim();
    const reason = formData.reason.trim();

    return `${modalText.emailGreeting}

${modalText.emailIntro}

• ${modalText.emailUsernameField}: ${username}
• ${modalText.emailContactField}: ${email}
• ${modalText.emailReasonField}: ${reason || "N/A"}

${modalText.emailThanks}`;
  };

  const validate = () => {
    if (!formData.username.trim()) {
      setError(modalText.validationErrorUsername);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError(modalText.validationErrorEmail);
      return false;
    }
    return true;
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const username = formData.username.trim();
    const subject = `${modalText.emailSubject} - ${username}`;
    const body = generateFormattedMessage();

    const mailtoUrl = `mailto:contact@nnt25.io.vn?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  const handleCopy = async () => {
    if (!validate()) return;

    const textToCopy = generateFormattedMessage();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="telecloud-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            className="telecloud-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="telecloud-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="telecloud-modal__close-btn"
              onClick={onClose}
              aria-label={modalText.closeAria}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <span className="telecloud-modal__badge">{modalText.badge}</span>
            <h2 id="telecloud-modal-title" className="telecloud-modal__title">
              {modalText.title}
            </h2>
            <p className="telecloud-modal__subtitle">{modalText.subtitle}</p>

            {/* Disclaimer card */}
            <div className="telecloud-modal__disclaimer">
              <div className="telecloud-modal__disclaimer-header">
                <svg
                  className="telecloud-modal__disclaimer-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                <span className="telecloud-modal__disclaimer-title">
                  {modalText.disclaimerTitle}
                </span>
              </div>
              <p className="telecloud-modal__disclaimer-text">
                {modalText.disclaimerText}
              </p>
            </div>

            <form className="telecloud-modal__form" onSubmit={handleSendEmail}>
              <div className="telecloud-modal__field">
                <label htmlFor="telecloud-username" className="telecloud-modal__label">
                  <span>{modalText.usernameLabel}</span>
                  <span className="telecloud-modal__required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  ref={usernameInputRef}
                  id="telecloud-username"
                  type="text"
                  required
                  placeholder={modalText.usernamePlaceholder}
                  className={`telecloud-modal__input ${
                    error && !formData.username.trim() ? "telecloud-modal__input--error" : ""
                  }`}
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                />
                <span className="telecloud-modal__hint">{modalText.usernameHint}</span>
              </div>

              <div className="telecloud-modal__field">
                <label htmlFor="telecloud-email" className="telecloud-modal__label">
                  <span>{modalText.emailLabel}</span>
                  <span className="telecloud-modal__required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="telecloud-email"
                  type="email"
                  required
                  placeholder={modalText.emailPlaceholder}
                  className={`telecloud-modal__input ${
                    error && !formData.email.trim() ? "telecloud-modal__input--error" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  autoComplete="email"
                />
                <span className="telecloud-modal__hint">{modalText.emailHint}</span>
              </div>

              <div className="telecloud-modal__field">
                <label htmlFor="telecloud-reason" className="telecloud-modal__label">
                  <span>{modalText.reasonLabel}</span>
                </label>
                <textarea
                  id="telecloud-reason"
                  rows={2}
                  placeholder={modalText.reasonPlaceholder}
                  className="telecloud-modal__textarea"
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                />
              </div>

              {error && <div className="telecloud-modal__error-message">{error}</div>}

              <div className="telecloud-modal__actions">
                <button
                  type="submit"
                  className="telecloud-modal__btn telecloud-modal__btn--primary"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>{modalText.sendEmailBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`telecloud-modal__btn telecloud-modal__btn--secondary ${
                    copied ? "telecloud-modal__btn--copied" : ""
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{modalText.copiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>{modalText.copyBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="telecloud-modal__footer-direct">
              <span>{modalText.directDmPrefix}</span>
              <a
                href="https://t.me/palera1nx"
                target="_blank"
                rel="noopener noreferrer"
                className="telecloud-modal__footer-link"
              >
                {modalText.directDmLink} →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeleCloudModal;
