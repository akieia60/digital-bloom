import { useToast } from './Toast';

/**
 * ExportTools — Export prompts/metadata to TXT, JSON, or CSV.
 *
 * Props:
 *   data     — Array of objects to export
 *   filename — Base filename (without extension)
 *   onClose  — Close callback
 *   isOpen   — Visibility toggle
 */
export default function ExportTools({ data, filename = 'digital-bloom-export', onClose, isOpen }) {
  const toast = useToast();

  const downloadFile = (content, ext, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success(`Exported as ${ext.toUpperCase()}`);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(data, null, 2), 'json', 'application/json');
  };

  const exportTXT = () => {
    const lines = data.map((item, i) => {
      const parts = [`#${i + 1}`];
      Object.entries(item).forEach(([key, val]) => {
        parts.push(`${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`);
      });
      return parts.join('\n');
    });
    downloadFile(lines.join('\n\n---\n\n'), 'txt', 'text/plain');
  };

  const exportCSV = () => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(item =>
      keys.map(k => {
        const val = item[k];
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    downloadFile([header, ...rows].join('\n'), 'csv', 'text/csv');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a14] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-white">Export Data</h2>
              <p className="text-[10px] text-white/30">{data?.length || 0} items</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-3">
          <button
            onClick={exportJSON}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#D4AF37]/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono font-bold text-blue-400">{ }</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-white/80 font-medium">JSON</p>
              <p className="text-[10px] text-white/30">Structured data, machine-readable</p>
            </div>
          </button>

          <button
            onClick={exportCSV}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#D4AF37]/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono font-bold text-emerald-400">CSV</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-white/80 font-medium">CSV</p>
              <p className="text-[10px] text-white/30">Spreadsheet-compatible, import to Excel</p>
            </div>
          </button>

          <button
            onClick={exportTXT}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#D4AF37]/20 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-mono font-bold text-purple-400">TXT</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-white/80 font-medium">Plain Text</p>
              <p className="text-[10px] text-white/30">Human-readable, easy to share</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
