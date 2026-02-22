import { useState, useEffect } from 'react';
import { useToast } from './Toast';

/**
 * PromptVersionHistory — Tracks prompt revisions with rollback capability.
 * Stores versions in localStorage keyed by prompt ID.
 *
 * Props:
 *   promptId    — Unique identifier for the prompt
 *   promptName  — Display name
 *   currentText — Current prompt text
 *   onRestore   — Callback when restoring a version
 *   onClose     — Close the panel
 *   isOpen      — Visibility toggle
 */

const STORAGE_KEY = 'db_prompt_versions';

function loadVersions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveVersions(versions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  } catch {
    // silently fail
  }
}

export default function PromptVersionHistory({ promptId, promptName, currentText, onRestore, onClose, isOpen }) {
  const toast = useToast();
  const [versions, setVersions] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen && promptId) {
      const all = loadVersions();
      setVersions(all[promptId] || []);
    }
  }, [isOpen, promptId]);

  const handleSaveVersion = () => {
    if (!currentText?.trim()) {
      toast.error('No prompt text to save');
      return;
    }

    const all = loadVersions();
    const promptVersions = all[promptId] || [];

    const newVersion = {
      id: Date.now(),
      text: currentText,
      note: note || 'Manual save',
      timestamp: new Date().toISOString(),
      version: promptVersions.length + 1,
    };

    promptVersions.push(newVersion);
    all[promptId] = promptVersions;
    saveVersions(all);
    setVersions(promptVersions);
    setNote('');
    toast.success(`Version ${newVersion.version} saved`);
  };

  const handleRestore = (version) => {
    if (onRestore) onRestore(version.text);
    toast.success(`Restored to version ${version.version}`);
  };

  const handleDelete = (versionId) => {
    const all = loadVersions();
    const promptVersions = (all[promptId] || []).filter(v => v.id !== versionId);
    all[promptId] = promptVersions;
    saveVersions(all);
    setVersions(promptVersions);
    toast.info('Version deleted');
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-blue-500/20 bg-[#0a0a14] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0a0a14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-white">Version History</h2>
              <p className="text-[10px] text-white/30">{promptName || 'Prompt'} — {versions.length} versions</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Save Current Version */}
          <div className="p-3 rounded-xl bg-blue-500/[0.04] border border-blue-500/15 space-y-2">
            <label className="block text-[10px] text-blue-400/60 uppercase tracking-wider">Save Current Version</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Version note (optional)..."
              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/30"
            />
            <button
              onClick={handleSaveVersion}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-colors text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Version {versions.length + 1}
            </button>
          </div>

          {/* Version List */}
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-white/30">No versions saved yet</p>
              <p className="text-[10px] text-white/20 mt-1">Save your first version above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...versions].reverse().map(version => (
                <div key={version.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/25">
                        v{version.version}
                      </span>
                      <span className="text-[10px] text-white/30">{formatDate(version.timestamp)}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleRestore(version)}
                        className="px-2 py-1 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(version.id)}
                        className="px-2 py-1 rounded-md text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {version.note && (
                    <p className="text-[10px] text-white/40 italic mb-1">{version.note}</p>
                  )}
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3">{version.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
