import BentoSection from "./bento/BentoSection";
import { buildSection } from "./bento/bentoUtils";
import { sectionShapes } from "../config/links";
import { useI18n } from "../i18n/useI18n";
import "./Bento.css";

/**
 * AboutPanel renders all Bento sections (About, Homelab, Now)
 * inside the About tab panel.
 */
const AboutPanel = ({ active, onAction }) => {
  const { t } = useI18n();

  const aboutSection = buildSection(sectionShapes.about, t.about);
  const homelabSection = buildSection(sectionShapes.homelab, t.homelab);
  const nowSection = buildSection(sectionShapes.now, t.now);

  return (
    <div
      id="panel-about"
      role="tabpanel"
      aria-labelledby="tab-about"
      hidden={!active}
      className="tab-panel tab-panel--fade-in tab-panel--about"
    >
      <BentoSection section={aboutSection} onAction={onAction} />
      <BentoSection section={homelabSection} onAction={onAction} />
      <BentoSection section={nowSection} onAction={onAction} />
    </div>
  );
};

export default AboutPanel;
