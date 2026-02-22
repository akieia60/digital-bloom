import { useState } from 'react';
import { useToast } from './Toast';

/**
 * VideoMetadataEditor — Track model, seed, settings, notes per video.
 *
 * Props:
 *   videoUrl    — URL of the video
 *   promptName  — Name of the associated prompt
 *   onSave      — Callback with metadata object
 *   onClose     — Close the panel
 *   isOpen      — Visibility toggle
 */

const STORAGE_KEY = 'db_video_metadata';

function loadMetadata() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMetadataStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export default function VideoMetadataEditor({ videoUrl, promptName, onSave, onClose, isOpen }) {
  const toast = useToast();

  const existing = videoUrl ? (loadMetadata()[videoUrl] || {}) : {};

  const [metadata, setMetadata] = useState({
    model: existing.model || 'grok-imagine',
    seed: existing.seed || '',
    duration: existing.duration || '10',
    aspectRatio: existing.aspectRatio || '9:16',
    resolution: existing.resolution || '720p',
    notes: existing.notes || '',
    rating: existing.rating || 0,
    isFavorite: existing.isFavorite || false,
    generatedAt: existing.generatedAt || new Date().toISOString(),
  });

  const handleChange = (field, value) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const all = loadMetadata();
    const key = videoUrl || `manual_${Date.now()}`;
    all[key] = { ...metadata, promptName, updatedAt: new Date().toISOString() };
    saveMetadataStore(all);
    if (onSave) onSave(all[key]);
    toast.success('Metadata saved');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/20 bg-[#0a0a14] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-white">Video Metadata</h2>
              <p className="text-[10px] text-white/30">{promptName || 'Track generation settings'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Model & Seed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Model</label>
              <select
                value={metadata.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full py-2 px-3 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-white/70 focus:outline-none focus:border-cyan-500/30"
              >
                <option value="grok-imagine">Grok Imagine</option>
                <option value="kling">Kling</option>
                <option value="runway">Runway</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Seed</label>
              <input
                type="text"
                value={metadata.seed}
                onChange={(e) => handleChange('seed', e.target.value)}
                placeholder="e.g., 42"
                className="w-full py-2 px-3 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-white/70 placeholder-white/20 focus:outline-none focus:border-cyan-500/30"
              />
            </div>
          </div>

          {/* Duration, Ratio, Resolution */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Duration</label>
              <select
                value={metadata.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full py-2 px-2 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-white/70 focus:outline-none focus:border-cyan-500/30"
              >
                <option value="5">5s</option>
                <option value="10">10s</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Ratio</label>
              <select
                value={metadata.aspectRatio}
                onChange={(e) => handleChange('aspectRatio', e.target.value)}
                className="w-full py-2 px-2 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-white/70 focus:outline-none focus:border-cyan-500/30"
              >
                <option value="9:16">9:16</option>
                <option value="16:9">16:9</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Quality</label>
              <select
                value={metadata.resolution}
                onChange={(e) => handleChange('resolution', e.target.value)}
                className="w-full py-2 px-2 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] text-white/70 focus:outline-none focus:border-cyan-500/30"
              >
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleChange('rating', star)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    star <= metadata.rating
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'bg-white/[0.03] text-white/20 hover:text-white/40'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <button
                onClick={() => handleChange('isFavorite', !metadata.isFavorite)}
                className={`ml-2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  metadata.isFavorite
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/[0.03] text-white/20 hover:text-white/40'
                }`}
              >
                <svg className="w-4 h-4" fill={metadata.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea
              value={metadata.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Generation notes, observations, what worked..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-cyan-500/30 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Metadata
          </button>
        </div>
      </div>
    </div>
  );
}
