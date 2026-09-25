import Button from "./Button";
import { socialLinks } from "../config/links";
import { useI18n } from "../i18n/useI18n";

/**
 * LinksPanel renders the list of social/outbound navigation buttons
 * in the Links tab panel.
 */
const LinksPanel = ({ active, onAction }) => {
  const { t } = useI18n();

  return (
    <div
      id="panel-links"
      role="tabpanel"
      aria-labelledby="tab-links"
      hidden={!active}
      className="tab-panel tab-panel--fade-in"
    >
      <nav className="button-stack" aria-label={t.socialLinksLabel}>
        {socialLinks.map((link, index) => (
          <Button
            key={link.id}
            href={link.url}
            onClick={link.action ? () => onAction(link.action) : undefined}
            icon={link.icon}
            label={link.label}
            className={link.className}
            title={link.title}
            index={index}
          />
        ))}
      </nav>
    </div>
  );
};

export default LinksPanel;
