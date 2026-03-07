const TONES = [
  {
    id: 'heartfelt',
    label: 'Heartfelt',
    description: 'Sincere, warm, and emotionally genuine.',
    icon: '💛',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'Light, fun, and full of personality.',
    icon: '✨',
  },
  {
    id: 'elegant',
    label: 'Elegant',
    description: 'Refined, understated, and deeply classy.',
    icon: '🌿',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    description: 'Tender, intimate, and deeply loving.',
    icon: '🌹',
  },
  {
    id: 'uplifting',
    label: 'Uplifting',
    description: 'Energizing, hopeful, and full of light.',
    icon: '🌟',
  },
  {
    id: 'deep',
    label: 'Deep',
    description: 'Contemplative, meaningful, and profound.',
    icon: '🌊',
  },
];

const CATEGORY_LABELS = {
  birthday: 'Birthday',
  iloveyou: 'I Love You',
  thankyou: 'Thank You',
  congratulations: 'Congratulations',
  anniversary: 'Anniversary',
  encouragement: 'Encouragement',
  sympathy: 'Sympathy',
};

export default function StepTone({ selected, category, onSelect }) {
  return (
    <div>
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 02</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Choose your tone
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          How should your {CATEGORY_LABELS[category] || 'bloom'} feel when it arrives?
        </p>
      </div>

      {/* Tone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            className={`group text-left rounded-2xl p-6 border-2 transition-all duration-300 ${
              selected === tone.id
                ? 'border-[#1D1D1F] bg-[#F5F5F7] shadow-lg scale-[1.02]'
                : 'border-[#D2D2D7] bg-white hover:border-[#1D1D1F] hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            <span className="text-2xl mb-3 block">{tone.icon}</span>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-medium text-[#1D1D1F]">{tone.label}</h3>
              {selected === tone.id && (
                <div className="w-5 h-5 rounded-full bg-[#1D1D1F] flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">{tone.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
