export default function ValueProps() {
  const values = [
    {
      title: "Published Digital Experiences",
      description: "DigitalBloom delivers curated and customized digital multimedia experiences, published with intention and designed to resonate emotionally."
    },
    {
      title: "Customization with Meaning",
      description: "Every DigitalBloom experience can be personalized with messages, colors, and creative elements to reflect the moment it represents."
    },
    {
      title: "Designed for Gifting and Sharing",
      description: "Send a DigitalBloom experience as a thoughtful digital gift or commission one for yourself as a personal expression."
    }
  ];

  return (
    <section className="value-props" id="experience">
      <div className="landing-container">
        <div className="value-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
