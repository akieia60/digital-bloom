const VideoPlayer = ({ videoUrl, posterUrl, alt }) => {
  if (!videoUrl) {
    return (
      <img
        src={posterUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <video
      src={videoUrl}
      autoPlay
      muted
      loop
      playsInline
      controls
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

export default VideoPlayer;
