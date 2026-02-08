import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is a DigitalBloom experience?",
      answer: "A DigitalBloom experience is a published digital multimedia creation designed to communicate emotion, intention, or connection. Each experience is thoughtfully crafted and can be customized to reflect your personal moment or message."
    },
    {
      question: "Are these downloadable files?",
      answer: "DigitalBloom experiences are delivered as curated digital media experiences rather than standalone downloadable products. Each experience is published and delivered with intention as part of our multimedia service."
    },
    {
      question: "Can I personalize an experience?",
      answer: "Yes. Each experience can be customized with messages, colors, and creative elements before delivery. This personalization is part of what makes DigitalBloom a publishing service rather than a simple file marketplace."
    },
    {
      question: "How do I receive my experience?",
      answer: "After customization, your DigitalBloom experience is published and delivered digitally. You can receive it privately or send it as a digital gift to someone else."
    },
    {
      question: "Can I send this as a gift?",
      answer: "Absolutely. DigitalBloom experiences are designed for gifting and sharing. You can commission an experience and have it delivered directly to someone special as a thoughtful digital expression."
    },
    {
      question: "What are Experience Credits?",
      answer: "Experience Credits provide prepaid access to DigitalBloom digital multimedia experiences. They can be purchased in fixed amounts and used to publish customized experiences for yourself or as gifts."
    },
    {
      question: "How do I redeem a credit?",
      answer: "Enter your credit code at checkout when publishing an experience. The credit will be applied to your order total. Partially used credits retain their remaining balance for future use."
    },
    {
      question: "Can I use multiple credits?",
      answer: "Currently, one credit code can be applied per order. If your credit has a remaining balance after a purchase, you can use it again on future orders."
    },
    {
      question: "Are credits refundable?",
      answer: "No. Experience Credits are non-refundable and not redeemable for cash. They are intended for DigitalBloom experience publishing only and have no expiration date."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="landing-container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <svg 
                  className="faq-icon" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M5 7.5L10 12.5L15 7.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
