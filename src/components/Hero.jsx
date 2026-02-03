const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Centered branding moved to Header - Hero is now focus on content */}

        {/* Main Heading */}
        <h1 className="font-cormorant text-6xl sm:text-7xl md:text-9xl font-bold mb-6 animate-slide-up tracking-tight">
          <span className="gradient-text drop-shadow-2xl">
            Digital Bloom™
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gold/90 mb-6 animate-slide-up font-light tracking-wide uppercase font-montserrat" style={{ animationDelay: '0.1s' }}>
          Exclusive 3D Flower Motion Art
        </p>

        {/* Description */}
        <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed font-light font-montserrat" style={{ animationDelay: '0.3s' }}>
          Premium animated flower videos that go viral. Send digital love, create stunning content, and stand out on social media.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={scrollToProducts}
            className="group relative px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full text-black font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Shop Luxury Collection
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => alert('🎬 Watch our demo reel coming soon! All videos are ready to purchase and download.')}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-gold/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 hover:border-gold/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass rounded-2xl p-8 border-t border-white/10 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-gold font-semibold text-xl mb-2">Instant Access</h3>
            <p className="text-white/60 text-sm font-light">Download your luxury art immediately after purchase</p>
          </div>

          <div className="glass rounded-2xl p-8 border-t border-white/10 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-gold font-semibold text-xl mb-2">Social Ready</h3>
            <p className="text-white/60 text-sm font-light">Optimized for high-impact social media presence</p>
          </div>

          <div className="glass rounded-2xl p-8 border-t border-white/10 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-gold font-semibold text-xl mb-2">Exclusive Quality</h3>
            <p className="text-white/60 text-sm font-light">Premium 3D animations with sophisticated effects</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
