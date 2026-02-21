/**
 * PricingTiers — Digital Bloom
 * Displays the 4 pricing tiers with descriptions and CTA buttons.
 * All prices and Stripe IDs come from src/config/pricingTiers.js.
 * Never hardcode prices here.
 */
import { useNavigate } from 'react-router-dom';
import { PRICING_TIERS } from '../config/pricingTiers';

const tierIcons = {
  1: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <path d="M24 10C24 10 16 18 16 24C16 28.418 19.582 32 24 32C28.418 32 32 28.418 32 24C32 18 24 10 24 10Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  2: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <path d="M24 10C24 10 16 18 16 24C16 28.418 19.582 32 24 32C28.418 32 32 28.418 32 24C32 18 24 10 24 10Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 20C14 20 8 22 8 26C8 30 12 32 16 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <path d="M34 20C34 20 40 22 40 26C40 30 36 32 32 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  3: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <path d="M24 8L26 18H36L28 24L31 34L24 28L17 34L20 24L12 18H22L24 8Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  4: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <path d="M24 8L26 18H36L28 24L31 34L24 28L17 34L20 24L12 18H22L24 8Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
    </svg>
  ),
};

const PricingTiers = () => {
  const navigate = useNavigate();

  const handleSelectTier = (tier) => {
    // Navigate to shop filtered by tier, or directly to checkout
    navigate(`/shop?tier=${tier.tier}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-semibold block mb-4">
          Choose Your Experience
        </span>
        <h2 className="text-4xl sm:text-5xl font-medium font-display tracking-tight text-white mb-6">
          Bloom Tiers
        </h2>
        <p className="text-sm text-white/40 font-light tracking-wide max-w-xl mx-auto">
          Every tier is a one-time purchase. No subscriptions. No hidden fees.
          Select the depth of experience that speaks to your moment.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.tier}
            className={`relative group flex flex-col glass border rounded-[2rem] p-8 transition-all duration-700 cursor-pointer
              ${tier.popular
                ? 'border-pure-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.12)]'
                : 'border-white/5 hover:border-pure-gold/20 hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]'
              }`}
            onClick={() => handleSelectTier(tier)}
          >
            {/* Badge */}
            {tier.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold
                ${tier.popular ? 'bg-pure-gold text-black' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                {tier.badge}
              </div>
            )}

            {/* Icon */}
            <div className={`mb-6 transition-colors duration-500 ${tier.popular ? 'text-pure-gold' : 'text-white/30 group-hover:text-pure-gold/60'}`}>
              {tierIcons[tier.tier]}
            </div>

            {/* Tier Number */}
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-2 font-medium">
              Tier {tier.tier}
            </span>

            {/* Name */}
            <h3 className={`text-xl font-medium font-display tracking-tight mb-3 transition-colors duration-500
              ${tier.popular ? 'text-pure-gold' : 'text-white group-hover:text-pure-gold'}`}>
              {tier.name}
            </h3>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-light tracking-tight text-white">
                ${tier.price.toFixed(2)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/30 ml-2">one-time</span>
            </div>

            {/* Description */}
            <p className="text-xs text-white/40 font-light leading-relaxed mb-6 flex-1">
              {tier.description}
            </p>

            {/* Duration */}
            <div className="border-t border-white/5 pt-6 mb-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span className="text-white/30">Duration</span>
                <span className="text-pure-gold/70 font-semibold">
                  {tier.duration_seconds_min}–{tier.duration_seconds_max}s
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              className={`w-full py-4 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500
                ${tier.popular
                  ? 'bg-pure-gold text-black hover:bg-white hover:text-black shadow-lg shadow-pure-gold/20'
                  : 'border border-white/10 text-white/60 hover:border-pure-gold/40 hover:text-white'
                }`}
            >
              Select {tier.name}
            </button>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-[10px] uppercase tracking-widest text-white/20 mt-12">
        All tiers include instant digital delivery · Stripe Checkout · Apple Pay &amp; Google Pay accepted
      </p>
    </section>
  );
};

export default PricingTiers;
