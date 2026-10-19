import { useState } from "react";
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
  const currentTags = PERSON_TAGS[isVi ? "vi" : "en"] || PERSON_TAGS.en;
  const currentTagText = isSudo
    ? "OPERATOR"
    : currentTags[tagIndex % currentTags.length];

  const handleTagClick = () => {
    setTagIndex((prev) => (prev + 1) % currentTags.length);
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
            <h2>
              {profileName}{" "}
              <button
                type="button"
                className="nc-tag nc-tag-accent nc-tag-interactive"
                onClick={handleTagClick}
                title={isVi ? "Bấm để đổi danh hiệu!" : "Click to cycle titles!"}
                aria-label={isVi ? "Đổi danh hiệu cá nhân" : "Cycle title"}
                style={{ verticalAlign: "middle", fontWeight: 600 }}
              >
                {currentTagText}
              </button>
            </h2>
            <p className="nc-profile-bio">
              {isVi
                ? "Nghịch Linux từ năm 14 tuổi. Thích tự host đồ chơi ở nhà thay vì cúng dữ liệu cho Google hay Microsoft. Tự dựng tự phá, lúc nào rảnh thì ngồi tối ưu cho nó chạy nhanh hơn một tí."
                : "Tinkering with Linux since 14. I self-host stuff at home just to keep my data off big tech's hard drives. Mostly I break things on purpose, then spend weekends making them faster."}
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
