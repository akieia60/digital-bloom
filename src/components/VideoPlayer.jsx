const VideoPlayer = ({ videoUrl, posterUrl, alt }) => {
  if (!videoUrl) {
    return (
      <div className="w-full h-full relative group overflow-hidden">
        <img
          src={posterUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group overflow-hidden bg-black">
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover animate-fade-in"
      />
      
      {/* Signature Watermark Overlay */}
      <div className="absolute bottom-6 right-6 pointer-events-none select-none opacity-40 group-hover:opacity-80 transition-opacity duration-700">
         <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-[0.4em] text-white font-display">Digital Bloom™</span>
            <span className="text-[6px] uppercase tracking-[0.2em] text-pure-gold mt-1 font-light">Fine Motion Art</span>
         </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>
    </div>
  );
};

export default VideoPlayer;
