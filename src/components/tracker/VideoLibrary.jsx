import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import VideoUploadZone from './VideoUploadZone';
import VideoMetadataEditor from './VideoMetadataEditor';
import ExportTools from './ExportTools';

const META_STORAGE_KEY = 'db_video_metadata';

function loadAllMetadata() {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * VideoLibrary — Admin section for managing generated/uploaded videos.
 * Shows all videos with metadata, ratings, favorites, and export.
 */
export default function VideoLibrary() {
  const toast = useToast();
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [filter, setFilter] = useState('all'); // all, favorites, rated

  useEffect(() => {
    refreshVideos();
  }, []);

  const refreshVideos = () => {
    const meta = loadAllMetadata();
    const list = Object.entries(meta).map(([url, data]) => ({
      url,
      ...data,
    }));
    // Sort by most recent first
    list.sort((a, b) => new Date(b.updatedAt || b.generatedAt || 0) - new Date(a.updatedAt || a.generatedAt || 0));
    setVideos(list);
  };

  const handleUploadComplete = ({ url, fileName }) => {
    // Save basic metadata for uploaded video
    const meta = loadAllMetadata();
    meta[url] = {
      model: 'manual-upload',
      promptName: fileName,
      rating: 0,
      isFavorite: false,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: '',
    };
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    refreshVideos();
    setShowUpload(false);
  };

  const handleDeleteVideo = (url) => {
    if (!confirm('Remove this video from the library?')) return;
    const meta = loadAllMetadata();
    delete meta[url];
    localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
    refreshVideos();
    toast.info('Video removed from library');
  };

  const filteredVideos = videos.filter(v => {
    if (filter === 'favorites') return v.isFavorite;
    if (filter === 'rated') return v.rating >= 4;
    return true;
  });

  const exportData = filteredVideos.map(v => ({
    prompt: v.promptName || '',
    model: v.model || '',
    rating: v.rating || 0,
    favorite: v.isFavorite ? 'Yes' : 'No',
    duration: v.duration || '',
    aspectRatio: v.aspectRatio || '',
    resolution: v.resolution || '',
    notes: v.notes || '',
    url: v.url || '',
    date: v.generatedAt || '',
  }));

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">Video Library</h3>
            <p className="text-xs text-white/30">{videos.length} videos tracked</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExport(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/25 transition-colors"
          >
            {showUpload ? 'Close' : '+ Upload'}
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <VideoUploadZone onUploadComplete={handleUploadComplete} />
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'favorites', label: 'Favorites' },
          { key: 'rated', label: '4+ Stars' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-sm text-white/30">No videos yet</p>
          <p className="text-[10px] text-white/20 mt-1">Generate or upload videos to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.url}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#D4AF37]/20 transition-all group"
            >
              {/* Video Preview */}
              <div className="relative aspect-video bg-black">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  preload="metadata"
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                />
                {video.isFavorite && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/30 flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/70 font-medium truncate flex-1">{video.promptName || 'Untitled'}</p>
                  <span className="text-[10px] text-white/30 ml-2 flex-shrink-0">{video.model}</span>
                </div>

                {/* Rating Stars */}
                {video.rating > 0 && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${s <= video.rating ? 'text-[#D4AF37]' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-white/25">
                  <span>{formatDate(video.generatedAt)}</span>
                  <span>{video.duration ? `${video.duration}s` : ''} {video.aspectRatio || ''}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.url)}
                    className="py-1.5 px-2 rounded-lg text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Editor Modal */}
      {editingVideo && (
        <VideoMetadataEditor
          videoUrl={editingVideo.url}
          promptName={editingVideo.promptName}
          onSave={() => {
            setEditingVideo(null);
            refreshVideos();
          }}
          onClose={() => setEditingVideo(null)}
          isOpen={!!editingVideo}
        />
      )}

      {/* Export Modal */}
      <ExportTools
        data={exportData}
        filename="digital-bloom-videos"
        onClose={() => setShowExport(false)}
        isOpen={showExport}
      />
    </div>
  );
}
