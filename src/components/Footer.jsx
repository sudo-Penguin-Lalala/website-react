/**
 * Footer renders the bottom copyright and monogram.
 */
const Footer = () => {
  return (
    <footer className="page-footer">
      <div className="monogram" aria-label="© 2026 Thien Nguyen. All rights reserved.">
        <span className="monogram__year">© 2026</span>
        <span className="monogram__name">Thien Nguyen</span>
        <span className="monogram__legal">All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
