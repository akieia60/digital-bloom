import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="landing-footer">
      <div className="landing-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">{t('footer_brand')}</h3>
            <p className="footer-tagline">{t('footer_tagline')}</p>
          </div>
          <div className="footer-bottom">
            {/* Legal links live in the footer because Twilio's carrier review
                and Google Ads both check that they're reachable from the
                landing page, not just by typing the URL. */}
            <nav className="footer-legal" style={footerLegalStyle}>
              <Link to="/privacy" style={footerLinkStyle}>Privacy Policy</Link>
              <Link to="/terms" style={footerLinkStyle}>Terms of Service</Link>
              <Link to="/refunds" style={footerLinkStyle}>Refunds</Link>
              <a href="mailto:hello@digitalbloom.store" style={footerLinkStyle}>Contact</a>
            </nav>
            <p className="footer-copyright">
              © {new Date().getFullYear()} {t('footer_brand')}. {t('footer_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLegalStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '18px',
  marginBottom: '12px',
};

const footerLinkStyle = {
  color: '#D4AF37',
  textDecoration: 'none',
  fontSize: '0.85rem',
};
