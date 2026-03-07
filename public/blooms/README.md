# /public/blooms — Digital Bloom Asset Structure

This directory holds all bloom visual assets, organized by usage context.

## Structure

```
public/blooms/
├── hero/          # Full-screen hero blooms (landing page, campaigns)
├── featured/      # Featured/spotlight bloom images (previews, cards)
├── posters/       # Video poster frames (used as fallback thumbnails)
└── shop/          # Shop-facing bloom thumbnails
```

## Naming Convention

```
{category}_{style}_{variant}.{ext}
```

Examples:
- `birthday_classic-rose_v1.jpg`
- `love_golden-roses_poster.jpg`
- `sympathy_lotus_hero.mp4`

## Notes
- Video assets remain in `/public/videos/shop/` — existing paths preserved for compatibility
- This `/blooms/` folder is for static image assets
- Poster images (.jpg) should be 16:9 or 4:5 aspect ratio at 1200px min width
