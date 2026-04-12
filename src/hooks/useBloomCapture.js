/**
 * useBloomCapture
 *
 * Handles two actions on the BloomDelivery page:
 *
 * share()    — Uses the native Web Share API on mobile (shows iOS/Android
 *              share sheet). Falls back to clipboard copy on desktop.
 *
 * download() — Captures the live video element frame-by-frame onto a
 *              Canvas, burns in the Digital Bloom™ watermark on every
 *              frame, and uses MediaRecorder to produce a downloadable
 *              .webm video. The watermark is pixel-level — it cannot
 *              be removed by the recipient.
 */

import { useState, useCallback, useRef } from 'react';

// Pick the best supported container format at load time.
const SUPPORTED_MIME = (() => {
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? null;
})();

export function useBloomCapture({ delivery, compositionRef }) {
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);   // 0–100
  const [copied, setCopied] = useState(false);
  const stopRef = useRef(false);

  // ── SHARE ──────────────────────────────────────────────────────────────
  const share = useCallback(async () => {
    const url = window.location.href;
    const from = delivery?.message?.fromName;
    const to = delivery?.message?.toName;
    const text = from && to
      ? `${from} sent you a Digital Bloom 🌸`
      : 'Someone sent you a Digital Bloom 🌸';

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Digital Bloom', text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User dismissed share sheet — silently ignore
    }
  }, [delivery]);

  // ── DOWNLOAD ───────────────────────────────────────────────────────────
  const download = useCallback(async () => {
    if (capturing || !SUPPORTED_MIME) return;

    const container = compositionRef?.current;
    if (!container) return;

    const videoEl = container.querySelector('video');
    if (!videoEl || !videoEl.src) {
      alert('The bloom video isn\'t ready yet — please wait a moment and try again.');
      return;
    }

    // Make sure we have dimensions
    if (!videoEl.videoWidth) {
      alert('Video is still loading — try again in a second.');
      return;
    }

    setCapturing(true);
    setProgress(0);
    stopRef.current = false;

    // ── Canvas ──
    const W = videoEl.videoWidth;
    const H = videoEl.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // ── MediaRecorder ──
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: SUPPORTED_MIME });
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    // Reset video to start, remove loop so it ends naturally
    const hadLoop = videoEl.loop;
    videoEl.loop = false;
    videoEl.currentTime = 0;
    await videoEl.play().catch(() => {});

    const duration = (isFinite(videoEl.duration) ? videoEl.duration : 30) * 1000;
    const startTime = Date.now();
    recorder.start(200);

    // ── Draw loop ──
    const drawFrame = () => {
      if (stopRef.current) {
        recorder.stop();
        return;
      }

      // 1. Video frame
      ctx.drawImage(videoEl, 0, 0, W, H);

      // 2. "Digital Bloom™" — gold italic, bottom-left
      const mainSize = Math.max(20, Math.round(W * 0.044));
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 12;
      ctx.font = `italic ${mainSize}px 'Cormorant Garamond', Georgia, serif`;
      ctx.fillStyle = 'rgba(212,175,55,0.9)';
      ctx.fillText('Digital Bloom™', 18, H - mainSize - 14);

      // 3. "digitalbloom.store" — small white, very bottom-left
      const urlSize = Math.max(11, Math.round(W * 0.021));
      ctx.font = `${urlSize}px 'Outfit', Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.48)';
      ctx.fillText('digitalbloom.store', 18, H - 9);
      ctx.restore();

      const elapsed = Date.now() - startTime;
      setProgress(Math.min(97, (elapsed / duration) * 100));

      if (!videoEl.ended && !videoEl.paused && elapsed < duration + 500) {
        requestAnimationFrame(drawFrame);
      } else {
        stopRef.current = true;
        recorder.stop();
      }
    };

    requestAnimationFrame(drawFrame);

    // ── When recording stops, trigger download ──
    recorder.onstop = () => {
      videoEl.loop = hadLoop; // restore loop
      const ext = SUPPORTED_MIME.includes('mp4') ? 'mp4' : 'webm';
      const name = delivery?.productName?.toLowerCase().replace(/\s+/g, '-') || 'bloom';
      const blob = new Blob(chunks, { type: SUPPORTED_MIME });
      const blobUrl = URL.createObjectURL(blob);
      const anchor = Object.assign(document.createElement('a'), {
        href: blobUrl,
        download: `digital-bloom-${name}.${ext}`,
      });
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 8000);
      setCapturing(false);
      setProgress(0);
    };
  }, [capturing, delivery, compositionRef]);

  // ── CANCEL ─────────────────────────────────────────────────────────────
  const cancelDownload = useCallback(() => {
    stopRef.current = true;
    setCapturing(false);
    setProgress(0);
  }, []);

  // ── CAPABILITIES ───────────────────────────────────────────────────────
  // Safari on iOS doesn't support MediaRecorder for video — show share only
  const canDownload = Boolean(SUPPORTED_MIME);

  return { share, download, cancelDownload, capturing, progress, copied, canDownload };
}
