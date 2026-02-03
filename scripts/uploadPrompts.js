import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Your complete prompt library from flower-animation-prompts.md
const promptsToUpload = [
  // ========== STYLING PROMPTS ==========
  {
    prompt_name: "Diamond Crusted Roses",
    prompt_category: "styling",
    full_prompt: "Create photorealistic red roses with diamond-encrusted edges on each petal, sparkling under studio lighting, white background, 3D render, ultra-high detail",
    quick_description: "Luxury roses with diamond-encrusted petal edges",
    recommended_price: 12.99,
    styling_features: { trim: "diamond", embellishments: "diamond-crust", color: "red" },
    tags: ["luxury", "diamond", "premium", "sparkle", "viral"]
  },
  {
    prompt_name: "Gold Trimmed Roses",
    prompt_category: "styling",
    full_prompt: "Luxury red roses with elegant gold metallic trim outlining each rose, premium look, soft lighting, white background, 3D animation",
    quick_description: "Elegant roses with gold metallic trim",
    recommended_price: 12.99,
    styling_features: { trim: "gold", metallic: true, color: "red" },
    tags: ["luxury", "gold", "premium", "elegant"]
  },
  {
    prompt_name: "White Trimmed Roses",
    prompt_category: "styling",
    full_prompt: "Deep red roses with clean white trim on outer edges, modern elegant style, floating rose petals, white background",
    quick_description: "Modern roses with white trim accents",
    recommended_price: 9.99,
    styling_features: { trim: "white", style: "modern", color: "red" },
    tags: ["modern", "elegant", "clean", "minimalist"]
  },
  {
    prompt_name: "Blue Petal Trim",
    prompt_category: "styling",
    full_prompt: "Red roses with electric blue glowing edges on petals, modern artistic style, dramatic lighting",
    quick_description: "Artistic roses with blue glowing edges",
    recommended_price: 11.99,
    styling_features: { trim: "blue", glow: true, artistic: true, color: "red" },
    tags: ["modern", "artistic", "glow", "blue", "unique"]
  },
  {
    prompt_name: "Orange Edge Roses",
    prompt_category: "styling",
    full_prompt: "Gradient roses transitioning from red center to bright orange edges, vibrant petals with orange highlights, warm lighting",
    quick_description: "Vibrant gradient roses with orange edges",
    recommended_price: 10.99,
    styling_features: { gradient: "red-to-orange", vibrant: true, warm: true },
    tags: ["vibrant", "gradient", "warm", "energetic"]
  },
  {
    prompt_name: "Gold Petal Roses",
    prompt_category: "styling",
    full_prompt: "Roses with solid gold metallic petals, reflective surface, luxury jewelry aesthetic, rotating on pedestal",
    quick_description: "Full gold metallic petals (ultra luxury)",
    recommended_price: 14.99,
    styling_features: { petals: "full-gold", metallic: true, reflective: true, luxury: "ultra" },
    tags: ["luxury", "gold", "metallic", "premium", "jewelry"]
  },
  {
    prompt_name: "Silver Petal Roses",
    prompt_category: "styling",
    full_prompt: "Pure silver metallic roses, mirror-like reflective petals, elegant and modern, soft lighting",
    quick_description: "Modern silver metallic roses",
    recommended_price: 14.99,
    styling_features: { petals: "full-silver", metallic: true, reflective: true, modern: true },
    tags: ["modern", "silver", "luxury", "reflective", "elegant"]
  },
  {
    prompt_name: "Gold Stem Roses",
    prompt_category: "styling",
    full_prompt: "Red roses with shining gold metallic stems, luxury feel, stems catching light, elegant arrangement",
    quick_description: "Roses with gold metallic stems",
    recommended_price: 11.99,
    styling_features: { stem: "gold-metallic", petals: "red", luxury: true },
    tags: ["luxury", "gold", "elegant", "stems"]
  },
  {
    prompt_name: "Silver Stem Roses",
    prompt_category: "styling",
    full_prompt: "Deep red roses with polished silver stems, modern luxury aesthetic, clean white background",
    quick_description: "Roses with silver metallic stems",
    recommended_price: 11.99,
    styling_features: { stem: "silver-metallic", petals: "red", modern: true },
    tags: ["modern", "silver", "luxury", "clean"]
  },

  // ========== ANIMATION PROMPTS ==========
  {
    prompt_name: "Heart-Shaped Pulse",
    prompt_category: "animation",
    full_prompt: "24 red roses arranged in perfect heart shape, center roses pulsating with realistic heartbeat rhythm, soft glow emanating from center, romantic lighting, loop animation",
    quick_description: "Heart arrangement with pulsating heartbeat effect",
    recommended_price: 14.99,
    animation_type: "heartbeat-pulse",
    technical_specs: {
      duration: "8-10 seconds",
      looping: true,
      arrangement: "heart-shape",
      rose_count: 24
    },
    song_suggestions: ["Heart Attack - Demi Lovato", "Lover - Taylor Swift", "My Heart Will Go On - Celine Dion"],
    tags: ["romantic", "heartbeat", "viral", "tiktok", "valentine"]
  },
  {
    prompt_name: "Wave Pop-Up Effect",
    prompt_category: "animation",
    full_prompt: "48 roses in square formation, each rose pops up one at a time from left to right creating wave effect, sequential timing, smooth motion, 5-second loop",
    quick_description: "Sequential wave effect with roses popping up",
    recommended_price: 12.99,
    animation_type: "wave-effect",
    technical_specs: {
      duration: "5-8 seconds",
      looping: true,
      arrangement: "square-grid",
      rose_count: 48,
      sequence: "left-to-right"
    },
    song_suggestions: ["Levitating - Dua Lipa", "Blinding Lights - The Weeknd"],
    tags: ["dynamic", "wave", "viral", "satisfying", "mesmerizing"]
  },
  {
    prompt_name: "Circular Heartbeat Pulse",
    prompt_category: "animation",
    full_prompt: "Roses arranged in circle, pulsating wave starts from center rose and ripples outward to edge simultaneously in all directions, heartbeat rhythm, glowing effect",
    quick_description: "Circular pulse wave radiating from center",
    recommended_price: 13.99,
    animation_type: "circular-pulse",
    technical_specs: {
      duration: "8-10 seconds",
      looping: true,
      arrangement: "circle",
      pulse_direction: "center-outward"
    },
    song_suggestions: ["Circles - Post Malone", "The Middle - Zedd"],
    tags: ["hypnotic", "pulse", "circular", "rhythmic", "viral"]
  },
  {
    prompt_name: "Sound Reactive Roses",
    prompt_category: "animation",
    full_prompt: "Group of roses responding to bass-heavy music, roses sway and pulse with each beat, stems move rhythmically, particles react to sound frequencies, dynamic camera",
    quick_description: "Roses that pulse and sway with music beats",
    recommended_price: 16.99,
    animation_type: "music-reactive",
    technical_specs: {
      duration: "10-15 seconds",
      looping: false,
      musicSync: true,
      dynamic: true
    },
    song_suggestions: ["Any bass-heavy song", "Starboy - The Weeknd", "industry baby - Lil Nas X"],
    tags: ["music", "reactive", "dynamic", "energetic", "bass", "viral"]
  },
  {
    prompt_name: "Roses Rising from Vase",
    prompt_category: "animation",
    full_prompt: "Long stem roses standing in crystal vase, stems slowly rise and intertwine elegantly, roses at top form heart shape, romantic smooth animation, 10 seconds",
    quick_description: "Elegant stems rising and intertwining into heart",
    recommended_price: 15.99,
    animation_type: "rising-intertwine",
    technical_specs: {
      duration: "10-12 seconds",
      looping: false,
      container: "crystal-vase",
      end_shape: "heart"
    },
    song_suggestions: ["Perfect - Ed Sheeran", "Thinking Out Loud - Ed Sheeran"],
    tags: ["romantic", "elegant", "smooth", "story", "sophisticated"]
  },
  {
    prompt_name: "Love Story Silhouette",
    prompt_category: "animation",
    full_prompt: "Long stem roses form silhouette of athletic muscular man (roses as head, stems as body), running animation toward smaller rose group that grows into silhouette of elegant woman, both silhouettes jump together and merge, transforming into one giant blooming rose opening from center, romantic cinematic sequence, 15-20 seconds",
    quick_description: "Cinematic love story: two silhouettes merge into blooming rose",
    recommended_price: 19.99,
    animation_type: "love-story",
    technical_specs: {
      duration: "15-20 seconds",
      looping: false,
      cinematic: true,
      story_arc: true,
      complexity: "high"
    },
    song_suggestions: [
      "Perfect - Ed Sheeran",
      "All of Me - John Legend",
      "A Thousand Years - Christina Perri",
      "Marry You - Bruno Mars"
    ],
    tags: ["romantic", "story", "cinematic", "viral", "premium", "proposal", "wedding"]
  },

  // ========== MASTER PROMPT ==========
  {
    prompt_name: "Ultimate Luxury Rose Master Prompt",
    prompt_category: "master",
    full_prompt: `Create a cinematic 3D animated luxury rose bouquet video with the following specifications:

VISUAL STYLE:
- Photorealistic roses with customizable trim (diamond/gold/silver/white/blue/orange)
- Customizable rose colors (red, pink, white, black, purple, yellow)
- Petals outlined with luxury trim
- Optional: Gold or silver metallic stems
- Studio lighting with soft shadows
- Clean white or gradient background
- Floating rose petals and sparkle effects
- Pearl or diamond embellishments

ANIMATION STYLE:
Choose: Heartbeat pattern, Wave effect, Circular pulse, Music reactive, Rising from vase, or Love story silhouette

TECHNICAL SPECS:
- 4K resolution (3840 x 2160)
- 24-30 FPS
- 6-20 second duration
- Smooth looping or cinematic sequence
- Motion blur for realism
- Particle effects (sparkles, light rays)

MOOD: Romantic, elegant, luxury brand feel (Venus et Fleur style), Instagram/TikTok viral-ready

OUTPUT: MP4 video file, suitable for social media sharing`,
    quick_description: "Master template for all luxury rose video variations (fully customizable)",
    recommended_price: 29.99,
    animation_type: "custom-combination",
    technical_specs: {
      duration: "customizable (6-20 seconds)",
      resolution: "4K",
      fps: 30,
      aspects: ["16:9", "9:16", "1:1"],
      fully_customizable: true
    },
    styling_features: {
      trim_options: ["diamond", "gold", "silver", "white", "blue", "orange"],
      color_options: ["red", "pink", "white", "black", "purple", "yellow"],
      arrangement_options: ["heart", "grid", "circle", "designer-heel", "vase"],
      stem_options: ["gold", "silver", "natural"]
    },
    tags: ["master", "premium", "custom", "luxury", "all-features", "customizable"]
  }
];

