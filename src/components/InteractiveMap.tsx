import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Globe, 
  Layers, 
  Sparkle, 
  Check, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  DollarSign
} from "lucide-react";
import { Spot } from "../types";

// City map view center locations
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number; desc: string }> = {
  "All Cities": { lat: 30.0, lng: -10.0, zoom: 2, desc: "Global curation spanning Saigon, US, Tokyo, Seoul & Europe" },
  "Ho Chi Minh City": { lat: 10.7769, lng: 106.7009, zoom: 13, desc: "Saigon Cozy Rooftops, Hidden Alley Libraries & River-view Solariums" },
  "Hanoi": { lat: 21.0285, lng: 105.8542, zoom: 13, desc: "Hanoi Old Alley Hideouts, Elegant French Glass Atriums & Creative Workspaces" },
  "Bangkok": { lat: 13.7563, lng: 100.5018, zoom: 13, desc: "Cozy Teakwood Canal Houses, Grand Sacred Riverfront Glass Pavilions & Creative Work Labs" },
  "Singapore": { lat: 1.3521, lng: 103.8198, zoom: 13, desc: "Futuristic Glass Rain Domes, Cozy Heritage Shophouse Nests & Professional Work Clubs" },
  "Tokyo": { lat: 35.6762, lng: 139.6503, zoom: 13, desc: "Neon Kissatens, Cozy Matcha Gardens & Vintage Vinyl Playbacks" },
  "Seoul": { lat: 37.5665, lng: 126.9780, zoom: 13, desc: "Quiet Hanok Atriums, Secluded Tea Houses & Minimalist Craft Coffee" },
  "London": { lat: 51.5074, lng: -0.1278, zoom: 13, desc: "Brutalist Coffee Vaults, Cozy Greenhouse Pubs & Curated Reading Rooms" },
  "Paris": { lat: 48.8566, lng: 2.3522, zoom: 13, desc: "Sage Green Solariums, Seine-side Book Bistros & Louvre-adjacent Atrium Domes" },
  "Seattle": { lat: 47.6062, lng: -122.3321, zoom: 13, desc: "Emerald Green Coffee & Vinyl Hideaways" },
  "New York": { lat: 40.7128, lng: -74.0060, zoom: 13, desc: "West Village Archives & Cozy Greenhouse Atrium Bars" },
  "San Francisco": { lat: 37.7749, lng: -122.4194, zoom: 13, desc: "Hayes Valley Brutalist Bars & SOMA Atrium Cafes" },
  "Chicago": { lat: 41.8781, lng: -87.6298, zoom: 13, desc: "Midwest Glass Conservatories, Lakeside Lounges & Chicago-style Brick Hideaways" },
  "Atlanta": { lat: 33.7490, lng: -84.3880, zoom: 13, desc: "Southern Green Oasis, Greenhouse Cafes & Piedmont Park Solariums" },
  "Washington D.C.": { lat: 38.9072, lng: -77.0369, zoom: 13, desc: "Potomac Solarium Lounges, Neoclassical Museum Atriums & Reading Alcoves" },
  "Boston": { lat: 42.3601, lng: -71.0589, zoom: 13, desc: "Historic Red Brick Libraries, Victorian Greenhouse Tea Houses & Back Bay Patios" },
  "Houston": { lat: 29.7604, lng: -95.3698, zoom: 13, desc: "Cozy Oak-shaded Patios, Glass Dome Gardens & Industrial Vinyl Cafes" },
  "Austin": { lat: 30.2672, lng: -97.7431, zoom: 13, desc: "Colorado River View Terraces, Hill Country Hideouts & South Congress Craft Hubs" },
  "Tampa": { lat: 27.9506, lng: -82.4572, zoom: 13, desc: "Ybor City Historic Courtyards, Shiny Waterfront Atriums & Hidden Tampa Bay Oasis" },
  "Orlando": { lat: 28.5383, lng: -81.3792, zoom: 13, desc: "Sun-drenched Lake Eola Pavilions, Magic Greenhouse Tea Rooms & Secret Swampside Lounges" }
};

