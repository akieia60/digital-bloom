import { useRef, useEffect } from 'react';

const CATEGORY_LABELS = {
  birthday: 'Birthday',
  iloveyou: 'I Love You',
  thankyou: 'Thank You',
  congratulations: 'Congratulations',
  anniversary: 'Anniversary',
  encouragement: 'Encouragement',
  sympathy: 'Sympathy',
};

const TONE_LABELS = {
  heartfelt: 'Heartfelt',
  playful: 'Playful',
  elegant: 'Elegant',
  romantic: 'Romantic',
  uplifting: 'Uplifting',
  deep: 'Deep',
};

const STEP_LABELS = {
  category: 1,
  tone: 2,
  style: 3,
  message: 4,
  personalize: 5,
};

export default function StepPreview({ bloom, activeMessage, onNext, onEdit }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const { template, to, from, deliveryDate, category, tone } = bloom;

  if (!template) {
    return (
      <div className="text-center py-16 text-[#6E6E73]">
        <p>Something went wrong. Please go back and select a style.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 06</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Your bloom preview
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          This is exactly what your recipient will receive. Make any changes before sending.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
        {/* Video Preview — left/top */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F5F7] shadow-2xl">
            {/* Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 z-10"
              style={{ background: template.accentColor }}
            />

            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            >
              <source src={template.videoUrl} type="video/mp4" />
            </video>

            {/* Message overlay — lower third */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
              {to && (
                <p className="text-white/70 text-xs uppercase tracking-[0.2em] font-medium mb-2">
                  For {to}
                </p>
              )}
              <p className="text-white text-sm sm:text-base leading-relaxed font-light italic">
                "{activeMessage}"
              </p>
              {from && (
                <p className="text-white/60 text-xs mt-3 tracking-wide">
                  — {from}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details panel — right/bottom */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bloom summary card */}
          <div className="bg-[#F5F5F7] rounded-2xl p-5">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] font-medium mb-4">Bloom Summary</h3>
            <div className="space-y-3">
              <SummaryRow label="Occasion" value={CATEGORY_LABELS[category]} onEdit={() => onEdit(1)} />
              <SummaryRow label="Tone" value={TONE_LABELS[tone]} onEdit={() => onEdit(2)} />
              <SummaryRow label="Style" value={template.name} onEdit={() => onEdit(3)} />
              <SummaryRow label="Message" value={activeMessage.length > 40 ? activeMessage.slice(0, 40) + '…' : activeMessage} onEdit={() => onEdit(4)} />
              <SummaryRow label="To" value={to} onEdit={() => onEdit(5)} />
              <SummaryRow label="From" value={from} onEdit={() => onEdit(5)} />
              {deliveryDate && (
                <SummaryRow label="Deliver On" value={formatDate(deliveryDate)} onEdit={() => onEdit(5)} />
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-5 border border-[#D2D2D7]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium">{template.name}</p>
                <p className="text-[9px] text-[#A0A0A8] mt-0.5 uppercase tracking-widest">Digital Bloom</p>
              </div>
              <p className="text-2xl font-medium text-[#1D1D1F]">${template.price.toFixed(2)}</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onNext}
            className="w-full py-4 bg-[#1D1D1F] text-white rounded-2xl text-sm font-medium hover:bg-[#D4AF37] hover:text-[#1D1D1F] transition-all duration-300 tracking-wide"
          >
            Send This Bloom — ${template.price.toFixed(2)}
          </button>

          <p className="text-center text-xs text-[#A0A0A8] leading-relaxed">
            Secure checkout · Instant digital delivery
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[10px] uppercase tracking-[0.15em] text-[#A0A0A8] font-medium flex-shrink-0 mt-0.5">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-[#1D1D1F] text-right truncate">{value}</span>
        <button
          onClick={onEdit}
          className="flex-shrink-0 text-[#A0A0A8] hover:text-[#D4AF37] transition-colors"
          aria-label={`Edit ${label}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
