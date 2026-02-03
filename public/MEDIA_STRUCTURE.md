# Media Files Structure

## Where to Place Your Files

### Videos
Place your luxury flower videos in:
```
public/videos/
```

**Naming Convention:**
- Use descriptive names: `red-rose-bouquet.mp4`, `pink-tulips.mp4`
- Supported formats: MP4, WebM
- Recommended: MP4 (H.264) for best browser compatibility

**Example:**
```
public/videos/red-rose-bouquet.mp4
public/videos/pink-tulip-bunch.mp4
public/videos/white-lily-arrangement.mp4
```

### Product Images
Place your high-resolution product images in:
```
public/images/products/
```

**Naming Convention:**
- Match video names: `red-rose-bouquet.jpg`, `pink-tulips.jpg`
- Supported formats: JPG, PNG, WebP
- Recommended size: 1000x1000px or larger (square aspect ratio)

**Example:**
```
public/images/products/red-rose-bouquet.jpg
public/images/products/pink-tulip-bunch.jpg
public/images/products/white-lily-arrangement.jpg
```

### Thumbnails (Optional)
Place smaller thumbnail images in:
```
public/images/thumbnails/
```

**Naming Convention:**
- Match product names with `-thumb` suffix
- Recommended size: 400x400px
- Used for faster loading in grid views

**Example:**
```
public/images/thumbnails/red-rose-bouquet-thumb.jpg
public/images/thumbnails/pink-tulip-bunch-thumb.jpg
```

## Accessing Files in Database

When adding products to Supabase, use these URL patterns:

**Video URL:**
```
/videos/red-rose-bouquet.mp4
```

**Image URL:**
```
/images/products/red-rose-bouquet.jpg
```

**Thumbnail URL:**
```
/images/thumbnails/red-rose-bouquet-thumb.jpg
```

The application will automatically prepend the correct path when displaying media.
