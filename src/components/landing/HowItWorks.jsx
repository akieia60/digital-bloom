import { useLanguage } from '../../contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { number: "01", title: t('hiw_step1_title'), description: t('hiw_step1_desc') },
    { number: "02", title: t('hiw_step2_title'), description: t('hiw_step2_desc') },
    { number: "03", title: t('hiw_step3_title'), description: t('hiw_step3_desc') },
    { number: "04", title: t('hiw_step4_title'), description: t('hiw_step4_desc') },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="landing-container">
        <h2 className="section-title">{t('hiw_title')}</h2>
        <p className="section-subtitle">{t('hiw_subtitle')}</p>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
