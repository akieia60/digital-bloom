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
            <p className="footer-copyright">
              © {new Date().getFullYear()} {t('footer_brand')}. {t('footer_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
