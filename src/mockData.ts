import { CoViber } from "./types";

export const MOCK_CO_VIBERS: CoViber[] = [
  {
    id: "viber-1",
    instagramHandle: "flora.femme",
    fullName: "Flora Dupont",
    bio: "collecting monsteras, film photography, green matcha floats under glass canopies. SF.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    aesthetic: "Sage Green",
    favoriteSpotId: "spot-1", // The Conservatory Room
    joinedRecently: true,
    linkedinUrl: "https://linkedin.com/in/flora-dupont-sf"
  },
  {
    id: "viber-2",
    instagramHandle: "lucas.retro",
    fullName: "Lucas Vance",
    bio: "Vinyl record hoarder, mid-century furniture, warm analog synthesizers & low golden light.",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    aesthetic: "Warm Sepia",
    favoriteSpotId: "spot-2", // Veridian & Vinyl
    joinedRecently: false,
    linkedinUrl: "https://linkedin.com/in/lucas-vance-design"
  },
  {
    id: "viber-3",
    instagramHandle: "jacob_creates",
    fullName: "Jacob Chen",
    bio: "Architectural draftsman • raw shuttered concrete • bitter pour-overs on slab counters.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    aesthetic: "Brutalist Mono",
    favoriteSpotId: "spot-3", // Mono Studio & Bakery
    joinedRecently: true,
    linkedinUrl: "https://linkedin.com/in/jacob-chen-arch"
  },
  {
    id: "viber-4",
    instagramHandle: "alicia.reads",
    fullName: "Alicia Patel",
    bio: "vintage leather journals, damp book scent, espresso & dark academia vibes in Nob Hill.",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    aesthetic: "Cozy Bibliophile",
    favoriteSpotId: "spot-4", // The Archival Library
    joinedRecently: false,
    linkedinUrl: "https://linkedin.com/in/alicia-patel-reads"
  },
  {
    id: "viber-5",
    instagramHandle: "kai_synthetic",
    fullName: "Kai Tanaka",
    bio: "subterranean cyber developer • dark synthwave • cold brew & monochrome lines.",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
    aesthetic: "Dystopian Cyber",
    favoriteSpotId: "spot-6", // Underground Zero
    joinedRecently: true,
    linkedinUrl: "https://linkedin.com/in/kai-tanaka-tech"
  }
];

// Aesthetic Instax-style grid presets for connected user profiles
export const AESTHETIC_GRID_PRESETS: Record<string, string[]> = {
  "Sage Green": [
    "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1510251173260-298906ee6d9c?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1502441779-37244584997e?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1581478204284-5f5cbb66a87c?auto=format&fit=crop&q=80&w=500"
  ],
  "Warm Sepia": [
    "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=500"
  ],
  "Brutalist Mono": [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500"
  ],
  "Cozy Bibliophile": [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1550399105-c4dbb677a11b?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=500"
  ],
  "Dystopian Cyber": [
    "https://images.unsplash.com/photo-1555543966-6d6986181090?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=500"
  ]
};

export const INSTAGRAM_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250"
];
