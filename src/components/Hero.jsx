import { useState, useEffect } from 'react';

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    if (isVideoOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isVideoOpen]);
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Cinematic Prelude */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass border border-white/5 mb-12 animate-fade-in">
          <span className="w-1 h-1 rounded-full bg-brand-gold/40 animate-pulse"></span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-medium">The Future of Gifting</span>
        </div>

        {/* Hero Title - Refined Hierarchy */}
        <div className="mb-20 animate-slide-up">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-brand-white leading-[1.05] tracking-[0.02em] mb-8">
            Give them their flowers
          </h1>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-brand-gold/85 leading-[1.05] tracking-[0.02em]">
            while they can still see them
          </h2>
        </div>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/60 mb-16 max-w-xl mx-auto animate-slide-up font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Digital Bloom was created to express love and appreciation with intention. We believe in giving people their flowers while they are still here to experience the gesture.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-10 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={scrollToProducts}
            className="group px-12 py-5 rounded-full text-sm font-medium tracking-[0.2em] uppercase transition-all bg-brand-gold text-black hover:bg-brand-gold/90"
          >
            Begin Your Story
          </button>

          <button
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center space-x-4 text-white/70 hover:text-white transition-all underline-offset-8"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-pure-gold/60 transition-all">
              <svg className="w-4 h-4 translate-x-0.5 text-pure-gold/80 group-hover:text-pure-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium">Watch the Film</span>
          </button>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
      {/* Cinematic Modal Overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-12 right-12 text-white/40 hover:text-white transition-all p-4 z-[110]"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full max-w-6xl aspect-video relative group px-6">
            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-pure-gold/20 border-t-pure-gold rounded-full animate-spin"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Preparing the Film</span>
              </div>
            )}
            <video
              src="/videos/grok_manifesto.mp4"
              autoPlay
              controls
              onLoadedData={() => setIsVideoLoading(false)}
              className={`w-full h-full object-contain rounded-3xl shadow-2xl border border-white/10 transition-all duration-1000 ${
                isVideoLoading ? 'opacity-0 scale-95 blur-2xl' : 'opacity-100 scale-100 blur-0'
              }`}
            />
            {/* Ambient Shadow */}
            {!isVideoLoading && <div className="absolute -inset-10 bg-pure-gold/5 blur-[100px] -z-10 rounded-full animate-pulse-slow"></div>}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
