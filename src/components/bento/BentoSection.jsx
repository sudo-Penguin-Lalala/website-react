import Reveal from "../Reveal";
import BentoCell from "./BentoCell";

/**
 * BentoSection renders a section header, animated Bento grid of cells,
 * and optional section closer with proper accessibility labelling.
 */
const BentoSection = ({ section, onAction }) => {
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
          <BentoCell key={i} cell={cell} onAction={onAction} />
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

export default BentoSection;
