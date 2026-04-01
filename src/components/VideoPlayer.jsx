const VideoPlayer = ({ videoUrl, posterUrl, alt }) => {
  if (!videoUrl) {
    return (
      <div className="w-full h-full relative group overflow-hidden">
        <img
          src={posterUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="db-watermark w-full h-full relative group overflow-hidden bg-black">
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover animate-fade-in"
      />
      {/* Getty-style diagonal watermark */}
      <div className="db-watermark-overlay" aria-hidden="true">
        <div className="db-watermark-grid">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="db-watermark-row">
              <span>© Digital Bloom</span>
              <span>© Digital Bloom</span>
              <span>© Digital Bloom</span>
              <span>© Digital Bloom</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
