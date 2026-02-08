export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">Digital Bloom</h3>
            <p className="footer-tagline">Digital multimedia publishing for meaningful expression</p>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Digital Bloom. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
