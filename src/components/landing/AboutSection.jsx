import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="about-section">
      <div className="landing-container">
        <div className="about-content">
          <h2 className="section-title">{t('about_title')}</h2>
          <div className="about-text">
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
          </div>
          <Link to="/shop" className="cta-secondary">
            {t('about_cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
