/**
 * Combines section layout shape and localized translation data into
 * structured section objects for rendering Bento grids.
 *
 * @param {Array<{key: string, span: string, accent?: boolean, href?: string, action?: string}>} shape
 * @param {{eyebrow: string, title: string, lede?: string, closer?: string, cells?: Record<string, {kicker?: string, title?: string, body?: string, linkLabel?: string}>}} translation
 * @returns {{eyebrow: string, title: string, lede?: string, closer?: string, cells: Array<object>}}
 */
export function buildSection(shape, translation) {
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
        action: entry.action,
        kicker: text.kicker,
        title: text.title,
        body: text.body,
        linkLabel: text.linkLabel,
      };
    }),
  };
}
