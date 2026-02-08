export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose an Experience",
      description: "Select a DigitalBloom experience designed around expression, mood, or occasion."
    },
    {
      number: "02",
      title: "Customize the Experience",
      description: "Personalize your experience with custom text, colors, and creative elements."
    },
    {
      number: "03",
      title: "Digital Publishing",
      description: "Your customized DigitalBloom experience is published as a digital multimedia creation."
    },
    {
      number: "04",
      title: "Delivery or Gifting",
      description: "Receive your experience privately or send it as a digital gift to someone else."
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="landing-container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Four steps to creating your personalized DigitalBloom experience
        </p>
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
