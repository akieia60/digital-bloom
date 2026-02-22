import { useState } from 'react';
import { useToast } from './Toast';

/**
 * ViralHooksScorer — Scores prompts/hooks on 5 metrics (1-10 each).
 * Metrics: Clarity, Emotional Hit, Curiosity Gap, Brand Fit, CTA Strength
 *
 * Props:
 *   prompt  — The prompt/hook text to score
 *   onClose — Close the panel
 *   isOpen  — Visibility toggle
 */
export default function ViralHooksScorer({ prompt, onClose, isOpen }) {
  const toast = useToast();
  const [scores, setScores] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [hookText, setHookText] = useState('');

  const METRICS = [
    { key: 'clarity', label: 'Clarity', desc: 'How clear and understandable is the message?', icon: '🎯' },
    { key: 'emotional', label: 'Emotional Hit', desc: 'Does it evoke a strong emotional response?', icon: '💖' },
    { key: 'curiosity', label: 'Curiosity Gap', desc: 'Does it make people want to see more?', icon: '🔮' },
    { key: 'brand', label: 'Brand Fit', desc: 'Does it align with Digital Bloom luxury aesthetic?', icon: '👑' },
    { key: 'cta', label: 'CTA Strength', desc: 'Does it drive action (buy, share, save)?', icon: '🚀' },
  ];

  const scorePrompt = () => {
    const text = hookText || prompt || '';
    if (!text.trim()) {
      toast.error('Enter a hook to score');
      return;
    }

    setIsScoring(true);

    setTimeout(() => {
      // Heuristic scoring based on text analysis
      const words = text.split(/\s+/).length;
      const hasQuestion = text.includes('?');
      const hasEmoji = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u.test(text);
      const hasAction = /\b(get|buy|shop|discover|unlock|transform|experience|create|watch|see)\b/i.test(text);
      const hasEmotion = /\b(love|beautiful|stunning|amazing|gorgeous|breathtaking|magical|dream|luxury|elegant)\b/i.test(text);
      const hasBrand = /\b(bloom|flower|floral|petal|rose|garden|bouquet|luxury|gold|premium)\b/i.test(text);
      const isShort = words <= 15;

      const clarity = Math.min(10, Math.max(3, isShort ? 8 : 6) + (hasQuestion ? 1 : 0));
      const emotional = Math.min(10, Math.max(3, hasEmotion ? 8 : 5) + (hasEmoji ? 1 : 0));
      const curiosity = Math.min(10, Math.max(3, hasQuestion ? 8 : 5) + (words > 5 && words < 20 ? 1 : 0));
      const brand = Math.min(10, Math.max(3, hasBrand ? 9 : 5) + (hasEmotion ? 1 : 0));
      const cta = Math.min(10, Math.max(3, hasAction ? 8 : 4) + (isShort ? 1 : 0));

      setScores({ clarity, emotional, curiosity, brand, cta });
      setIsScoring(false);
      toast.success('Hook scored!');
    }, 600);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25';
    if (score >= 6) return 'text-[#D4AF37] bg-[#D4AF37]/15 border-[#D4AF37]/25';
    if (score >= 4) return 'text-amber-400 bg-amber-500/15 border-amber-500/25';
    return 'text-red-400 bg-red-500/15 border-red-500/25';
  };

  const getOverallScore = () => {
    if (!scores) return 0;
    return Math.round((scores.clarity + scores.emotional + scores.curiosity + scores.brand + scores.cta) / 5 * 10) / 10;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-500/20 bg-[#0a0a14] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-white">Viral Hook Scorer</h2>
              <p className="text-[10px] text-white/30">Score your hooks on 5 key metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Hook Input */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Hook / Caption Text</label>
            <textarea
              value={hookText}
              onChange={(e) => setHookText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-amber-500/30 resize-none"
              placeholder="Enter your viral hook or caption..."
              defaultValue={prompt ? prompt.substring(0, 200) : ''}
            />
          </div>

          {/* Score Button */}
          <button
            onClick={scorePrompt}
            disabled={isScoring}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isScoring ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                Scoring...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Score This Hook
              </>
            )}
          </button>

          {/* Score Results */}
          {scores && (
            <div className="space-y-3">
              {/* Overall Score */}
              <div className="text-center py-3 rounded-xl bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent border border-[#D4AF37]/15">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Overall Score</p>
                <p className="text-3xl font-display font-bold text-[#D4AF37]">{getOverallScore()}</p>
                <p className="text-[10px] text-white/30 mt-0.5">out of 10</p>
              </div>

              {/* Individual Metrics */}
              <div className="space-y-2">
                {METRICS.map(metric => {
                  const score = scores[metric.key];
                  return (
                    <div key={metric.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-lg flex-shrink-0">{metric.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white/70">{metric.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(score)}`}>
                            {score}/10
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score * 10}%`,
                              background: score >= 8 ? '#10B981' : score >= 6 ? '#D4AF37' : score >= 4 ? '#F59E0B' : '#EF4444',
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-white/30 mt-0.5">{metric.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
