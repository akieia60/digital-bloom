
import os
import shutil
import hashlib

SOURCE_DIR = "/Users/akieiamoniquedavis/Desktop/digital bloom flower-shop projet"
DEST_DIR = "/Users/akieiamoniquedavis/Desktop/flower-shop/public/videos"

if not os.path.exists(DEST_DIR):
    os.makedirs(DEST_DIR)

video_files = []
for root, dirs, files in os.walk(SOURCE_DIR):
    for file in files:
        if file.lower().endswith(('.mp4', '.mov', '.webm')):
            video_files.append(os.path.join(root, file))

print(f"Found {len(video_files)} videos in source.")

for src_path in video_files:
    filename = os.path.basename(src_path)
    dest_path = os.path.join(DEST_DIR, filename)
    
    if os.path.exists(dest_path):
        # Name collision, append hash of path
        name, ext = os.path.splitext(filename)
        h = hashlib.md5(src_path.encode()).hexdigest()[:6]
        filename = f"{name}_{h}{ext}"
        dest_path = os.path.join(DEST_DIR, filename)
    
    shutil.copy2(src_path, dest_path)
    print(f"Copied: {filename}")

print(f"Sync complete. Total files in dest: {len(os.listdir(DEST_DIR))}")
