import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bookmark, 
  MapPin, 
  Instagram, 
  Layers, 
  UtensilsCrossed, 
  Star,
  ChevronLeft,
  ChevronRight,
  Info,
  ChevronDown,
  ChevronUp,
  Volume2,
  Moon,
  Users
} from "lucide-react";
import { Spot, CoViber } from "../types";

interface SpotCardProps {
  spot: Spot;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  coVibers: CoViber[];
  onOpenChat: (viber: CoViber) => void;
  onTagClick: (tag: string) => void;
  activeTags: string[];
  activeCurrency?: string;
  currencySymbol?: string;
  exchangeRate?: number;
}

export default function SpotCard({
  spot,
  isSaved,
  onToggleSave,
  coVibers,
  onOpenChat,
  onTagClick,
  activeTags,
  activeCurrency = "USD",
  currencySymbol = "$",
  exchangeRate = 1
}: SpotCardProps) {
  // Balanced picture layout: Dynamic multiple images from main picture & stories
  const images = [spot.image, ...(spot.stories || [])].filter(Boolean);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Translate average priceUsd into current target filter currency
  const convertedPrice = Math.round(spot.priceUsd * exchangeRate);
  const formattedPrice = activeCurrency === "JPY" || activeCurrency === "VND"
    ? `${currencySymbol}${convertedPrice.toLocaleString()}`
    : `${currencySymbol}${convertedPrice}`;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      layout
      className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white border border-[#ECCFB7]/40 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(236,207,183,0.18)] hover:border-amber-400/80"
      id={`spot-card-${spot.id}`}
    >
      {/* Visual Header - Interactive Story Carousel on the Card */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImageIndex}
            src={images[activeImageIndex]}
            alt={spot.name}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Floating City & Category Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
          <span className="rounded-full bg-white text-zinc-950 font-bold px-2.5 py-0.5 text-[9px] tracking-wider uppercase shadow-md font-mono">
            {spot.city}
          </span>
          <span className="rounded-full bg-zinc-950/80 text-amber-200 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase shadow-md">
            {spot.category}
          </span>
        </div>

        {/* Favorite/Save Toggle Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(spot.id);
          }}
          className={`absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 z-10 ${
            isSaved
              ? "bg-amber-500 text-white hover:scale-110 shadow-lg"
              : "bg-white/90 text-zinc-800 hover:bg-white hover:scale-110 shadow-md"
          }`}
          aria-label="Save this spot"
          id={`save-btn-${spot.id}`}
        >
          <Bookmark className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Image Ticker Indicators (Instagram Stories style dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-4 right-4 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all duration-350 ${
                  i === activeImageIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Manual Left/Right Image Changers on Hover */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={prevImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Card Info */}
      <div className="flex flex-1 flex-col p-4.5 bg-white">
        {/* Core Info - Sleek and Visual-centric */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold tracking-tight text-zinc-950 font-display">
              {spot.name}
            </h3>
            <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-800 tracking-wider">
              {spot.rating}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 mt-0.5">
            <p className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
              <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
              {spot.location} • <span className="font-mono text-zinc-600 font-bold">{spot.priceLevel} ({formattedPrice})</span>
            </p>
            
            <a
              href={`https://instagram.com/${spot.instagramHandle}`}
              target="_blank"
              rel="noopener"
              referrerPolicy="no-referrer"
              className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-pink-600 hover:text-pink-800 transition-colors uppercase font-mono tracking-close"
              title={`Explore business account @${spot.instagramHandle} on Instagram`}
            >
              <Instagram className="h-3 w-3 text-pink-500 shrink-0" />
              <span>@{spot.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Quick Ratings & Specs Bar - ALWAYS visible, direct integration */}
        <div className="mt-2.5 grid grid-cols-3 gap-1 p-1 bg-amber-50/10 border border-dashed border-[#ECCFB7]/35 rounded-xl text-center shadow-3xs">
          <div className="flex flex-col justify-center items-center py-1">
            <span className="text-[7.5px] font-black tracking-wider uppercase font-mono text-zinc-400">Google Rating</span>
            <div className="flex items-center gap-0.5 mt-0.5 text-[10.5px] font-extrabold text-amber-700">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{spot.googleRating || "4.8"}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center py-1 border-x border-zinc-200/60">
            <span className="text-[7.5px] font-black tracking-wider uppercase font-mono text-zinc-400">Yelp Score</span>
            <div className="flex items-center gap-0.5 mt-0.5 text-[10.5px] font-extrabold text-rose-600">
              <UtensilsCrossed className="h-2.5 w-2.5 text-rose-500 shrink-0" />
              <span>{spot.yelpRating || "4.7"}/5</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center py-1">
            <span className="text-[7.5px] font-black tracking-wider uppercase font-mono text-zinc-400">Instagram Feed</span>
            <div className="flex items-center justify-center gap-0.5 mt-0.5 text-[10px] font-extrabold text-pink-600 truncate max-w-full px-0.5">
              <span>{spot.instagramActivity ? spot.instagramActivity.split(" (")[0] : "Active"}</span>
            </div>
          </div>
        </div>

        {/* Sleek Short Description (Less words by default) */}
        <p className="mt-2 text-xs text-zinc-600 leading-relaxed font-sans line-clamp-2">
          {spot.description}
        </p>

        {/* Interactive Dynamic Vibe Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {spot.vibeTags.slice(0, 3).map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className={`rounded-full px-2 py-0.5 text-[8.5px] font-mono tracking-close transition-all ${
                  isActive
                    ? "bg-[#8C3E14] text-white border border-[#8C3E14]"
                    : "bg-[#FFF0E8]/60 text-[#8C3E14] hover:bg-[#FFF0E8] border border-[#ECCFB7]/40"
                }`}
                id={`tag-btn-${spot.id}-${tag}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* 🥞 Prominent Menu Highlights */}
        {spot.menuHighlights && spot.menuHighlights.length > 0 && (
          <div className="mt-3 bg-[#FAF8F5] border border-[#ECCFB7]/30 rounded-2xl p-3 shadow-3xs">
            <div className="flex items-center gap-1.5 text-[9.5px] font-black text-[#8C3E14] uppercase tracking-wider font-mono mb-1.5">
              <span>🥞 Menu Specialties</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {spot.menuHighlights.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#ECCFB7]/20 px-2 py-0.5 text-[10px] font-medium text-zinc-800"
                >
                  <div className="h-1 w-1 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 🪴 Prominent Physical Space Design */}
        {spot.placeLayout && (
          <div className="mt-2.5 bg-emerald-50/15 border border-emerald-100/40 rounded-2xl p-3 shadow-3xs">
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-800 uppercase tracking-wider font-bold mb-1">
              <Layers className="h-3 w-3 text-emerald-600" />
              <span>🪵 Indoor Ambiance</span>
            </div>
            <p className="text-[10.5px] leading-relaxed text-zinc-600 italic font-sans">
              &ldquo;{spot.placeLayout}&rdquo;
            </p>
          </div>
        )}

        {/* COMPREHENSIVE CURATION ACCORDION (Balance of detailed info) */}
        <div className="mt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 border-t border-b border-dashed border-[#ECCFB7]/45 text-[9px] font-bold text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-widest font-mono"
            id={`toggle-details-btn-${spot.id}`}
          >
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-zinc-400 shrink-0" />
              {isExpanded ? "Hide Atmosphere Specs" : "Show Atmosphere Specs"}
            </span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
 
          {/* Smooth expandable list section populated under click */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden bg-[#FAF9F6]/50"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="py-3 px-1 space-y-3 test-content">
              {/* Ambient indicators */}
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-[#ECCFB7]/25 bg-white p-1.5 text-[10px] font-medium text-zinc-700 shadow-3xs">
                <div className="text-center">
                  <span className="text-[8px] uppercase font-mono text-zinc-400">Lighting</span>
                  <p className="font-bold text-zinc-850 truncate px-0.5">{spot.lighting}</p>
                </div>
                <div className="text-center border-x border-zinc-150">
                  <span className="text-[8px] uppercase font-mono text-zinc-400">Acoustics</span>
                  <p className="font-bold text-zinc-850 truncate px-0.5">{spot.noise}</p>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase font-mono text-zinc-400">Seating</span>
                  <p className="font-bold text-zinc-850 truncate px-0.5">{spot.seating}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer: Dynamic Meetup Linking (Replaces "coVibers" with "Meetups") */}
        <div className="mt-3 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {coVibers.length > 0 ? (
              <div className="flex items-center -space-x-1">
                {coVibers.slice(0, 3).map((viber) => (
                  <button
                    key={viber.id}
                    onClick={() => onOpenChat(viber)}
                    className="relative shrink-0 transition-transform hover:scale-110"
                    title={`Message @${viber.instagramHandle} to meetup here`}
                    id={`meetup-viber-btn-${viber.id}`}
                  >
                    <img
                      src={viber.profilePic}
                      alt={viber.fullName}
                      className="h-5.5 w-5.5 rounded-full object-cover border border-white shadow-sm"
                    />
                  </button>
                ))}
                <span className="pl-1.5 text-[9px] font-mono font-bold text-zinc-500 flex items-center gap-0.5">
                  <Users className="h-3 w-3 text-zinc-400" />
                  <span>+{spot.coVibersCount} active for Meetups</span>
                </span>
              </div>
            ) : (
              <span className="text-[9.5px] text-zinc-400 font-mono">
                {spot.savedCount || 120}+ saved spots
              </span>
            )}
          </div>

          <a
            href={`https://instagram.com/${spot.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zinc-50 hover:bg-pink-50 p-1.5 text-zinc-400 hover:text-pink-600 transition-colors shrink-0 border border-zinc-200/50"
            title={`View @${spot.instagramHandle} curation on Instagram`}
          >
            <Instagram className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </motion.div>
  );
}
