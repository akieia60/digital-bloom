import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 pb-20">
      {/* Refined Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Cinematic Prelude */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-black/5 mb-12 animate-fade-in">
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 animate-pulse"></span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6E6E73] font-medium">{t('hero_prelude')}</span>
        </div>

        {/* Hero Title - Refined Hierarchy */}
        <div className="mb-20 animate-slide-up">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[#1D1D1F] leading-[1.05] tracking-[0.02em] mb-8">
            {t('hero_title_1')}
          </h1>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#D4AF37]/85 leading-[1.05] tracking-[0.02em]">
            {t('hero_title_2')}
          </h2>
        </div>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#6E6E73] mb-16 max-w-xl mx-auto animate-slide-up font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
          {t('hero_subtitle')}
        </p>

        {/* Primary Action — Single CTA, no Watch the Film */}
        <div className="flex justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={scrollToProducts}
            className="group px-12 py-5 rounded-full text-sm font-medium tracking-[0.2em] uppercase transition-all bg-[#1D1D1F] text-white hover:bg-[#D4AF37] hover:text-[#1D1D1F]"
          >
            {t('hero_cta')}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#1D1D1F] to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
