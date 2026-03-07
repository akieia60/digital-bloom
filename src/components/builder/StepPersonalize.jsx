export default function StepPersonalize({
  to, from, deliveryDate, privateNote,
  onChange, onNext,
}) {
  const isValid = to.trim() && from.trim();

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 05</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Personalize your bloom
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          Add the details that make it truly theirs.
        </p>
      </div>

      <div className="space-y-5">
        {/* To */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            To <span className="text-[#FF3B7F]">*</span>
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => onChange({ to: e.target.value })}
            placeholder="Their name"
            maxLength={60}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] transition-colors duration-200 bg-white"
          />
        </div>

        {/* From */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            From <span className="text-[#FF3B7F]">*</span>
          </label>
          <input
            type="text"
            value={from}
            onChange={(e) => onChange({ from: e.target.value })}
            placeholder="Your name"
            maxLength={60}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] transition-colors duration-200 bg-white"
          />
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            Delivery Date
            <span className="ml-2 text-[9px] normal-case text-[#A0A0A8] tracking-normal">Optional — leave blank for immediate</span>
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => onChange({ deliveryDate: e.target.value })}
            min={today}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] transition-colors duration-200 bg-white"
          />
        </div>

        {/* Private Note */}
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#6E6E73] font-medium mb-2">
            Private Note
            <span className="ml-2 text-[9px] normal-case text-[#A0A0A8] tracking-normal">Optional — not shown on the bloom</span>
          </label>
          <textarea
            value={privateNote}
            onChange={(e) => onChange({ privateNote: e.target.value })}
            placeholder="Any special delivery instructions or private context for us…"
            maxLength={300}
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] resize-none leading-relaxed transition-colors duration-200 bg-white"
          />
          <p className="text-right text-xs text-[#A0A0A8] mt-1">{privateNote.length}/300</p>
        </div>

        {/* Continue */}
        {isValid && (
          <div className="pt-4 text-center">
            <button
              onClick={onNext}
              className="px-8 py-3 bg-[#1D1D1F] text-white rounded-full text-sm font-medium hover:bg-[#D4AF37] hover:text-[#1D1D1F] transition-all duration-300"
            >
              Preview My Bloom
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
