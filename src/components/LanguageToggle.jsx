import { useI18n } from "../i18n/useI18n";
import "./LanguageToggle.css";

const UsFlag = () => (
  <svg
    className="lang-toggle__flag-svg"
    viewBox="0 0 24 16"
    width="20"
    height="13.33"
    aria-hidden="true"
  >
    <defs>
      <clipPath id="us-flag-clip">
        <rect width="24" height="16" rx="2" />
      </clipPath>
      <polygon
        id="us-star"
        points="0,-0.6 0.18,-0.19 0.6,-0.19 0.25,0.06 0.38,0.48 0,0.2 -0.38,0.48 -0.25,0.06 -0.6,-0.19 -0.18,-0.19"
        fill="#ffffff"
      />
    </defs>
    <g clipPath="url(#us-flag-clip)">
      {/* 13 Stripes */}
      <rect width="24" height="16" fill="#b22234" />
      <rect y="1.23" width="24" height="1.23" fill="#ffffff" />
      <rect y="3.69" width="24" height="1.23" fill="#ffffff" />
      <rect y="6.15" width="24" height="1.23" fill="#ffffff" />
      <rect y="8.62" width="24" height="1.23" fill="#ffffff" />
      <rect y="11.08" width="24" height="1.23" fill="#ffffff" />
      <rect y="13.54" width="24" height="1.23" fill="#ffffff" />
      {/* Blue Canton */}
      <rect width="9.6" height="8.62" fill="#3c3b6e" />
      {/* Star Grid */}
      <use href="#us-star" x="1.6" y="1.4" />
      <use href="#us-star" x="3.2" y="1.4" />
      <use href="#us-star" x="4.8" y="1.4" />
      <use href="#us-star" x="6.4" y="1.4" />
      <use href="#us-star" x="8.0" y="1.4" />
      <use href="#us-star" x="2.4" y="2.8" />
      <use href="#us-star" x="4.0" y="2.8" />
      <use href="#us-star" x="5.6" y="2.8" />
      <use href="#us-star" x="7.2" y="2.8" />
      <use href="#us-star" x="1.6" y="4.3" />
      <use href="#us-star" x="3.2" y="4.3" />
      <use href="#us-star" x="4.8" y="4.3" />
      <use href="#us-star" x="6.4" y="4.3" />
      <use href="#us-star" x="8.0" y="4.3" />
      <use href="#us-star" x="2.4" y="5.7" />
      <use href="#us-star" x="4.0" y="5.7" />
      <use href="#us-star" x="5.6" y="5.7" />
      <use href="#us-star" x="7.2" y="5.7" />
      <use href="#us-star" x="1.6" y="7.2" />
      <use href="#us-star" x="3.2" y="7.2" />
      <use href="#us-star" x="4.8" y="7.2" />
      <use href="#us-star" x="6.4" y="7.2" />
      <use href="#us-star" x="8.0" y="7.2" />
    </g>
  </svg>
);

const VnFlag = () => (
  <svg
    className="lang-toggle__flag-svg"
    viewBox="0 0 24 16"
    width="20"
    height="13.33"
    aria-hidden="true"
  >
    <clipPath id="vn-flag-clip">
      <rect width="24" height="16" rx="2" />
    </clipPath>
    <g clipPath="url(#vn-flag-clip)">
      <rect width="24" height="16" fill="#da251d" />
      <polygon
        points="12,3.2 13.08,6.52 16.57,6.52 13.74,8.57 14.82,11.88 12,9.83 9.18,11.88 10.26,8.57 7.43,6.52 10.92,6.52"
        fill="#ffff00"
      />
    </g>
  </svg>
);

const LanguageToggle = () => {
  const { lang, t, toggle } = useI18n();

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={t.languageToggleAria}
      title={t.languageToggleAria}
    >
      <span className="lang-toggle__flag" aria-hidden="true">
        {lang === "vi" ? <VnFlag /> : <UsFlag />}
      </span>
      <span className="lang-toggle__code">{lang.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggle;

