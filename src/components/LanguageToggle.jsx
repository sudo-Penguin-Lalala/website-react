import { useI18n } from "../i18n/useI18n";
import "./LanguageToggle.css";

const UsFlag = () => (
  <svg
    className="lang-toggle__flag-svg"
    viewBox="0 0 24 16"
    width="20"
    height="13.3"
    aria-hidden="true"
  >
    <clipPath id="us-flag-clip">
      <rect width="24" height="16" rx="2.5" />
    </clipPath>
    <g clipPath="url(#us-flag-clip)">
      <rect width="24" height="16" fill="#b22234" />
      <path
        d="M0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0z"
        fill="#ffffff"
      />
      <rect width="10.2" height="8.6" fill="#3c3b6e" />
      {/* 5-pointed star cluster */}
      <polygon
        points="2.8,1.4 3.2,2.6 4.4,2.6 3.4,3.3 3.8,4.5 2.8,3.8 1.8,4.5 2.2,3.3 1.2,2.6 2.4,2.6"
        fill="#ffffff"
      />
      <polygon
        points="7.4,1.4 7.8,2.6 9.0,2.6 8.0,3.3 8.4,4.5 7.4,3.8 6.4,4.5 6.8,3.3 5.8,2.6 7.0,2.6"
        fill="#ffffff"
      />
      <polygon
        points="5.1,4.2 5.5,5.4 6.7,5.4 5.7,6.1 6.1,7.3 5.1,6.6 4.1,7.3 4.5,6.1 3.5,5.4 4.7,5.4"
        fill="#ffffff"
      />
    </g>
  </svg>
);

const VnFlag = () => (
  <svg
    className="lang-toggle__flag-svg"
    viewBox="0 0 24 16"
    width="20"
    height="13.3"
    aria-hidden="true"
  >
    <clipPath id="vn-flag-clip">
      <rect width="24" height="16" rx="2.5" />
    </clipPath>
    <g clipPath="url(#vn-flag-clip)">
      <rect width="24" height="16" fill="#da251d" />
      <polygon
        points="12,2.8 13.5,7.3 18.2,7.3 14.4,10.1 15.9,14.6 12,11.8 8.1,14.6 9.6,10.1 5.8,7.3 10.5,7.3"
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

