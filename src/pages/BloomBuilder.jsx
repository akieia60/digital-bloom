import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getTemplates } from '../data/bloomTemplates';
import { getMessages } from '../data/bloomMessages';
import BuilderNav from '../components/builder/BuilderNav';
import StepCategory from '../components/builder/StepCategory';
import StepTone from '../components/builder/StepTone';
import StepStyle from '../components/builder/StepStyle';
import StepMessage from '../components/builder/StepMessage';
import StepPersonalize from '../components/builder/StepPersonalize';
import StepPreview from '../components/builder/StepPreview';
import StepCheckout from '../components/builder/StepCheckout';

// ── Step config ──────────────────────────────────────────────────────
const STEPS = [
  { id: 1, key: 'category',    label: 'Occasion',    short: '01' },
  { id: 2, key: 'tone',        label: 'Tone',         short: '02' },
  { id: 3, key: 'style',       label: 'Style',        short: '03' },
  { id: 4, key: 'message',     label: 'Message',      short: '04' },
  { id: 5, key: 'personalize', label: 'Personalize',  short: '05' },
  { id: 6, key: 'preview',     label: 'Preview',      short: '06' },
  { id: 7, key: 'checkout',    label: 'Send',         short: '07' },
];

const INITIAL_BLOOM = {
  category: null,   // 'birthday' | 'iloveyou' | 'thankyou' | etc.
  tone: null,       // 'heartfelt' | 'playful' | etc.
  template: null,   // template object from bloomTemplates.js
  messageType: 'curated',  // 'curated' | 'custom'
  selectedMessage: '',
  customMessage: '',
  to: '',
  from: '',
  deliveryDate: '',
  privateNote: '',
};

export default function BloomBuilder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [step, setStep] = useState(1);
  const [bloom, setBloom] = useState(INITIAL_BLOOM);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const updateBloom = useCallback((updates) => {
    setBloom((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, STEPS.length)), []);
  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);
  const goToStep = useCallback((n) => {
    // Only allow going back to completed steps
    if (n < step) setStep(n);
  }, [step]);

  // Derived helpers
  const activeMessage = bloom.messageType === 'custom' ? bloom.customMessage : bloom.selectedMessage;
  const isStepValid = () => {
    switch (step) {
      case 1: return !!bloom.category;
      case 2: return !!bloom.tone;
      case 3: return !!bloom.template;
      case 4: return !!activeMessage.trim();
      case 5: return !!bloom.to.trim() && !!bloom.from.trim();
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  const handleAddToCart = () => {
    if (!bloom.template) return;
    const product = {
      id: `builder-${bloom.template.id}-${Date.now()}`,
      name: bloom.template.name,
      price: bloom.template.price,
      video_url: bloom.template.videoUrl,
      image_url: bloom.template.posterUrl,
      category: bloom.category,
      bloom_meta: {
        category: bloom.category,
        tone: bloom.tone,
        message: activeMessage,
        to: bloom.to,
        from: bloom.from,
        deliveryDate: bloom.deliveryDate,
        privateNote: bloom.privateNote,
      }
    };
    addToCart(product, 1);
    setCheckoutDone(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <StepCategory
          selected={bloom.category}
          onSelect={(cat) => {
            // Reset downstream selections when category changes
            updateBloom({ category: cat, tone: null, template: null, selectedMessage: '' });
            goNext();
          }}
        />
      );
      case 2: return (
        <StepTone
          selected={bloom.tone}
          category={bloom.category}
          onSelect={(tone) => {
            updateBloom({ tone, template: null, selectedMessage: '' });
            goNext();
          }}
        />
      );
      case 3: return (
        <StepStyle
          category={bloom.category}
          tone={bloom.tone}
          selected={bloom.template}
          onSelect={(template) => {
            updateBloom({ template });
            goNext();
          }}
        />
      );
      case 4: return (
        <StepMessage
          category={bloom.category}
          tone={bloom.tone}
          messageType={bloom.messageType}
          selectedMessage={bloom.selectedMessage}
          customMessage={bloom.customMessage}
          onChange={(updates) => updateBloom(updates)}
          onNext={goNext}
        />
      );
      case 5: return (
        <StepPersonalize
          to={bloom.to}
          from={bloom.from}
          deliveryDate={bloom.deliveryDate}
          privateNote={bloom.privateNote}
          onChange={(updates) => updateBloom(updates)}
          onNext={goNext}
        />
      );
      case 6: return (
        <StepPreview
          bloom={bloom}
          activeMessage={activeMessage}
          onNext={goNext}
          onEdit={(targetStep) => setStep(targetStep)}
        />
      );
      case 7: return (
        <StepCheckout
          bloom={bloom}
          activeMessage={activeMessage}
          onAddToCart={handleAddToCart}
          checkoutDone={checkoutDone}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <BuilderNav
        steps={STEPS}
        currentStep={step}
        onStepClick={goToStep}
        onExit={() => navigate('/')}
      />

      {/* Step Content */}
      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {renderStep()}
        </div>
      </main>

      {/* Bottom Action Bar */}
      {step < 7 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#D2D2D7]/50 px-6 py-4 z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-300 ${
                    s.id === step
                      ? 'w-4 h-1.5 bg-[#1D1D1F]'
                      : s.id < step
                      ? 'w-1.5 h-1.5 bg-[#D4AF37]'
                      : 'w-1.5 h-1.5 bg-[#D2D2D7]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={!isStepValid()}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isStepValid()
                  ? 'bg-[#1D1D1F] text-white hover:bg-[#D4AF37] hover:text-[#1D1D1F]'
                  : 'bg-[#D2D2D7] text-[#6E6E73] cursor-not-allowed'
              }`}
            >
              {step === 6 ? 'Review & Send' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
