/**
 * BentoCell renders an individual card within a Bento grid, supporting
 * responsive spans, accents, interactive modal triggers, and outbound links.
 */
const BentoCell = ({ cell, onAction }) => {
  const titleClass = `cell__title${cell.titleBig ? " cell__title--big" : ""}`;
  return (
    <article
      className={
        `cell cell--${cell.span}` +
        (cell.accent ? " cell--accent" : "") +
        (cell.stat ? " cell--stat" : "") +
        (cell.action ? " cell--interactive" : "")
      }
      onClick={cell.action && onAction ? () => onAction(cell.action) : undefined}
      role={cell.action ? "button" : undefined}
      tabIndex={cell.action ? 0 : undefined}
      onKeyDown={
        cell.action && onAction
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAction(cell.action);
              }
            }
          : undefined
      }
    >
      {cell.kicker && <p className="cell__kicker">{cell.kicker}</p>}
      {cell.title && <h3 className={titleClass}>{cell.title}</h3>}
      {cell.body && <p className="cell__body">{cell.body}</p>}
      {cell.action && cell.linkLabel && (
        <button
          type="button"
          className="cell__link"
          onClick={(e) => {
            e.stopPropagation();
            if (onAction) onAction(cell.action);
          }}
        >
          {cell.linkLabel}
        </button>
      )}
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

export default BentoCell;
