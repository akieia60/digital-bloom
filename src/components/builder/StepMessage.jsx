import { useState } from 'react';
import { getMessages } from '../../data/bloomMessages';

export default function StepMessage({
  category,
  tone,
  messageType,
  selectedMessage,
  customMessage,
  onChange,
  onNext,
}) {
  const messages = getMessages(category, tone);
  const [customDraft, setCustomDraft] = useState(customMessage || '');

  const handleSelectCurated = (msg) => {
    onChange({ messageType: 'curated', selectedMessage: msg });
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomDraft(val);
    onChange({ messageType: 'custom', customMessage: val, selectedMessage: '' });
  };

  const handleSwitchToCustom = () => {
    onChange({ messageType: 'custom', selectedMessage: '' });
  };

  const handleSwitchToCurated = () => {
    onChange({ messageType: 'curated', customMessage: '' });
    setCustomDraft('');
  };

  const activeMessage = messageType === 'custom' ? customDraft : selectedMessage;
  const canContinue = !!activeMessage.trim();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-3">Step 04</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1D1D1F] mb-4 tracking-tight">
          Choose your message
        </h1>
        <p className="text-[#6E6E73] text-base max-w-md mx-auto leading-relaxed">
          Select from our curated message bank, or write something completely your own.
        </p>
      </div>

      {/* Toggle tabs */}
      <div className="flex rounded-xl border border-[#D2D2D7] overflow-hidden mb-8 max-w-xs mx-auto">
        <button
          onClick={handleSwitchToCurated}
          className={`flex-1 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 ${
            messageType === 'curated'
              ? 'bg-[#1D1D1F] text-white'
              : 'bg-white text-[#6E6E73] hover:bg-[#F5F5F7]'
          }`}
        >
          Curated
        </button>
        <button
          onClick={handleSwitchToCustom}
          className={`flex-1 py-2.5 text-xs font-medium tracking-wide transition-all duration-200 ${
            messageType === 'custom'
              ? 'bg-[#1D1D1F] text-white'
              : 'bg-white text-[#6E6E73] hover:bg-[#F5F5F7]'
          }`}
        >
          Write My Own
        </button>
      </div>

      {messageType === 'curated' ? (
        <>
          {messages.length === 0 ? (
            <p className="text-center text-[#6E6E73] py-8">
              No curated messages for this combination yet. Try writing your own!
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectCurated(msg)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMessage === msg
                      ? 'border-[#1D1D1F] bg-[#F5F5F7]'
                      : 'border-[#D2D2D7] bg-white hover:border-[#A0A0A8] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-4 h-4 mt-0.5 rounded-full border-2 transition-all duration-200 ${
                        selectedMessage === msg
                          ? 'border-[#1D1D1F] bg-[#1D1D1F]'
                          : 'border-[#D2D2D7]'
                      }`}
                    >
                      {selectedMessage === msg && (
                        <svg className="w-full h-full p-0.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-[#1D1D1F] leading-relaxed italic">"{msg}"</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <textarea
            value={customDraft}
            onChange={handleCustomChange}
            placeholder="Write your message here… something only you could say."
            maxLength={200}
            rows={5}
            className="w-full px-5 py-4 rounded-xl border-2 border-[#D2D2D7] focus:border-[#1D1D1F] outline-none resize-none text-sm text-[#1D1D1F] placeholder-[#A0A0A8] leading-relaxed transition-colors duration-200 bg-white"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#6E6E73]">Keep it personal and genuine</p>
            <span className="text-xs text-[#A0A0A8]">{customDraft.length}/200</span>
          </div>
        </div>
      )}

      {/* Preview of selected */}
      {canContinue && (
        <div className="mt-8 p-5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium mb-2">Your message</p>
          <p className="text-sm text-[#1D1D1F] italic leading-relaxed">"{activeMessage}"</p>
        </div>
      )}

      {/* Continue CTA inline (in addition to footer bar) */}
      {canContinue && (
        <div className="mt-8 text-center">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-[#1D1D1F] text-white rounded-full text-sm font-medium hover:bg-[#D4AF37] hover:text-[#1D1D1F] transition-all duration-300"
          >
            Use this message
          </button>
        </div>
      )}
    </div>
  );
}
