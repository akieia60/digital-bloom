import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BuilderProgress from '../components/builder/BuilderProgress';
import StepCategory from '../components/builder/StepCategory';
import StepTone from '../components/builder/StepTone';
import StepStyle from '../components/builder/StepStyle';
import StepMessage from '../components/builder/StepMessage';
import StepPersonalize from '../components/builder/StepPersonalize';
import StepPreview from '../components/builder/StepPreview';
import StepCheckout from '../components/builder/StepCheckout';
import '../styles/builder.css';

const TOTAL_STEPS = 7;

const INITIAL_STATE = {
  category: '',
  tone: '',
  styleId: '',
  message: { preset: '', custom: '' },
  personalize: {
    to: '',
    from: '',
    recipientEmail: '',
    deliveryDate: '',
    privateNote: '',
  },
};

/**
 * Returns true if the user may proceed from the given step.
 */
function canProceed(step, state) {
  switch (step) {
    case 1: return !!state.category;
    case 2: return !!state.tone;
    case 3: return !!state.styleId;
    case 4: return !!(state.message?.preset || state.message?.custom);
    case 5: return true; // all fields optional
    case 6: return true; // preview — always can proceed
    case 7: return true;
    default: return false;
  }
}

export default function BloomBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState(INITIAL_STATE);

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleCategoryChange = (val) => {
    // Reset tone, style when category changes
    setState((s) => ({ ...s, category: val, tone: '', styleId: '' }));
  };

  const handleToneChange = (val) => {
    // Reset style when tone changes
    setState((s) => ({ ...s, tone: val, styleId: '' }));
  };

  const proceed = canProceed(step, state);

  return (
    <div className="bloom-builder">
      {/* Top bar */}
      <div className="bloom-builder__topbar">
        <Link to="/" className="bloom-builder__brand">Digital Bloom</Link>
        <button
          className="bloom-builder__close"
          onClick={() => navigate('/')}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit
        </button>
      </div>

      {/* Step progress */}
      <BuilderProgress currentStep={step} />

      {/* Step content */}
      <div className="bloom-builder__inner">
        {step === 1 && (
          <StepCategory
            value={state.category}
            onChange={handleCategoryChange}
          />
        )}

        {step === 2 && (
          <StepTone
            value={state.tone}
            onChange={handleToneChange}
            categoryId={state.category}
          />
        )}

        {step === 3 && (
          <StepStyle
            value={state.styleId}
            onChange={(val) => setState((s) => ({ ...s, styleId: val }))}
            categoryId={state.category}
            toneId={state.tone}
          />
        )}

        {step === 4 && (
          <StepMessage
            value={state.message}
            onChange={(val) => setState((s) => ({ ...s, message: val }))}
            categoryId={state.category}
            toneId={state.tone}
          />
        )}

        {step === 5 && (
          <StepPersonalize
            value={state.personalize}
            onChange={(val) => setState((s) => ({ ...s, personalize: val }))}
          />
        )}

        {step === 6 && (
          <StepPreview state={state} />
        )}

        {step === 7 && (
          <StepCheckout state={state} />
        )}

        {/* Navigation */}
        {step < 7 && (
          <div className="builder-nav">
            <button
              className="builder-nav__back"
              onClick={handleBack}
              type="button"
              style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back
            </button>

            <button
              className="builder-nav__next"
              onClick={handleNext}
              disabled={!proceed}
              type="button"
            >
              {step === 6 ? 'Continue to Checkout' : 'Continue'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Back button for checkout step */}
        {step === 7 && (
          <div className="builder-nav">
            <button
              className="builder-nav__back"
              onClick={handleBack}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
