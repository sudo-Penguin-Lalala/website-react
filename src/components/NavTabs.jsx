import { useI18n } from "../i18n/useI18n";
import "./NavTabs.css";

const TABS = [
  { id: "links", key: "links" },
  { id: "about", key: "about" },
];

const NavTabs = ({ active, onChange }) => {
  const { t } = useI18n();

  return (
    <div className="nav-tabs" role="tablist" aria-label="Page sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className="nav-tabs__btn"
          onClick={() => onChange(tab.id)}
        >
          {t.nav[tab.key]}
        </button>
      ))}
    </div>
  );
};

export default NavTabs;
