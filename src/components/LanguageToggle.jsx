import { useI18n } from "../i18n/useI18n";
import "./LanguageToggle.css";

const LanguageToggle = () => {
  const { t, toggle } = useI18n();
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={t.languageToggleAria}
      title={t.languageToggleAria}
    >
      <span className="lang-toggle__flag" aria-hidden="true">{t.flag}</span>
    </button>
  );
};

export default LanguageToggle;
