import { useState, useRef } from 'react';
import { getTemplates } from '../../data/bloomTemplates';

const TIER_LABELS = { 2: 'Bloom Experience', 3: 'Premium Bloom' };

export default function StepStyle({ category, tone, selected, onSelect }) {
  const templates = getTemplates(category, tone);
  const [hoveredId, setHoveredId] = useState(null);
  const videoRefs = useRef({});

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    const video = videoRefs.current[id];
    if (video) video.play().catch(() => {});
  };

  const handleMouseLeave = (id) => {
    setHoveredId(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // Fallback: if no templates match category+tone, show all for category
  const displayTemplates = templates.length > 0 ? templates : getTemplates(category, null);

  return (
    <div>
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 03</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Choose your bloom style
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          Each style is a curated cinematic video — hover to preview it alive.
        </p>
      </div>

      {displayTemplates.length === 0 ? (
        <div className="text-center text-[#6E6E73] py-16">
          <p className="text-lg mb-2">No styles available yet for this combination.</p>
          <p className="text-sm">More blooms coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {displayTemplates.map((template) => {
            const isSelected = selected?.id === template.id;
            const isHovered = hoveredId === template.id;

            return (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                onMouseEnter={() => handleMouseEnter(template.id)}
                onMouseLeave={() => handleMouseLeave(template.id)}
                className={`group text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#1D1D1F] shadow-xl scale-[1.02]'
                    : 'border-[#D2D2D7] hover:border-[#1D1D1F] hover:shadow-lg hover:scale-[1.01]'
                }`}
              >
                {/* Video Preview */}
                <div className="relative aspect-[3/4] bg-[#F5F5F7] overflow-hidden">
                  {/* Color accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 z-10"
                    style={{ background: template.accentColor }}
                  />

                  <video
                    ref={(el) => { if (el) videoRefs.current[template.id] = el; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    preload="none"
                  >
                    <source src={template.videoUrl} type="video/mp4" />
                  </video>

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Hover play indicator */}
                  {!isHovered && !isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md z-20">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}

                  {/* Label badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-semibold"
                      style={{ background: template.accentColor, color: template.labelColor }}
                    >
                      {template.label}
                    </span>
                  </div>

                  {/* Price badge */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#1D1D1F]">
                      ${template.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-medium text-[#1D1D1F] leading-tight">{template.name}</h3>
                    {template.popular && (
                      <span className="flex-shrink-0 text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6E6E73] leading-relaxed">{template.description}</p>
                  <p className="text-[9px] uppercase tracking-widest text-[#A0A0A8] mt-2 font-medium">
                    {TIER_LABELS[template.tier] || 'Digital Bloom'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