// Planned expansions to link next
const PLANNED_CITIES = [
  { name: "Kyoto", country: "Japan", theme: "Wabi-sabi Tea Gardens & Micro Roasters", votes: 512, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=300" },
  { name: "Barcelona", country: "Spain", theme: "Gothic Rooftops & Art Nouveau Solariums", votes: 418, image: "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&q=80&w=300" },
  { name: "Da Nang", country: "Vietnam", theme: "My Khe Coastal Cafes & Marble Mountain Retreats", votes: 389, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=300" }
];

interface InteractiveMapProps {
  spots: Spot[];
  selectedCity: string;
  onSelectSpot: (spot: Spot) => void;
  selectedSpotId?: string;
  currencySymbol: string;
  exchangeRate: number;
}

export default function InteractiveMap({
  spots,
  selectedCity,
  onSelectSpot,
  selectedSpotId,
  currencySymbol,
  exchangeRate
}: InteractiveMapProps) {
  const [mapStyle, setMapStyle] = useState<"blueprint" | "warmsepia" | "satellite">("blueprint");
  const [directionRequestSpot, setDirectionRequestSpot] = useState<Spot | null>(null);
  const [votedCities, setVotedCities] = useState<string[]>([]);
  const [successVoteCity, setSuccessVoteCity] = useState<string | null>(null);

  // Filter spots available for mapping (only show selected city, or all if All Cities)
  const mappedSpots = spots.filter(
    s => selectedCity === "All Cities" || s.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const activeCenter = CITY_CENTERS[selectedCity] || CITY_CENTERS["All Cities"];

  // Handle vote simulation
  const handleVoteCity = (cityName: string) => {
    if (votedCities.includes(cityName)) return;
    setVotedCities([...votedCities, cityName]);
    setSuccessVoteCity(cityName);
    setTimeout(() => {
      setSuccessVoteCity(null);
    }, 3000);
  };

  return (
    <div className="rounded-[32px] bg-white border border-[#EBEBEB] p-6 shadow-sm overflow-hidden flex flex-col gap-6" id="hago-google-map-helper">
      
      {/* Map Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1 bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 font-mono text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full mb-2">
            <Globe className="h-3 w-3 animate-spin duration-10000" />
            <span>Active City Network: {selectedCity}</span>
          </span>
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 font-display">
            Interactive Curation GPS Map
          </h3>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            {activeCenter.desc} • Coordinates: {activeCenter.lat}°N, {Math.abs(activeCenter.lng)}°W
          </p>
        </div>

        {/* Map Style Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-full text-xs font-medium">
          <button
            onClick={() => setMapStyle("blueprint")}
            className={`px-3 py-1.5 rounded-full transition-all ${
              mapStyle === "blueprint" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Aesthetic Map
          </button>
          <button
            onClick={() => setMapStyle("warmsepia")}
            className={`px-3 py-1.5 rounded-full transition-all ${
              mapStyle === "warmsepia" ? "bg-amber-600 text-white shadow-sm" : "text-zinc-650 hover:text-zinc-950"
            }`}
          >
            Warm Sepia 🕯️
          </button>
          <button
            onClick={() => setMapStyle("satellite")}
            className={`px-3 py-1.5 rounded-full transition-all ${
              mapStyle === "satellite" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Main Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Visual Map canvas (2 cols) */}
        <div className="lg:col-span-2 relative aspect-[16/10] bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden group/canvas">
          
          {/* Aesthetic map background textures according to toggle */}
          {mapStyle === "blueprint" && (
            <div className="absolute inset-0 bg-[#F4F4EE] opacity-100 transition-opacity duration-300">
              {/* Complex blueprint grid pattern representing streets */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              {/* Big decorative river path */}
              <svg className="absolute w-full h-full text-emerald-100/50 fill-current pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-10 120 C 150 130, 200 180, 400 320 S 550 450, 780 430 L 780 500 L -10 500 Z" />
                <path d="M 200 -10 C 350 140, 320 280, 500 500" stroke="#DFE7D4" strokeWidth="24" fill="none" opacity="0.3" />
              </svg>
              {/* Mock Street Names */}
              <div className="absolute top-[20%] left-[10%] text-[8px] font-mono text-zinc-400 select-none uppercase tracking-widest font-bold">Aura Boulevard</div>
              <div className="absolute bottom-[35%] right-[20%] text-[8px] font-mono text-zinc-400 select-none uppercase tracking-widest font-bold font-semibold">Curation Boulevard</div>
              <div className="absolute top-[60%] right-[35%] text-[8px] font-mono text-zinc-400 select-none uppercase tracking-widest font-bold">Vibe Alley</div>
            </div>
          )}

          {mapStyle === "warmsepia" && (
            <div className="absolute inset-0 bg-[#FAF4ED] opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              <svg className="absolute w-full h-full text-[#F5E6D8]/60 fill-current pointer-events-none">
                <path d="M-10 120 C 150 130, 200 180, 400 320 S 550 450, 780 430 L 780 500 L -10 500 Z" />
              </svg>
              {/* Luminous Warm Sepia streets */}
              <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />
              <div className="absolute top-[20%] left-[10%] text-[8px] font-mono text-[#8C3E14]/50 select-none uppercase tracking-widest font-bold">Matcha Avenue</div>
              <div className="absolute bottom-[35%] right-[20%] text-[8px] font-mono text-[#8C3E14]/50 select-none uppercase tracking-widest font-bold">Clover Parkway</div>
            </div>
          )}

          {mapStyle === "satellite" && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-referrer grayscale-[40%] contrast-[110%] opacity-100 transition-opacity duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')` }}>
              <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[0.5px]" />
              <div className="absolute top-[20%] left-[10%] text-[8px] font-mono text-white/50 select-none uppercase tracking-wider">Aero Imaging Channel</div>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm text-[10px] font-medium text-zinc-700 flex items-center gap-1.5">
            <Compass className="h-3 w-3 animate-bounce text-amber-500" />
            <span>Map scale: 1:15,000 | GPS Status: Locked</span>
          </div>

          {/* Interactive spot markers placement using relative coordinate offsets */}
          {mappedSpots.map((spot, idx) => {
            // Compute visual spot coordinate position offset simulation
            // Base offset off their lat/lng
            const lats = spot.lat || 37.7749;
            const lngs = spot.lng || -122.4194;
            
            // Derive fixed random positions so they sit in different parts of our simulated map
            const offsetPositions = [
              { left: "25%", top: "35%" },
              { left: "55%", top: "22%" },
              { left: "75%", top: "65%" },
              { left: "38%", top: "78%" },
              { left: "15%", top: "58%" },
              { left: "82%", top: "15%" },
              { left: "45%", top: "48%" }
            ];
            
            const position = offsetPositions[idx % offsetPositions.length];
            const isSelected = selectedSpotId === spot.id;

            return (
              <button
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none transition-transform duration-200 active:scale-95"
                style={{ left: position.left, top: position.top }}
                title={`Marker: ${spot.name}`}
              >
                <div className="relative group/marker">
                  {/* Outer circle wave animate effect */}
                  {isSelected && (
                    <span className="absolute -inset-4 rounded-full bg-amber-500/30 animate-ping duration-2000" />
                  )}
                  {/* Styled design marker pin */}
                  <div className={`p-1.5 rounded-full shadow-lg border transition-all ${
                    isSelected 
                      ? "bg-amber-500 border-white text-white scale-110 z-30" 
                      : "bg-white border-zinc-300 text-zinc-900 group-hover/marker:bg-zinc-950 group-hover/marker:text-white"
                  }`}>
                    <MapPin className="h-4.5 w-4.5" />
                  </div>

                  {/* Compact glance hover tag (no doomscrolling, instant metrics) */}
                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-8 z-30 bg-zinc-950 text-white rounded-lg px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap shadow-xl flex items-center gap-1.5 transition-all duration-300 scale-90 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover/marker:opacity-100 group-hover/marker:translate-y-[-2px] pointer-events-none"
                  }`}>
                    <span>{spot.name}</span>
                    <span className="text-[9px] font-mono text-amber-300">★ {spot.googleRating}</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Simple Vector Route line simulation if a spot sits selected */}
          {mappedSpots.map((spot, idx) => {
            if (selectedSpotId && spot.id === selectedSpotId) {
              return (
                <svg key={`route-${spot.id}`} className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 50 100 Q 150 180, 250 250 T 400 300" 
                    fill="none" 
                    stroke="rgba(245, 158, 11, 0.6)" 
                    strokeWidth="35" 
                    strokeDasharray="6 4" 
                    className="animate-[dash_10s_linear_infinite]"
                  />
                </svg>
              );
            }
            return null;
          })}
        </div>

        {/* Selected Spot Details & Directions simulator panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 shrink-0">
            {mappedSpots.find(s => s.id === selectedSpotId) ? (() => {
              const activeSpot = mappedSpots.find(s => s.id === selectedSpotId)!;
              const priceConverted = Math.round(activeSpot.priceUsd * exchangeRate);
              
              return (
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono uppercase bg-[#FFF0E8] text-[#8C3E14] border border-[#ECCFB7]/60 px-2 py-0.5 rounded-full font-bold">
                        {activeSpot.city} curated
                      </span>
                      <h4 className="font-bold text-sm tracking-tight text-zinc-900 mt-1 font-display">
                        {activeSpot.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                        <Navigation className="h-3 w-3 text-amber-500 shrink-0" />
                        <span>Lat {activeCenter.lat.toFixed(4)}• Lng {Math.abs(activeCenter.lng).toFixed(4)}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-lg">
                      {currencySymbol}{priceConverted} menu avg
                    </span>
                  </div>

                  {/* High-density menu & physical environment details list */}
                  <div className="bg-white p-3 rounded-xl border border-zinc-100 text-[11px] leading-relaxed space-y-1.5 text-zinc-700">
                    <div>
                      <strong className="text-zinc-900 font-bold block text-[10px] uppercase font-mono tracking-wider">Aesthetic layout & smell:</strong>
                      <span>"{activeSpot.placeLayout || 'A highly crafted layout built of raw materials and custom lighting.'}"</span>
                    </div>
                    <div className="border-t border-zinc-100 pt-1.5 mt-1.5">
                      <strong className="text-zinc-900 font-bold block text-[10px] uppercase font-mono tracking-wider">Historical parameters & metrics:</strong>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-1">
                        <span className="text-[10px]">⭐ Google Map: <strong className="text-zinc-950 font-bold">{activeSpot.googleRating}/5</strong></span>
                        <span className="text-[10px]">💬 Yelp score: <strong className="text-zinc-950 font-bold">{activeSpot.yelpRating}/5</strong></span>
                        <span className="text-[10px]">📸 Instagram mentions: <strong className="text-zinc-950 font-bold">{activeSpot.instagramActivity}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Direction Link Action */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDirectionRequestSpot(activeSpot)}
                      className="flex-1 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs py-2 transition-all font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Link API Directions</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeSpot.name + " " + activeSpot.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 p-2 transition-colors flex items-center justify-center"
                      title="Open in actual Google Maps"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-6">
                <Compass className="h-6 w-6 text-zinc-400 mx-auto mb-2 animate-spin duration-5000" />
                <p className="text-xs font-semibold text-zinc-700 mb-1">Interactive GPS Overlay</p>
                <p className="text-[10px] text-zinc-400 max-w-xs mx-auto">Select any spot marker on the map to trigger detailed Google maps route, menu layout insights, and precise historical ratings.</p>
              </div>
            )}
          </div>

          {/* Planned city linkage feedback notification */}
          <AnimatePresence>
            {directionRequestSpot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex flex-col gap-1 text-emerald-800 relative"
              >
                <button 
                  onClick={() => setDirectionRequestSpot(null)}
                  className="absolute top-2 right-2 text-emerald-600 hover:text-emerald-900"
                >
                  ✕
                </button>
                <h5 className="font-bold text-xs flex items-center gap-1.5">
                  <Check className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5 shrink-0" />
                  <span>Google Maps SDK Linked</span>
                </h5>
                <p className="text-[10.5px] leading-tight">
                  Successfully requested route sequence from current location to **{directionRequestSpot.name}**! Simulated directions have been calculated on {directionRequestSpot.city} regional systems.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan to Link other cities Widget (Direct requirement) */}
          <div className="rounded-2xl border border-dashed border-zinc-300 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-zinc-500">
                Future Node Expansion
              </span>
              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-1.5 py-0.2 rounded">
                Plan Linkages
              </span>
            </div>
            <h4 className="font-bold text-xs text-zinc-900 mt-1 font-display">
              Where should hago link next?
            </h4>
            <p className="text-[10.5px] text-zinc-500 leading-tight">
              Our curators are continuously vetting spaces globally. Highlight cities below to connect them immediately into our network.
            </p>

            <div className="space-y-1.5 mt-2">
              {PLANNED_CITIES.map((city) => {
                const voted = votedCities.includes(city.name);
                return (
                  <div key={city.name} className="flex justify-between items-center text-xs p-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
                    <div>
                      <div className="font-bold text-zinc-800 flex items-center gap-1">
                        <span>{city.name}</span>
                        <span className="text-[8px] font-normal text-zinc-400">({city.country})</span>
                      </div>
                      <div className="text-[9px] text-zinc-400">{city.theme}</div>
                    </div>
                    <button
                      onClick={() => handleVoteCity(city.name)}
                      className={`px-2 py-1 rounded text-[9px] font-bold tracking-wide transition-all ${
                        voted 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                      }`}
                      disabled={voted}
                    >
                      {voted ? "Connected!" : "Vouch"}
                    </button>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {successVoteCity && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] text-emerald-700 text-right font-semibold mt-1"
                >
                  ✓ Curators added vouch vote for {successVoteCity}! Linking soon.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
