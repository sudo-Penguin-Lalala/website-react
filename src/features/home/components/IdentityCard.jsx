import { useState } from "preact/hooks";
import { PERSON_TAGS } from "../constants/homelabData";
import avatar224 from "../../../assets/avatar-224.png";
import avatar448 from "../../../assets/avatar-448.png";
import avatar224Webp from "../../../assets/avatar-224.webp";
import avatar448Webp from "../../../assets/avatar-448.webp";

const IdentityCard = ({
  isSudo,
  isVi,
  profileName,
  altText = "Thien Nguyen — profile photo",
}) => {
  const [tagIndex, setTagIndex] = useState(0);
  const [showAlias, setShowAlias] = useState(false);
  const currentTags = PERSON_TAGS[isVi ? "vi" : "en"] || PERSON_TAGS.en;
  const currentTagText = isSudo
    ? "OPERATOR"
    : currentTags[tagIndex % currentTags.length];

  const handleTagClick = () => {
    setTagIndex((prev) => (prev + 1) % currentTags.length);
  };

  const handleNameClick = () => {
    setShowAlias((prev) => !prev);
  };

  return (
    <section className={`nc-card ${isSudo ? "is-root-card" : ""}`}>
      <header className="nc-card-head">
        <h2 className="nc-card-title">
          <span className="nc-prompt-glyph">&gt;</span> whoami {isSudo ? "--elevated" : ""}
        </h2>
        <span className={`nc-card-status ${isSudo ? "nc-status-root" : ""}`}>
          {isSudo
            ? "uid=0(root) gid=0(root) [SUPERUSER]"
            : "uid=1001(nnt) gid=1001(nnt)"}
        </span>
      </header>
      <div className="nc-card-body">
        <div className="nc-profile-layout">
          <div className={`nc-avatar-frame ${isSudo ? "is-root" : ""}`}>
            {isSudo && <span className="nc-avatar-root-badge"># ROOT</span>}
            <picture>
              <source
                type="image/webp"
                srcSet={`${avatar224Webp} 1x, ${avatar448Webp} 2x`}
              />
              <img
                src={avatar224}
                srcSet={`${avatar448} 2x`}
                alt={altText}
                width="88"
                height="88"
              />
            </picture>
          </div>

          <div className="nc-profile-text">
            <div className="nc-profile-heading">
              <h2 className="nc-profile-name">
                <button
                  type="button"
                  className="nc-profile-name-btn"
                  onClick={handleNameClick}
                  title={isVi ? "Bấm để đổi bí danh! 🐧" : "Click to toggle handle! 🐧"}
                  aria-label={isVi ? "Đổi bí danh hiển thị" : "Toggle display handle"}
                >
                  {showAlias ? "sudo-Penguin-Lalala" : profileName}
                </button>
              </h2>
              <button
                type="button"
                className="nc-tag nc-tag-accent nc-tag-interactive"
                onClick={handleTagClick}
                title={isVi ? "Bấm để đổi danh hiệu!" : "Click to cycle titles!"}
                aria-label={isVi ? "Đổi danh hiệu cá nhân" : "Cycle title"}
              >
                {currentTagText}
              </button>
            </div>
            <p className="nc-profile-bio">
              {isVi
                ? "Đam mê Linux và hệ thống tự host. Thích tự vận hành dịch vụ cá nhân, tôn trọng quyền riêng tư và dữ liệu độc lập. Tự dựng tự phá, tối ưu cho vui."
                : "Linux and self-hosting enthusiast. Building private, privacy-respecting services and independent infrastructure. Breaking things on purpose and making them faster."}
            </p>
            {isSudo && (
              <div className="nc-tag-list">
                <span
                  className="nc-tag"
                  style={{
                    borderColor: "var(--danger)",
                    color: "var(--danger)",
                    background: "rgba(255,107,107,0.15)",
                    fontWeight: 700,
                  }}
                >
                  # SUDOER
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdentityCard;
