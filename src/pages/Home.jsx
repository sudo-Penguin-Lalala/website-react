import { Suspense, lazy, Fragment, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Button from "../components/Button";
import ClickSpark from "../components/ClickSpark";
import ShinyText from "../components/ShinyText";
import CircularText from "../components/CircularText";
import Reveal from "../components/Reveal";
import LanguageToggle from "../components/LanguageToggle";
import NavTabs from "../components/NavTabs";
import { useI18n } from "../i18n/useI18n";
import { detectDeviceTier } from "../lib/deviceTier";
import "../components/Bento.css";
import avatar224 from "../assets/avatar-224.png";
import avatar448 from "../assets/avatar-448.png";
import avatar224Avif from "../assets/avatar-224.avif";
import avatar448Avif from "../assets/avatar-448.avif";
import avatar224Webp from "../assets/avatar-224.webp";
import avatar448Webp from "../assets/avatar-448.webp";
import { socialLinks, profileData, sectionShapes } from "../config/links";

const ShapeGrid = lazy(() => import("../components/ShapeGrid"));

const Cell = ({ cell }) => {
  const titleClass = `cell__title${cell.titleBig ? " cell__title--big" : ""}`;
  return (
    <article
      className={
        `cell cell--${cell.span}` +
        (cell.accent ? " cell--accent" : "") +
        (cell.stat ? " cell--stat" : "")
      }
    >
      {cell.kicker && <p className="cell__kicker">{cell.kicker}</p>}
      {cell.title && <h3 className={titleClass}>{cell.title}</h3>}
      {cell.body && <p className="cell__body">{cell.body}</p>}
      {cell.href && cell.linkLabel && (
        <a
          className="cell__link"
          href={cell.href}
          target={cell.href.startsWith("http") ? "_blank" : undefined}
          rel={cell.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {cell.linkLabel}
        </a>
      )}
    </article>
  );
};

function buildSection(shape, translation) {
  return {
    eyebrow: translation.eyebrow,
    title: translation.title,
    lede: translation.lede,
    closer: translation.closer,
    cells: shape.map((entry) => {
      const text = translation.cells?.[entry.key] || {};
      return {
        span: entry.span,
        accent: entry.accent,
        href: entry.href,
        kicker: text.kicker,
        title: text.title,
        body: text.body,
        linkLabel: text.linkLabel,
      };
    }),
  };
}

const BentoSection = ({ section }) => {
  const slug = section.eyebrow
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
  return (
    <section className="bento-section" aria-labelledby={`section-${slug}`}>
      <Reveal>
        <p className="bento-section__eyebrow">{section.eyebrow}</p>
        <h2
          id={`section-${slug}`}
          className="bento-section__title"
          spellCheck={false}
        >
          {section.title}
        </h2>
        {section.lede && (
          <p className="bento-section__lede" spellCheck={false}>
            {section.lede}
          </p>
        )}
      </Reveal>
      <Reveal className="bento" delay={120}>
        {section.cells.map((cell, i) => (
          <Cell key={i} cell={cell} />
        ))}
      </Reveal>
      {section.closer && (
        <Reveal>
          <p className="section-closer">{section.closer}</p>
        </Reveal>
      )}
    </section>
  );
};

const Home = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [activeTab, setActiveTab] = useState("links");
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const tier = detectDeviceTier();
  const allowBackground = tier !== "low";

  useEffect(() => {
    if (!allowBackground) return;
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const id = schedule(() => setShowBackground(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [allowBackground]);

  const aboutSection = buildSection(sectionShapes.about, t.about);
  const homelabSection = buildSection(sectionShapes.homelab, t.homelab);
  const nowSection = buildSection(sectionShapes.now, t.now);

  const Wrapper = tier === "low" ? Fragment : ClickSpark;

  return (
    <Wrapper>
      <LanguageToggle />
      <div className="home">
        <div className="background-squares" aria-hidden="true">
          {allowBackground && showBackground && (
            <Suspense fallback={null}>
              <ShapeGrid />
            </Suspense>
          )}
        </div>
        <main className="container">
          <div className={`column${activeTab === "about" ? " column--wide" : ""}`}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                scale: imageLoaded ? 1 : 0.92,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="avatar-wrap"
            >
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${avatar224Avif} 1x, ${avatar448Avif} 2x`}
                />
                <source
                  type="image/webp"
                  srcSet={`${avatar224Webp} 1x, ${avatar448Webp} 2x`}
                />
                <img
                  className="avatar avatar--rounded"
                  src={avatar224}
                  srcSet={`${avatar448} 2x`}
                  width="128"
                  height="128"
                  alt={profileData.avatar.alt}
                  fetchpriority="high"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </picture>
            </motion.div>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShinyText text={t.profile.name} />
              <span style={{ color: "#2457f5" }}>.</span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.profile.tagline}
            </motion.p>

            <NavTabs active={activeTab} onChange={setActiveTab} />

            <div
              key={activeTab}
              id="panel-links"
              role="tabpanel"
              aria-labelledby="tab-links"
              hidden={activeTab !== "links"}
              className="tab-panel tab-panel--fade-in"
            >
              <nav className="button-stack" aria-label={t.socialLinksLabel}>
                {socialLinks.map((link, index) => (
                  <Button
                    key={link.id}
                    href={link.url}
                    icon={link.icon}
                    label={link.label}
                    className={link.className}
                    title={link.title}
                    index={index}
                  />
                ))}
              </nav>
            </div>

            <div
              key={`about-${activeTab}`}
              id="panel-about"
              role="tabpanel"
              aria-labelledby="tab-about"
              hidden={activeTab !== "about"}
              className="tab-panel tab-panel--fade-in tab-panel--about"
            >
              <BentoSection section={aboutSection} />
              <BentoSection section={homelabSection} />
              <BentoSection section={nowSection} />
            </div>
          </div>
        </main>

        <footer className="page-footer">
          <CircularText text="Made with ❤️ by NNT ✦ " radius={60} />
        </footer>
      </div>
    </Wrapper>
  );
};

export default Home;
