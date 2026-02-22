import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from './Toast';

/**
 * VideoUploadZone — Drag-and-drop video upload to Supabase storage.
 * File size validation: warning at 100MB, blocked at 500MB.
 *
 * Props:
 *   onUploadComplete — Callback with { url, fileName, size }
 *   bucket           — Supabase storage bucket name (default: 'product-media')
 */
export default function VideoUploadZone({ onUploadComplete, bucket = 'product-media' }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const MAX_SIZE = 500 * 1024 * 1024; // 500MB
  const WARN_SIZE = 100 * 1024 * 1024; // 100MB

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      toast.error(`File too large (${formatSize(file.size)}). Maximum is 500MB.`);
      return;
    }

    if (file.size > WARN_SIZE) {
      toast.info(`Large file (${formatSize(file.size)}) — upload may take a moment`);
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `tracker-videos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setPreview({ url: publicUrl, name: file.name, size: file.size });

      if (onUploadComplete) {
        onUploadComplete({ url: publicUrl, fileName: file.name, size: file.size });
      }

      toast.success('Video uploaded successfully!');
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? 'border-[#D4AF37] bg-[#D4AF37]/[0.05]'
            : uploading
            ? 'border-blue-500/30 bg-blue-500/[0.03]'
            : 'border-white/[0.08] bg-white/[0.02] hover:border-[#D4AF37]/30 hover:bg-white/[0.03]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            <p className="text-xs text-white/50">Uploading...</p>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#D4AF37]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-white/50 font-medium">
              {isDragging ? 'Drop video here' : 'Drag & drop video or click to browse'}
            </p>
            <p className="text-[10px] text-white/25 mt-1">MP4, MOV, WebM — Max 500MB</p>
          </>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-emerald-400 font-medium">Uploaded</span>
            </div>
            <span className="text-[10px] text-white/30">{formatSize(preview.size)}</span>
          </div>
          <video
            src={preview.url}
            controls
            className="w-full rounded-lg max-h-48"
          />
          <p className="text-[10px] text-white/30 truncate">{preview.name}</p>
        </div>
      )}
    </div>
  );
}
