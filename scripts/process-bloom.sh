#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Digital Bloom — Watermark Burn-In Script
# Burns permanent watermarks into bloom videos using FFmpeg
# 
# Usage: ./process-bloom.sh <input_video> <recipient_name> [output_path]
#
# Watermark layers:
#   1. "TM" — bottom-left corner
#   2. "Digital Bloom™" — bottom-right corner
#   3. Diagonal repeating "Digital Bloom" pattern — covers entire frame
#   4. "For [Recipient Name]" — center-bottom
# ══════════════════════════════════════════════════════════════

set -euo pipefail

# ── Args ──
INPUT_VIDEO="${1:?Usage: process-bloom.sh <input_video> <recipient_name> [output_path]}"
RECIPIENT_NAME="${2:?Please provide a recipient name}"
OUTPUT_PATH="${3:-}"

# If no output path given, generate one
if [ -z "$OUTPUT_PATH" ]; then
  BASENAME=$(basename "$INPUT_VIDEO" | sed 's/\.[^.]*$//')
  OUTPUT_DIR="$(dirname "$INPUT_VIDEO")/watermarked"
  mkdir -p "$OUTPUT_DIR"
  OUTPUT_PATH="$OUTPUT_DIR/${BASENAME}_protected.mp4"
fi

# Ensure output dir exists
mkdir -p "$(dirname "$OUTPUT_PATH")"

echo "🎬 Processing bloom video..."
echo "   Input:     $INPUT_VIDEO"
echo "   Recipient: $RECIPIENT_NAME"
echo "   Output:    $OUTPUT_PATH"

# ── FFmpeg filter chain ──
# All 4 watermark layers are composited in a single filter_complex pass.
#
# Layer 1: "TM" in bottom-left (small, semi-transparent)
# Layer 2: "Digital Bloom™" in bottom-right
# Layer 3: Diagonal repeating "Digital Bloom" text across entire frame
# Layer 4: "For [Recipient Name]" center-bottom

FONTFILE="/System/Library/Fonts/Helvetica.ttc"

# Build the diagonal watermark text (repeated 8 times to cover the frame)
DIAG_TEXT="Digital Bloom    Digital Bloom    Digital Bloom    Digital Bloom    Digital Bloom"

ffmpeg -y -i "$INPUT_VIDEO" \
  -filter_complex "
    [0:v]
    drawtext=text='TM':
      fontfile=$FONTFILE:
      fontsize=14:
      fontcolor=white@0.4:
      x=20:
      y=h-30:
      shadowcolor=black@0.3:
      shadowx=1:
      shadowy=1,

    drawtext=text='Digital Bloom™':
      fontfile=$FONTFILE:
      fontsize=14:
      fontcolor=white@0.4:
      x=w-tw-20:
      y=h-30:
      shadowcolor=black@0.3:
      shadowx=1:
      shadowy=1,

    drawtext=text='${DIAG_TEXT}':
      fontfile=$FONTFILE:
      fontsize=18:
      fontcolor=white@0.12:
      x='(w-tw)/2':
      y='(h-th)/2 - 120':
      shadowcolor=black@0.05:
      shadowx=0:
      shadowy=0,

    drawtext=text='${DIAG_TEXT}':
      fontfile=$FONTFILE:
      fontsize=18:
      fontcolor=white@0.12:
      x='(w-tw)/2 + 60':
      y='(h-th)/2 - 40':
      shadowcolor=black@0.05:
      shadowx=0:
      shadowy=0,

    drawtext=text='${DIAG_TEXT}':
      fontfile=$FONTFILE:
      fontsize=18:
      fontcolor=white@0.12:
      x='(w-tw)/2 - 60':
      y='(h-th)/2 + 40':
      shadowcolor=black@0.05:
      shadowx=0:
      shadowy=0,

    drawtext=text='${DIAG_TEXT}':
      fontfile=$FONTFILE:
      fontsize=18:
      fontcolor=white@0.12:
      x='(w-tw)/2':
      y='(h-th)/2 + 120':
      shadowcolor=black@0.05:
      shadowx=0:
      shadowy=0,

    drawtext=text='For ${RECIPIENT_NAME}':
      fontfile=$FONTFILE:
      fontsize=22:
      fontcolor=white@0.6:
      x='(w-tw)/2':
      y=h-60:
      shadowcolor=black@0.5:
      shadowx=2:
      shadowy=2
    [out]
  " \
  -map "[out]" -map 0:a? \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$OUTPUT_PATH" 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Watermarked video saved to: $OUTPUT_PATH"
  echo "   File size: $(du -h "$OUTPUT_PATH" | cut -f1)"
else
  echo "❌ Error processing video"
  exit 1
fi
