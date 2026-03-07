export default function BuilderNav({ steps, currentStep, onStepClick, onExit }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D2D2D7]/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={onExit}
          className="flex items-center gap-2 group"
          aria-label="Exit builder"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors font-medium">
            Digital Bloom
          </span>
        </button>

        {/* Step indicators — desktop only */}
        <div className="hidden sm:flex items-center gap-0">
          {steps.map((s, i) => {
            const isDone = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            const isClickable = s.id < currentStep;

            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => isClickable && onStepClick(s.id)}
                  disabled={!isClickable}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-all duration-200 ${
                    isCurrent
                      ? 'text-[#1D1D1F] bg-[#F5F5F7]'
                      : isDone
                      ? 'text-[#D4AF37] hover:bg-[#F5F5F7] cursor-pointer'
                      : 'text-[#D2D2D7] cursor-default'
                  }`}
                >
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span>{s.short}</span>
                  )}
                  <span className="hidden lg:inline">{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-4 h-px mx-0.5 ${isDone ? 'bg-[#D4AF37]' : 'bg-[#D2D2D7]'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: step count */}
        <div className="sm:hidden text-xs text-[#6E6E73]">
          Step {currentStep} of {steps.length}
        </div>

        {/* Exit */}
        <button
          onClick={onExit}
          className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors text-sm"
          aria-label="Exit"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
