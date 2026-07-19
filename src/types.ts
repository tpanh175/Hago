export interface Spot {
  id: string;
  name: string;
  category: string;
  vibeTags: string[];
  description: string;
  location: string;
  lighting: string;
  noise: string;
  seating: string;
  instagramHandle: string;
  coVibersCount: number;
  savedCount: number;
  rating: string;
  image: string;
  stories?: string[];
  city: string;
  priceLevel: string;
  priceUsd: number;
  menuHighlights: string[];
  placeLayout: string;
  yelpRating: number;
  googleRating: number;
  instagramActivity: string;
  lat: number;
  lng: number;
  explorerMode?: "local" | "visitor" | "work";
}

export interface UserProfile {
  instagramHandle: string;
  fullName: string;
  bio: string;
  profilePic: string;
  aesthetic?: "Sage Green" | "Warm Sepia" | "Dystopian Cyber" | "Cozy Bibliophile" | "Brutalist Mono" | "Pick Later" | string;
  savedSpots?: string[]; // spot IDs
  linkedinUrl?: string; // Optional LinkedIn for Coffee Chats
}

export interface CoViber {
  id: string;
  instagramHandle: string;
  fullName: string;
  bio: string;
  profilePic: string;
  aesthetic: string;
  favoriteSpotId: string;
  joinedRecently: boolean;
  linkedinUrl?: string; // Optional LinkedIn for Coffee Chats
}

export interface ChatMessage {
  id: string;
  sender: "user" | "them";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  viberId: string;
  messages: ChatMessage[];
}

export interface MatchResponse {
  bestMatchSpotId: string;
  matchScore: string;
  vibeAnalyticReport: string;
  dreamSpot?: Spot;
}