async function uploadPrompts() {
  console.log('🚀 Starting Digital Bloom prompt library upload...\n');
  console.log(`📝 Total prompts to upload: ${promptsToUpload.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const prompt of promptsToUpload) {
    try {
      const { data, error } = await supabase
        .from('prompt_library')
        .insert([prompt])
        .select();

      if (error) {
        console.error(`❌ Error uploading "${prompt.prompt_name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Uploaded: ${prompt.prompt_name} (${prompt.prompt_category})`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception uploading "${prompt.prompt_name}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Prompt library upload complete!');
  console.log(`✅ Success: ${successCount} prompts`);
  console.log(`❌ Failed: ${errorCount} prompts`);
  console.log('='.repeat(50) + '\n');

  console.log('📊 Summary:');
  const styling = promptsToUpload.filter(p => p.prompt_category === 'styling').length;
  const animation = promptsToUpload.filter(p => p.prompt_category === 'animation').length;
  const master = promptsToUpload.filter(p => p.prompt_category === 'master').length;

  console.log(`   • Styling Prompts: ${styling}`);
  console.log(`   • Animation Prompts: ${animation}`);
  console.log(`   • Master Prompts: ${master}`);
  console.log('\n🎬 Next step: Generate videos using these prompts!');
  console.log('💡 Start with "Heart-Shaped Pulse" + "Diamond Crusted" for max viral potential!\n');
}

// Run the upload
uploadPrompts().catch(console.error);
