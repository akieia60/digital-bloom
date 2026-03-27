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
    </div>
  );
};

export default VideoPlayer;
