import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Bookmark,
  Calendar,
  Users,
  Instagram,
  Compass,
  MapPin,
  Clock,
  Send,
  Plus,
  Trash2,
  Share2,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Moon,
  Armchair,
  Check,
  Heart,
  Grid,
  Map,
  X,
  FileText,
  Radio,
  Sliders,
  Sparkle,
  Globe,
  DollarSign,
  Coins,
  Linkedin,
  Star,
  UtensilsCrossed,
  User,
  Copy
} from "lucide-react";

import { Spot, UserProfile, CoViber, ChatSession, MatchResponse } from "./types";
import { MOCK_CO_VIBERS, AESTHETIC_GRID_PRESETS, INSTAGRAM_AVATARS } from "./mockData";
import SpotCard from "./components/SpotCard";
import InteractiveMap from "./components/InteractiveMap";

import { FALLBACK_SPOTS } from "./spotsData";

const CITY_TRENDS: Record<string, Array<{ title: string; query: string; icon: string; desc: string; type: "hype" | "small" | "treat" | "hangout" }>> = {
  "Hanoi": [
    { title: "Sand Volleyball & Matcha Club", query: "West Lake sand volleyball", icon: "🏐", desc: "Vibrant sand volleyball courts paired with chilling hand-whisked Kyoto matcha.", type: "hangout" },
    { title: "Cedar-Glass Pickleball & Special Latte", query: "West Lake sunrise pickleball court", icon: "🏸", desc: "Experience the ultimate timber courts aligned with organic plant milks.", type: "hangout" },
    { title: "Retro Vinyl Tea Room in Hidden Alley", query: "Hanoi vintage vinyl cafe", icon: "🌱", desc: "Secluded rustic corners spinning raw acoustic tracks behind ancient Hanoi arches.", type: "small" },
    { title: "European Glass Atrium Afternoon Tea", query: "Hanoi premium glasshouse tea lounge", icon: "✨", desc: "Splurge on an elegant imperial high-tea experience beneath grand glass domes.", type: "treat" }
  ],
  "Ho Chi Minh City": [
    { title: "Thao Dien Timber Pickleball & Matcha Loft", query: "Thao Dien wooden court pickleball", icon: "🏸", desc: "High-contrast geometric court fitted with warm timber finishes and whisked green tea.", type: "hangout" },
    { title: "Saigon Riverfront Sand Volleyball Arena", query: "Saigon River sand volleyball team", icon: "🏐", desc: "Active sand matches accompanied by refreshing river breeze and cold organic juices.", type: "hangout" },
    { title: "Sunset Acoustic Skylight Rooftop", query: "Saigon acoustic guitar rooftop lounge", icon: "🎵", desc: "Stunning panoramic vistas overlooking Landmark 81 skylines in plush armchairs.", type: "hype" },
    { title: "Brutalist Vinyl Basement Lounge", query: "Saigon raw concrete analog audiophile room", icon: "🖤", desc: "Subterranean brick bunkers playing warm-toned analog soul and legendary records.", type: "small" }
  ],
  "San Francisco": [
    { title: "Dolores Park Volleyball & Boba Hub", query: "Dolores sand volleyball court", icon: "🏐", desc: "Bask in golden West Coast vibes with sand matches and hand-pressed tapiocas.", type: "hangout" },
    { title: "Presidio Court Pickleball & Matcha Loft", query: "Presidio court pickleball", icon: "🏸", desc: "Play with close friends under fog-veiled eucalyptus trees in the historic preserve.", type: "hangout" },
    { title: "Hayes Brutalist Espresso Bars", query: "Hayes Valley artisan espresso", icon: "📐", desc: "Monochrome architectural benches crafted for high productivity and focus.", type: "small" },
    { title: "SOMA Botanical Glass Greenhouse", query: "SOMA botanical greenhouse cafe", icon: "🌿", desc: "Rejuvenate yourself inside gorgeous high-ceiling tropical hanging gardens.", type: "treat" }
  ],
  "Seattle": [
    { title: "Green Lake Volleyball & Fruit Juicery", query: "Green Lake volleyball court", icon: "🏐", desc: "Seaside-style sand courts on the tranquil, misty banks of Green Lake.", type: "hangout" },
    { title: "Pioneer Square Record Lounges", query: "Pioneer square vinyl cafe", icon: "🎧", desc: "Sift through dusty classics while sipping deep wood-fired espressos.", type: "small" },
    { title: "Capitol Hill Hype Specialty Matchas", query: "Capitol Hill aesthetic matcha latte", icon: "🍵", desc: "Enjoy famous salted milk-foam ceremonial matcha lattes in minimalist spaces.", type: "hype" }
  ],
  "Default": [
    { title: "Sand Volleyball Social Courts", query: "Sand volleyball court", icon: "🏐", desc: "Combine physical active play with hydrating cold refreshments.", type: "hangout" },
    { title: "Pickleball & Master Matcha Lounge", query: "Pickleball court social club", icon: "🏸", desc: "Sleek courts paired with custom-crafted matcha drink bars.", type: "hangout" },
    { title: "Cozy Independent Creative Nook", query: "Cozy local independent cafe", icon: "🌱", desc: "Warm micro-roasters emphasizing quiet community and personal care.", type: "small" },
    { title: "Luxury High-Design Culinary Atrium", query: "Luxury high design architecture lounge", icon: "✨", desc: "Sleek interior profiles offering premium custom culinary tea pairings.", type: "treat" }
  ]
};

interface Participant {
  name: string;
  instagramHandle: string;
  avatar: string;
}

interface HangoutPlan {
  id: string;
  title: string;
  spotId: string;
  spotName: string;
  spotImage: string;
  date: string;
  time: string;
  vibeStyle: "vintageCream" | "slateGrey" | "neonObsidian" | "sageMatcha";
  friends: Participant[];
  notes: string;
  votes: { location: number; time: number; vibes: number };
}

