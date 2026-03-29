import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "faq_q1",
      answer: "faq_a1"
    },
    {
      question: "faq_q2",
      answer: "faq_a2"
    },
    {
      question: "faq_q3",
      answer: "faq_a3"
    },
    {
      question: "faq_q4",
      answer: "faq_a4"
    },
    {
      question: "faq_q5",
      answer: "faq_a5"
    },
    {
      question: "faq_q6",
      answer: "faq_a6"
    },
    {
      question: "faq_q7",
      answer: "faq_a7"
    },
    {
      question: "faq_q8",
      answer: "faq_a8"
    },
    {
      question: "faq_q9",
      answer: "faq_a9"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="landing-container">
        <h2 className="section-title">{t('faq_title')}</h2>
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
                <span>{t(faq.question)}</span>
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
                <p>{t(faq.answer)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
