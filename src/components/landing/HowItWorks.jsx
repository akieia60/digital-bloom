import { useLanguage } from '../../contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: "how_step1_title",
      description: "how_step1_desc"
    },
    {
      number: "02",
      title: "how_step2_title",
      description: "how_step2_desc"
    },
    {
      number: "03",
      title: "how_step3_title",
      description: "how_step3_desc"
    },
    {
      number: "04",
      title: "how_step4_title",
      description: "how_step4_desc"
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="landing-container">
        <h2 className="section-title">{t('how_title')}</h2>
        <p className="section-subtitle">
          {t('how_subtitle')}
        </p>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{t(step.title)}</h3>
              <p className="step-description">{t(step.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
