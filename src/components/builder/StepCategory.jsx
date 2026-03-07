const CATEGORIES = [
  {
    id: 'birthday',
    label: 'Birthday',
    emoji: '🌸',
    description: 'Celebrate their special day with a bloom that makes them feel extraordinary.',
    color: '#FFD23F',
    textColor: '#1D1D1F',
  },
  {
    id: 'iloveyou',
    label: 'I Love You',
    emoji: '❤️',
    description: 'Say the three words with a bloom that makes them feel truly seen.',
    color: '#FF3B7F',
    textColor: '#FFFFFF',
  },
  {
    id: 'thankyou',
    label: 'Thank You',
    emoji: '✨',
    description: 'Express gratitude in a way that will never be forgotten.',
    color: '#D4AF37',
    textColor: '#1D1D1F',
  },
  {
    id: 'congratulations',
    label: 'Congratulations',
    emoji: '🏆',
    description: 'Honor their achievement with a bloom as remarkable as they are.',
    color: '#B45FFF',
    textColor: '#FFFFFF',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    emoji: '💍',
    description: 'Celebrate the love story you\'ve been writing together.',
    color: '#FF6B6B',
    textColor: '#FFFFFF',
  },
  {
    id: 'encouragement',
    label: 'Encouragement',
    emoji: '🌟',
    description: 'Show up for someone who needs to know they\'re not alone.',
    color: '#FF8C42',
    textColor: '#FFFFFF',
  },
  {
    id: 'sympathy',
    label: 'Sympathy',
    emoji: '🕊️',
    description: 'Hold someone gently in a moment of loss or difficulty.',
    color: '#7B9FFF',
    textColor: '#FFFFFF',
  },
];

export default function StepCategory({ selected, onSelect }) {
  return (
    <div>
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 01</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          What's the occasion?
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          Every bloom starts with intention. Choose the one that matches yours.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`group relative text-left rounded-2xl p-6 border-2 transition-all duration-300 ${
              selected === cat.id
                ? 'border-[#1D1D1F] shadow-lg scale-[1.02]'
                : 'border-[#D2D2D7] hover:border-[#1D1D1F] hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            {/* Color accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-opacity duration-300"
              style={{ background: cat.color, opacity: selected === cat.id ? 1 : 0.5 }}
            />

            <span className="text-2xl mb-3 block">{cat.emoji}</span>
            <h3 className="text-base font-medium text-[#1D1D1F] mb-1">{cat.label}</h3>
            <p className="text-xs text-[#6E6E73] leading-relaxed">{cat.description}</p>

            {selected === cat.id && (
              <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#1D1D1F] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
