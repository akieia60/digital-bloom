import { Link } from 'react-router-dom';

export default function TwoWaysToBloom() {
  return (
    <section className="two-ways-section">
      <div className="landing-container">
        <span className="cat-eyebrow">FLEXIBLE GIFTING</span>
        <h2 className="cat-headline">Two Ways to Bloom</h2>
        <p className="cat-subtext">
          Send a bloom directly, or purchase Experience Credits as a digital gift card
          that your loved one can redeem whenever they're ready.
        </p>

        <div className="two-ways-grid">
          {/* Option 1 */}
          <Link to="/shop" className="two-ways-card">
            <div className="two-ways-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <path d="M24 8C20 8 16 12 16 18C16 24 24 36 24 36C24 36 32 24 32 18C32 12 28 8 24 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 14V22M20 18H28" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
              </svg>
            </div>
            <h3 className="two-ways-title">Send a Bloom</h3>
            <p className="two-ways-desc">
              Choose an occasion, customize your message, and deliver a beautiful
              digital experience directly to someone special.
            </p>
            <span className="two-ways-cta">
              Browse Occasions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12H19M12 5L19 12L12 19" />
              </svg>
            </span>
          </Link>

          {/* Option 2 */}
          <Link to="/credits" className="two-ways-card two-ways-card--gold">
            <div className="two-ways-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <rect x="6" y="14" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M6 22H42" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 30H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                <circle cx="36" cy="30" r="3" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
              </svg>
            </div>
            <h3 className="two-ways-title">Experience Credits</h3>
            <p className="two-ways-desc">
              Give the gift of choice. Purchase credits that can be redeemed
              for any bloom — perfect when you want them to pick their own.
            </p>
            <span className="two-ways-cta">
              Get Credits
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12H19M12 5L19 12L12 19" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
