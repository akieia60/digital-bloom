import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate form submission (replace with actual email service)
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="landing-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2 className="section-title">{t('contact_title')}</h2>
            <p className="contact-description">
              {t('contact_subtitle')}
            </p>
            <div className="contact-details">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:hello@digitalbloom.com">hello@digitalbloom.com</a>
              </p>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact_label_name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('contact_placeholder_name')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact_label_email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('contact_placeholder_email')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact_label_message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder={t('contact_placeholder_message')}
              />
            </div>
            <button
              type="submit"
              className="cta-primary"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? t('contact_button_sending') : status === 'success' ? t('contact_button_sent') : t('contact_button_send')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