const CURRENCY_CONVERSIONS: Record<string, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.78, label: "GBP (£)" },
  JPY: { symbol: "¥", rate: 155.4, label: "JPY (¥)" },
  VND: { symbol: "₫", rate: 25450, label: "VND (₫)" },
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<"discover" | "planner" | "vibematch" | "covibers" | "you">("discover");

  // App catalog lists
  const [spots, setSpots] = useState<Spot[]>(FALLBACK_SPOTS);
  const [savedSpotIds, setSavedSpotIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [currentUserProvider, setCurrentUserProvider] = useState<string | null>(() => {
    return localStorage.getItem("hago_auth_provider") || null;
  });
  const [selectedVibeFilter, setSelectedVibeFilter] = useState<string>("");

  // Curation Filters: Cities, Budgets, Currencies
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [explorerMode, setExplorerMode] = useState<"local" | "visitor" | "work">("local");
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<string>("USD");
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);
  const [displayMode, setDisplayMode] = useState<"grid" | "gps">("grid");
  const [compareMode, setCompareMode] = useState<"opentable" | "instagram" | "googlemaps" | "hago">("hago");
  const [activeCohort, setActiveCohort] = useState<string | null>(null);

  // Dynamic Google Maps Search & Vibe Identity states
  const [exploreFocus, setExploreFocus] = useState<"hype" | "small-business" | "treat-yourself" | "hangout">("small-business");
  const [activeCompanions, setActiveCompanions] = useState<"solo" | "besties" | "romantic" | "crew">("solo");
  const [isGoogleMapsSearching, setIsGoogleMapsSearching] = useState(false);
  const [googleMapsSearchError, setGoogleMapsSearchError] = useState("");
  const [googleMapsSearchSuccess, setGoogleMapsSearchSuccess] = useState("");
  const [cityRadarTrends, setCityRadarTrends] = useState<Array<{ title: string; query: string; icon: string; desc: string; type: "hype" | "small" | "treat" | "hangout" }>>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);

  // Welcome Registration and How-It-Works modal states
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regInstagram, setRegInstagram] = useState("");
  const [regLinkedin, setRegLinkedin] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regAesthetic, setRegAesthetic] = useState<"Sage Green" | "Warm Sepia" | "Dystopian Cyber" | "Cozy Bibliophile" | "Brutalist Mono" | "Pick Later">("Pick Later");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authStatusMessage, setAuthStatusMessage] = useState("");

  // AI Matching states
  const [userMoodInput, setUserMoodInput] = useState("");
  const [selectedMatchingTags, setSelectedMatchingTags] = useState<string[]>([]);
  const [isMatchingInputLoading, setIsMatchingInputLoading] = useState(false);
  const [aiMatchResult, setAiMatchResult] = useState<MatchResponse | null>(null);

  // "You" Tab (Vibe Hub & MECE Importer) States
  const [youChatMessages, setYouChatMessages] = useState<Array<{ id: string; sender: "user" | "ai"; text: string; suggestedSpots?: Spot[] }>>([
    {
      id: "init-1",
      sender: "ai",
      text: "Hello! I'm hago, your personal AI Vibe Coach 🌸.\n\nEvery city has secret, magical corners—sometimes a super cute dog cafe with a scenic rooftop is tucked away just 2 blocks from your home without you ever realizing it!\n\nTell me about the spaces or experiences you've absolutely loved in the past, or what you're in the mood for today. I will listen to your favorite vibes, map them to our MECE taxonomy, and unearth hidden local spots that match your exact taste!"
    }
  ]);
  const [youInputText, setYouInputText] = useState("");
  const [youRawImportText, setYouRawImportText] = useState("");
  const [youParsedDrafts, setYouParsedDrafts] = useState<Spot[]>([]);
  const [isParsingImport, setIsParsingImport] = useState(false);
  const [youImportLogs, setYouImportLogs] = useState<string[]>([]);

  // Connect Instagram accounts simulation
  const [connectedProfile, setConnectedProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("vibecheck_connected_profile");
    if (saved) return JSON.parse(saved);
    // Presetted mock active user profile
    return {
      instagramHandle: "curated_soul",
      fullName: "Isabella Martinez",
      bio: "minimalist spaces • ceramic pottery lover • hunting dim coffeeshops & quiet jazz alcoves.",
      profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      aesthetic: "Sage Green",
      savedSpots: ["spot-1", "spot-4"]
    };
  });
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  const [newInstagramHandle, setNewInstagramHandle] = useState("");

  // Hangout Planner State persistence
  const [hangoutPlans, setHangoutPlans] = useState<HangoutPlan[]>(() => {
    const saved = localStorage.getItem("vibecheck_hangout_plans");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "plan-1",
        title: "Mindful Matcha & Code Session",
        spotId: "spot-1",
        spotName: "The Conservatory Room",
        spotImage: "https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&q=80&w=500",
        date: "2026-06-25",
        time: "14:30",
        vibeStyle: "sageMatcha",
        friends: [
          { name: "Flora Dupont", instagramHandle: "flora.femme", avatar: INSTAGRAM_AVATARS[1] },
          { name: "Alicia Patel", instagramHandle: "alicia.reads", avatar: INSTAGRAM_AVATARS[0] }
        ],
        notes: "Remember your analog notebook! We are setting down phones for 60 minutes.",
        votes: { location: 4, time: 3, vibes: 5 }
      },
      {
        id: "plan-2",
        title: "Vibing over RareSoul Vinyls",
        spotId: "spot-2",
        spotName: "Veridian & Vinyl",
        spotImage: "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&q=80&w=500",
        date: "2026-06-29",
        time: "19:00",
        vibeStyle: "vintageCream",
        friends: [
          { name: "Lucas Vance", instagramHandle: "lucas.retro", avatar: INSTAGRAM_AVATARS[2] }
        ],
        notes: "Bring cash if you'd like to purchase any vintage vinyl pressings from their side shelf.",
        votes: { location: 2, time: 2, vibes: 4 }
      }
    ];
  });
  
  // Crew board discussion threads for each hangout plan
  const [crewDiscussions, setCrewDiscussions] = useState<{ [key: string]: Array<{ sender: string; text: string; time: string }> }>(() => {
    const saved = localStorage.getItem("vibecheck_crew_discussions");
    if (saved) return JSON.parse(saved);
    return {
      "plan-1": [
        { sender: "flora.femme", text: "I already packed my film camera! 📸", time: "2h ago" },
        { sender: "alicia.reads", text: "Yay, I'm bringing the green tea pastries! 🍵🌿", time: "1h ago" }
      ],
      "plan-2": [
        { sender: "lucas.retro", text: "Do they have record cleaners there? 💿", time: "Yesterday" }
      ]
    };
  });
  const [newCrewMsgText, setNewCrewMsgText] = useState<{ [key: string]: string }>({});

  // New hang-out draft wizard
  const [isCreatingHangout, setIsCreatingHangout] = useState(false);
  const [hangoutDraftTitle, setHangoutDraftTitle] = useState("");
  const [hangoutDraftSpotId, setHangoutDraftSpotId] = useState("");
  const [hangoutDraftDate, setHangoutDraftDate] = useState("");
  const [hangoutDraftTime, setHangoutDraftTime] = useState("");
  const [hangoutDraftStyle, setHangoutDraftStyle] = useState<"vintageCream" | "slateGrey" | "neonObsidian" | "sageMatcha">("vintageCream");
  const [hangoutDraftNotes, setHangoutDraftNotes] = useState("");
  const [selectedFriendsForDraft, setSelectedFriendsForDraft] = useState<CoViber[]>([]);

  // Instax Story Visualizer Modal
  const [activeStorySpot, setActiveStorySpot] = useState<Spot | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Invitation Card Showcase Viewer
  const [viewingInviteCardPlan, setViewingInviteCardPlan] = useState<HangoutPlan | null>(null);

  // Group chat system for Co-Vibers DM mockups
  const [activeChatViber, setActiveChatViber] = useState<CoViber | null>(null);
  const [currentChatMessageText, setCurrentChatMessageText] = useState("");
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});

  // Unified vibe terms catalog
  const VIBE_BUBBLES = [
    { label: "🕯️ Cozy & Candlelit", tag: "candlelit" },
    { label: "🌿 Sage Garden", tag: "sagegreen" },
    { label: "🎧 Lo-Fi Vinyl", tag: "vinylonly" },
    { label: "🤍 Neutral Tones", tag: "neutraltones" },
    { label: "📐 Raw Industrial", tag: "brutalistmono" },
    { label: "💻 Mindful Deep-Focus", tag: "minimalist" },
    { label: "🌙 Dimly Lit", tag: "dimlylit" },
    { label: "🍵 Wabi Sabi", tag: "wabisabi" }
  ];

  // Load spots initially from Server express catalog
  useEffect(() => {
    fetch("/api/spots/catalog")
      .then((res) => {
        if (!res.ok) throw new Error("Catalog load failed, utilizing fallbacks");
        return res.json();
      })
      .then((data) => {
        if (data.spots && data.spots.length > 0) {
          setSpots(data.spots);
          setSelectedSpotId(data.spots[0].id);
        } else {
          setSelectedSpotId(FALLBACK_SPOTS[0].id);
        }
      })
      .catch((err) => {
        console.warn("Backend catalog fallback: ", err);
        setSelectedSpotId(FALLBACK_SPOTS[0].id);
      });
  }, []);

  // Dynamic Google Maps Search API handler
  const handleGoogleMapsSearch = async (queryToSearch?: string) => {
    const queryStr = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (!queryStr.trim()) return;

    setIsGoogleMapsSearching(true);
    setGoogleMapsSearchError("");
    setGoogleMapsSearchSuccess("");

    try {
      const budgetParam = selectedBudgets.length > 0 ? selectedBudgets[0] : "$$";
      const response = await fetch("/api/spots/search-map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: queryStr,
          city: selectedCity,
          exploreFocus,
          budget: budgetParam,
          companions: activeCompanions,
        }),
      });

      if (!response.ok) {
        throw new Error("Connection error from dynamic curation index.");
      }

      const data = await response.json();
      if (data.spots && data.spots.length > 0) {
        setSpots((prevSpots) => {
          const existingIds = prevSpots.map((s) => s.id);
          const uniqueNewSpots = data.spots.filter((s: Spot) => !existingIds.includes(s.id));
          return [...uniqueNewSpots, ...prevSpots];
        });

        setSelectedSpotId(data.spots[0].id);
        setSearchQuery(queryStr);
        setDisplayMode("gps");
        setGoogleMapsSearchSuccess(`🗺️ Pinpointed 3 new "${queryStr}" spots matching your aura onto the interactive map!`);
        
        // Clear message after 4s
        setTimeout(() => setGoogleMapsSearchSuccess(""), 5000);
      } else {
        setGoogleMapsSearchError("No curated spaces fit that particular search combination on the map.");
        setTimeout(() => setGoogleMapsSearchError(""), 5000);
      }
    } catch (err: any) {
      console.error("Map search error: ", err);
      setGoogleMapsSearchError("Failed to coordinate matches with the satellite AI mapping system.");
      setTimeout(() => setGoogleMapsSearchError(""), 5000);
    } finally {
      setIsGoogleMapsSearching(false);
    }
  };
  
  // Fetch Dynamic City Trends from Yelp, Google Business, Instagram Simulation/Grounding
  useEffect(() => {
    setIsTrendsLoading(true);
    fetch(`/api/trends/city-radar?city=${encodeURIComponent(selectedCity)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Trends endpoint failed, falling back");
        return res.json();
      })
      .then((data) => {
        if (data && data.trends && data.trends.length > 0) {
          setCityRadarTrends(data.trends);
        } else {
          setCityRadarTrends(CITY_TRENDS[selectedCity] || CITY_TRENDS["Default"]);
        }
      })
      .catch((err) => {
        console.warn("Retrying with static local curated radar:", err);
        setCityRadarTrends(CITY_TRENDS[selectedCity] || CITY_TRENDS["Default"]);
      })
      .finally(() => {
        setIsTrendsLoading(false);
      });
  }, [selectedCity]);

  // Save changes locally to localStorage
  useEffect(() => {
    localStorage.setItem("vibecheck_hangout_plans", JSON.stringify(hangoutPlans));
  }, [hangoutPlans]);

  useEffect(() => {
    if (connectedProfile) {
      localStorage.setItem("vibecheck_connected_profile", JSON.stringify(connectedProfile));
    } else {
      localStorage.removeItem("vibecheck_connected_profile");
    }
  }, [connectedProfile]);

  // Favorite toggle helper
  const handleToggleSave = (spotId: string) => {
    setSavedSpotIds((prev) =>
      prev.includes(spotId) ? prev.filter((id) => id !== spotId) : [...prev, spotId]
    );
  };

  // Run AI matching loop on local API
  const handleAIMappingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMoodInput && selectedMatchingTags.length === 0) return;

    setIsMatchingInputLoading(true);
    setAiMatchResult(null);

    try {
      const res = await fetch("/api/vibe/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMood: userMoodInput,
          selectedTags: selectedMatchingTags
        })
      });

      if (!res.ok) throw new Error("Vibe Matching error");
      const matchedData = await res.json();
      setAiMatchResult(matchedData);

      // If AI recommends a Dream Spot, temporarily seed it to state
      if (matchedData.dreamSpot) {
        setSpots((prev) => {
          if (prev.some((s) => s.id === matchedData.dreamSpot.id)) return prev;
          return [matchedData.dreamSpot, ...prev];
        });
      }
    } catch (err) {
      console.error("AI Matcher Error: ", err);
    } finally {
      setIsMatchingInputLoading(false);
    }
  };

  // Toggle Tag in Matcher Multi-selector
  const handleToggleMatchingTag = (tag: string) => {
    setSelectedMatchingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Open Spot Story
  const handleOpenStories = (spot: Spot) => {
    setActiveStorySpot(spot);
    setActiveStoryIdx(0);
  };

  // Next/Prev story handlers
  const handleNextStory = () => {
    if (!activeStorySpot) return;
    const storyList = activeStorySpot.stories || [];
    if (activeStoryIdx < storyList.length - 1) {
      setActiveStoryIdx((prev) => prev + 1);
    } else {
      setActiveStorySpot(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIdx > 0) {
      setActiveStoryIdx((prev) => prev - 1);
    }
  };

  // Submitting DM mocks
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatViber || !currentChatMessageText.trim()) return;

    const vId = activeChatViber.id;
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: "user" as const,
      text: currentChatMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatSessions((prev) => {
      const existing = prev[vId] || { viberId: vId, messages: [] };
      return {
        ...prev,
        [vId]: {
          ...existing,
          messages: [...existing.messages, userMsg]
        }
      };
    });

    const typedMsg = currentChatMessageText.toLowerCase();
    setCurrentChatMessageText("");

    // Whimsical responsive simulated response
    setTimeout(() => {
      let replyText = `Oh my god, I absolutely love that spot! Perfect vibe. Let's definitely meet up there! ✨`;
      if (typedMsg.includes("invite") || typedMsg.includes("plan") || typedMsg.includes("hangout")) {
        replyText = `That sounds incredibly aesthetic. Consider me 100% RSVP'd. Let me connect to my Instagram DM and remind Lucas too! ☕🌿`;
      } else if (typedMsg.includes("matcha") || typedMsg.includes("tea") || typedMsg.includes("coffee")) {
        replyText = `Mmm, their single-origin beverages are literally to die for! The concrete pour-over station looks beautiful too. Count me in!`;
      } else if (typedMsg.includes("when") || typedMsg.includes("time") || typedMsg.includes("date")) {
        replyText = `Any afternoon next weekend works perfectly for me! Let me arrange my calendar slides.`;
      }

      const replyMsg = {
        id: `m-${Date.now() + 1}`,
        sender: "them" as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatSessions((prev) => {
        const existing = prev[vId] || { viberId: vId, messages: [] };
        return {
          ...prev,
          [vId]: {
            ...existing,
            messages: [...existing.messages, replyMsg]
          }
        };
      });
    }, 1500);
  };

  // "You" AI Hub Chat Handler
  const handleYouChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youInputText.trim()) return;

    const userText = youInputText.trim();
    const userMsg = {
      id: `you-msg-${Date.now()}`,
      sender: "user" as const,
      text: userText
    };

    setYouChatMessages((prev) => [...prev, userMsg]);
    setYouInputText("");

    // AI simulation response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let aiText = "I hear you! Based on the experiences and tastes you enjoy, I mapped your vibe against our neighborhood classification system. Here are the perfect local spots matching your vibe:";
      let selectedSpots: Spot[] = [];

      if (lower.includes("dog") || lower.includes("pet") || lower.includes("puppy") || lower.includes("chó") || lower.includes("rooftop") || lower.includes("roof") || lower.includes("hidden") || lower.includes("gem")) {
        aiText = "Oh, you are in for an absolute treat! Did you know there is a gorgeous, hidden dog-friendly oasis with a scenic rooftop garden called 'Rooftop Paws & Brews' tucked away just 2 blocks from the city center? Here are some incredibly adorable, pet-friendly spots with breezy terraces and high aesthetic points:";
        
        // Generate/Find suitable spots
        const customDogSpot: Spot = {
          id: `suggested-dog-${Date.now()}`,
          name: "Rooftop Paws & Brews",
          category: "Botanical Yard",
          city: "San Francisco",
          priceLevel: "$$",
          priceUsd: 14,
          vibeTags: ["rooftop", "dog-friendly", "cute", "organic"],
          description: "An incredibly cute dog-friendly cafe on a hidden garden rooftop with custom turf patches, organic dog treats, and stellar pour-overs.",
          location: "235 Townsend St, San Francisco",
          lighting: "☀️ 3500K Direct Natural Skylights",
          noise: "🎵 45dB Soft Puppy Tail-wags & Chill Beats",
          seating: "🪑 Airy Outdoor Redwood Benches",
          instagramHandle: "rooftoppaws_sf",
          coVibersCount: 8,
          savedCount: 24,
          rating: "98% Charming",
          image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600",
          stories: [
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
          ],
          menuHighlights: ["Puppyccino", "Rosewater Cold Brew"],
          placeLayout: "Rooftop garden deck with safe glass railings and soft pet zones",
          yelpRating: 4.9,
          googleRating: 4.8,
          instagramActivity: "Trending Neighborhood Gem",
          lat: 37.7786,
          lng: -122.3912,
          explorerMode: "local"
        };
        selectedSpots = [customDogSpot, ...spots.filter(s => s.description.toLowerCase().includes("garden") || s.description.toLowerCase().includes("outdoor"))];
      } else if (lower.includes("romantic") || lower.includes("date") || lower.includes("candle") || lower.includes("night") || lower.includes("hẹn hò") || lower.includes("lãng mạn")) {
        aiText = "Wonderful choice. For a beautiful evening, candlelight intimacy, and warm acoustic backdrops, here are some stunning cozy lounge spots with low amber glow (~2200K) and velvet corners:";
        selectedSpots = spots.filter(s => s.category.toLowerCase().includes("lounge") || s.description.toLowerCase().includes("candlelight") || s.name.includes("Veranda") || s.name.includes("Soma") || s.name.includes("Vinyl"));
      } else if (lower.includes("quiet") || lower.includes("study") || lower.includes("work") || lower.includes("focus") || lower.includes("laptop")) {
        aiText = "To lock in your focus, write, or work in serene peace, I recommend these beautifully-lit spaces featuring wide wooden desks, reliable power outlets, and peaceful ambiance under 40dB:";
        selectedSpots = spots.filter(s => s.description.toLowerCase().includes("work") || s.description.toLowerCase().includes("study") || s.name.includes("Plow") || s.name.includes("Skylight") || s.name.includes("Oak"));
      } else if (lower.includes("matcha") || lower.includes("tea") || lower.includes("trà")) {
        aiText = "For high-grade ceremonial matcha whisked by hand, and clean botanical tea lounges, you will absolutely fall in love with these peaceful sanctuaries:";
        selectedSpots = spots.filter(s => s.name.toLowerCase().includes("matcha") || s.description.toLowerCase().includes("matcha") || s.description.toLowerCase().includes("tea"));
      } else {
        // Fallback matching general preferences
        aiText = "I analyzed your vibe profile and matched it to a couple of gorgeous, multi-functional local spaces in San Francisco that are beloved for their design-forward ambiance and incredible community energy:";
        selectedSpots = spots.slice(0, 2);
      }

      const aiMsg = {
        id: `you-msg-ai-${Date.now()}`,
        sender: "ai" as const,
        text: aiText,
        suggestedSpots: selectedSpots.slice(0, 2)
      };

      setYouChatMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  // Google Maps / Yelp Raw Paste Parser
  const handleParseRawImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youRawImportText.trim()) return;

    setIsParsingImport(true);
    setYouImportLogs((prev) => [...prev, "⚡ Initiating MECE data parsing pipeline..."]);

    setTimeout(() => {
      const lines = youRawImportText.split("\n").map(l => l.trim()).filter(l => l.length > 5);
      const parsed: Spot[] = [];
      const logs: string[] = [];

      lines.forEach((line, index) => {
        // Clean line, look for common splitters like ":", "-", "at", "St"
        let name = "";
        let desc = "";
        
        if (line.includes(":")) {
          const parts = line.split(":");
          name = parts[0].trim();
          desc = parts.slice(1).join(":").trim();
        } else if (line.includes("-")) {
          const parts = line.split("-");
          name = parts[0].trim();
          desc = parts.slice(1).join("-").trim();
        } else {
          // Fallback splits
          const words = line.split(" ");
          if (words.length > 3) {
            name = words.slice(0, 3).join(" ");
            desc = words.slice(3).join(" ");
          } else {
            name = line;
            desc = "An exceptional independent coffee and community hub.";
          }
        }

        // Clean name from numbers/bullet points
        name = name.replace(/^[\d.\-*+\s]+/, "").trim();
        if (name.length < 2) return;

        // Custom image matching
        const mockImg = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600";

        const newDraft: Spot = {
          id: `draft-${Date.now()}-${index}`,
          name: name,
          category: lowerCategoryMatch(name, desc),
          city: "San Francisco",
          priceLevel: ["$", "$$", "$$$"][Math.floor(Math.random() * 3)],
          priceUsd: 12,
          vibeTags: ["cozy", "aesthetic", "imported"],
          description: desc || "A unique aesthetic destination imported from your personal lists. High ambiance points.",
          location: name + " • SF",
          lighting: lowerLightingMatch(name, desc),
          noise: lowerNoiseMatch(name, desc),
          seating: lowerSeatingMatch(name, desc),
          instagramHandle: name.toLowerCase().replace(/[^a-z0-9_]/g, "") + "_sf",
          coVibersCount: 1,
          savedCount: 5,
          rating: "95% Cozy",
          image: mockImg,
          stories: [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400"
          ],
          menuHighlights: ["Specialty Brew", "Signature Pastry"],
          placeLayout: "Sleek contemporary seating with rich ambient setups",
          yelpRating: parseFloat((4.3 + Math.random() * 0.6).toFixed(1)),
          googleRating: parseFloat((4.4 + Math.random() * 0.5).toFixed(1)),
          instagramActivity: "Just Imported",
          lat: 37.7749 + (Math.random() - 0.5) * 0.02,
          lng: -122.4194 + (Math.random() - 0.5) * 0.02,
          explorerMode: "local"
        };

        parsed.push(newDraft);
        logs.push(`✅ Successfully parsed: "${name}" (${newDraft.category}) • Ambiance: ${newDraft.lighting}`);
      });

      if (parsed.length > 0) {
        setYouParsedDrafts(parsed);
        setYouImportLogs((prev) => [...prev, ...logs, `✨ Successfully converted ${parsed.length} locations into standardized hago drafts!`]);
      } else {
        setYouImportLogs((prev) => [...prev, "❌ No valid locations recognized. Try pasting using a 'Name: Description' format!"]);
      }
      setIsParsingImport(false);
    }, 1200);
  };

  // Helper matching functions for raw imports
  const lowerCategoryMatch = (name: string, desc: string): string => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("matcha") || text.includes("tea") || text.includes("trà")) return "Matcha Bar";
    if (text.includes("pastry") || text.includes("bakery") || text.includes("bánh")) return "Boulangerie";
    if (text.includes("bar") || text.includes("lounge") || text.includes("cocktail") || text.includes("rượu")) return "Vinyl Lounge";
    if (text.includes("park") || text.includes("vườn") || text.includes("garden")) return "Botanical Yard";
    return "Specialty Coffee";
  };

  const lowerLightingMatch = (name: string, desc: string): string => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("dim") || text.includes("candle") || text.includes("dark") || text.includes("mờ") || text.includes("tối")) return "🕯️ 2200K Candlelight Spectrum";
    if (text.includes("bright") || text.includes("sun") || text.includes("sky") || text.includes("sáng") || text.includes("kính")) return "☀️ 3500K Direct Natural Skylights";
    return "💡 Soft Diffused Glow";
  };

  const lowerNoiseMatch = (name: string, desc: string): string => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("quiet") || text.includes("silent") || text.includes("tĩnh") || text.includes("học")) return "🔇 < 30dB Soft Jazz Whispers";
    if (text.includes("lively") || text.includes("beat") || text.includes("nhộn") || text.includes("music")) return "🔊 65dB+ Lively Beats";
    return "🎵 40dB Soft Keyboard Clatters";
  };

  const lowerSeatingMatch = (name: string, desc: string): string => {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("sofa") || text.includes("couch") || text.includes("velvet") || text.includes("êm")) return "🛋️ Plush Velvet Lounges";
    if (text.includes("desk") || text.includes("table") || text.includes("bàn") || text.includes("socket")) return "🪵 Wide Oak Desks with Outlets";
    return "🪑 Cozy Cushion Benches";
  };

  // Physically import a draft spot into the live app spots catalog! (Add "từ từ" one by one)
  const handleImportSpotDraft = (draftSpot: Spot) => {
    // Check duplication
    const exists = spots.some(s => s.name.toLowerCase() === draftSpot.name.toLowerCase());
    if (exists) {
      alert(`"${draftSpot.name}" already exists in your curated list!`);
      return;
    }

    // Add to master list of spots!
    setSpots((prev) => [draftSpot, ...prev]);
    // Save to favorites as well so it is curated for "You"
    setSavedSpotIds((prev) => [...prev, draftSpot.id]);

    // Remove from parsed drafts
    setYouParsedDrafts((prev) => prev.filter(s => s.id !== draftSpot.id));
    setYouImportLogs((prev) => [...prev, `🎉 Successfully imported "${draftSpot.name}" into your live explore catalog!`]);
  };

  // Instagram Mock connect
  const handleInstagramConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstagramHandle.trim()) return;

    setIsConnectingInstagram(true);
    setTimeout(() => {
      const parts = newInstagramHandle.split(/[._]/);
      const namePart = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Curator Friend";
      setConnectedProfile({
        instagramHandle: newInstagramHandle.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
        fullName: namePart,
        bio: "aesthetic curator • discovering warm cozy study corners • visual architect student SF",
        profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
        aesthetic: Object.keys(AESTHETIC_GRID_PRESETS)[Math.floor(Math.random() * 5)] as any,
        savedSpots: []
      });
      setIsConnectingInstagram(false);
      setNewInstagramHandle("");
    }, 1200);
  };

  // Hangout Planner creations
  const handleCreateHangoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hangoutDraftTitle.trim() || !hangoutDraftSpotId) return;

    const chosenSpot = spots.find((s) => s.id === hangoutDraftSpotId) || FALLBACK_SPOTS[0];
    const newPlan: HangoutPlan = {
      id: `hangout-${Date.now()}`,
      title: hangoutDraftTitle,
      spotId: chosenSpot.id,
      spotName: chosenSpot.name,
      spotImage: chosenSpot.image,
      date: hangoutDraftDate || "Flexible Date",
      time: hangoutDraftTime || "Afternoon",
      vibeStyle: hangoutDraftStyle,
      friends: selectedFriendsForDraft.map((v) => ({
        name: v.fullName,
        instagramHandle: v.instagramHandle,
        avatar: v.profilePic
      })),
      notes: hangoutDraftNotes,
      votes: { location: 1, time: 1, vibes: 1 }
    };

    setHangoutPlans((prev) => [newPlan, ...prev]);
    setIsCreatingHangout(false);

    // Reset fields
    setHangoutDraftTitle("");
    setHangoutDraftSpotId("");
    setHangoutDraftDate("");
    setHangoutDraftTime("");
    setHangoutDraftStyle("vintageCream");
    setHangoutDraftNotes("");
    setSelectedFriendsForDraft([]);

    // Open invite card automatically for delight interaction
    setViewingInviteCardPlan(newPlan);
  };

  // Toggle CoViber in draft selected friends list
  const handleToggleViberInDraft = (viber: CoViber) => {
    setSelectedFriendsForDraft((prev) =>
      prev.some((p) => p.id === viber.id)
        ? prev.filter((p) => p.id !== viber.id)
        : [...prev, viber]
    );
  };

  // Delete planned hangout
  const handleDeleteHangout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHangoutPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Generate a functional template Google Calendar link
  const getGoogleCalendarUrl = (plan: any) => {
    // Parse date: e.g. "2026-06-25" -> "20260625"
    let formattedDate = "";
    if (plan.date && /^\d{4}-\d{2}-\d{2}$/.test(plan.date)) {
      formattedDate = plan.date.replace(/-/g, "");
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      formattedDate = tomorrow.toISOString().split("T")[0].replace(/-/g, "");
    }

    // Parse time: e.g. "14:30" -> start "143000", end "163000" (plus 2 hours)
    let startTime = "150000";
    let endTime = "170000";
    if (plan.time && /^\d{2}:\d{2}$/.test(plan.time)) {
      const [h, m] = plan.time.split(":");
      startTime = `${h}${m}00`;
      const endH = String((parseInt(h, 10) + 2) % 24).padStart(2, "0");
      endTime = `${endH}${m}00`;
    }

    const dates = `${formattedDate}T${startTime}/${formattedDate}T${endTime}`;

    const chosenSpot = spots.find((s) => s.id === plan.spotId);
    const location = chosenSpot ? `${chosenSpot.name}, ${chosenSpot.location}` : plan.spotName;
    const friendsList = plan.friends?.map((f: any) => `@${f.instagramHandle}`).join(", ") || "";
    const description = `Outing Title: ${plan.title}\nNotes: "${plan.notes || "Enjoy a pleasant ambiance!"}"\nTarget Spot: ${plan.spotName}\nLocation: ${location}\nInvited Crew: ${friendsList || "Self-Care Solo"}\n\nCreated via hago. Synchronized real-time with tpanhhhhh04@gmail.com`;

    const title = `hago: ${plan.title} @ ${plan.spotName}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  };

  // Filtered logic for discovery catalog
  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.placeLayout && spot.placeLayout.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (spot.menuHighlights && spot.menuHighlights.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesVibe = selectedVibeFilter
      ? spot.vibeTags.includes(selectedVibeFilter)
      : true;

    const matchesCity = selectedCity === "All Cities"
      ? true
      : spot.city?.toLowerCase() === selectedCity.toLowerCase();

    const matchesBudget = selectedBudgets.length === 0
      ? true
      : selectedBudgets.includes(spot.priceLevel);

    const matchesExplorerMode = !spot.explorerMode || spot.explorerMode === explorerMode;

    return matchesSearch && matchesVibe && matchesCity && matchesBudget && matchesExplorerMode;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-amber-100 selection:text-amber-900 border-t-4 border-zinc-900">
      
      {/* Dynamic Welcome & SSO Login / Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            id="hago-welcome-onboarding-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border-2 border-[#FFE2D1] rounded-[36px] max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl relative min-h-[620px]"
            >
              {/* Comfortable close button */}
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-zinc-600 p-2 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-full cursor-pointer flex items-center justify-center shadow-xs"
                title="Explore App Directly"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Decorative Ornament floating stickers */}
              <div className="absolute top-4 right-16 hidden sm:block text-xs font-mono text-zinc-400 select-none bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full pointer-events-none">
                📍 v2.16 • San Francisco, Seattle, NYC
              </div>

              {/* LEFT SIDE: HAGO Compounded Benefits & Comparative matrix */}
              <div className="md:col-span-5 bg-gradient-to-br from-[#FEF6F0] via-[#FFF0E8] to-[#FFF5FE] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#FFE2D1] relative">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm">🌸</span>
                    <h3 className="text-sm font-bold tracking-tight text-amber-900 font-display">
                      hago <span className="text-zinc-400 font-normal italic font-serif">atmosphere guide</span>
                    </h3>
                  </div>

                  <h4 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                    Why explorers <br />choose <span className="bg-amber-100 px-1.5 rounded-lg text-amber-905">hago.</span>
                  </h4>
                  
                  <p className="text-[12px] text-zinc-650 font-sans mt-3 leading-relaxed">
                    <strong>hago</strong> is your pocket companion for beautiful city spaces. It filters out the noise so you can find exactly what fits your active state, with zero reservation friction, ad clutter, or endless scroll loops.
                  </p>

                  {/* Compounded Benefits Matrix cards */}
                  <div className="mt-6 space-y-3.5">
                    <div className="bg-[#FFFBF8] p-4 rounded-2xl border border-[#FFE2D1] shadow-xs">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                        <span>✨</span>
                        <span>How we can help you:</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed mt-1">
                        We collect exact atmospheric details—natural lighting hours, true acoustic noise levels, workspace seat specifications, and cozy layout blueprints.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/70">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                          <span>🏡 Find Secret Local Escape Spots</span>
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded uppercase font-mono">Calm</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 leading-relaxed mt-1">
                          Browse quiet plant greenhouse patios, secluded alleyway book bars, and peaceful neighborhood tea houses where you can slow down.
                        </p>
                      </div>

                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/70">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                          <span>🧭 Pursue Grand Visual Landmarks</span>
                          <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded uppercase font-mono">Exotic</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 leading-relaxed mt-1">
                          Discover majestic glass dome conservatories, historical libraries, ocean galleries, and glowing, photogenic vistas.
                        </p>
                      </div>

                      <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-105">
                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                          <span>💼 Work Zones & Fine Dining Meetings</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded uppercase font-mono">Focus</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 leading-relaxed mt-1">
                          Pinpoint silent study cafes, laptop clubs with power outlets, and elegant, high-end fine dining for client meetings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FFE5D8] flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>✓ cute design philosophy</span>
                  <span>100% secure</span>
                </div>
              </div>

              {/* RIGHT SIDE: Interactive welcome tab & SSO / Custom Login Page */}
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#FFF0E8] text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Welcome to hago! (•‿•)
                    </span>
                    <span className="text-xs animate-bounce">🎈</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight font-display mt-2">
                    Let's connect your space
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Sign in to join local SF/Seattle meetup circles, customize your favourite aesthetics, save private spots, and create spontaneous meetups.
                  </p>

                  {/* Auth loader indicator if connecting via SSO */}
                  {isAuthLoading ? (
                    <div className="my-10 p-8 rounded-3xl bg-zinc-50 border border-zinc-150 flex flex-col items-center justify-center text-center animate-pulse">
                      <div className="h-9 w-9 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mb-3" />
                      <p className="text-xs font-bold text-zinc-800">{authStatusMessage}</p>
                      <p className="text-[10px] font-mono text-zinc-400 mt-1.5 italic">Synchronizing local storage presets...</p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-5">
                      
                      {/* Social SSO Buttons */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                          🛡️ Quick Single Sign-On (SSO)
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          <button
                            onClick={() => {
                              setIsAuthLoading(true);
                              setAuthStatusMessage("Connecting to Google OAuth client...");
                              setTimeout(() => {
                                setAuthStatusMessage("Retrieving secure Google user token & meta...");
                                setTimeout(() => {
                                  const mockGoogleUser = {
                                    id: "google-user",
                                    fullName: "Isabella Martinez (Google)",
                                    instagramHandle: "isabella.spots",
                                    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
                                    city: "San Francisco",
                                    bio: "Solo architecture explorer. Love dark chocolates, books and warm coffee corners! ☕🌱",
                                    joinedDate: "Today",
                                    linkedinUrl: "https://linkedin.com/in/isabella-martinez-spots"
                                  };
                                  localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockGoogleUser));
                                  localStorage.setItem("hago_onboarding_shown", "true");
                                  localStorage.setItem("hago_auth_provider", "google");
                                  setConnectedProfile(mockGoogleUser);
                                  setCurrentUserProvider("google");
                                  setIsAuthLoading(false);
                                  setShowOnboarding(false);
                                }, 1200);
                              }, 1200);
                            }}
                            className="bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-[11px] py-2 px-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          >
                            <Globe className="h-3 w-3 text-blue-500" />
                            <span>Google</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsAuthLoading(true);
                              setAuthStatusMessage("Querying Instagram Graph API...");
                              setTimeout(() => {
                                setAuthStatusMessage("Mapping authenticated business tags...");
                                setTimeout(() => {
                                  const mockInstaUser = {
                                    id: "insta-user",
                                    fullName: "Lucas Aoki (Instagram)",
                                    instagramHandle: "lucas.vinyl",
                                    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
                                    city: "Seattle",
                                    bio: "Aesthetic vinyl digger based in Seattle. Let's grab some matcha! 🍵🎧",
                                    joinedDate: "Today",
                                    linkedinUrl: "https://linkedin.com/in/lucas-aoki-vinyl"
                                  };
                                  localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockInstaUser));
                                  localStorage.setItem("hago_onboarding_shown", "true");
                                  localStorage.setItem("hago_auth_provider", "instagram");
                                  setConnectedProfile(mockInstaUser);
                                  setCurrentUserProvider("instagram");
                                  setIsAuthLoading(false);
                                  setShowOnboarding(false);
                                }, 1200);
                              }, 1200);
                            }}
                            className="bg-white hover:bg-pink-50 border border-pink-100 hover:border-pink-300 text-pink-700 text-[11px] py-2 px-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          >
                            <Instagram className="h-3 w-3" />
                            <span>Instagram</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsAuthLoading(true);
                              setAuthStatusMessage("Connecting to Facebook credentials...");
                              setTimeout(() => {
                                setAuthStatusMessage("Winding up user feed nodes...");
                                setTimeout(() => {
                                  const mockFbUser = {
                                    id: "fb-user",
                                    fullName: "Sophia Vance (Facebook)",
                                    instagramHandle: "sophia.v",
                                    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
                                    city: "NYC",
                                    bio: "Always down for family brunch parks and vintage photography sessions! 🧸🌟",
                                    joinedDate: "Today",
                                    linkedinUrl: "https://linkedin.com/in/sophia-vance-design"
                                  };
                                  localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockFbUser));
                                  localStorage.setItem("hago_onboarding_shown", "true");
                                  localStorage.setItem("hago_auth_provider", "facebook");
                                  setConnectedProfile(mockFbUser);
                                  setCurrentUserProvider("facebook");
                                  setIsAuthLoading(false);
                                  setShowOnboarding(false);
                                }, 1200);
                              }, 1200);
                            }}
                            className="bg-white hover:bg-blue-50 border border-blue-100 hover:border-blue-300 text-blue-700 text-[11px] py-2 px-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          >
                            <Users className="h-3 w-3 text-blue-600" />
                            <span>Facebook</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsAuthLoading(true);
                              setAuthStatusMessage("Initializing Apple Secure Enclave token...");
                              setTimeout(() => {
                                setAuthStatusMessage("Decrypting federated Apple ID credential...");
                                setTimeout(() => {
                                  const mockAppleUser = {
                                    id: "apple-user",
                                    fullName: "Ethan Thorne (Apple ID)",
                                    instagramHandle: "ethan.thorne",
                                    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
                                    city: "Hanoi",
                                    bio: "Design researcher. Seeking minimalist brutalist spaces & perfect double espressos. 📐☕",
                                    joinedDate: "Today",
                                    linkedinUrl: "https://linkedin.com/in/ethan-thorne-research"
                                  };
                                  localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockAppleUser));
                                  localStorage.setItem("hago_onboarding_shown", "true");
                                  localStorage.setItem("hago_auth_provider", "apple");
                                  setConnectedProfile(mockAppleUser);
                                  setCurrentUserProvider("apple");
                                  setIsAuthLoading(false);
                                  setShowOnboarding(false);
                                }, 1200);
                              }, 1200);
                            }}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white border border-zinc-950 text-[11px] py-2 px-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
                          >
                            <span className="text-xs"></span>
                            <span>Apple ID</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsAuthLoading(true);
                              setAuthStatusMessage("Querying LinkedIn profile services...");
                              setTimeout(() => {
                                setAuthStatusMessage("Retrieving professional coffee chat credentials...");
                                setTimeout(() => {
                                  const mockLinkedInUser = {
                                    id: "linkedin-user",
                                    fullName: "Minh Anh Nguyen (LinkedIn)",
                                    instagramHandle: "minhanh.hago",
                                    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                                    city: "HCMC",
                                    bio: "Tech entrepreneur and product designer. Down to connect for coffee chats & startup chats! 🚀☕",
                                    joinedDate: "Today",
                                    linkedinUrl: "https://linkedin.com/in/minh-anh-hago"
                                  };
                                  localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockLinkedInUser));
                                  localStorage.setItem("hago_onboarding_shown", "true");
                                  localStorage.setItem("hago_auth_provider", "linkedin");
                                  setConnectedProfile(mockLinkedInUser);
                                  setCurrentUserProvider("linkedin");
                                  setIsAuthLoading(false);
                                  setShowOnboarding(false);
                                }, 1200);
                              }, 1200);
                            }}
                            className="bg-white hover:bg-sky-50 border border-sky-100 hover:border-sky-300 text-sky-700 text-[11px] py-2 px-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs col-span-2 sm:col-span-1"
                          >
                            <Linkedin className="h-3 w-3 text-sky-600" />
                            <span>LinkedIn</span>
                          </button>
                        </div>
                      </div>

                      {/* Manual Custom Profile Creation */}
                      <div className="space-y-3.5 border-t border-zinc-100 pt-4.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                            ✍️ Or Custom Hand-crafted Profile
                          </p>
                          <span className="text-[9px] text-[#8C3E14] bg-[#FFF0E8] font-bold px-1.5 rounded">Cute Swatches Included</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">Full Name</label>
                            <input
                              type="text"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              placeholder="e.g. Misa Amano"
                              className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">Email Address</label>
                            <input
                              type="email"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="e.g. misa@hago.cafe"
                              className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">Instagram Handle</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-mono">@</span>
                              <input
                                type="text"
                                value={regInstagram}
                                onChange={(e) => setRegInstagram(e.target.value)}
                                placeholder="misa.matcha"
                                className="w-full text-xs pl-6 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">Aesthetic Swatch</label>
                            <select
                              value={regAesthetic}
                              onChange={(e) => setRegAesthetic(e.target.value as any)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800 appearance-none cursor-pointer"
                              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "14px" }}
                            >
                              <option value="Pick Later">Pick Later 🎨 (Optional)</option>
                              <option value="Sage Green">Sage Green 🌱</option>
                              <option value="Warm Sepia">Warm Sepia ☕</option>
                              <option value="Dystopian Cyber">Dystopian Cyber 🎧</option>
                              <option value="Cozy Bibliophile">Cozy Bibliophile 📖</option>
                              <option value="Brutalist Mono">Brutalist Concrete 📐</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">LinkedIn URL (Optional - for coffee chats)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-mono">https://</span>
                            <input
                              type="text"
                              value={regLinkedin}
                              onChange={(e) => setRegLinkedin(e.target.value)}
                              placeholder="linkedin.com/in/yourprofile"
                              className="w-full text-xs pl-16 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-zinc-700 font-mono uppercase">Short Bio / What vibes do you seek?</label>
                          <textarea
                            value={regBio}
                            onChange={(e) => setRegBio(e.target.value)}
                            placeholder="I seek quiet vinyl record bars and double matcha lattes..."
                            className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800 h-16 resize-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!regName.trim() || !regInstagram.trim()) {
                              alert("Please fill in at least a Name and an Instagram handle so we can connect you! 🌸");
                              return;
                            }
                            setIsAuthLoading(true);
                            setAuthStatusMessage(regAesthetic === "Pick Later" ? "Creating your guest explorer profile..." : `Registering custom ${regAesthetic} explorer...`);
                            setTimeout(() => {
                              const cleanLinkedin = regLinkedin.trim() 
                                ? (regLinkedin.trim().startsWith("http") ? regLinkedin.trim() : "https://" + regLinkedin.trim()) 
                                : undefined;

                              const manualUser = {
                                id: `custom-user-${Date.now()}`,
                                fullName: regName,
                                instagramHandle: regInstagram.replace("@", "").trim(),
                                profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                                city: "San Francisco",
                                bio: regBio || (regAesthetic === "Pick Later" ? "I seek cozy spot recommendations & matcha runs!" : `I seek lovely ${regAesthetic} lounges and serene matcha bars!`),
                                aesthetic: regAesthetic,
                                joinedDate: "Today",
                                linkedinUrl: cleanLinkedin
                              };
                              localStorage.setItem("vibecheck_connected_profile", JSON.stringify(manualUser));
                              localStorage.setItem("hago_onboarding_shown", "true");
                              localStorage.setItem("hago_auth_provider", "custom");
                              setConnectedProfile(manualUser);
                              setCurrentUserProvider("custom");
                              setIsAuthLoading(false);
                              setShowOnboarding(false);
                            }, 1200);
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-2xl shadow-xs transition-colors cursor-pointer text-center active:scale-98"
                        >
                          Launch Custom Profile 🚀
                        </button>
                      </div>

                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3.5">
                  <button
                    onClick={() => {
                      localStorage.setItem("hago_onboarding_shown", "true");
                      setShowOnboarding(false);
                    }}
                    className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 hover:underline cursor-pointer"
                  >
                    Skip registration, enter as Guest 🍂
                  </button>
                  <p className="text-[9.5px] text-zinc-400 text-center sm:text-right font-sans">
                    By accessing hago, you agree to discover, share and take care of local spaces.
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modal: How It Works & Compounded Benefits */}
      <AnimatePresence>
        {showHowItWorksModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4"
            id="hago-how-it-works-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              className="bg-white border-2 border-amber-200 rounded-[32px] max-w-3xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1.5 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✨</span>
                <h3 className="text-sm font-black text-[#8C3E14] uppercase tracking-wider font-mono">
                  Meet hago — Your Vibe Guide
                </h3>
              </div>

              <h4 className="text-xl font-black text-zinc-900 tracking-tight leading-snug font-display">
                How hago makes spot picking effortless 🌸
              </h4>
              <p className="text-xs text-zinc-650 leading-relaxed mt-2 font-sans font-medium">
                No more juggling tab-overloads, generic review boards, and chaotic feeds! <strong>hago</strong> aggregates everything you need into a cute, single-screen experience, backed by smart <strong>integrated AI support</strong>.
              </p>

              {/* Cute Scannable Feature Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="bg-[#FFFBF9] border border-[#ECCFB7]/40 rounded-2xl p-4 flex gap-3 hover:shadow-xs transition-shadow">
                  <span className="text-2xl shrink-0">📍</span>
                  <div>
                    <h5 className="font-extrabold text-zinc-900 text-xs tracking-tight">
                      Google Maps + Yelp, Combined!
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                      See real Google stars and Yelp ratings directly on each card. Skip the duplicates and see physical specs like lighting, seating, and noise immediately.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-[#FCFBF7] border border-zinc-200/50 rounded-2xl p-4 flex gap-3 hover:shadow-xs transition-shadow">
                  <span className="text-2xl shrink-0">📸</span>
                  <div>
                    <h5 className="font-extrabold text-zinc-900 text-xs tracking-tight">
                      Instagram Preview Stories
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                      We link every curated spot directly to their official Instagram handle. Tap on any spot to instantly view current stories, vibe checks, and layout previews!
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-[#FCFBF7] border border-zinc-200/50 rounded-2xl p-4 flex gap-3 hover:shadow-xs transition-shadow">
                  <span className="text-2xl shrink-0">👯</span>
                  <div>
                    <h5 className="font-extrabold text-zinc-900 text-xs tracking-tight">
                      Plan Ahead with Friends
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                      Easily share or schedule outings. Plan with friends and meet up on spot chats directly, making physical space curation social and connected.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-[#FFFBF9] border border-[#ECCFB7]/40 rounded-2xl p-4 flex gap-3 hover:shadow-xs transition-shadow">
                  <span className="text-2xl shrink-0">🤖</span>
                  <div>
                    <h5 className="font-extrabold text-zinc-900 text-xs tracking-tight">
                      AI Support & Validation
                    </h5>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
                      Need backup on your spot choice? Use integrated AI to query, match, and instantly draft coordinates or invite-links to copy and text to your group chat!
                    </p>
                  </div>
                </div>
              </div>

              {/* Fast Comparison Chips */}
              <div className="mt-5 p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-wrap items-center gap-2 justify-center text-[10.5px] font-mono text-zinc-500">
                <span className="font-bold text-[#8C3E14] uppercase text-[9.5px]">hago super powers:</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200">✨ Organic Atmosphere</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200">🚫 100% Ad-Free</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-200">💼 LinkedIn Coffee Chats</span>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <p className="text-[9.5px] font-mono text-zinc-400">"Sensory logic meets cozy urban exploration."</p>
                <button
                  onClick={() => setShowHowItWorksModal(false)}
                  className="bg-[#8C3E14] hover:bg-[#6E300E] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Let's Explore!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Aesthetic Top Ambient Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECCFB7]/20 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/50 h-10 w-10 rounded-2xl flex items-center justify-center font-display font-extrabold text-[15px] tracking-tight shadow-xs select-none transform hover:rotate-6 transition-transform">
            ha
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-zinc-900 flex items-center gap-1.5 font-display">
              hago <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </h1>
            <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest leading-none font-semibold mt-0.5">
              Atmospheric City Guide
            </p>
          </div>
        </div>

        {/* Dynamic Nav Menu */}
        <nav className="flex items-center gap-2.5 md:gap-3.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-[#ECCFB7]/25 shadow-3xs">
          <button
            onClick={() => { setActiveTab("discover"); setAiMatchResult(null); }}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "discover"
                ? "bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 shadow-3xs font-extrabold"
                : "text-zinc-500 hover:bg-zinc-150 hover:text-zinc-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Explore Spots</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")} // Map to planner
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "planner"
                ? "bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 shadow-3xs font-extrabold"
                : "text-zinc-500 hover:bg-zinc-150 hover:text-zinc-900"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hangout Planner</span>
            {hangoutPlans.length > 0 && (
              <span className="bg-[#8C3E14] text-white text-[9px] rounded-full px-1.5 py-0.5 leading-none font-bold">
                {hangoutPlans.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("covibers")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "covibers"
                ? "bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 shadow-3xs font-extrabold"
                : "text-zinc-500 hover:bg-zinc-150 hover:text-zinc-900"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Meetups</span>
            <span className="bg-zinc-200 text-zinc-700 text-[10px] rounded-full px-1.5 py-0.5 font-mono font-bold">
              {MOCK_CO_VIBERS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("you")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === "you"
                ? "bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 shadow-3xs font-extrabold"
                : "text-zinc-500 hover:bg-zinc-150 hover:text-zinc-900"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">More You</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
          </button>

          {/* How It Works Button representing compounded benefits */}
          <button
            onClick={() => setShowHowItWorksModal(true)}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-850 border border-amber-500/20 rounded-full px-3.5 py-2 text-xs font-black tracking-wide transition-all cursor-pointer active:scale-95"
            title="View hago interactive comparative benefits"
          >
            <Sparkle className="h-3.5 w-3.5 text-amber-600 animate-spin" />
            <span className="hidden md:inline">How it Works</span>
          </button>
        </nav>

        {/* User Mini Instax Badge */}
        <div className="flex items-center gap-2 border-l border-zinc-100 pl-4">
          {connectedProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("covibers")}
                className="flex items-center gap-2 group text-left"
                title="View Connected Account"
              >
                <img
                  src={connectedProfile.profilePic}
                  alt={connectedProfile.fullName}
                  className="h-8 w-8 rounded-full object-cover border border-zinc-300 group-hover:scale-105 transition-transform"
                />
                <div className="hidden lg:block leading-none">
                  <p className="text-[11px] font-bold text-zinc-900">@{connectedProfile.instagramHandle}</p>
                  <p className="text-[9px] font-medium text-emerald-600 block mt-0.5 font-mono">CONNECTED</p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem("hago_onboarding_shown");
                  localStorage.removeItem("vibecheck_connected_profile");
                  setConnectedProfile(null);
                  setCurrentUserProvider(null);
                  setShowOnboarding(true);
                }}
                className="text-[9px] font-mono font-bold text-red-500 hover:text-red-700 hover:underline px-1 py-0.5 border border-red-200 rounded bg-red-50 cursor-pointer ml-1 text-center scale-90"
                title="Sign out of account"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowOnboarding(true);
              }}
              className="flex items-center gap-1.5 text-[11px] font-bold text-amber-750 bg-amber-50 hover:bg-amber-100 rounded-full px-3.5 py-1.5 transition-colors border border-amber-100 cursor-pointer"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Sign In / Up</span>
            </button>
          )}
        </div>
      </header>

      {/* Primary Workspace Scroll Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pb-20 md:pb-8">

        {/* ACTIVE TAB: EXPLORE / DISCOVER DIR */}
        {(activeTab === "discover") && (
          <div>
            {/* Extremely Cute & Polish-Driven Brand Explainer Hero Panel */}
            <div className="mb-10 rounded-[40px] bg-gradient-to-br from-[#FAF9F6] via-[#F4EDE7] to-[#FAF4FA] border-2 border-[#ECCFB7] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              
              {/* Cute Decorative Stickers / Floating Ornaments */}
              <div className="absolute top-4 right-10 flex gap-2.5 z-0 pointer-events-none opacity-60">
                <span className="text-2xl animate-pulse">✨</span>
                <span className="text-xl">🥐</span>
                <span className="text-2xl">🌸</span>
              </div>
              <div className="absolute bottom-6 left-10 flex gap-2.5 z-0 pointer-events-none opacity-60">
                <span className="text-2xl">🐾</span>
                <span className="text-xl">🍵</span>
                <span className="text-2xl">🛋️</span>
              </div>

              {/* Central Curation & Interactive Persona Selectors */}
              <div className="relative z-10 w-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-[#F3D5C0] text-[#712D03] font-mono text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-xs">
                      ☕ Spot Discovery, Solved!
                    </span>
                    <span className="text-sm animate-bounce">🎈</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-display leading-tight">
                    Why waste time on <span className="text-red-500 line-through decoration-dashed decoration-2">doomscrolling</span>?
                  </h2>
                  <p className="text-sm text-zinc-700 leading-relaxed font-sans mt-3 max-w-4xl text-balance">
                    Discover local vinyl lounges, botanical cafes, quiet family parks, and moody date settings. <strong>hago</strong> eliminates the pain of costly reservations, tedious manual planners, and generic maps. Designed for families, romantic dates, solo companions, and friendly matcha runs! 🌸🧸🕯️
                  </p>
                </div>

                {/* Target Audience Quick Pills */}
                <div className="mt-8 pt-6 border-t border-[#ECCFB7]/70 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-800 font-bold">
                    <span className="text-amber-600 text-sm">🥞</span>
                    <span>Pick an archetype to filter:</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets(["$", "$$"]);
                        setSelectedVibeFilter("neutraltones"); // Warm study
                        setActiveCohort("student");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "student"
                          ? "bg-amber-500 border-amber-600 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">🎒</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">Solo Student</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Quiet study & coffee</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets([]);
                        setSelectedVibeFilter("vinylonly"); // Creative retro youth
                        setActiveCohort("youth");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "youth"
                          ? "bg-rose-500 border-rose-600 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">🎧</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">Aesthetic Youth</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Vinyl records & soul</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets([]);
                        setSelectedVibeFilter("plantparadise"); // Botanical or cozy group spaces
                        setActiveCohort("group");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "group"
                          ? "bg-[#10B981] border-emerald-600 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">🍵</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">Matcha & Friends</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Vibrant botanical zones</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets([]);
                        setSelectedVibeFilter("candlelit"); // Cozy first date spots
                        setActiveCohort("firstdate");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "firstdate"
                          ? "bg-amber-400 border-amber-500 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">🥂</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">First Date</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Cozy café & chat spots</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets(["$$", "$$$"]);
                        setSelectedVibeFilter("dimlylit"); // Intimate couple dates
                        setActiveCohort("coupledate");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "coupledate"
                          ? "bg-violet-400 border-violet-500 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">🕯️</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">Couple Date</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Intimate warm candlelight</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedBudgets([]);
                        setSelectedVibeFilter("sagegreen"); // Spacious gardens and parks
                        setActiveCohort("family");
                        setSearchQuery("");
                      }}
                      className={`px-4.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border shadow-xs cursor-pointer active:scale-95 ${
                        activeCohort === "family"
                          ? "bg-teal-400 border-teal-500 text-zinc-950 shadow-md font-extrabold"
                          : "bg-white hover:bg-[#FAF4F0] text-zinc-800 border-[#ECCFB7]/40 hover:border-[#ECCFB7]"
                      }`}
                    >
                      <span className="text-lg">👪</span>
                      <div className="text-left leading-none">
                        <p className="font-extrabold">Family Outing</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-1">Spacious, peaceful lawns</p>
                      </div>
                    </button>
                  </div>

                  {/* Dynamic Alert Banner based on auto-filter choice */}
                  {activeCohort && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 mt-3 rounded-xl bg-white/80 border border-[#FFE2D1] text-[11px] text-zinc-700 flex items-center justify-between"
                    >
                      <div>
                        {activeCohort === "student" && "🎒 Curators loaded: Quiet, affordable study spots (under $$) styled with study-friendly layouts!"}
                        {activeCohort === "youth" && "🎵 Curators loaded: Creative mid-century spots featuring vinyl listening decks & dim-lit lounges!"}
                        {activeCohort === "group" && "🌿 Curators loaded: Cozy glass green-houses & botanical tea zones perfect for matcha runs with friends!"}
                        {activeCohort === "firstdate" && "🥂 Curators loaded: Friendly, cozy café niches and beautiful open spaces perfect for delightful first date conversations!"}
                        {activeCohort === "coupledate" && "🕯️ Curators loaded: Intimate, dimly-lit spots featuring cozy private booths and candlelight perfect for a date!"}
                        {activeCohort === "family" && "👪 Curators loaded: Beautiful, spacious public parks and botanical greenhouses designed for family tranquility!"}
                      </div>
                      <button
                        onClick={() => {
                          setActiveCohort(null);
                          setSelectedVibeFilter("");
                          setSelectedBudgets([]);
                        }}
                        className="text-[10px] font-bold text-red-500 hover:underline pl-2 uppercase shrink-0"
                      >
                        Reset
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

            </div>

            {/* Curated Vibe Bubbles Filter Line */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  Filter by Curated Vibe Presets:
                </h3>
                {selectedVibeFilter && (
                  <button
                    onClick={() => setSelectedVibeFilter("")}
                    className="text-[10px] font-semibold text-amber-600 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                {VIBE_BUBBLES.map((bubble) => {
                  const isActive = selectedVibeFilter === bubble.tag;
                  return (
                    <button
                      key={bubble.tag}
                      onClick={() => setSelectedVibeFilter(isActive ? "" : bubble.tag)}
                      className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 border ${
                        isActive
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                      }`}
                      id={`vibe-bubble-${bubble.tag}`}
                    >
                      {bubble.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Search & Satellite Map Engine */}
            <div className="mb-10 p-8 bg-white border-2 border-zinc-900/10 rounded-[36px] shadow-[0_15px_45px_rgba(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                    🌐 LIVE GOOGLE MAPS & AI RADAR
                  </h3>
                  <p className="text-xs text-zinc-550 mt-1.5 font-medium">
                    Scan for any active urban theme (e.g. matcha, beach volleyball, pickleball, vinyl basement) matching real-time coordinates.
                  </p>
                </div>
                {/* Active settings indicators */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold bg-[#FAF8F5] text-amber-900 p-2.5 rounded-2xl border border-zinc-200/80 shrink-0 shadow-3xs">
                  <span className="uppercase">Target: {exploreFocus === "hype" ? "🔥 Trending" : exploreFocus === "small-business" ? "🌱 Indie Gems" : exploreFocus === "treat-yourself" ? "✨ Splurge" : "🏸 Sports"}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="uppercase">Social Mode: {activeCompanions === "solo" ? "🚶 Solo" : activeCompanions === "besties" ? "👯 Besties" : activeCompanions === "romantic" ? "👩‍❤️‍👨 Date" : "👥 Meetings"}</span>
                </div>
              </div>

              {/* Main Interactive Input Bar */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch relative">
                <div className="flex-1 relative">
                  <div className="relative h-full">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Enter search theme... e.g. sand volleyball and tea, cozy study corner, beach pickleball..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                      className="w-full pl-12 pr-5 py-4 text-xs rounded-2xl bg-[#FCFBF9] border-2 border-zinc-200/60 text-zinc-800 placeholder-zinc-400/80 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all shadow-3xs"
                      id="spot-search-input"
                    />
                  </div>

                  {/* Autocomplete popup */}
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 top-full mt-3 bg-white border-2 border-zinc-250/70 shadow-2xl rounded-3xl p-5 z-40 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                        <p className="text-[10px] font-mono font-black text-amber-700 uppercase tracking-widest">
                          ⚡ Curation Query Suggestion Engine
                        </p>
                        <span className="text-[9px] text-zinc-400 font-mono font-bold">Auto-Engine active</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { label: "🍵 Pure Matcha & Boba", query: "matcha" },
                          { label: "☕ Creamy Espressos & Desks", query: "coffee" },
                          { label: "🥐 Hot Sourdough & Scones", query: "pastry" },
                          { label: "🍜 Cozy Noodle Rooms", query: "ramen" },
                          { label: "🌿 Peaceful Glass Atriums", query: "glasshouse" },
                          { label: "🧸 Scenic Gardens & Lawns", query: "park" },
                          { label: "🏸 Court Pickleball & Tea", query: "pickleball" },
                          { label: "🏐 Volleyball & Matcha", query: "volleyball" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => {
                              setSearchQuery(item.query);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs hover:bg-[#FAF8F5] text-zinc-700 hover:text-zinc-950 transition-colors border-2 border-transparent hover:border-zinc-200/40 cursor-pointer"
                          >
                            <span className="font-extrabold">{item.label}</span>
                            <span className="text-[9px] text-amber-700 bg-amber-100 font-bold font-mono px-2 py-0.5 rounded-md uppercase">apply</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sub-Tag selector */}
                <div className="w-full lg:w-56 relative shrink-0">
                  <select
                    value={selectedVibeFilter}
                    onChange={(e) => setSelectedVibeFilter(e.target.value)}
                    className="w-full px-4.5 py-4 text-xs rounded-2xl bg-[#FCFBF9] border-2 border-zinc-200/60 text-zinc-800 font-extrabold focus:outline-none focus:ring-2 focus:ring-zinc-900 appearance-none cursor-pointer h-full shadow-3xs"
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2318181b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "14px" }}
                    id="vibe-select-filter"
                  >
                    <option value="">All Ambience Tags</option>
                    <option value="plantparadise">🌿 Plant Paradise</option>
                    <option value="vinylonly">🎧 Vinyl Record Playback</option>
                    <option value="brutalistmono">📐 Brutalist Concrete</option>
                    <option value="candlelit">🕯️ Amber Candlelit</option>
                    <option value="neutraltones">🤍 Neutral Palettes</option>
                    <option value="wabisabi">🏺 Wabi Sabi</option>
                    <option value="warmgoldenhour">☀️ Warm Golden Sun</option>
                    <option value="minimalist">💻 Mindful Study Work</option>
                  </select>
                </div>

                {/* Trigger Dynamic Google Maps Search Button */}
                <button
                  type="button"
                  onClick={() => handleGoogleMapsSearch()}
                  disabled={isGoogleMapsSearching || !searchQuery.trim()}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-150 disabled:border-zinc-200 disabled:text-zinc-400 text-zinc-950 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md active:scale-95 hover:shadow-lg"
                >
                  {isGoogleMapsSearching ? (
                    <>
                      <span className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Scanning Maps...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4.5 w-4.5 text-zinc-950 animate-pulse" />
                      <span>Query Google Maps AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status information and alert updates */}
              {isGoogleMapsSearching && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-850 flex items-center gap-2.5 animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-550 bg-indigo-505"></span>
                  </span>
                  <span className="font-medium">
                    🛰️ Synchronizing live telemetry over <strong>{selectedCity}</strong>... AI is parsing venue menus, hourly schedules, acoustics, and coordinates matching: <em>"{searchQuery}"</em>.
                  </span>
                </div>
              )}

              {googleMapsSearchSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-150 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <span>✨</span>
                  <span>{googleMapsSearchSuccess}</span>
                </div>
              )}

              {googleMapsSearchError && (
                <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-2xl text-xs text-rose-850 flex items-center gap-2 font-medium">
                  <span>⚠️</span>
                  <span>{googleMapsSearchError}</span>
                </div>
              )}

              {/* Clickable suggestion badges row underneath */}
              <div className="flex flex-wrap items-center gap-1.5 px-0.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mr-1">Hot Search:</span>
                {[
                  { label: "Ceremonial Matcha 🍵", q: "matcha" },
                  { label: "River Volleyball 🏐", q: "volleyball" },
                  { label: "Pickleball Grass Courts 🏸", q: "pickleball" },
                  { label: "Aesthetic Espresso ☕", q: "coffee" },
                  { label: "Fresh Sourdough Scones 🥐", q: "pastry" },
                  { label: "Vinyl Listening 🎵", q: "vinyl" }
                ].map((chip) => (
                  <button
                    key={chip.q}
                    onClick={() => {
                      setSearchQuery(chip.q);
                      handleGoogleMapsSearch(chip.q);
                    }}
                    className={`text-[10.5px] font-medium px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      searchQuery === chip.q
                        ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                        : "bg-zinc-100 border-zinc-200 text-zinc-650 hover:bg-zinc-200"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      // Restore default established catalog representation
                      fetch("/api/spots/catalog")
                        .then(r => r.json())
                        .then(d => {
                          if (d.spots) {
                            setSpots(d.spots);
                            setSelectedSpotId(d.spots[0].id);
                          }
                        });
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:underline pl-1.5 uppercase tracking-wide cursor-pointer"
                  >
                    Reset Grid
                  </button>
                )}
              </div>
            </div>

            {/* ✨ SUGGESTED SPOTS ENGINE: Curated Spot Suggesion with Google & Yelp Reviews & Highlights */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#FFFDFB] to-[#FFF5EE] border border-[#ECCFB7]/60 rounded-[32px] text-zinc-900 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE8DC]/50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#ECCFB7]/35 pb-4">
                  <div>
                    <span className="text-[10px] bg-[#8C3E14]/10 text-[#8C3E14] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#8C3E14]/20 inline-flex items-center gap-1">
                      ✨ Spot Curator Engine
                    </span>
                    <h3 className="text-lg font-black mt-2 text-zinc-900 tracking-tight font-display flex items-center gap-2">
                      hago Spot Spotlight: Reviews & Story Previews 🌸
                    </h3>
                    <p className="text-xs text-zinc-650 mt-1 leading-relaxed">
                      Gom Google Maps, Yelp reviews và story xem trước quán cực tiện. Cho phép cross-text và chốt kèo với bạn bè trên Instagram!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Curation Online</span>
                  </div>
                </div>

                {/* Grid list of dynamic suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                  {spots.slice(0, 3).map((spot) => (
                    <div
                      key={spot.id}
                      className="bg-white border border-[#ECCFB7]/45 rounded-2xl p-4.5 flex flex-col justify-between hover:shadow-md hover:border-[#ECCFB7]/80 transition-all group duration-300 relative"
                    >
                      <div>
                        {/* Spot Category Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-zinc-50 text-zinc-500 px-2 py-0.5 rounded border border-zinc-100">
                            {spot.category}
                          </span>
                          <span className="text-[10px] font-bold text-amber-805">
                            {spot.rating}
                          </span>
                        </div>

                        {/* Beautiful Spot Thumbnail Cover */}
                        <div className="relative h-28 w-full overflow-hidden rounded-xl mb-3 border border-zinc-150 shadow-3xs bg-zinc-100">
                          <img
                            src={spot.image}
                            alt={spot.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                          <span className="absolute bottom-2 left-2 bg-black/55 text-white font-mono text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold backdrop-blur-xs">
                            {spot.city || "San Francisco"}
                          </span>
                        </div>

                        {/* Name and Location */}
                        <h4 className="text-sm font-black text-zinc-900 group-hover:text-[#8C3E14] transition-colors leading-snug">
                          {spot.name}
                        </h4>
                        <p className="text-[10.5px] text-zinc-400 mt-0.5 mb-3 flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 shrink-0 text-zinc-350" />
                          <span className="truncate">{spot.location}</span>
                        </p>

                        {/* Google Stars & Yelp Row */}
                        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#FFF0E8]/40 border border-[#ECCFB7]/25 rounded-xl text-center mb-3 text-[10px]">
                          <div>
                            <span className="text-[7.5px] font-black uppercase text-zinc-400 font-mono tracking-wider">Google Maps</span>
                            <div className="flex items-center justify-center gap-0.5 mt-0.5 font-extrabold text-amber-700">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span>{spot.googleRating || "4.8"} ⭐️</span>
                            </div>
                          </div>
                          <div className="border-l border-zinc-200/60">
                            <span className="text-[7.5px] font-black uppercase text-zinc-400 font-mono tracking-wider">Yelp Score</span>
                            <div className="flex items-center justify-center gap-0.5 mt-0.5 font-extrabold text-rose-600">
                              <UtensilsCrossed className="h-2.5 w-2.5 text-rose-500 shrink-0" />
                              <span>{spot.yelpRating || "4.7"}/5</span>
                            </div>
                          </div>
                        </div>

                        {/* Highlight Section (Thứ nổi bật) */}
                        <div className="space-y-1 bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-150/75 text-[11px] mb-3 leading-snug text-zinc-600">
                          <div className="text-[8.5px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span>🪴 Standout Highlights</span>
                          </div>
                          <p className="text-zinc-700 font-medium line-clamp-2">
                            {spot.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-dashed border-zinc-200">
                            <span className="text-[9px] bg-white border border-zinc-200 rounded px-1 text-zinc-500">✨ {spot.lighting}</span>
                            <span className="text-[9px] bg-white border border-zinc-200 rounded px-1 text-zinc-500">🔊 {spot.noise}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Footer buttons */}
                      <div className="space-y-2 pt-2 border-t border-zinc-100">
                        {/* Live Story Preview */}
                        <button
                          type="button"
                          onClick={() => handleOpenStories(spot)}
                          className="w-full py-1.5 px-2 bg-pink-50 hover:bg-pink-100/80 text-pink-700 border border-pink-200/50 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-3xs"
                        >
                          <Instagram className="h-3 w-3 text-pink-500 shrink-0 animate-pulse" />
                          <span>📸 Preview Live Story</span>
                        </button>

                        <div className="flex gap-1.5">
                          {/* Plan Outing button */}
                          <button
                            type="button"
                            onClick={() => {
                              setHangoutDraftSpotId(spot.id);
                              setIsCreatingHangout(true);
                            }}
                            className="flex-1 py-1 px-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[9.5px] font-bold flex items-center justify-center gap-0.5 transition-all"
                          >
                            <Calendar className="h-2.5 w-2.5" />
                            <span>Plan Outing</span>
                          </button>

                          {/* Quick Link Business */}
                          <a
                            href={`https://instagram.com/${spot.instagramHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1 px-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-lg text-[9.5px] font-medium flex items-center justify-center gap-0.5 transition-all"
                          >
                            <span>Visit IG →</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-[#ECCFB7]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>
                    💡 Click "Preview Live Story" to instantly open simulated Instagram Stories of the venue layout & drinks!
                  </span>
                  <span className="text-[#8C3E14] font-bold">
                    Connected with Instagram handle & Google Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Grid: Your Vibe Profile & City Trend Guidance */}
            <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Bento 1: Vibe Settings Identity Profile */}
              <div className="bg-white border-2 border-zinc-900/10 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-zinc-900/20 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black shadow-xs">🎯</div>
                    <div>
                      <h4 className="text-xs font-mono font-black text-zinc-950 uppercase tracking-wider font-display">Your Custom Vibe Profile</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Fine-tune the recommendation stream around your spatial and mood goals</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Focus Options (hype, small, treat, sports) */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest block font-extrabold">Aesthetic Focus:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "small-business", label: "🌱 Indie Gems / Local", tooltip: "Support creative independent micro-spaces" },
                          { id: "hype", label: "🔥 Trending / Hype", tooltip: "Highly cataloged, buzzing local hotspots" },
                          { id: "treat-yourself", label: "✨ High-Design Splurge", tooltip: "Indulge in award-winning architecture and luxury plates" },
                          { id: "hangout", label: "🏸 Active Court & Hangout", tooltip: "Outdoor volleyball courts, pickleball arenas, and gardens" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setExploreFocus(item.id as any);
                              if (connectedProfile) {
                                setConnectedProfile({
                                  ...connectedProfile,
                                  bio: `${connectedProfile.bio.split(" • ")[0]} • Preferred ${item.label.split(" / ")[0]}`
                                });
                              }
                            }}
                            className={`px-3 py-2 text-left text-xs rounded-xl font-bold border-2 cursor-pointer transition-all ${
                              exploreFocus === item.id
                                ? "bg-amber-500/10 text-amber-950 border-amber-500 font-black"
                                : "bg-zinc-50/50 border-zinc-200/60 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            }`}
                            title={item.tooltip}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Companion Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono font-black text-[#71717A] uppercase tracking-widest block font-extrabold">Outing companions:</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "solo", label: "Solo Run", emoji: "🚶" },
                          { id: "besties", label: "Besties", emoji: "👯" },
                          { id: "romantic", label: "Dating", emoji: "👩‍❤️‍👨" },
                          { id: "crew", label: "Meetings", emoji: "💼" }
                        ].map((comp) => (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => setActiveCompanions(comp.id as any)}
                            className={`px-1.5 py-2 text-center rounded-xl text-[9px] font-bold border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                              activeCompanions === comp.id
                                ? "bg-[#8C3E14] text-white border-[#8C3E14] font-black shadow-sm"
                                : "bg-white border-zinc-200/60 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                            }`}
                          >
                            <span className="text-sm">{comp.emoji}</span>
                            <span>{comp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono font-semibold">
                  <span>ACTIVE PARAMS: <span className="font-extrabold text-zinc-800">{exploreFocus.toUpperCase()} • {activeCompanions.toUpperCase()}</span></span>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">● Live Sync Active</span>
                </div>
              </div>

              {/* Bento 2: Trending Radar */}
              <div className="bg-white border-2 border-zinc-900/10 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-zinc-900/20 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs animate-pulse font-bold shadow-xs">⚡</div>
                      <div>
                        <h4 className="text-xs font-mono font-black text-zinc-950 uppercase tracking-wider font-display">City Trend Monitor & Radar ({selectedCity === "All Cities" ? "Global" : selectedCity})</h4>
                        <p className="text-[10px] text-zinc-400 font-medium">Current high-intensity urban lifestyle trends</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-red-100 text-red-800 border-2 border-red-200 font-black px-2 py-0.5 rounded-md font-mono uppercase tracking-wider shrink-0">TRENDING</span>
                  </div>

                  <div className="mt-5 space-y-2 max-h-[155px] overflow-y-auto pr-1">
                    {isTrendsLoading ? (
                      <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wider font-semibold">Tuning Live Yelp & Google APIs...</span>
                      </div>
                    ) : (
                      (cityRadarTrends.length > 0 ? cityRadarTrends : (CITY_TRENDS[selectedCity] || CITY_TRENDS["Default"])).map((trend, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(trend.query);
                            if (trend.type === "small") setExploreFocus("small-business");
                            else if (trend.type === "hype") setExploreFocus("hype");
                            else if (trend.type === "treat") setExploreFocus("treat-yourself");
                            else if (trend.type === "hangout") setExploreFocus("hangout");
                            
                            handleGoogleMapsSearch(trend.query);
                          }}
                          className="w-full p-2.5 bg-gradient-to-r from-[#FAF9F6]/50 to-white hover:from-amber-500/5 hover:to-amber-500/10 border border-zinc-200 hover:border-amber-200 rounded-xl text-left flex items-start gap-3 transition-all group cursor-pointer"
                        >
                          <div className="text-base h-9 w-9 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0 self-center group-hover:bg-amber-100/80 transition-all select-none">
                            {trend.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-black text-zinc-900 flex items-center gap-2">
                              <span>{trend.title}</span>
                              <span className="text-[8px] bg-zinc-105 text-zinc-500 px-1.5 py-0.5 rounded font-black tracking-widest scale-95 border border-zinc-200 shrink-0 uppercase">
                                {trend.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-snug">{trend.desc}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="text-[9.5px] text-zinc-400 pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between font-medium font-semibold">
                  <span>Tap any trend card to instantly configure AI map radar 🧭</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">hago Engine</span>
                </div>
              </div>

            </div>

             {/* Curation Navigation Bar: Active Cities, Price, and Currency Toggles */}
            <div className="mb-10 bg-white border-2 border-zinc-900/10 rounded-[36px] p-8 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.025)]">
              
              {/* COMPASS MODE: Local, Visitor & Work Selectors (High Craftsmanship) */}
              <div className="border border-zinc-200 bg-[#FCFBF8] rounded-2xl p-5">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-black tracking-widest uppercase bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full">
                        Curated Perspective
                      </span>
                      <span className="text-[9px] font-mono font-black tracking-widest uppercase bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-full animate-pulse shadow-xs">
                        Vibe Shifter
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-zinc-900 mt-2 flex items-center gap-2">
                      {explorerMode === "local" && "🏡 Local Hideouts & Cozy Niches"}
                      {explorerMode === "visitor" && "🧭 Visitor Adventures & Famous Landmarks"}
                      {explorerMode === "work" && "💼 Professional Workrooms & Quiet Lounges"}
                    </h3>
                  </div>

                  {/* Segmented control toggle with motion */}
                  <div className="relative flex p-1.5 bg-zinc-150 rounded-2xl w-full xl:w-auto overflow-hidden self-stretch xl:self-auto border border-zinc-200">
                    <button
                      onClick={() => setExplorerMode("local")}
                      className={`relative z-10 flex-1 px-5 py-2.5 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 leading-none ${
                        explorerMode === "local" ? "text-zinc-950" : "text-zinc-550 hover:text-zinc-800"
                      }`}
                    >
                      <span>🏡 Local</span>
                    </button>
                    <button
                      onClick={() => setExplorerMode("visitor")}
                      className={`relative z-10 flex-1 px-5 py-2.5 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 leading-none ${
                        explorerMode === "visitor" ? "text-zinc-950" : "text-zinc-550 hover:text-zinc-800"
                      }`}
                    >
                      <span>🧭 Visitor</span>
                    </button>
                    <button
                      onClick={() => setExplorerMode("work")}
                      className={`relative z-10 flex-1 px-5 py-2.5 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 leading-none ${
                        explorerMode === "work" ? "text-zinc-950" : "text-zinc-550 hover:text-zinc-800"
                      }`}
                    >
                      <span>💼 Work</span>
                    </button>

                    {/* Sliding background indicator */}
                    <div
                      className="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-xl shadow-md transition-transform duration-300 ease-out border border-zinc-200/50"
                      style={{
                        width: "calc(33.333% - 4px)",
                        transform: 
                          explorerMode === "local" 
                            ? "translateX(0%)" 
                            : explorerMode === "visitor" 
                            ? "translateX(100%)" 
                            : "translateX(200%)",
                      }}
                    />
                  </div>
                </div>

                {/* Poetic description according to active mode - shortened & concise */}
                <div className="mt-4 border-t border-zinc-200 pt-4 flex items-start gap-2 text-xs text-zinc-650">
                  <div className="mt-0.5 text-amber-500 animate-spin">✦</div>
                  <div className="flex flex-col gap-1 leading-relaxed">
                    {explorerMode === "local" ? (
                      <>
                        <p className="font-extrabold text-zinc-800 text-[13px] tracking-tight">
                          “Find peaceful micro-spaces hidden in secret neighborhood shortcuts.”
                        </p>
                        <p className="italic text-zinc-550 text-[11px] font-serif">
                          “Curating intimate communities, personal pacing, and absolute simplicity.”
                        </p>
                      </>
                    ) : explorerMode === "visitor" ? (
                      <>
                        <p className="font-extrabold text-zinc-800 text-[13px] tracking-tight">
                          “Aesthetic landmarks, breathtaking view decks, and premium architecture.”
                        </p>
                        <p className="italic text-zinc-550 text-[11px] font-serif">
                          “Perfect for exploring visual wonderlands, taking photos, and high-design culture.”
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-extrabold text-zinc-800 text-[13px] tracking-tight">
                          “High-bandwidth study tables, laptop-friendly plugs, and acoustic focus.”
                        </p>
                        <p className="italic text-zinc-550 text-[11px] font-serif">
                          “Engineered for quiet flow state, executive chats, and single-origin filter roasts.”
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* City Row Pivot */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                    <span className="text-[10px] font-mono font-black tracking-wider uppercase text-zinc-400">Pivoting Curated Cities</span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">19 World Hubs connected</span>
                </div>

                {/* Grid wrap with modern styled item buttons */}
                <div className="flex flex-wrap gap-2 max-h-[190px] overflow-y-auto pr-1">
                  {[
                    { name: "All Cities", emoji: "🌏" },
                    { name: "Ho Chi Minh City", emoji: "🇻🇳" },
                    { name: "Hanoi", emoji: "🇻🇳" },
                    { name: "Bangkok", emoji: "🇹🇭" },
                    { name: "Singapore", emoji: "🇸🇬" },
                    { name: "Tokyo", emoji: "🇯🇵" },
                    { name: "Seoul", emoji: "🇰🇷" },
                    { name: "London", emoji: "🇬🇧" },
                    { name: "Paris", emoji: "🇫🇷" },
                    { name: "San Francisco", emoji: "🇺🇸" },
                    { name: "Seattle", emoji: "🇺🇸" },
                    { name: "New York", emoji: "🇺🇸" },
                    { name: "Chicago", emoji: "🇺🇸" },
                    { name: "Atlanta", emoji: "🇺🇸" },
                    { name: "Washington D.C.", emoji: "🇺🇸" },
                    { name: "Boston", emoji: "🇺🇸" },
                    { name: "Houston", emoji: "🇺🇸" },
                    { name: "Austin", emoji: "🇺🇸" },
                    { name: "Tampa", emoji: "🇺🇸" },
                    { name: "Orlando", emoji: "🇺🇸" }
                  ].map((cityObj) => (
                    <button
                      key={cityObj.name}
                      onClick={() => {
                        setSelectedCity(cityObj.name);
                        setSelectedSpotId(undefined); // Reset active marker
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border-2 transition-all cursor-pointer flex items-center gap-2 ${
                        selectedCity === cityObj.name
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-md font-extrabold"
                          : "bg-white border-zinc-200/60 text-zinc-700 hover:border-zinc-300 hover:bg-[#FCFBF8]"
                      }`}
                    >
                      <span className="text-sm shrink-0">{cityObj.emoji}</span>
                      <span>{cityObj.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget and Currency Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-100 pt-4 animate-[fadeIn_0.2s_ease]">
                
                {/* Hotel-style Price Ranges (Multi-toggle) */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-500">Tier Budget Filter:</span>
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
                    {["$", "$$", "$$$", "$$$$"].map((tier) => {
                      const isSelected = selectedBudgets.includes(tier);
                      const labels: Record<string, string> = {
                        "$": "Budget ($)",
                        "$$": "Moderate ($$)",
                        "$$$": "Upscale ($$$)",
                        "$$$$": "Ultra-vibe ($$$$)"
                      };
                      return (
                        <button
                          key={tier}
                          onClick={() => {
                            setSelectedBudgets((prev) =>
                              prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
                            );
                          }}
                          className={`px-3 py-1 text-[11px] font-bold font-mono rounded-md transition-all uppercase cursor-pointer ${
                            isSelected
                              ? "bg-white text-amber-600 shadow-sm border border-zinc-200"
                              : "text-zinc-500 hover:text-zinc-800"
                          }`}
                          title={`Toggle ${labels[tier]}`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                  {selectedBudgets.length > 0 && (
                    <button
                      onClick={() => setSelectedBudgets([])}
                      className="text-[10px] font-semibold text-neutral-400 hover:text-rose-500 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Hotel-style Currency Converter Dropdown */}
                <div className="flex items-center md:justify-end gap-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                    <Coins className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Display Currency:</span>
                  </div>
                  <select
                    value={activeCurrency}
                    onChange={(e) => setActiveCurrency(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                  >
                    {Object.keys(CURRENCY_CONVERSIONS).map((cur) => (
                      <option key={cur} value={cur}>
                        {CURRENCY_CONVERSIONS[cur].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* View Mode Switching Tabs (Grid vs GPS Simulator Mode to block Doomscrolling) */}
            <div className="mb-6 flex justify-between items-center border-b border-[#F0F0F0] pb-3">
              <div className="flex gap-4">
                <button
                  onClick={() => setDisplayMode("grid")}
                  className={`pb-1.5 text-sm font-semibold tracking-tight transition-all relative cursor-pointer ${
                    displayMode === "grid" ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <span>Curation Card Grid</span>
                  {displayMode === "grid" && (
                    <motion.div layoutId="activeline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
                <button
                  onClick={() => setDisplayMode("gps")}
                  className={`pb-1.5 text-sm font-semibold tracking-tight transition-all relative flex items-center gap-1.5 cursor-pointer ${
                    displayMode === "gps" ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Map className="h-3.5 w-3.5 text-amber-500" />
                  <span>Interactive Map GPS</span>
                  {displayMode === "gps" && (
                    <motion.div layoutId="activeline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
              </div>

              {displayMode === "gps" ? (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/50 rounded px-2.5 py-0.5 font-mono">
                  Google Maps SDK Active
                </span>
              ) : (
                <span className="text-[10px] text-zinc-400 font-mono">
                  Visual Grid Layout
                </span>
              )}
            </div>

            {/* Catalog Grid Section with Stories Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Main Directory Catalog list (2 cols) */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 font-display">
                    {displayMode === "gps" ? "GPS Map Discovery" : `${filteredSpots.length} Curated Spots Matching Your Aura`}
                  </h3>
                  <div className="text-[11px] font-semibold text-zinc-500">
                    {selectedCity === "All Cities" ? "Nationwide Curations (Seattle, NYC, SF)" : `Showing node spaces in ${selectedCity}`}
                  </div>
                </div>

                {displayMode === "gps" ? (
                  <InteractiveMap
                    spots={spots}
                    selectedCity={selectedCity}
                    onSelectSpot={(spot) => setSelectedSpotId(spot.id)}
                    selectedSpotId={selectedSpotId}
                    currencySymbol={CURRENCY_CONVERSIONS[activeCurrency].symbol}
                    exchangeRate={CURRENCY_CONVERSIONS[activeCurrency].rate}
                  />
                ) : (
                  <>
                    {filteredSpots.length === 0 ? (
                      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-zinc-200">
                        <Sliders className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                        <p className="text-zinc-600 font-semibold mb-1 text-sm">No curated spaces fit that particular filter combination.</p>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto">Try toggling different budget ranges, switching cities, or matching with of the vibe keywords!</p>
                        <button
                          onClick={() => { setSearchQuery(""); setSelectedVibeFilter(""); setSelectedBudgets([]); setSelectedCity("All Cities"); }}
                          className="mt-4 rounded-full bg-zinc-900 text-white text-xs font-semibold px-4 py-2 cursor-pointer"
                        >
                          Reset Filters & Nodes
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease]">
                        {filteredSpots.map((spot) => (
                          <div key={spot.id} className="relative cursor-pointer" onClick={() => handleOpenStories(spot)}>
                            <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none bg-zinc-950/80 text-white text-[9px] uppercase tracking-widest font-mono rounded-full px-2 py-0.5 ml-2 mt-2 flex items-center gap-1 select-none">
                              <Radio className="h-2.5 w-2.5 animate-pulse text-amber-400" />
                              <span>Tap Stories</span>
                            </div>
                            <SpotCard
                              spot={spot}
                              isSaved={savedSpotIds.includes(spot.id)}
                              onToggleSave={handleToggleSave}
                              coVibers={MOCK_CO_VIBERS.filter((v) => v.favoriteSpotId === spot.id)}
                              onOpenChat={(v) => {
                                setActiveChatViber(v);
                                const welcome = `Hey there! I saw you viewing @${spot.instagramHandle}. It has such a cozy aesthetic, doesn't it? Let's connect on Instagram or make a hangout plan together! 🌿☕`;
                                if (!chatSessions[v.id]) {
                                  setChatSessions((prev) => ({
                                    ...prev,
                                    [v.id]: {
                                      vibeId: v.id,
                                      messages: [{
                                        id: "welcome",
                                        sender: "them",
                                        text: welcome,
                                        timestamp: "Just Now"
                                      }]
                                    }
                                  }));
                                }
                              }}
                              onTagClick={(tag) => setSelectedVibeFilter(tag)}
                              activeTags={selectedVibeFilter ? [selectedVibeFilter] : []}
                              activeCurrency={activeCurrency}
                              currencySymbol={CURRENCY_CONVERSIONS[activeCurrency].symbol}
                              exchangeRate={CURRENCY_CONVERSIONS[activeCurrency].rate}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar Active Vibe Interactions (1 col) */}
              <div className="space-y-6">
                
                {/* Visual Delight Sidebar Container for Instagram Feed */}
                <div className="rounded-[28px] bg-white border border-[#EBEBEB] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold tracking-tight text-zinc-950 font-display">
                        Your Instax Photo Grid
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400">CONNECT INSTAGRAM TO SYNC</p>
                    </div>
                    {connectedProfile ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-mono text-emerald-700 uppercase tracking-widest font-semibold border border-emerald-100">
                        {connectedProfile.aesthetic}
                      </span>
                    ) : (
                      <span className="text-[10px] text-pink-500 font-bold font-mono">OFFLINE</span>
                    )}
                  </div>

                  {connectedProfile ? (
                    <div>
                      <div className="flex items-center gap-3 mb-4 p-2 bg-zinc-50 rounded-xl">
                        <img
                          src={connectedProfile.profilePic}
                          alt="Instagram Profile"
                          className="h-10 w-10.5 rounded-full object-cover border-2 border-zinc-200"
                        />
                        <div className="leading-tight min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">@{connectedProfile.instagramHandle}</p>
                          <p className="text-[10/11px] text-zinc-500 leading-none truncate">{connectedProfile.fullName}</p>
                        </div>
                        <button
                          onClick={() => setConnectedProfile(null)}
                          className="ml-auto text-zinc-400 hover:text-zinc-600 p-1"
                          title="Disconnect"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Mock connected Grid Presets */}
                      {connectedProfile.aesthetic && AESTHETIC_GRID_PRESETS[connectedProfile.aesthetic] ? (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            {AESTHETIC_GRID_PRESETS[connectedProfile.aesthetic].map((img, i) => (
                              <div key={i} className="aspect-square rounded-lg overflow-hidden border border-zinc-100 relative group cursor-pointer">
                                <img
                                  src={img}
                                  alt="Instax grid photo"
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Heart className="h-4 w-4 text-white fill-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3.5 text-center">
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Auto-curated to match your <strong className="text-zinc-700">{connectedProfile.aesthetic}</strong> aura
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="border border-dashed border-zinc-300 rounded-2xl p-4 text-center bg-zinc-50/50">
                          <p className="text-xs font-bold text-zinc-700">No Vibe Swatch custom-selected yet</p>
                          <p className="text-[10.5px] text-zinc-400 mt-1 leading-normal">
                            You chose to pick later. Your grid is kept warm and neutral. Pick an aura anytime to unlock custom layouts.
                          </p>
                          <div className="grid grid-cols-3 gap-1.5 my-3">
                            {[1, 2, 3].map((num) => (
                              <div key={num} className="aspect-square rounded-xl bg-zinc-100/70 border border-zinc-200/50 flex items-center justify-center text-zinc-300 font-mono text-[10px]">
                                ☕
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab("covibers");
                              setTimeout(() => {
                                const element = document.getElementById("aesthetic-theme-btn-Sage-Green");
                                if (element) element.scrollIntoView({ behavior: "smooth" });
                              }, 150);
                            }}
                            className="text-[10.5px] font-black tracking-wide text-amber-900 bg-amber-100 hover:bg-amber-200 transition-all px-3 py-1.5 rounded-xl border border-amber-200 cursor-pointer inline-flex items-center gap-1 active:scale-95 shadow-2xs"
                          >
                            <span>Pick My Swatch Now 🎨</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-3">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-900 mb-1">Mirror your Instagram feed palette</p>
                      <p className="text-[11px] text-zinc-400 mx-auto max-w-[220px] mb-4">
                        Connect simulated handle to unlock dynamic color-matching and find matching co-vibes!
                      </p>
                      <form onSubmit={handleInstagramConnect} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. wanderer.jpeg"
                          value={newInstagramHandle}
                          onChange={(e) => setNewInstagramHandle(e.target.value)}
                          className="flex-1 border border-zinc-200 rounded-full px-3 py-1.5 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                          required
                          id="new-handle-input"
                        />
                        <button
                          type="submit"
                          className="bg-zinc-900 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold hover:bg-zinc-800"
                        >
                          Sync
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Hangout Plan Ahead Card Widget */}
                <div className="rounded-[28px] bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-full filter blur-xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="h-9 w-9 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-inner mb-3.5">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    
                    <h4 className="text-sm font-bold tracking-tight text-zinc-950 font-display">
                      Plan Ahead with Friends
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mt-1 mb-4">
                      Choose stunning design card templates, lock in date & times, vote for aesthetic spots, and create downloadable visual invitation files to share instantly on your Instagram group chat!
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setHangoutDraftSpotId(spots[0]?.id || "");
                          setIsCreatingHangout(true);
                        }}
                        className="w-full rounded-2xl bg-zinc-900 text-white text-xs font-semibold py-2.5 transition-colors hover:bg-zinc-800 flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Craft New Hangout Card</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("planner")}
                        className="w-full rounded-2xl bg-white border border-zinc-200 text-zinc-700 text-xs font-medium py-2 transition-colors hover:bg-zinc-50"
                      >
                        Show Itinerary Boards ({hangoutPlans.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aesthetic Visualizer Map Segment Graphic */}
                <div className="rounded-[28px] bg-white border border-[#EBEBEB] p-5 shadow-sm">
                  <h4 className="text-xs font-bold tracking-tight text-zinc-950 mb-3 font-display uppercase tracking-widest font-mono">
                    Active Ambience Heatmap
                  </h4>
                  {/* CSS SVG Map Mockup Graphics to help with UI UX */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-100 bg-[#E8ECE9]">
                    <svg viewBox="0 0 200 120" className="w-full h-full text-zinc-400 select-none">
                      {/* Grid routes */}
                      <path d="M 0,20 Q 80,40 200,30" fill="none" stroke="#D1D5DB" strokeWidth="4" />
                      <path d="M 0,90 Q 110,60 200,100" fill="none" stroke="#D1D5DB" strokeWidth="4" />
                      <path d="M 50,0 Q 40,80 70,120" fill="none" stroke="#D1D5DB" strokeWidth="4" />
                      <path d="M 150,0 Q 140,80 160,120" fill="none" stroke="#D1D5DB" strokeWidth="4" />
                      
                      {/* Ambient Bloom circles */}
                      <circle cx="65" cy="35" r="14" fill="#a7f3d0" fillOpacity="0.45" /> {/* Green */}
                      <circle cx="145" cy="50" r="18" fill="#fef3c7" fillOpacity="0.55" /> {/* Gold */}
                      <circle cx="155" cy="95" r="12" fill="#fed7aa" fillOpacity="0.5" />  {/* Orange */}

                      <circle cx="65" cy="35" r="3" fill="#059669" />
                      <circle cx="145" cy="50" r="3" fill="#d97706" />
                      <circle cx="155" cy="95" r="3" fill="#ea580c" />
                    </svg>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-2.5">
                      <div className="text-[10px] text-white font-mono flex items-center justify-between w-full">
                        <span className="font-semibold">Matcha Cafe density high SOMA</span>
                        <span className="text-amber-300">● Live Vibes</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}


        {/* ACTIVE TAB: HANGOUT PLANNER */}
        {(activeTab === "planner" || (activeTab as any) === "planning") && (
          <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-950 font-display">
                  Your Meetups, Hangouts & Outings
                </h2>
                <p className="text-xs text-zinc-500">
                  Plan ahead with your friend circle, vote on options, and export beautiful custom cards to Google Calendar.
                </p>
              </div>

              <button
                onClick={() => {
                  setHangoutDraftSpotId(spots[0]?.id || "");
                  setIsCreatingHangout(true);
                }}
                className="rounded-full bg-zinc-900 text-white px-5 py-2.5 text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 self-start"
              >
                <Plus className="h-4 w-4" />
                <span>Plan New Outing</span>
              </button>
            </div>

            {/* Google Calendar Active Integration Banner */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-[#FAF9F5] border border-indigo-100 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center border border-indigo-200 text-xl shadow-2xs shrink-0 select-none">
                  📅
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-950 font-display">Google Calendar Live-Sync</span>
                    <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-100/90 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider scale-95 border border-emerald-200">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                      Live Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Authorized integration with <strong className="text-[#3F51B5]">tpanhhhhh04@gmail.com</strong> • AutoSyncing trip bookings and client meetings bilingually.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <button
                  id="master-sync-button"
                  onClick={() => {
                    const icon = document.getElementById("force-sync-spinner-icon");
                    if (icon) {
                      icon.classList.add("animate-spin");
                      setTimeout(() => {
                        icon.classList.remove("animate-spin");
                        alert("Success: All scheduled events, hangout plans and meeting blocks have been immediately synchronized with your Google Calendar (tpanhhhhh04@gmail.com)!");
                      }, 1200);
                    }
                  }}
                  className="text-[11px] font-bold tracking-tight bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-2xl px-3.5 py-2 cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-3xs"
                >
                  <svg id="force-sync-spinner-icon" className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
                  </svg>
                  <span>Sync All (Google Calendar)</span>
                </button>
              </div>
            </div>

            {hangoutPlans.length === 0 ? (
              <div className="text-center py-20 px-4 bg-white rounded-3xl border border-zinc-200">
                <Calendar className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-700 font-semibold mb-1 text-sm">No scheduled hangout plans yet.</p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                  Initiate an outing design cards, customize aesthetic themes representing your crew mood, and plan a perfect weekend study or date loop.
                </p>
                <button
                  onClick={() => setIsCreatingHangout(true)}
                  className="rounded-full bg-zinc-900 text-white text-xs font-semibold px-5 py-2.5"
                >
                  Create Your First Outing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hangoutPlans.map((plan) => {
                  const styleColors = {
                    vintageCream: { bg: "bg-[#FAF7F0] border-[#E8DFD0]", text: "text-amber-900", tag: "bg-[#DFD3C3]/50 text-amber-900", title: "text-amber-950 font-serif" },
                    slateGrey: { bg: "bg-[#F3F4F6] border-[#D1D5DB]", text: "text-slate-800", tag: "bg-[#E5E7EB] text-slate-800", title: "text-slate-950 font-display" },
                    neonObsidian: { bg: "bg-zinc-900 border-zinc-800 text-zinc-100", text: "text-zinc-200", tag: "bg-zinc-800 text-zinc-300", title: "text-white font-mono" },
                    sageMatcha: { bg: "bg-[#F4F9F4] border-[#D2E0D2]", text: "text-emerald-900", tag: "bg-[#E2EDE2] text-emerald-900", title: "text-emerald-950 font-display" }
                  }[plan.vibeStyle];

                  return (
                    <motion.div
                      layout
                      key={plan.id}
                      className={`rounded-[28px] border p-6 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${styleColors.bg}`}
                    >
                      <div>
                        {/* Outing card header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`rounded-full px-3 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold ${styleColors.tag}`}>
                            {plan.vibeStyle === "vintageCream" && "Warm Sepia"}
                            {plan.vibeStyle === "slateGrey" && "Neutral Shutter"}
                            {plan.vibeStyle === "neonObsidian" && "Obsidian Cyber"}
                            {plan.vibeStyle === "sageMatcha" && "Sage Green"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewingInviteCardPlan(plan)}
                              className="p-1 px-2.5 rounded-full bg-white/80 hover:bg-white text-[11px] font-bold text-zinc-700 shadow-sm border border-zinc-200/50 flex items-center gap-1"
                              title="Generate RSVP invitation Graphic image"
                            >
                              <Share2 className="h-3 w-3" />
                              <span>View Invite Card</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteHangout(plan.id, e)}
                              className="p-1.5 rounded-full bg-white/80 hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-zinc-100 hover:border-rose-200 transition-colors"
                              title="Cancel plan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className={`text-lg font-bold tracking-tight mb-2.5 ${styleColors.title}`}>
                          {plan.title}
                        </h3>

                        {/* Connected Spot Segment inside invitation card */}
                        <div className="mb-4 flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/50">
                          <img
                            src={plan.spotImage}
                            alt={plan.spotName}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                          <div className="leading-tight min-w-0">
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">TARGET OUTING SPOT</p>
                            <p className="text-xs font-bold text-zinc-900 truncate">{plan.spotName}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-auto text-zinc-400" />
                        </div>

                        {/* Itinerary timing fields */}
                        <div className="grid grid-cols-2 gap-3 mb-3 text-xs font-medium">
                          <div className="flex items-center gap-2 text-zinc-700 bg-white/45 px-3 py-2 rounded-xl">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{plan.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-700 bg-white/45 px-3 py-2 rounded-xl">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{plan.time}</span>
                          </div>
                        </div>

                        {/* Google Calendar sync CTA */}
                        <a
                          href={getGoogleCalendarUrl(plan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-4 w-full py-2 px-4 rounded-xl bg-[#3F51B5] hover:bg-[#303F9F] text-white flex items-center justify-center gap-2 text-xs font-semibold tracking-wide transition-all shadow-2xs active:scale-[0.98] select-none text-center"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/>
                          </svg>
                          <span>Sync with Google Calendar</span>
                        </a>

                        {plan.notes && (
                          <div className="text-[11px] leading-relaxed text-zinc-650 bg-white/30 p-2.5 rounded-xl border border-white/20 italic mb-3">
                            &ldquo;{plan.notes}&rdquo;
                          </div>
                        )}

                        {/* Interactive Crew Discussion Thread */}
                        <div className="mb-4 bg-white/40 rounded-2xl p-3 border border-white/40">
                          <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>💬 Crew Chat Board</span>
                            <span className="bg-amber-100 text-amber-900 text-[8px] font-bold px-1.5 py-0.2 rounded font-sans shrink-0 scale-90">Live Feed</span>
                          </p>

                          {/* Message List */}
                          <div className="space-y-2 max-h-36 overflow-y-auto mb-2 text-left pr-1 scrollbar-thin">
                            {(crewDiscussions[plan.id] || []).map((msg, idx) => (
                              <div key={idx} className="text-[11px] leading-snug">
                                <span className="font-extrabold text-zinc-900">@{msg.sender}</span>
                                <span className="text-zinc-500 font-mono text-[9px] ml-1.5">{msg.time}</span>
                                <p className="text-zinc-700 font-sans mt-0.5 pl-1.5 border-l border-zinc-200">{msg.text}</p>
                              </div>
                            ))}
                            {(crewDiscussions[plan.id] || []).length === 0 && (
                              <p className="text-[10px] text-zinc-400 italic">No messages posted yet. Start the thread!</p>
                            )}
                          </div>

                          {/* Submit Message Input */}
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newCrewMsgText[plan.id] || ""}
                              onChange={(e) => {
                                setNewCrewMsgText(prev => ({ ...prev, [plan.id]: e.target.value }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const text = newCrewMsgText[plan.id]?.trim();
                                  if (!text) return;
                                  const userHandle = connectedProfile?.instagramHandle || "guest_explorer";
                                  const newMsg = { sender: userHandle, text, time: "Just Now" };
                                  const updatedHistory = [...(crewDiscussions[plan.id] || []), newMsg];
                                  const nextState = { ...crewDiscussions, [plan.id]: updatedHistory };
                                  setCrewDiscussions(nextState);
                                  localStorage.setItem("vibecheck_crew_discussions", JSON.stringify(nextState));
                                  setNewCrewMsgText(prev => ({ ...prev, [plan.id]: "" }));
                                }
                              }}
                              placeholder="Type a message to your crew..."
                              className="w-full text-[10.5px] px-2.5 py-1.5 rounded-xl bg-white/70 border border-zinc-200 focus:outline-none focus:bg-white text-zinc-800"
                            />
                            <button
                              onClick={() => {
                                const text = newCrewMsgText[plan.id]?.trim();
                                if (!text) return;
                                const userHandle = connectedProfile?.instagramHandle || "guest_explorer";
                                const newMsg = { sender: userHandle, text, time: "Just Now" };
                                const updatedHistory = [...(crewDiscussions[plan.id] || []), newMsg];
                                const nextState = { ...crewDiscussions, [plan.id]: updatedHistory };
                                setCrewDiscussions(nextState);
                                localStorage.setItem("vibecheck_crew_discussions", JSON.stringify(nextState));
                                setNewCrewMsgText(prev => ({ ...prev, [plan.id]: "" }));
                              }}
                              className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[10px] rounded-xl px-2.5 cursor-pointer active:scale-95 transition-transform"
                            >
                              Post
                            </button>
                          </div>
                        </div>

                        {/* Inline spontaneous Peer inviter to bind tabs and pages */}
                        <div className="mb-4 pt-2.5 border-t border-dashed border-zinc-200/50 flex flex-col gap-1 text-left">
                          <p className="text-[9.5px] font-bold text-zinc-400 font-mono uppercase tracking-wider">🎯 Spot suggestions & Spontaneous quick invites:</p>
                          <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
                            {MOCK_CO_VIBERS.slice(0, 4).map((viber) => {
                              const alreadyInvited = plan.friends.some((f) => f.instagramHandle === viber.instagramHandle);
                              if (alreadyInvited) return null;
                              return (
                                <button
                                  key={viber.id}
                                  onClick={() => {
                                    const nextFriends = [...plan.friends, { name: viber.fullName, instagramHandle: viber.instagramHandle, avatar: viber.profilePic }];
                                    const nextPlans = hangoutPlans.map((p) => p.id === plan.id ? { ...p, friends: nextFriends } : p);
                                    setHangoutPlans(nextPlans);
                                    localStorage.setItem("vibecheck_hangout_plans", JSON.stringify(nextPlans));
                                  }}
                                  className="text-[9px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg px-2 py-1 shrink-0 transition-all flex items-center gap-1 active:scale-95"
                                  title={`Invite @${viber.instagramHandle} to join outings`}
                                >
                                  <span>+ @{viber.instagramHandle}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Participant friends line */}
                      <div className="pt-4 border-t border-zinc-200/50 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-mono text-zinc-400 uppercase">INVITED GUESTS</p>
                          <div className="mt-1 flex items-center -space-x-1">
                            {plan.friends.map((friend, i) => (
                              <img
                                key={i}
                                src={friend.avatar}
                                alt={friend.name}
                                className="h-6 w-6 rounded-full object-cover border border-white"
                                title={`@${friend.instagramHandle}`}
                              />
                            ))}
                            {plan.friends.length === 0 && (
                              <span className="text-[11px] text-zinc-400 italic">No friends invited yet</span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Votes Component */}
                        <div className="flex items-center gap-2.5">
                          <div className="text-center bg-white/70 px-2.5 py-1 rounded-lg border border-white/80">
                            <p className="text-[8px] font-mono text-zinc-400">RSVP YES</p>
                            <p className="text-xs font-bold text-zinc-800">{plan.friends.length + 1}</p>
                          </div>
                          {/* Vote buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                alert("RSVP vote registered! Your friends have been notified on IG.");
                              }}
                              className="rounded-lg bg-zinc-900 text-white text-[10px] font-bold px-2 py-1.5 active:scale-95 transition-transform"
                            >
                              👍 Vote Spot
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}





        {/* ACTIVE TAB: CO-VIBERS DIRECTORY */}
        {(activeTab === "covibers") && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-950 font-display">
                  San Francisco Meetups & Connections
                </h2>
                <p className="text-xs text-zinc-500">
                  Connect with curated peers (designers, students & creatives), view their aesthetic feeds, and invite them for a shared study hangout.
                </p>
              </div>

              {connectedProfile ? (
                <div className="bg-emerald-50 text-emerald-950 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2.5 max-w-sm self-start">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono">CONNECTED AS: @{connectedProfile.instagramHandle}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const handle = prompt("Enter simulated Instagram handle:");
                    if (handle) {
                      setConnectedProfile({
                        instagramHandle: handle.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
                        fullName: "Curated Peer",
                        bio: "film archives • quiet tea spaces • sf lifestyle design",
                        profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
                        aesthetic: "Warm Sepia",
                        savedSpots: []
                      });
                    }
                  }}
                  className="rounded-full bg-zinc-900 text-white px-5 py-2.5 text-xs font-bold hover:bg-zinc-800 flex items-center justify-center gap-1.5 self-start"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Connect My Instagram</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* CoVibers Feed grid (2 cols) */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {MOCK_CO_VIBERS.map((viber) => {
                  const favoriteSpot = spots.find((s) => s.id === viber.favoriteSpotId) || FALLBACK_SPOTS[0];
                  return (
                    <div
                      key={viber.id}
                      className="bg-white border border-[#EBEBEB] rounded-[24px] p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                      id={`coviber-card-${viber.id}`}
                    >
                      <div>
                        {/* Headers */}
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={viber.profilePic}
                            alt={viber.fullName}
                            className="h-12 w-12 rounded-full object-cover border border-zinc-200"
                          />
                          <div className="leading-tight min-w-0">
                            <h4 className="text-xs font-bold text-zinc-900 truncate">@{viber.instagramHandle}</h4>
                            <p className="text-[10/11px] text-zinc-500 truncate">{viber.fullName}</p>
                          </div>
                          {viber.joinedRecently && (
                            <span className="ml-auto bg-amber-50 text-amber-700 text-[8px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                              Active Now
                            </span>
                          )}
                        </div>

                        <p className="text-xs leading-relaxed text-zinc-600 mb-4 line-clamp-3">
                          {viber.bio}
                        </p>

                        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                          <p className="text-[9px] font-mono text-zinc-400 uppercase">FAVORITE CURATED SPOT</p>
                          <p className="text-xs font-bold text-zinc-950 truncate mt-0.5">{favoriteSpot.name}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-medium text-zinc-700 font-mono">
                          {viber.aesthetic}
                        </span>
                        
                         <div className="flex items-center gap-2">
                          {viber.linkedinUrl && (
                            <a
                              href={viber.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 border border-[#0077B5]/25 rounded-full px-3 py-1.5 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                              title={`Schedule a LinkedIn Coffee Chat with ${viber.fullName}`}
                              id={`linkedin-coffee-chat-${viber.id}`}
                            >
                              <Linkedin className="h-3.5 w-3.5" />
                              <span className="text-[11px] font-bold">Coffee Chat</span>
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setActiveChatViber(viber);
                              const greeting = `Hey @${viber.instagramHandle}! Let's study code or read together at "${favoriteSpot.name}" sometime. We both share beautiful taste! ☕🌿`;
                              if (!chatSessions[viber.id]) {
                                setChatSessions((prev) => ({
                                  ...prev,
                                  [viber.id]: {
                                    viberId: viber.id,
                                    messages: [{
                                      id: "greeting",
                                      sender: "them",
                                      text: greeting,
                                      timestamp: "Just Now"
                                    }]
                                  }
                                }));
                              }
                            }}
                            className="bg-zinc-900 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1 active:scale-95"
                            id={`message-viber-btn-${viber.id}`}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Message</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connected Palette visual guidelines */}
              <div className="space-y-6">
                {/* Custom Profile Editor Card */}
                <div className="bg-white border border-[#EBEBEB] rounded-[24px] p-5 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base text-amber-600">👤</span>
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider text-zinc-800">
                      My Profile Card Editor
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-normal mb-4">
                    Update your details anytime. Selecting an aesthetic swatch below will instantly skin your profile and suggest tailored spots!
                  </p>

                  {connectedProfile ? (
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-bold text-zinc-500 font-mono uppercase">Full Name</label>
                        <input
                          type="text"
                          value={connectedProfile.fullName}
                          onChange={(e) => {
                            const updated = { ...connectedProfile, fullName: e.target.value };
                            setConnectedProfile(updated);
                            localStorage.setItem("vibecheck_connected_profile", JSON.stringify(updated));
                          }}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-850 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-bold text-zinc-500 font-mono uppercase">Instagram Handle</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-mono">@</span>
                          <input
                            type="text"
                            value={connectedProfile.instagramHandle}
                            onChange={(e) => {
                              const updated = { ...connectedProfile, instagramHandle: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "") };
                              setConnectedProfile(updated);
                              localStorage.setItem("vibecheck_connected_profile", JSON.stringify(updated));
                            }}
                            className="w-full text-xs pl-6 pr-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-850 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-bold text-zinc-500 font-mono uppercase">Bio Description</label>
                        <textarea
                          value={connectedProfile.bio}
                          onChange={(e) => {
                            const updated = { ...connectedProfile, bio: e.target.value };
                            setConnectedProfile(updated);
                            localStorage.setItem("vibecheck_connected_profile", JSON.stringify(updated));
                          }}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-800 h-16 resize-none leading-relaxed"
                          placeholder="Tell local explorers what you seek..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9.5px] font-bold text-zinc-500 font-mono uppercase">LinkedIn URL (Coffee Chats)</label>
                        <input
                          type="text"
                          value={connectedProfile.linkedinUrl || ""}
                          onChange={(e) => {
                            const updated = { ...connectedProfile, linkedinUrl: e.target.value };
                            setConnectedProfile(updated);
                            localStorage.setItem("vibecheck_connected_profile", JSON.stringify(updated));
                          }}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white text-zinc-850 font-medium"
                        />
                      </div>

                      {/* Display notice if aesthetic is 'Pick Later' */}
                      {connectedProfile.aesthetic === "Pick Later" ? (
                        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2">
                          <span className="text-sm">🎨</span>
                          <div className="leading-tight">
                            <p className="text-[10px] font-bold text-amber-900">Aesthetic Swatch: Decided Later</p>
                            <p className="text-[9.5px] text-zinc-500 mt-1">Select one of the presets below when you are ready to style your grid!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-55/40 border border-emerald-200 rounded-xl flex items-center justify-between text-[10px] font-mono text-emerald-800 font-bold px-3">
                          <span>AESTHETIC STYLE:</span>
                          <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full uppercase text-[9px]">{connectedProfile.aesthetic}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-50 border border-dashed border-zinc-250 text-center">
                      <p className="text-xs text-zinc-550 mb-3 font-semibold">No profile connected as guest explorer.</p>
                      <button
                        onClick={() => {
                          const mockUser = {
                            instagramHandle: "guest_matcha",
                            fullName: "Jamie Aoki",
                            bio: "Searching for bright glasshouse atriums & double espressos",
                            profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
                            aesthetic: "Pick Later" as any,
                            savedSpots: []
                          };
                          setConnectedProfile(mockUser);
                          localStorage.setItem("vibecheck_connected_profile", JSON.stringify(mockUser));
                        }}
                        className="text-xs font-bold text-[#8C3E14] bg-[#FFF0E8] hover:bg-[#FFE0D0] px-4 py-2 rounded-xl border border-[#FFE2D1] cursor-pointer"
                      >
                        Create Guest Profile
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-[#EBEBEB] rounded-[24px] p-5 shadow-sm">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider font-mono text-zinc-400 mb-3 block">
                    Choose Your Theme Swatch
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                    Change your profile background palette. You can select, reset or change this theme swatch instantly structure!
                  </p>

                  <div className="space-y-1.5">
                    {Object.keys(AESTHETIC_GRID_PRESETS).map((aestheticName) => {
                      const isChosen = connectedProfile?.aesthetic === aestheticName;
                      return (
                        <button
                          key={aestheticName}
                          onClick={() => {
                            if (!connectedProfile) {
                              setConnectedProfile({
                                instagramHandle: "curated_soul",
                                fullName: "Isabella Martinez",
                                bio: "searching cozy study shelters SF",
                                profilePic: INSTAGRAM_AVATARS[0],
                                aesthetic: aestheticName as any,
                                savedSpots: []
                              });
                            } else {
                              setConnectedProfile({
                                ...connectedProfile,
                                aesthetic: aestheticName as any
                              });
                            }
                          }}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                            isChosen
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-50 text-zinc-700 border-zinc-200/50 hover:bg-zinc-100"
                          }`}
                          id={`aesthetic-theme-btn-${aestheticName.replace(/\s+/g, "-")}`}
                        >
                          <span>{aestheticName}</span>
                          {isChosen && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Social proof graphic */}
                <div className="bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-[24px] p-5 shadow-sm">
                  <Instagram className="h-8 w-8 mb-3 opacity-90" />
                  <h4 className="text-sm font-bold tracking-tight text-white font-display">
                    Connect real accounts
                  </h4>
                  <p className="text-xs text-white/95 leading-relaxed mt-1 mb-4">
                    Instantly sync direct messages, profiles grids, and find the absolute best cozy corners alongside active peers in your district securely without meta app reviews.
                  </p>
                  <span className="text-[10px] font-mono bg-white/20 px-2 py-1 rounded-md text-white/95 uppercase">
                    100% Client-side sandbox
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ACTIVE TAB: YOU (VIBE HUB) */}
        {(activeTab === "you") && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="p-6 bg-gradient-to-r from-[#FFF5EE] via-[#FFFDFB] to-[#FAF9F6] border border-[#ECCFB7] rounded-[32px] text-zinc-900 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFE8DC]/40 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="text-[10px] bg-[#8C3E14]/10 text-[#8C3E14] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-[#8C3E14]/20 inline-flex items-center gap-1.5 mb-2">
                  ✨ Personal MECE Space
                </span>
                <h2 className="text-2xl font-black text-zinc-900 font-display">
                  More You: Vibe Hub & List Importer 🌸
                </h2>
                <p className="text-xs text-zinc-650 mt-1 max-w-3xl leading-relaxed">
                  Design your exclusive space profile with <strong>MECE</strong> taxonomy (Mutually Exclusive, Collectively Exhaustive). Talk with your AI Vibe Coach to unearth cozy neighborhood spots or paste raw text from your legacy Google Maps & Yelp bookmarks to seamlessly import them!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT SPACE: AI VIBE COACH & IMPORTER INPUTS (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* SECTION 1: AI Vibe Coach Chat */}
                <div className="bg-white border border-[#ECCFB7]/45 rounded-[32px] p-6 shadow-3xs">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center border border-pink-100 shadow-2xs font-bold text-lg select-none">
                        🤖
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">AI Vibe Coach 💬</h3>
                        <p className="text-[10px] text-zinc-400">Chat to express your unique taste & uncover neighborhood gems</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">AI Active</span>
                  </div>

                  {/* Chat Message Window */}
                  <div className="h-80 overflow-y-auto bg-zinc-50/70 border border-zinc-150/50 rounded-2xl p-4 space-y-4 mb-4 flex flex-col">
                    {youChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[85%] flex flex-col gap-1.5 ${
                          msg.sender === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div
                          className={`rounded-[20px] p-4 text-xs leading-relaxed shadow-3xs ${
                            msg.sender === "user"
                              ? "bg-zinc-900 text-white rounded-tr-none"
                              : "bg-white text-zinc-850 border border-zinc-150 rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>

                        {/* If AI message contains recommended spots, display them inside chat bubble */}
                        {msg.suggestedSpots && msg.suggestedSpots.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 max-w-full">
                            {msg.suggestedSpots.map((spot) => {
                              const isSaved = spots.some(s => s.name.toLowerCase() === spot.name.toLowerCase());
                              return (
                                <div key={spot.id} className="bg-white border border-zinc-205 p-3 rounded-xl flex flex-col justify-between shadow-3xs">
                                  <div>
                                    <div className="relative h-20 w-full rounded-lg overflow-hidden bg-zinc-100 mb-2">
                                      <img src={spot.image} alt={spot.name} className="h-full w-full object-cover" />
                                    </div>
                                    <h4 className="text-[11.5px] font-bold text-zinc-900 truncate">{spot.name}</h4>
                                    <p className="text-[9px] text-zinc-400 truncate">{spot.location}</p>
                                  </div>
                                  <button
                                    onClick={() => handleImportSpotDraft(spot)}
                                    className={`w-full mt-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                      isSaved
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
                                    }`}
                                  >
                                    {isSaved ? "✓ Saved & Live" : "Import to hago"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleYouChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Share your taste or ask about rooftops, pet cafes, cozy niches..."
                      value={youInputText}
                      onChange={(e) => setYouInputText(e.target.value)}
                      className="flex-1 rounded-xl border border-zinc-250 px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!youInputText.trim()}
                      className="bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
                    >
                      Send
                    </button>
                  </form>
                </div>

                {/* SECTION 2: Google Maps / Yelp Lists Importer */}
                <div className="bg-white border border-[#ECCFB7]/45 rounded-[32px] p-6 shadow-3xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-9 w-9 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center border border-amber-100 shadow-2xs font-bold text-lg select-none">
                      🗺️
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Google Maps & Yelp Lists Parser</h3>
                      <p className="text-[10px] text-zinc-400">Paste raw list items, addresses, or notes from your past logs</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">
                    Have a collection of places saved in your notes, texts, or legacy Google Maps? Paste them here! Our MECE parser will split them into clean cards (mapping titles, light spectrums, and acoustics) for you to import into hago one by one.
                  </p>

                  <form onSubmit={handleParseRawImport} className="space-y-4">
                    <textarea
                      rows={5}
                      className="w-full border border-zinc-200 rounded-xl p-3 text-xs font-mono text-zinc-850 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white bg-zinc-50/40"
                      placeholder={`Example format to paste:
1. Sextant Coffee: Industrial coffee roasters, massive oak tables, multiple outlets at every corner.
2. Jane on Fillmore - Quiet woodsy mezzanine upper level, soothing candle aura, slow lofi beats.
3. Blue Bottle - Majestic natural skylights filtering down, perfect pour-over gear.`}
                      value={youRawImportText}
                      onChange={(e) => setYouRawImportText(e.target.value)}
                    />

                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[9.5px] font-mono text-zinc-400">MECE Input Validation: Active</span>
                      <button
                        type="submit"
                        disabled={isParsingImport || !youRawImportText.trim()}
                        className="rounded-xl bg-[#8C3E14] hover:bg-[#712D03] text-white px-5 py-2.5 text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                      >
                        {isParsingImport ? (
                          <>
                            <span className="animate-spin text-xs">⏳</span>
                            <span>Parsing raw list items...</span>
                          </>
                        ) : (
                          <>
                            <span>Parse & Import Legacy List ⚡</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Parse Terminal Logs */}
                  {youImportLogs.length > 0 && (
                    <div className="mt-4 p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-300 max-h-32 overflow-y-auto space-y-1">
                      <p className="text-zinc-500 border-b border-zinc-800 pb-1 mb-1.5">// hago MECE Parser Terminal Outputs</p>
                      {youImportLogs.map((log, i) => (
                        <p key={i} className="leading-relaxed">{log}</p>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT SPACE: PARSED DRAFT SPOTS FEED (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* SECTION 3: Draft Spots to Import One-By-One */}
                <div className="bg-gradient-to-br from-[#FFFDFB] to-[#FAF9F6] border border-[#ECCFB7]/60 rounded-[32px] p-6 shadow-3xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between border-b border-[#ECCFB7]/30 pb-3 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                          📥 Import Drafts One-By-One <span className="text-xs text-rose-500 font-mono font-bold">({youParsedDrafts.length} Drafts)</span>
                        </h3>
                        <p className="text-[10px] text-zinc-500">Approve and save each spot to your live list</p>
                      </div>
                      <span className="text-[9.5px] font-mono text-amber-800 bg-[#FFF0E8] px-2 py-0.5 rounded border border-[#ECCFB7]/45 font-bold">One-Click Save</span>
                    </div>

                    {youParsedDrafts.length === 0 ? (
                      <div className="p-8 text-center bg-white border border-dashed border-zinc-200 rounded-2xl text-zinc-400 space-y-2">
                        <span className="text-3xl block">📥</span>
                        <p className="text-xs font-semibold text-zinc-500">Drafts catalog is empty</p>
                        <p className="text-[10px] text-zinc-400">Paste raw text from Google Maps/Yelp in the panel on the left to populate draft cards here!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {youParsedDrafts.map((draft) => (
                          <div
                            key={draft.id}
                            className="bg-white border border-zinc-150 rounded-2xl p-4 hover:border-pink-300 hover:shadow-xs transition-all relative group animate-fade-in"
                          >
                            <div className="flex gap-3">
                              {/* Left Thumbnail */}
                              <div className="h-16 w-16 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-150">
                                <img src={draft.image} alt={draft.name} className="h-full w-full object-cover" />
                              </div>

                              {/* Details */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className="text-[8px] font-mono uppercase bg-zinc-50 text-zinc-500 px-1.5 py-0.2 rounded font-bold border border-zinc-150">{draft.category}</span>
                                  <span className="text-[10px] font-bold text-amber-700">⭐ {draft.googleRating}</span>
                                </div>
                                <h4 className="text-xs font-bold text-zinc-900 truncate mt-1">{draft.name}</h4>
                                <p className="text-[10px] text-zinc-400 truncate flex items-center gap-0.5">
                                  <MapPin className="h-2.5 w-2.5 shrink-0 text-zinc-350" />
                                  <span>{draft.location}</span>
                                </p>
                              </div>
                            </div>

                            {/* Attributes */}
                            <div className="grid grid-cols-2 gap-1 mt-3 p-1.5 bg-zinc-50/70 border border-zinc-150/60 rounded-xl text-[9px] text-zinc-500">
                              <span className="truncate">{draft.lighting}</span>
                              <span className="truncate">{draft.noise}</span>
                            </div>

                            <p className="text-[10px] text-zinc-650 mt-2 line-clamp-2 leading-relaxed bg-zinc-50/30 p-2 rounded-lg border border-zinc-150/50">
                              {draft.description}
                            </p>

                            {/* Save CTA */}
                            <button
                              type="button"
                              onClick={() => handleImportSpotDraft(draft)}
                              className="w-full mt-3 py-1.5 bg-[#8C3E14] hover:bg-[#712D03] text-white rounded-xl text-[10px] font-black tracking-wide flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer shadow-3xs"
                            >
                              <span>Import to hago catalog</span>
                              <span>→</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 4: MECE Mindset Identity Card */}
                <div className="bg-white border border-[#ECCFB7]/35 rounded-[32px] p-5 shadow-3xs">
                  <h4 className="text-xs font-black text-zinc-900 uppercase font-mono tracking-wider text-zinc-400 mb-3 flex items-center gap-1">
                    <span>🧠 MECE Vibe Classification standards</span>
                  </h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                    MECE (Mutually Exclusive, Collectively Exhaustive) ensures your personal space logs are organized cleanly without overlaps or omissions:
                  </p>

                  <div className="space-y-3.5 text-[11px]">
                    <div className="flex gap-2.5 items-start">
                      <span className="bg-[#FFF0E8] text-[#8C3E14] h-5 w-5 rounded-md flex items-center justify-center shrink-0 font-bold">1</span>
                      <div>
                        <h5 className="font-bold text-zinc-800">Mutually Exclusive (No Overlaps)</h5>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Each physical cafe gets precisely mapped to single primary sonic and illumination spectra indices.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="bg-[#FFF0E8] text-[#8C3E14] h-5 w-5 rounded-md flex items-center justify-center shrink-0 font-bold">2</span>
                      <div>
                        <h5 className="font-bold text-zinc-800">Collectively Exhaustive (No Omissions)</h5>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Captures the entirety of daily scenarios, from high-focus mornings to cozy date-night candlelit lounges.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* Aesthetic footer */}
      <footer className="bg-white border-t border-zinc-105/85 px-4 py-6 md:py-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-zinc-100 p-2.5 rounded-xl font-display font-black text-zinc-900 text-xs">H•G</span>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900">hago © 2026</p>
              <p className="text-[10px] text-zinc-400">Crafting high-end minimalist design maps for study spots & quiet dates.</p>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-medium text-zinc-500">
            <button onClick={() => alert("Simulated Terms Loaded")} className="hover:text-zinc-800">Ambience Codex</button>
            <button onClick={() => alert("Simulated System Status Active")} className="hover:text-zinc-800">System Status (100%)</button>
            <div className="text-[10px] font-mono text-zinc-400">UTC: 2026-06-20</div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: HANGOUT CARD CREATOR WIZARD */}
      {isCreatingHangout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl bg-white rounded-[32px] overflow-hidden border border-zinc-200 shadow-2xl flex flex-col"
            id="hangout-wizard-modal"
          >
            <div className="bg-zinc-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Craft Aesthetic Invite Outing</h3>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">Plan ahead with friends</p>
              </div>
              <button
                onClick={() => setIsCreatingHangout(false)}
                className="p-1 px-2 text-xs font-bold bg-white/10 hover:bg-white/20 rounded-full text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateHangoutSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="draft-title" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Outing Title (e.g. Vintage Study Session)</label>
                  <input
                    id="draft-title"
                    type="text"
                    required
                    placeholder="Matcha Latte Tasting"
                    value={hangoutDraftTitle}
                    onChange={(e) => setHangoutDraftTitle(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                  />
                </div>

                {/* Target spot selection */}
                <div className="space-y-1">
                  <label htmlFor="draft-spot" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Curated Spot</label>
                  <select
                    id="draft-spot"
                    value={hangoutDraftSpotId}
                    onChange={(e) => setHangoutDraftSpotId(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                    required
                  >
                    <option value="">Select Cafe or Lounge</option>
                    {spots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vibe Theme layout design style */}
                <div className="space-y-1">
                  <label htmlFor="draft-vibes-design" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Card Design Theme</label>
                  <select
                    id="draft-vibes-design"
                    value={hangoutDraftStyle}
                    onChange={(e) => setHangoutDraftStyle(e.target.value as any)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                  >
                    <option value="vintageCream">Warm Sepia (Vintage Cream)</option>
                    <option value="slateGrey">Neutral Shutter (Cement Grey)</option>
                    <option value="neonObsidian">Obsidian Cyber (Minimal Dark)</option>
                    <option value="sageMatcha">Sage Green (Plant Paradise)</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label htmlFor="draft-date" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Outing Date</label>
                  <input
                    id="draft-date"
                    type="date"
                    value={hangoutDraftDate}
                    onChange={(e) => setHangoutDraftDate(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <label htmlFor="draft-time" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Start Time</label>
                  <input
                    id="draft-time"
                    type="time"
                    value={hangoutDraftTime}
                    onChange={(e) => setHangoutDraftTime(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                  />
                </div>
              </div>

              {/* Select friends matching active CoVibers */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Invite Friends from Meetup Circle</span>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1 bg-zinc-50 rounded-2xl border border-zinc-100">
                  {MOCK_CO_VIBERS.map((v) => {
                    const isSelected = selectedFriendsForDraft.some((p) => p.id === v.id);
                    return (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => handleToggleViberInDraft(v)}
                        className={`flex items-center gap-2 p-1.5 rounded-xl text-left border ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        }`}
                        id={`draft-select-viber-${v.id}`}
                      >
                        <img
                          src={v.profilePic}
                          alt={v.fullName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="leading-none min-w-0">
                          <p className="text-[10px] font-bold truncate">@{v.instagramHandle}</p>
                          <p className={`text-[8px] truncate ${isSelected ? "text-slate-300" : "text-zinc-400"}`}>{v.fullName}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Curator special instructions */}
              <div className="space-y-1">
                <label htmlFor="draft-notes" className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">Crew Coordination Notes (Atmospheric Details)</label>
                <textarea
                  id="draft-notes"
                  rows={2}
                  placeholder="e.g. Leave headphones in the lockers. We're journaling for 30 minutes in dim light..."
                  value={hangoutDraftNotes}
                  onChange={(e) => setHangoutDraftNotes(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl py-3 text-xs transition-colors"
              >
                Compile Outing Invitation Card
              </button>

            </form>
          </motion.div>
        </div>
      )}


      {/* MODAL 2: INSTAX STORY ACTIVE SLIDE VIEW */}
      {activeStorySpot && (
        <div className="fixed inset-0 z-50 bg-[#0C0C0C]/95 backdrop-blur-md flex items-center justify-center p-2" onClick={() => setActiveStorySpot(null)}>
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-zinc-800" onClick={(e) => e.stopPropagation()}>
            
            {/* Horizontal progress bar segment */}
            <div className="absolute top-4 left-4 right-4 z-40 flex gap-1">
              {(activeStorySpot.stories || [activeStorySpot.image]).map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      i < activeStoryIdx ? "w-full" : i === activeStoryIdx ? "w-full animate-pulse" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Image display */}
            <img
              src={(activeStorySpot.stories || [activeStorySpot.image])[activeStoryIdx]}
              alt="Aesthetic ambiance slide"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Ambient gradients shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

            {/* Standard Meta UI Headers overlay */}
            <div className="absolute top-8 left-4 right-4 flex items-center gap-3 z-30">
              <span className="bg-white/80 backdrop-blur-sm text-zinc-900 font-bold px-3 py-1 rounded-full text-[11px] font-display">
                {activeStorySpot.category}
              </span>
              <div className="text-left leading-none">
                <h4 className="text-sm font-bold text-white font-display mb-0.5">{activeStorySpot.name}</h4>
                <p className="text-[10px] text-zinc-300 font-mono">@{activeStorySpot.instagramHandle}</p>
              </div>

              <button
                onClick={() => setActiveStorySpot(null)}
                className="ml-auto text-white bg-black/40 p-1.5 rounded-full hover:bg-black/60"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Vertical layout descriptors parameters */}
            <div className="absolute bottom-6 left-5 right-5 z-20 space-y-3.5 text-white">
              <span className="inline-block px-2.5 py-0.5 bg-amber-500 text-[10px] font-mono tracking-widest uppercase rounded">
                Ambience Story
              </span>

              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {activeStoryIdx === 0
                  ? activeStorySpot.description
                  : `Curator note: Enjoy ${activeStorySpot.lighting} coupled with ${activeStorySpot.noise} acoustics. It registers ${activeStorySpot.rating} score.`}
              </p>

              <div className="flex gap-1.5 flex-wrap">
                {activeStorySpot.vibeTags.map((t) => (
                  <span key={t} className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20 gap-1.5">
                <button
                  onClick={() => {
                    handleToggleSave(activeStorySpot.id);
                    alert("Added to your Saved Voids bookmarks shelf!");
                  }}
                  className="flex items-center gap-1 bg-white text-zinc-900 rounded-full px-3 py-2 text-[10.5px] font-bold shrink-0"
                >
                  <Bookmark className="h-3 w-3" fill={savedSpotIds.includes(activeStorySpot.id) ? "currentColor" : "none"} />
                  <span>RSVP Spot</span>
                </button>
                <button
                  onClick={() => {
                    setHangoutDraftSpotId(activeStorySpot.id);
                    setIsCreatingHangout(true);
                    setActiveStorySpot(null);
                    setActiveTab("planner");
                  }}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-750 text-white rounded-full px-3 py-2 text-[10.5px] font-bold shrink-0"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Schedule Meetup</span>
                </button>
                <a
                  href={`https://instagram.com/${activeStorySpot.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] font-bold text-pink-400 hover:underline flex items-center gap-1 shrink-0 ml-auto"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  <span>@{activeStorySpot.instagramHandle}</span>
                </a>
              </div>
            </div>

            {/* Click-to-Next invisible tap zones */}
            <button
              onClick={handlePrevStory}
              disabled={activeStoryIdx === 0}
              className="absolute top-1/4 bottom-1/4 left-0 w-1/3 cursor-w-resize disabled:cursor-default"
              aria-label="Previous story page"
            />
            <button
              onClick={handleNextStory}
              className="absolute top-1/4 bottom-1/4 right-0 w-2/3 cursor-e-resize"
              aria-label="Next story page"
            />

          </div>
        </div>
      )}


      {/* MODAL 3: INVITATION GRAPHIC DESIGN PREVIEW */}
      {viewingInviteCardPlan && (
        <div className="fixed inset-0 z-50 bg-[#000]/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setViewingInviteCardPlan(null)}>
          <div className="w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* The actual Invitation Visual render board */}
            {(() => {
              const pal = {
                vintageCream: { bg: "bg-[#FAF7F0] text-amber-900", frame: "border-[#E8DFD0]", accent: "bg-[#DFD3C3]/40", textMuted: "text-amber-800/80", title: "font-serif text-amber-950" },
                slateGrey: { bg: "bg-[#F3F4F6] text-slate-800", frame: "border-[#D1D5DB]", accent: "bg-[#E5E7EB]", textMuted: "text-slate-650", title: "font-display text-slate-950" },
                neonObsidian: { bg: "bg-zinc-950 text-zinc-100", frame: "border-zinc-800", accent: "bg-zinc-900", textMuted: "text-zinc-400", title: "font-mono text-white" },
                sageMatcha: { bg: "bg-[#F4F9F4] text-emerald-900", frame: "border-[#D2E0D2]", accent: "bg-[#E2EDE2]", textMuted: "text-emerald-800/80", title: "font-display text-emerald-950" }
              }[viewingInviteCardPlan.vibeStyle];

              return (
                <div className={`p-6 rounded-[32px] border shadow-2xl relative ${pal.bg} ${pal.frame}`} id="printable-invitation-card">
                  {/* Instax frame styling border */}
                  <div className="border border-zinc-200/50 rounded-2xl p-4 bg-white/60 backdrop-blur-sm shadow-inner relative overflow-hidden">
                    
                    {/* Tiny visual graphic indicator */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1.5">
                        <Sparkle className="h-4.5 w-4.5 text-amber-500 animate-spin" />
                        <span className="text-[9px] font-mono uppercase tracking-widest">Aura invitation card</span>
                      </div>
                      <span className="text-[10px] font-bold tracking-tight">VIBECHECK® PRE-CHECKED</span>
                    </div>

                    <img
                      src={viewingInviteCardPlan.spotImage}
                      alt={viewingInviteCardPlan.spotName}
                      className="w-full aspect-[4/3] rounded-xl object-cover border border-zinc-200/40 mb-3.5"
                    />

                    <h3 className={`text-base font-bold tracking-tight mb-2.5 ${pal.title}`}>
                      {viewingInviteCardPlan.title}
                    </h3>

                    {/* Detailed address panel */}
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <div>
                          <p className="font-bold leading-none">{viewingInviteCardPlan.spotName}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">SOMA District neighborhood</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-2 border-t border-zinc-100">
                        <div>
                          <p className="text-[9px] text-zinc-400 font-mono">DATE</p>
                          <p className="font-bold">{viewingInviteCardPlan.date}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-zinc-400 font-mono">TIME</p>
                          <p className="font-bold">{viewingInviteCardPlan.time}</p>
                        </div>
                      </div>
                    </div>

                    {viewingInviteCardPlan.notes && (
                      <div className={`text-[10px] italic leading-relaxed p-2 rounded-lg border mb-4 bg-zinc-50/50 ${pal.frame}`}>
                        &ldquo;{viewingInviteCardPlan.notes}&rdquo;
                      </div>
                    )}

                    {/* RSVP Code block */}
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-zinc-200">
                      <div>
                        <p className="text-[8px] font-mono text-zinc-400 uppercase">RSVP VIA HAGO MEETUPS</p>
                        <p className="text-[10px] font-bold text-zinc-800">@{connectedProfile?.instagramHandle || "curated_soul"}</p>
                      </div>
                      {/* Simulated QR Code graphic */}
                      <div className="h-8 w-8 bg-zinc-900 rounded p-0.5">
                        <svg viewBox="0 0 10 10" className="w-full h-full text-white fill-current">
                          <rect x="0" y="0" width="3" height="3" />
                          <rect x="7" y="0" width="3" height="3" />
                          <rect x="0" y="7" width="3" height="3" />
                          <rect x="4" y="4" width="2" height="2" />
                          <rect x="8" y="8" width="2" height="2" />
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* Close and action controls */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => {
                        alert("Invitation card mockup copied! Paste on your Instagram Direct Messages group chat loop!");
                      }}
                      className="flex-1 bg-zinc-900 text-white rounded-xl py-2 text-xs font-bold hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Copy DM Invite Link</span>
                    </button>
                    <button
                      onClick={() => setViewingInviteCardPlan(null)}
                      className="bg-white/80 border border-zinc-200 font-semibold rounded-xl text-zinc-700 px-4 py-2 text-xs hover:bg-white"
                    >
                      Close View
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}


      {/* MODAL 4: INTERACTIVE INSTAGRAM DIRECT MESSAGE SIMULATION */}
      {activeChatViber && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-white rounded-[24px] overflow-hidden border border-zinc-200 shadow-2xl flex flex-col" id="dm-simulation-box">
          
          {/* Header */}
          <div className="bg-zinc-900 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={activeChatViber.profilePic}
                alt={activeChatViber.fullName}
                className="h-8 w-8 rounded-full object-cover border border-white/20"
              />
              <div className="leading-tight text-left">
                <h4 className="text-xs font-bold font-display">@{activeChatViber.instagramHandle}</h4>
                <p className="text-[9px] text-emerald-400 font-mono">Active Co-Viber online</p>
              </div>
            </div>
            <button
              onClick={() => setActiveChatViber(null)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* DM Body Chat Shelf */}
          <div className="h-64 p-4 overflow-y-auto bg-zinc-50 flex flex-col gap-3">
            {(chatSessions[activeChatViber.id]?.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-[18px] p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-zinc-900 text-white ml-auto rounded-tr-none"
                    : "bg-white text-zinc-800 mr-auto rounded-tl-none border border-zinc-200 shadow-xs"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[8px] opacity-40 block text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-150 flex gap-2">
            <input
              type="text"
              placeholder={`Send message to @${activeChatViber.instagramHandle}...`}
              value={currentChatMessageText}
              onChange={(e) => setCurrentChatMessageText(e.target.value)}
              className="flex-1 rounded-full border border-zinc-250 px-3.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:bg-white"
              id="dm-message-input"
            />
            <button
              type="submit"
              disabled={!currentChatMessageText.trim()}
              className="h-8 w-8 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-40"
              aria-label="Send messages"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Premium Sticky Bottom Mobile Nav Bar (Syncs perfectly across all screens and highlights active pages) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-t border-zinc-200/85 px-4 py-2 flex justify-around items-center shadow-lg pb-safe">
        <button
          onClick={() => { setActiveTab("discover"); setAiMatchResult(null); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "discover" ? "text-amber-800 font-bold scale-105" : "text-zinc-500 font-medium"
          }`}
          id="mob-nav-explore"
        >
          <Compass className="h-5 w-5" />
          <span className="text-[9.5px]">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab("planner")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
            activeTab === "planner" ? "text-amber-800 font-bold scale-105" : "text-zinc-500 font-medium"
          }`}
          id="mob-nav-planner"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[9.5px]">Planner</span>
          {hangoutPlans.length > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-amber-500 text-white text-[8.5px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold font-sans">
              {hangoutPlans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("vibematch")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "vibematch" ? "text-amber-800 font-bold scale-105" : "text-zinc-500 font-medium"
          }`}
          id="mob-nav-vibematch"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[9.5px]">Matcher</span>
        </button>

        <button
          onClick={() => setActiveTab("covibers")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
            activeTab === "covibers" ? "text-amber-800 font-bold scale-105" : "text-zinc-500 font-medium"
          }`}
          id="mob-nav-meetups"
        >
          <Users className="h-5 w-5" />
          <span className="text-[9.5px]">Meetups</span>
          <span className="absolute top-0.5 right-1 bg-zinc-200 text-zinc-800 text-[8.5px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-semibold font-mono">
            {MOCK_CO_VIBERS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("you")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
            activeTab === "you" ? "text-amber-800 font-bold scale-105" : "text-zinc-500 font-medium"
          }`}
          id="mob-nav-you"
        >
          <User className="h-5 w-5" />
          <span className="text-[9.5px]">More You</span>
          <span className="absolute top-0.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
        </button>
      </div>

    </div>
  );
}
