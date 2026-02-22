import { useState } from 'react';
import { useToast } from './Toast';

/**
 * PromptEnhancer — Transforms rough ideas into professional video prompts.
 * Uses AI-style enhancement patterns locally (no external API needed).
 *
 * Props:
 *   prompt     — The original prompt text
 *   onEnhanced — Callback with enhanced prompt text
 *   onClose    — Close the panel
 *   isOpen     — Visibility toggle
 */
export default function PromptEnhancer({ prompt, onEnhanced, onClose, isOpen }) {
  const toast = useToast();
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [style, setStyle] = useState('cinematic');

  const ENHANCEMENT_STYLES = {
    cinematic: {
      label: 'Cinematic',
      prefix: 'Cinematic, dramatic lighting, shallow depth of field, film grain, ',
      suffix: '. Shot on 35mm film, golden hour lighting, bokeh background, professional color grading.',
    },
    luxury: {
      label: 'Luxury',
      prefix: 'Ultra-luxurious, opulent, ',
      suffix: '. Rich velvet textures, gold leaf accents, crystal reflections, premium quality, 8K resolution.',
    },
    ethereal: {
      label: 'Ethereal',
      prefix: 'Dreamy, ethereal, soft-focus, ',
      suffix: '. Gentle particle effects, iridescent light, pastel color palette, floating petals, magical atmosphere.',
    },
    bold: {
      label: 'Bold & Viral',
      prefix: 'Eye-catching, vibrant, high-contrast, ',
      suffix: '. Dynamic camera movement, saturated colors, trending aesthetic, social media optimized, attention-grabbing.',
    },
    romantic: {
      label: 'Romantic',
      prefix: 'Romantic, warm, intimate, ',
      suffix: '. Soft candlelight, rose petals, warm amber tones, gentle motion, heartfelt atmosphere.',
    },
  };

  const handleEnhance = () => {
    if (!prompt?.trim()) {
      toast.error('No prompt to enhance');
      return;
    }

    setIsEnhancing(true);

    // Simulate processing delay for UX
    setTimeout(() => {
      const config = ENHANCEMENT_STYLES[style];
      const enhanced = config.prefix + prompt.trim() + config.suffix;
      setEnhancedPrompt(enhanced);
      setIsEnhancing(false);
      toast.success('Prompt enhanced!');
    }, 800);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast.success('Enhanced prompt copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleUse = () => {
    if (onEnhanced) onEnhanced(enhancedPrompt);
    toast.success('Enhanced prompt applied');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-500/20 bg-[#0a0a14] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-white">Prompt Enhancer</h2>
              <p className="text-[10px] text-white/30">Transform prompts into professional quality</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Original Prompt */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Original Prompt</label>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/60 leading-relaxed max-h-24 overflow-y-auto">
              {prompt || 'No prompt provided'}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-2">Enhancement Style</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ENHANCEMENT_STYLES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    style === key
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Enhance Button */}
          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25 hover:bg-purple-500/25 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isEnhancing ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Enhance Prompt
              </>
            )}
          </button>

          {/* Enhanced Result */}
          {enhancedPrompt && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-purple-400/60 uppercase tracking-wider mb-1.5">Enhanced Prompt</label>
                <div className="p-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/15 text-sm text-white/80 leading-relaxed">
                  {enhancedPrompt}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-xs font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button
                  onClick={handleUse}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25 hover:bg-purple-500/25 transition-colors text-xs font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Use This Prompt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
