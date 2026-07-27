/**
 * Shared occasion metadata for Digital Bloom.
 * Used by CategoryPage, CategoryGrid, Shop, and Customizer.
 *
 * Each occasion maps a category slug (matching Supabase `products.category`)
 * to its display name, emotional tagline, accent color, emoji icon,
 * slogan presets (for the customizer message step), and customizer defaults.
 */

const OCCASIONS = {
  'mothers-day': {
    name: "Mother's Day",
    title: "Mother's Day Blooms",
    tagline: 'Celebrate the woman who made everything bloom.',
    salesPitch: "Just in time to send your mother, grandmother, or any special woman in your life a beautiful Mother's Day bloom. Whether she's near or far, show her how much she means to you with a stunning digital experience that captures your love and appreciation.",
    accent: '#FF4DA6',
    emoji: '💐',
    sloganPresets: [
      "Happy Mother's Day — you made everything bloom.",
      "Thank you for every sacrifice, every hug, every everything.",
      "The world is better because you're in it.",
      "You are my first love and my greatest teacher.",
      "No words are enough — so I'm sending you flowers.",
      "Raising me was a gift you gave the world. Thank you, Mom.",
    ],
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: "Happy Mother's Day",
      messagePlaceholder: "e.g., Happy Mother's Day, Mom!",
      toPlaceholder: 'Mom, Grandma, Auntie...',
    },
  },

  'birthday': {
    name: 'Birthday',
    title: 'Birthday Blooms',
    tagline: 'Make their special day absolutely unforgettable.',
    salesPitch: "Just in time to send your sister, brother, cousin, boyfriend, girlfriend, or loved one a birthday bloom that will make their day absolutely special. Create memories that last forever with a personalized digital experience that shows how much you care about their celebration.",
    accent: '#FFD23F',
    emoji: '🎂',
    sloganPresets: [
      'Happy Birthday — you deserve to be celebrated all day.',
      'Another year of being amazing. Keep shining.',
      'Wishing you everything your heart desires today.',
      "It's your day — bloom like you always do.",
      'Grateful for the day you came into the world.',
      'May this year be your most beautiful one yet.',
    ],
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'warm',
      balloonMessage: 'Happy Birthday',
      messagePlaceholder: 'e.g., Happy Birthday!',
      toPlaceholder: "Birthday star's name",
    },
  },

  'love': {
    name: 'Love',
    title: 'Love & Romance',
    tagline: 'Express your deepest feelings without saying a word.',
    accent: '#FF3B7F',
    emoji: '❤️',
    sloganPresets: [
      'You are the reason I believe in love.',
      'Every day with you is my favorite.',
      "I love you — more than words, more than flowers, more than anything.",
      'Loving you is the easiest thing I have ever done.',
      'You are my home.',
      'Here are your flowers — given while you are here.',
    ],
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: 'I Love You',
      messagePlaceholder: 'e.g., You mean everything to me',
      toPlaceholder: "Your love's name",
    },
  },

  'anniversary': {
    name: 'Anniversary',
    title: 'Anniversary Blooms',
    tagline: 'Celebrating every year you chose each other.',
    accent: '#C0392B',
    emoji: '💍',
    sloganPresets: [
      "Here's to every year we've grown together.",
      'I would choose you again and again.',
      'Thank you for being my person — every single day.',
      'Every anniversary is proof that love can last.',
      "We built something beautiful. Happy Anniversary.",
      'Still my favorite adventure.',
    ],
    customizerDefaults: {
      colorTheme: 'romantic',
      balloonMessage: 'Happy Anniversary',
      messagePlaceholder: 'e.g., Happy Anniversary, my love',
      toPlaceholder: "Partner's name",
    },
  },

  'valentine': {
    name: "Valentine's Day",
    title: "Valentine's Day Blooms",
    tagline: 'For the one who has your heart — now and always.',
    accent: '#FF6B6B',
    emoji: '💕',
    sloganPresets: [
      'Be my Valentine — now and always.',
      'My heart blooms every time I think of you.',
      "You're my favorite reason to smile.",
      'Roses are red, but nothing compares to you.',
      'Falling for you was the best thing I ever did.',
      "Happy Valentine's Day to the love of my life.",
    ],
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'romantic',
      balloonMessage: 'I Love You',
      messagePlaceholder: 'e.g., Be my Valentine',
      toPlaceholder: "Your Valentine's name",
    },
  },

  'celebration': {
    name: 'Congratulations',
    title: 'Congratulations Blooms',
    tagline: 'Celebrate their achievements in style.',
    accent: '#B45FFF',
    emoji: '🎉',
    sloganPresets: [
      "You did it — we always knew you would.",
      "Congratulations! Your hard work finally bloomed.",
      "This is just the beginning of everything great.",
      "So incredibly proud of you.",
      "You earned this moment — celebrate it fully.",
      "The world better watch out — you are unstoppable.",
    ],
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'elegant',
      balloonMessage: 'Congratulations',
      messagePlaceholder: 'e.g., So proud of you!',
      toPlaceholder: "The achiever's name",
    },
  },

  'encouragement': {
    name: 'Encouragement',
    title: 'Encouragement Blooms',
    tagline: 'Send strength when they need it most.',
    accent: '#F39C12',
    emoji: '💪',
    sloganPresets: [
      "You are stronger than you think — keep going.",
      "This is just a chapter, not the whole story.",
      "I believe in you more than you know.",
      "Hard days make strong people. You've got this.",
      "The light at the end is closer than it feels.",
      "Sending you strength, love, and these flowers.",
    ],
    customizerDefaults: {
      colorTheme: 'warm',
      messagePlaceholder: "e.g., Keep going, you've got this",
      toPlaceholder: "Their name",
    },
  },

  'thank-you': {
    name: 'Thank You',
    title: 'Thank You Blooms',
    tagline: 'Gratitude in full bloom.',
    accent: '#27AE60',
    emoji: '🙏',
    sloganPresets: [
      "Thank you — from the bottom of my heart.",
      "What you did meant more than you know.",
      "Grateful for you every single day.",
      "You showed up when it mattered. Thank you.",
      "I couldn't have done it without you.",
      "Your kindness deserves flowers. Here they are.",
    ],
    customizerDefaults: {
      colorTheme: 'warm',
      balloonMessage: 'Thank You',
      messagePlaceholder: "e.g., Thank you so much!",
      toPlaceholder: "Their name",
    },
  },

  'grief': {
    name: 'Memorial',
    title: 'Memorial & Sympathy',
    tagline: 'Honor those we hold dear — their light never fades.',
    salesPitch: "Just in time to send friends, family, and loved ones your heartfelt condolences via social media. Whether you can't be there in person or you are there and want to offer another gesture of support and appreciation, a memorial bloom can always be used for someone who has lost a loved one.",
    accent: '#7B9FFF',
    emoji: '🕊️',
    sloganPresets: [
      "There are no words — only love and flowers.",
      "Thinking of you and holding you close in spirit.",
      "Their memory will always be a blessing.",
      "May you feel surrounded by love during this time.",
      "Gone from our sight, never from our hearts.",
      "Sending peace, comfort, and these flowers to you.",
    ],
    customizerDefaults: {
      occasion: 'sympathy',
      colorTheme: 'cool',
      messagePlaceholder: 'e.g., Thinking of you during this time',
      toPlaceholder: 'Their name',
    },
  },

  'friendship': {
    name: 'Thinking of You',
    title: 'Thinking of You',
    tagline: 'Let them know they matter — today and every day.',
    accent: '#FF8C42',
    emoji: '💛',
    sloganPresets: [
      "Just wanted you to know I was thinking of you.",
      "You cross my mind more than you know.",
      "Sending love from right here.",
      "You matter — and I wanted to remind you.",
      "You are my person and I cherish you.",
      "No special occasion needed — you always deserve flowers.",
    ],
    customizerDefaults: {
      occasion: 'encouragement',
      colorTheme: 'warm',
      balloonMessage: "You're the Best",
      messagePlaceholder: 'e.g., Just wanted you to know I care',
      toPlaceholder: "Friend's name",
    },
  },

  'gratitude': {
    name: 'Gratitude',
    title: 'Gratitude Blooms',
    tagline: 'For those who show up, lift up, and light the way.',
    accent: '#16A085',
    emoji: '✨',
    sloganPresets: [
      "I am so grateful to have you in my life.",
      "Thank you for being exactly who you are.",
      "You make everything better just by being here.",
      "Gratitude is not enough — but these flowers come close.",
      "The world is brighter because of you.",
      "You are a gift I don't take for granted.",
    ],
    customizerDefaults: {
      colorTheme: 'warm',
      messagePlaceholder: "e.g., I'm so grateful for you",
      toPlaceholder: "Their name",
    },
  },

  'fathers-day': {
    name: "Father's Day",
    title: "Father's Day Blooms",
    tagline: 'The strongest roots grow the tallest flowers.',
    accent: '#2980B9',
    emoji: '👑',
    sloganPresets: [
      "Happy Father's Day to my favorite person.",
      "You showed me what strength looks like. Thank you, Dad.",
      "Everything good in me came from watching you.",
      "The world needs more dads like you.",
      "Thank you for always showing up — in every way.",
      "My hero, my father, my safe place.",
    ],
    customizerDefaults: {
      colorTheme: 'cool',
      balloonMessage: "Happy Father's Day",
      messagePlaceholder: "e.g., Happy Father's Day, Dad!",
      toPlaceholder: "Dad, Grandpa, Uncle...",
    },
  },

  'baby': {
    name: 'New Baby',
    title: 'New Baby Blooms',
    tagline: 'Welcome the newest bloom in the family.',
    accent: '#F8C8D4',
    emoji: '🍼',
    sloganPresets: [
      "Welcome to the world, little one.",
      "The smallest hands hold the biggest hearts.",
      "A new bloom has arrived — and the world is better for it.",
      "Congratulations on your beautiful new baby.",
      "She arrived and everything changed — beautifully.",
      "He's here! And he's already everything.",
    ],
    customizerDefaults: {
      colorTheme: 'warm',
      messagePlaceholder: "e.g., Welcome, beautiful baby!",
      toPlaceholder: "The new parents' names",
    },
  },

  'milestones': {
    name: 'Milestones',
    title: 'Milestone Blooms',
    tagline: 'Every finish line deserves flowers.',
    accent: '#8E44AD',
    emoji: '🏆',
    sloganPresets: [
      "Look how far you've come. This is your moment.",
      "You set the goal, you put in the work, you made it.",
      "Milestones like this deserve to be celebrated fully.",
      "Every step that got you here was worth it.",
      "This is just the beginning of what you'll accomplish.",
      "So proud to witness your journey.",
    ],
    customizerDefaults: {
      colorTheme: 'elegant',
      messagePlaceholder: "e.g., Congratulations on reaching this milestone!",
      toPlaceholder: "Their name",
    },
  },

  'promotions': {
    name: 'Promotion',
    title: 'Promotion Blooms',
    tagline: 'Rise. Shine. You earned every bit of this.',
    accent: '#D4AF37',
    emoji: '🚀',
    sloganPresets: [
      "You earned this. Now go show them what you're made of.",
      "Promoted — because greatness doesn't go unnoticed.",
      "This new title fits you perfectly. Congratulations.",
      "The only way is up from here.",
      "All the hard work finally bloomed into this moment.",
      "Watching you level up has been an honor.",
    ],
    customizerDefaults: {
      colorTheme: 'elegant',
      balloonMessage: 'Congratulations',
      messagePlaceholder: "e.g., Congratulations on your promotion!",
      toPlaceholder: "Their name",
    },
  },

  'graduation': {
    name: 'Graduation',
    title: 'Graduation Blooms',
    tagline: 'Cap tossed. Future ready. Flowers deserved.',
    accent: '#E67E22',
    emoji: '🎓',
    sloganPresets: [
      "Congratulations, Graduate — the world is yours.",
      "Years of hard work bloomed into this moment.",
      "You walked across that stage and everything changed.",
      "This diploma is proof of what you're capable of.",
      "We always believed you'd get here. Congratulations.",
      "The tassel was worth the hassle. You did it!",
    ],
    customizerDefaults: {
      colorTheme: 'warm',
      balloonMessage: 'Congratulations',
      messagePlaceholder: "e.g., Congratulations, Graduate!",
      toPlaceholder: "Graduate's name",
    },
  },

  'holidays': {
    name: 'Holidays',
    title: 'Holiday Blooms',
    tagline: "Season's greetings in full bloom.",
    accent: '#C0392B',
    emoji: '🎄',
    sloganPresets: [
      "Wishing you peace, joy, and a beautiful season.",
      "May your holidays be as warm as you make ours.",
      "Grateful for you — every day, but especially today.",
      "Happy Holidays from my heart to yours.",
      "Sending love and light this holiday season.",
      "This season and always — you are cherished.",
    ],
    customizerDefaults: {
      colorTheme: 'cool',
      messagePlaceholder: "e.g., Happy Holidays!",
      toPlaceholder: "Their name",
    },
  },

  'luxury': {
    name: 'Luxury',
    title: 'Glass Stiletto Series',
    tagline: 'Where fashion meets floral artistry.',
    accent: '#D4AF37',
    emoji: '💎',
    sloganPresets: [
      "You deserve the finest — always.",
      "Luxury was made for someone like you.",
      "To the woman who commands every room she enters.",
      "Excellence recognizes excellence.",
      "You are the definition of elegance.",
      "Nothing less than extraordinary — just like you.",
    ],
    customizerDefaults: {
      occasion: 'celebration',
      colorTheme: 'elegant',
      messagePlaceholder: 'e.g., You deserve the finest',
      toPlaceholder: 'Recipient name',
    },
  },

  'zodiac': {
    name: 'Zodiac',
    title: 'Zodiac Collection',
    tagline: 'Written in the stars — a bloom for your sign.',
    accent: '#9B59B6',
    emoji: '✨',
    sloganPresets: [
      "The stars aligned just for you.",
      "Your sign was written in flowers.",
      "Cosmic energy, celestial blooms.",
      "Born under the right stars for greatness.",
      "Your story is written in the stars — and in these blooms.",
      "The universe had you in mind when it made this.",
    ],
    customizerDefaults: {
      colorTheme: 'cool',
      messagePlaceholder: 'e.g., The stars aligned for you',
      toPlaceholder: 'Recipient name',
    },
  },

  'signature-stories': {
    name: 'Signature Stories',
    title: 'Signature Stories',
    tagline: 'Premium blooms crafted for the moments that matter most.',
    salesPitch: "Signature Stories are Digital Bloom's most intentional creations — handcrafted motion experiences designed to speak directly to the heart. Each one tells a story that words alone could never capture.",
    accent: '#D4AF37',
    emoji: '📖',
    sloganPresets: [
      "Some moments deserve more than words — here are your flowers.",
      "This one was made with you in mind.",
      "A story told in bloom, just for you.",
      "Not just a gift — an experience.",
      "Crafted with intention. Sent with love.",
      "You deserve something that truly says everything.",
    ],
    customizerDefaults: {
      occasion: 'love',
      colorTheme: 'elegant',
      balloonMessage: 'With Love',
      messagePlaceholder: 'e.g., This one is just for you',
      toPlaceholder: 'Recipient name',
    },
  },

  'general': {
    name: 'General',
    title: 'General Collection',
    tagline: 'Beautiful blooms for every moment.',
    accent: '#6E6E73',
    emoji: '🌸',
    sloganPresets: [
      "Because you deserve flowers — just because.",
      "No reason needed. You matter.",
      "Sending love your way.",
      "A little something beautiful, just for you.",
      "Every day is worth celebrating when you're in it.",
      "Here are your flowers. You've earned them.",
    ],
    customizerDefaults: {
      messagePlaceholder: 'e.g., Thinking of you!',
      toPlaceholder: 'Recipient name',
    },
  },
};

export default OCCASIONS;
