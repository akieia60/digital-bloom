import { useState } from 'react';
import { primeVideoPlayback } from '../lib/media';

const VideoPlayer = ({ videoUrl, posterUrl, alt }) => {
  const [isReady, setIsReady] = useState(false);

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
      {posterUrl && (
        <img
          src={posterUrl}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isReady ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      <video
        src={videoUrl}
        poster={posterUrl || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => {
          primeVideoPlayback(event);
        }}
        onCanPlay={() => setIsReady(true)}
        onLoadedData={() => setIsReady(true)}
        className={`w-full h-full object-cover animate-fade-in transition-opacity duration-500 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
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
