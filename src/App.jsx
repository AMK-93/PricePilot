import React, { useState, useContext, createContext } from "react";
import {
  Search, Home, Heart, Bell, User, ChevronLeft, Star, Truck,
  Sun, Moon, Globe, DollarSign, Plus, X, Check, TrendingUp,
  Clock, ShoppingBag, Smartphone, Sofa, Shirt, Apple as AppleIcon, Dumbbell,
} from "lucide-react";

/* ---------------- design tokens (light + dark) ---------------- */
const LIGHT = {
  bg: "#F6F8FC",
  card: "#FFFFFF",
  ink: "#0E1B33",
  inkSoft: "#5B6B85",
  blue: "#1D4ED8",
  blueSoft: "#EAF0FE",
  blueDeep: "#123C9E",
  green: "#2FBE8F",
  greenSoft: "#E6F9F2",
  line: "#E7ECF4",
  gold: "#F5A623",
};
const DARK = {
  bg: "#0B1220",
  card: "#141B2E",
  ink: "#F1F5FB",
  inkSoft: "#8B96AE",
  blue: "#4C82FF",
  blueSoft: "#1B2542",
  blueDeep: "#7FA8FF",
  green: "#33D399",
  greenSoft: "#123526",
  line: "#232C42",
  gold: "#F5C463",
};
const ThemeContext = createContext(LIGHT);
const useTheme = () => useContext(ThemeContext);

const displayFont = "'Manrope', system-ui, sans-serif";
const bodyFont = "'Inter', system-ui, sans-serif";

/* ---------------- sample data (GCC market) ---------------- */
const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: Smartphone },
  { id: "home", label: "Home", icon: Sofa },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "grocery", label: "Grocery", icon: AppleIcon },
  { id: "sports", label: "Sports", icon: Dumbbell },
];

/* Every store below has a confirmed GCC-region affiliate program (verified
   via ArabClicks, DCMnetwork, or the retailer's own program), spanning
   large international names and regional/local GCC chains, so the
   comparison table isn't limited to just 2-3 big names. "local: true"
   marks GCC-headquartered or GCC-only chains, shown to the user so it's
   clear this app supports local businesses, not just international giants. */
const STORES = {
  amazon: { name: "Amazon.ae", color: "#FF9900", cat: "electronics", local: false },
  noon: { name: "Noon", color: "#FEEE00", cat: "electronics", local: false },
  sharaf: { name: "Sharaf DG", color: "#D71920", cat: "electronics", local: true },
  jarir: { name: "Jarir", color: "#0072BC", cat: "electronics", local: true },
  extra: { name: "Extra", color: "#E4002B", cat: "electronics", local: true },
  banggood: { name: "Banggood", color: "#FF6600", cat: "electronics", local: false },
  namshi: { name: "Namshi", color: "#000000", cat: "fashion", local: true },
  ounass: { name: "Ounass", color: "#B08D57", cat: "fashion", local: true },
  farfetch: { name: "Farfetch", color: "#000000", cat: "fashion", local: false },
  sixthstreet: { name: "6th Street", color: "#111111", cat: "fashion", local: true },
  danubehome: { name: "Danube Home", color: "#C8102E", cat: "home", local: true },
  homecentre: { name: "Home Centre", color: "#00539F", cat: "home", local: true },
  carrefour: { name: "Carrefour", color: "#004E9E", cat: "grocery", local: false },
  ourshoppe: { name: "Our Shoppe", color: "#F26522", cat: "grocery", local: true },
  myprotein: { name: "Myprotein", color: "#1A1A1A", cat: "sports", local: false },
  iherb: { name: "iHerb", color: "#71B62C", cat: "grocery", local: false },
};

/* Stores grouped by category, for the browsable directory */
const STORE_GROUPS = Object.entries(STORES).reduce((groups, [id, store]) => {
  (groups[store.cat] ||= []).push({ id, ...store });
  return groups;
}, {});

const PRODUCTS = [
  {
    id: 1, name: "iPhone 15 Pro 128GB", cat: "electronics",
    img: "📱", rating: 4.8, reviews: 2140, lastUpdated: "2 hours ago",
    specs: ["6.1\" Super Retina XDR", "A17 Pro chip", "48MP camera", "Titanium build"],
    ai: "Consistently praised for camera quality and build. A few reviewers note battery life is average for heavy users — otherwise the top pick in this price tier.",
    history: [359.0, 356.5, 352.0, 348.9, 345.0, 349.9, 344.5, 342.5],
    prices: [
      { store: "amazon", price: 349.900, shipping: 0, delivery: "Tomorrow", affiliateLink: "https://amazon.ae/dp/EXAMPLE?tag=pricepilot-21", inStock: true },
      { store: "noon", price: 342.500, shipping: 1.500, delivery: "2 days", affiliateLink: "https://noon.com/track?ref=pricepilot&id=IPH15PRO128", inStock: true, couponCode: "NOON20" },
      { store: "sharaf", price: 359.000, shipping: 0, delivery: "Today", affiliateLink: "https://sharafdg.com/track?ref=pricepilot&id=IPH15PRO128", inStock: true },
      { store: "jarir", price: 355.750, shipping: 2.000, delivery: "3 days", affiliateLink: "https://jarir.com/track?ref=pricepilot&id=IPH15PRO128", inStock: true },
    ],
  },
  {
    id: 2, name: "Sony WH-1000XM5 Headphones", cat: "electronics",
    img: "🎧", rating: 4.7, reviews: 980, lastUpdated: "5 hours ago",
    specs: ["Industry-leading ANC", "30hr battery", "Multipoint pairing", "Touch controls"],
    ai: "Best-in-class noise cancelling according to most reviewers. Comfortable for long wear; a minority found the case bulky for travel.",
    history: [96.0, 94.5, 92.0, 93.5, 89.9, 88.0, 84.0],
    prices: [
      { store: "amazon", price: 89.900, shipping: 0, delivery: "Tomorrow", affiliateLink: "https://amazon.ae/dp/EXAMPLE2?tag=pricepilot-21", inStock: true },
      { store: "extra", price: 84.000, shipping: 2.500, delivery: "4 days", affiliateLink: "https://extra.com/track?ref=pricepilot&id=SONYXM5", inStock: true, couponCode: "EXTRA10" },
      { store: "noon", price: 91.250, shipping: 0, delivery: "2 days", affiliateLink: "https://noon.com/track?ref=pricepilot&id=SONYXM5", inStock: true },
    ],
  },
  {
    id: 3, name: "Samsung 55\" 4K QLED TV", cat: "electronics",
    img: "📺", rating: 4.5, reviews: 610, lastUpdated: "1 hour ago",
    specs: ["QLED HDR10+", "120Hz refresh", "Smart TV, Tizen OS", "3x HDMI 2.1"],
    ai: "Strong value for the panel quality. Sound is described as thin by several reviewers — a soundbar is commonly recommended alongside it.",
    history: [265.0, 262.0, 258.0, 250.0, 245.0, 242.0, 239.5],
    prices: [
      { store: "sharaf", price: 249.000, shipping: 5.000, delivery: "3 days", affiliateLink: "https://sharafdg.com/track?ref=pricepilot&id=SAMSTV55", inStock: true },
      { store: "extra", price: 239.500, shipping: 5.000, delivery: "5 days", affiliateLink: "https://extra.com/track?ref=pricepilot&id=SAMSTV55", inStock: true },
      { store: "jarir", price: 255.000, shipping: 0, delivery: "2 days", affiliateLink: "https://jarir.com/track?ref=pricepilot&id=SAMSTV55", inStock: true },
    ],
  },
  {
    id: 4, name: "Nike Air Zoom Pegasus 40", cat: "fashion",
    img: "👟", rating: 4.6, reviews: 1420, lastUpdated: "4 hours ago",
    specs: ["Responsive foam", "Breathable mesh", "Road running", "Available in 6 colors"],
    ai: "Reviewers consistently call this a reliable daily trainer. Sizing runs slightly small — most suggest ordering half a size up.",
    history: [36.9, 36.9, 35.0, 34.5, 33.9, 32.9, 32.9],
    prices: [
      { store: "noon", price: 32.900, shipping: 1.000, delivery: "2 days", affiliateLink: "https://noon.com/track?ref=pricepilot&id=NIKEPEG40", inStock: false },
      { store: "amazon", price: 34.500, shipping: 0, delivery: "Tomorrow", affiliateLink: "https://amazon.ae/dp/EXAMPLE4?tag=pricepilot-21", inStock: true },
    ],
  },
  {
    id: 5, name: "Adidas Ultraboost 22", cat: "fashion",
    img: "👟", rating: 4.7, reviews: 860, lastUpdated: "6 hours ago",
    specs: ["Boost midsole", "Primeknit upper", "Continental rubber outsole", "Available in 8 colors"],
    ai: "Praised for all-day comfort and energy return. A few reviewers mention the knit upper shows wear faster than expected with heavy daily use.",
    history: [46.0, 45.5, 44.0, 42.5, 41.9, 39.9, 38.500],
    prices: [
      { store: "noon", price: 38.500, shipping: 1.000, delivery: "2 days", affiliateLink: "https://noon.com/track?ref=pricepilot&id=ADIUB22", inStock: true },
      { store: "sharaf", price: 41.000, shipping: 0, delivery: "Today", affiliateLink: "https://sharafdg.com/track?ref=pricepilot&id=ADIUB22", inStock: true },
    ],
  },
  {
    id: 6, name: "Levi's 501 Original Jeans", cat: "fashion",
    img: "👖", rating: 4.5, reviews: 2210, lastUpdated: "3 hours ago",
    specs: ["100% cotton denim", "Straight fit", "Button fly", "Classic 5-pocket styling"],
    ai: "Reviewers consistently call this the most reliable classic fit. Sizing is described as true to size for most, running slightly long in the leg.",
    history: [22.0, 21.5, 20.9, 19.900, 18.9, 18.500, 18.500],
    prices: [
      { store: "noon", price: 18.500, shipping: 1.000, delivery: "2 days", affiliateLink: "https://noon.com/track?ref=pricepilot&id=LEVI501", inStock: true },
      { store: "amazon", price: 19.900, shipping: 0, delivery: "Tomorrow", affiliateLink: "https://amazon.ae/dp/EXAMPLE6?tag=pricepilot-21", inStock: true },
    ],
  },
  {
    id: 7, name: "3-Seater Fabric Sofa", cat: "home",
    img: "🛋️", rating: 4.4, reviews: 340, lastUpdated: "1 day ago",
    specs: ["Solid wood frame", "High-density foam", "Removable covers", "Grey or beige"],
    ai: "Reviewers say assembly is straightforward and the cushions hold shape well after months of use. A few mention delivery scheduling can run a day or two behind the estimate.",
    history: [199.0, 195.0, 189.0, 185.0, 179.900, 179.900, 174.000],
    prices: [
      { store: "danubehome", price: 174.000, shipping: 0, delivery: "5 days", affiliateLink: "https://danubehome.com/track?ref=pricepilot&id=SOFA3S", inStock: true },
      { store: "homecentre", price: 179.900, shipping: 0, delivery: "4 days", affiliateLink: "https://homecentre.com/track?ref=pricepilot&id=SOFA3S", inStock: true },
    ],
  },
  {
    id: 8, name: "Weekly Grocery Essentials Pack", cat: "grocery",
    img: "🛒", rating: 4.3, reviews: 190, lastUpdated: "30 minutes ago",
    specs: ["Rice, pasta & staples", "Dairy & eggs", "Fresh produce box", "Household cleaning basics"],
    ai: "Reviewers say the freshness of produce is consistent and substitutions are rare. A few note prices fluctuate week to week more than in-store, so checking before ordering helps.",
    history: [15.5, 15.200, 14.900, 15.000, 14.700, 14.500, 14.250],
    prices: [
      { store: "carrefour", price: 14.250, shipping: 1.000, delivery: "Today", affiliateLink: "https://carrefouruae.com/track?ref=pricepilot&id=GROCPACK", inStock: true },
      { store: "ourshoppe", price: 14.900, shipping: 0, delivery: "Tomorrow", affiliateLink: "https://ourshopee.com/track?ref=pricepilot&id=GROCPACK", inStock: true },
    ],
  },
];

const TRENDING = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[4]];
const RECENT_SEARCHES = ["iPhone 15", "Wireless headphones", "Running shoes"];

/* "For You" — trending items plus anything matching the customer's recent
   searches, deduplicated. Replaces a flat "All" tab so the default view
   feels curated rather than every category mixed together. In production
   this would also factor in past purchases/clicks, not just searches. */
const FOR_YOU = (() => {
  const seen = new Set();
  const list = [];
  const add = (p) => { if (!seen.has(p.id)) { seen.add(p.id); list.push(p); } };
  TRENDING.forEach(add);
  RECENT_SEARCHES.forEach((term) => {
    const words = term.toLowerCase().split(" ");
    PRODUCTS.forEach((p) => {
      const name = p.name.toLowerCase();
      if (words.some((w) => w.length > 2 && name.includes(w))) add(p);
    });
  });
  return list;
})();

const fmt = (n) => `BHD ${n.toFixed(3)}`;
const lowest = (p) => p.prices.reduce((a, b) => (a.price + a.shipping < b.price + b.shipping ? a : b));

/* delivery strings -> comparable days */
const deliveryDays = (label) => {
  if (/today/i.test(label)) return 0;
  if (/tomorrow/i.test(label)) return 1;
  const m = label.match(/\d+/);
  return m ? parseInt(m[0], 10) : 3;
};

/* Value Score — "best deal" not just "cheapest". Built only from data we can
   automate from a real feed (total cost, delivery speed) — no manual fields
   like warranty yet. Weighting is intentionally visible in the UI (not a
   black-box "AI verdict") so users can see exactly why a store scores the
   way it does:
     65% total cost (price + shipping) — the biggest factor
     35% delivery speed — real convenience value, automatable from the feed
   Each store's raw numbers are scaled 0–10 relative to the other partner
   stores offering the same product. */
const WEIGHT_COST = 0.65;
const WEIGHT_DELIVERY = 0.35;

function computeValueScores(prices) {
  const totalCosts = prices.map((p) => p.price + p.shipping);
  const days = prices.map((p) => deliveryDays(p.delivery));
  const minCost = Math.min(...totalCosts), maxCost = Math.max(...totalCosts);
  const minDay = Math.min(...days), maxDay = Math.max(...days);

  return prices.map((p, i) => {
    const costScore = maxCost === minCost ? 10 : 10 * (1 - (totalCosts[i] - minCost) / (maxCost - minCost));
    const deliveryScore = maxDay === minDay ? 10 : 10 * (1 - (days[i] - minDay) / (maxDay - minDay));
    const value = costScore * WEIGHT_COST + deliveryScore * WEIGHT_DELIVERY;
    return { ...p, costScore, deliveryScore, valueScore: Math.round(value * 10) / 10 };
  });
}

/* the store to lead with — highest value score, but never one that's out
   of stock (falls back to all stores only if every option is unavailable) */
function bestValue(prices) {
  const scored = computeValueScores(prices).sort((a, b) => b.valueScore - a.valueScore);
  return scored.find((p) => p.inStock !== false) || scored[0];
}

/* ---------------- shared bits ---------------- */
function TopBar({ title, onBack }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 12px" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: C.blueSoft, border: "none", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color={C.blue} />
        </button>
      )}
      <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 20, color: C.ink }}>{title}</div>
    </div>
  );
}

function RatingRow({ rating, reviews }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.inkSoft }}>
      <Star size={13} fill={C.gold} color={C.gold} />
      <span style={{ fontWeight: 700, color: C.ink }}>{rating}</span>
      {reviews && <span>({reviews.toLocaleString()})</span>}
    </div>
  );
}

/* price confidence bar — signature element: shows where a price sits vs the market range */
function PriceConfidenceBar({ price, all }) {
  const C = useTheme();
  const min = Math.min(...all.map((p) => p.price));
  const max = Math.max(...all.map((p) => p.price));
  const pct = max === min ? 0 : ((price - min) / (max - min)) * 100;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 5, borderRadius: 4, background: "linear-gradient(90deg,#2FBE8F,#F5A623,#E4572E)", position: "relative" }}>
        <div style={{ position: "absolute", left: `calc(${pct}% - 4px)`, top: -2.5, width: 9, height: 9, borderRadius: 999, background: C.ink, border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.inkSoft, marginTop: 3 }}>
        <span>Best price</span><span>Highest price</span>
      </div>
    </div>
  );
}

/* price history chart — shows the last several price points as a simple line,
   so users can tell if a "deal" is actually a good one over time */
function PriceHistoryChart({ history }) {
  const C = useTheme();
  const w = 300, h = 70, pad = 8;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (history.length - 1);
  const points = history.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return `${x},${y}`;
  }).join(" ");
  const last = history[history.length - 1];
  const first = history[0];
  const trendDown = last < first;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={trendDown ? C.green : C.gold} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.inkSoft, marginTop: 2 }}>
        <span>{history.length}-check history</span>
        <span style={{ color: trendDown ? C.green : C.gold, fontWeight: 700 }}>
          {trendDown ? "↓ trending down" : "↑ trending up"}
        </span>
      </div>
    </div>
  );
}

/* transparency note — makes clear PricePilot compares a curated set of
   partner stores, not "everywhere", which builds trust rather than
   overpromising coverage it can't maintain solo */
function PartnerStoresNote({ onBrowse }) {
  const C = useTheme();
  const storeCount = Object.keys(STORES).length;
  const catCount = Object.keys(STORE_GROUPS).length;
  return (
    <div onClick={onBrowse} style={{ background: C.blueSoft, borderRadius: 12, padding: "10px 12px", fontSize: 11, color: C.inkSoft, lineHeight: 1.5, cursor: onBrowse ? "pointer" : "default" }}>
      <span style={{ fontWeight: 700, color: C.blueDeep }}>{storeCount} partner stores across {catCount} categories </span>
      — big regional chains and local GCC businesses alike. We only compare stores we have a direct relationship with, so every price shown is accurate and current.
      {onBrowse && <span style={{ display: "block", marginTop: 4, fontWeight: 700, color: C.blue }}>See all stores →</span>}
    </div>
  );
}

/* coupon chip — copies a code to the clipboard with brief confirmation.
   Codes come from the same affiliate networks as the price feed (most
   provide tracking coupons alongside product data), not entered manually. */
function CouponChip({ code }) {
  const C = useTheme();
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: `1px dashed ${C.green}`, borderRadius: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: C.green, cursor: "pointer" }}>
      🏷️ {code} {copied ? "· Copied!" : "· Tap to copy"}
    </button>
  );
}

function ProductCard({ product, onOpen, onFav, isFav }) {
  const C = useTheme();
  const best = bestValue(product.prices);
  const store = STORES[best.store];
  return (
    <div onClick={() => onOpen(product)} style={{ background: C.card, borderRadius: 18, padding: 14, boxShadow: "0 2px 10px rgba(14,27,51,0.06)", position: "relative", cursor: "pointer" }}>
      <div style={{ position: "absolute", top: 10, left: 10, background: C.greenSoft, color: C.green, fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 999 }}>
        BEST VALUE
      </div>
      <button onClick={(e) => { e.stopPropagation(); onFav(product.id); }} style={{ position: "absolute", top: 10, right: 10, background: C.card, border: "none", borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <Heart size={15} fill={isFav ? "#E4572E" : "none"} color={isFav ? "#E4572E" : C.inkSoft} />
      </button>
      <div style={{ fontSize: 48, textAlign: "center", padding: "18px 0 10px" }}>{product.img}</div>
      <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 4 }}>{product.name}</div>
      <RatingRow rating={product.rating} reviews={product.reviews} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
        <span style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 19, color: C.blueDeep }}>{fmt(best.price)}</span>
        <span style={{ fontSize: 11, color: C.inkSoft }}>at {store.name}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: C.blueDeep, background: C.blueSoft, borderRadius: 999, padding: "1px 6px", marginLeft: "auto" }}>⭐ {best.valueScore.toFixed(1)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, fontSize: 11, color: C.inkSoft }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Truck size={12} /> {best.shipping === 0 ? "Free shipping" : fmt(best.shipping)}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {best.delivery}</span>
      </div>
      <div style={{ fontSize: 9.5, color: C.inkSoft, opacity: 0.75, marginTop: 4 }}>Updated {product.lastUpdated}</div>
    </div>
  );
}

/* brief confirmation toast — gives instant feedback for actions like
   setting an alert, instead of leaving the user guessing whether a tap
   registered */
function Toast({ message }) {
  const C = useTheme();
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", maxWidth: 420, width: "calc(100% - 40px)", background: C.ink, color: "white", borderRadius: 12, padding: "12px 16px", fontSize: 12.5, fontWeight: 600, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", zIndex: 50 }}>
      {message}
    </div>
  );
}

function BottomNav({ screen, go }) {
  const C = useTheme();
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "favorites", icon: Heart, label: "Favorites" },
    { id: "alerts", icon: Bell, label: "Alerts" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.card, borderTop: `1px solid ${C.line}`, display: "flex", padding: "10px 6px 18px", justifyContent: "space-around", zIndex: 10 }}>
      {items.map((it) => {
        const active = screen === it.id;
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => go(it.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Icon size={21} color={active ? C.blue : C.inkSoft} fill={active && it.id === "favorites" ? C.blue : "none"} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.blue : C.inkSoft }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- screens ---------------- */
function Welcome({ go }) {
  const C = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [signingIn, setSigningIn] = useState(null); // "google" | "apple" | null

  // Mock social sign-in — in production this calls Supabase/Firebase Auth's
  // real Google/Apple OAuth flow. No passwords for PricePilot to store or
  // secure, and no email-verification flow to build ourselves.
  const socialSignIn = (provider) => {
    setSigningIn(provider);
    setTimeout(() => { setSigningIn(null); go("home"); }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", background: `linear-gradient(180deg, ${C.blueDeep} 0%, ${C.blue} 55%, #3B7CF5 100%)`, padding: "60px 28px 40px", color: "white" }}>
      <div />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 86, height: 86, background: "rgba(255,255,255,0.15)", borderRadius: 24, margin: "0 auto 22px", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <ShoppingBag size={40} color="white" />
        </div>
        <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 30, letterSpacing: -0.5 }}>PricePilot</div>
        <div style={{ fontFamily: bodyFont, fontSize: 15, opacity: 0.85, marginTop: 8 }}>Find the best price in seconds</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {showForm ? (
          <>
            <input
              autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              style={{ background: "rgba(255,255,255,0.95)", color: C.ink, border: "none", borderRadius: 14, padding: "14px 16px", fontSize: 14, fontFamily: bodyFont, outline: "none" }}
            />
            <button
              onClick={() => go("home")}
              disabled={!email.includes("@")}
              style={{ background: email.includes("@") ? "white" : "rgba(255,255,255,0.4)", color: C.blueDeep, fontWeight: 700, fontSize: 15, border: "none", borderRadius: 14, padding: "15px 0", fontFamily: bodyFont, cursor: email.includes("@") ? "pointer" : "not-allowed" }}
            >
              Continue
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: "none", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 13, border: "none", padding: "4px 0", fontFamily: bodyFont }}>Back</button>
          </>
        ) : (
          <>
            <button
              onClick={() => socialSignIn("google")}
              disabled={!!signingIn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "white", color: C.ink, fontWeight: 700, fontSize: 14.5, border: "none", borderRadius: 14, padding: "13px 0", fontFamily: bodyFont, cursor: "pointer" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z"/></svg>
              {signingIn === "google" ? "Signing in…" : "Continue with Google"}
            </button>
            <button
              onClick={() => socialSignIn("apple")}
              disabled={!!signingIn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#000", color: "white", fontWeight: 700, fontSize: 14.5, border: "none", borderRadius: 14, padding: "13px 0", fontFamily: bodyFont, cursor: "pointer" }}
            >
              <svg width="15" height="18" viewBox="0 0 15 18" fill="white"><path d="M12.3 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2 1-.04 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1-.02 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.02 0-2.1-.8-2.2-3.2zM10.4 3.1c.6-.7 1-1.7.9-2.7-.9.04-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z"/></svg>
              {signingIn === "apple" ? "Signing in…" : "Continue with Apple"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontSize: 11, opacity: 0.7 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.25)" }} />
            </div>
            <button onClick={() => setShowForm(true)} style={{ background: "rgba(255,255,255,0.12)", color: "white", fontWeight: 600, fontSize: 14, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 14, padding: "12px 0", fontFamily: bodyFont, cursor: "pointer" }}>Continue with email</button>
            <button onClick={() => go("home")} style={{ background: "none", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 13, border: "none", padding: "6px 0", fontFamily: bodyFont, cursor: "pointer" }}>Continue as Guest</button>
          </>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ go, openSearch, favorites, toggleFav, openProduct }) {
  const C = useTheme();
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: "22px 20px 6px" }}>
        <div style={{ fontSize: 13, color: C.inkSoft }}>Good evening 👋</div>
        <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 22, color: C.ink }}>Find your best price</div>
      </div>
      <div style={{ padding: "14px 20px" }}>
        <div onClick={() => openSearch()} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "13px 16px", boxShadow: "0 2px 8px rgba(14,27,51,0.05)" }}>
          <Search size={18} color={C.inkSoft} />
          <span style={{ color: C.inkSoft, fontSize: 14 }}>Search for any product…</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "4px 20px 18px", overflowX: "auto" }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.id} onClick={() => openSearch(c.id)} style={{ minWidth: 74, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} color={C.blue} />
              </div>
              <span style={{ fontSize: 11, color: C.ink, fontWeight: 600 }}>{c.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ marginBottom: 18 }}>
          <PartnerStoresNote onBrowse={() => go("stores")} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <TrendingUp size={16} color={C.green} />
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.ink }}>Trending now</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {TRENDING.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={openProduct} onFav={toggleFav} isFav={favorites.includes(p.id)} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Clock size={16} color={C.inkSoft} />
          <span style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 15, color: C.ink }}>Recent searches</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {RECENT_SEARCHES.map((s) => (
            <div key={s} onClick={() => openSearch()} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 14px", fontSize: 12.5, color: C.ink, cursor: "pointer" }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchResults({ go, favorites, toggleFav, openProduct, initialCategory }) {
  const C = useTheme();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCategory || "foryou");
  // "For You" with no typed query shows the curated recommendation list;
  // typing a query always searches the full catalog since that's an
  // explicit request, not a browsing preference. Picking a specific
  // category always filters to that category.
  const pool = cat === "foryou" ? (q ? PRODUCTS : FOR_YOU) : PRODUCTS.filter((p) => p.cat === cat);
  const filtered = pool.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "12px 16px" }}>
          <Search size={17} color={C.inkSoft} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for any product…" style={{ border: "none", outline: "none", fontSize: 14, flex: 1, fontFamily: bodyFont }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "2px 20px 10px", overflowX: "auto" }}>
        <button onClick={() => setCat("foryou")} style={{ flexShrink: 0, border: "none", borderRadius: 999, padding: "6px 13px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: cat === "foryou" ? C.blue : C.blueSoft, color: cat === "foryou" ? "white" : C.blue }}>For You</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink: 0, border: "none", borderRadius: 999, padding: "6px 13px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: cat === c.id ? C.blue : C.blueSoft, color: cat === c.id ? "white" : C.blue }}>{c.label}</button>
        ))}
      </div>
      {cat === "foryou" && !q && (
        <div style={{ padding: "0 20px 8px", fontSize: 11, color: C.inkSoft }}>Based on what's trending and what you've searched for</div>
      )}
      <div style={{ padding: "0 20px", fontSize: 12, color: C.inkSoft }}>{filtered.length} results</div>
      <div style={{ padding: "12px 20px 90px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((p) => {
          const pBest = bestValue(p.prices);
          return (
          <div key={p.id} onClick={() => openProduct(p)} style={{ background: C.card, borderRadius: 16, padding: 12, display: "flex", gap: 12, boxShadow: "0 2px 8px rgba(14,27,51,0.05)", position: "relative", cursor: "pointer" }}>
            <div style={{ fontSize: 40, width: 64, height: 64, background: C.blueSoft, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 13.5, color: C.ink }}>{p.name}</div>
              <RatingRow rating={p.rating} reviews={p.reviews} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: C.blueDeep, fontFamily: displayFont }}>{fmt(pBest.price)}</span>
                <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>best value at {STORES[pBest.store].name}</span>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }} style={{ background: "none", border: "none", alignSelf: "start" }}>
              <Heart size={16} fill={favorites.includes(p.id) ? "#E4572E" : "none"} color={favorites.includes(p.id) ? "#E4572E" : C.inkSoft} />
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductDetails({ product, onBack, favorites, toggleFav, addAlert, stockAlerts, toggleStockAlert, alerts, alertTargets, adjustTarget, showToast }) {
  const C = useTheme();
  if (!product) return null;
  const isFav = favorites.includes(product.id);
  const scored = computeValueScores(product.prices).sort((a, b) => b.valueScore - a.valueScore);
  const inStockScored = scored.filter((p) => p.inStock !== false);
  const best = inStockScored[0] || scored[0];
  const cheapest = [...inStockScored].sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping))[0] || best;
  const bestIsCheapest = best.store === cheapest.store;
  return (
    <div style={{ paddingBottom: 100 }}>
      <TopBar title="Product Details" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: C.blueSoft, borderRadius: 20, padding: "36px 0", textAlign: "center", fontSize: 76, position: "relative" }}>
          {product.img}
          <button onClick={() => toggleFav(product.id)} style={{ position: "absolute", top: 14, right: 14, background: C.card, border: "none", borderRadius: 999, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
            <Heart size={16} fill={isFav ? "#E4572E" : "none"} color={isFav ? "#E4572E" : C.inkSoft} />
          </button>
        </div>

        <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 19, color: C.ink, marginTop: 16 }}>{product.name}</div>
        <RatingRow rating={product.rating} reviews={product.reviews} />
        <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 4 }}>Prices updated {product.lastUpdated}</div>

        <div style={{ marginTop: 16, background: C.greenSoft, borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: 0.4 }}>BEST DEAL</div>
          <div style={{ fontSize: 13, color: C.ink, marginTop: 5, lineHeight: 1.5 }}>
            {bestIsCheapest
              ? `${STORES[best.store].name} is both the cheapest total cost and the fastest delivery among partner stores — the clear best value here.`
              : `${STORES[cheapest.store].name} has the lowest total cost at ${fmt(cheapest.price + cheapest.shipping)}, but ${STORES[best.store].name}'s faster delivery (${best.delivery}) gives it the higher overall Value Score — worth the small difference for most buyers.`}
          </div>
        </div>

        <div style={{ marginTop: 16, background: C.greenSoft, borderRadius: 16, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: 0.4 }}>AI SUMMARY</div>
          <div style={{ fontSize: 13, color: C.ink, marginTop: 5, lineHeight: 1.5 }}>{product.ai}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 8 }}>Price history</div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px" }}>
            <PriceHistoryChart history={product.history} />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 8 }}>Specifications</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {product.specs.map((s) => (
              <div key={s} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 10px", fontSize: 11.5, color: C.inkSoft }}>{s}</div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 14.5, color: C.ink, marginBottom: 10 }}>Compare stores — by best value</div>
          <div style={{ marginBottom: 8 }}>
            <PartnerStoresNote />
          </div>
          <div style={{ background: C.blueSoft, borderRadius: 12, padding: "9px 12px", fontSize: 10.5, color: C.inkSoft, marginBottom: 10, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: C.blueDeep }}>How Value Score works: </span>
            65% total cost (price + shipping) + 35% delivery speed, scored 0–10 against the other partner stores for this product. Warranty and other factors aren't included yet — only what we can verify automatically.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scored.map((p) => {
              const store = STORES[p.store];
              const isBest = p.store === best.store;
              const isCheapestOnly = p.store === cheapest.store && !bestIsCheapest;
              const alertKey = `${product.id}-${p.store}`;
              const wantsNotify = stockAlerts?.includes(alertKey);
              return (
                <div key={p.store} style={{ background: C.card, borderRadius: 14, padding: 12, border: isBest ? `1.5px solid ${C.green}` : `1px solid ${C.line}`, position: "relative", opacity: p.inStock ? 1 : 0.85 }}>
                  {isBest && p.inStock && <div style={{ position: "absolute", top: -9, left: 12, background: C.green, color: "white", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>BEST VALUE</div>}
                  {isCheapestOnly && p.inStock && <div style={{ position: "absolute", top: -9, left: 12, background: C.gold, color: "white", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 999 }}>CHEAPEST</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{store.name}</span>
                        {p.inStock && <span style={{ fontSize: 10.5, fontWeight: 800, color: C.blueDeep, background: C.blueSoft, borderRadius: 999, padding: "1px 7px" }}>⭐ {p.valueScore.toFixed(1)}</span>}
                        {!p.inStock && <span style={{ fontSize: 9.5, fontWeight: 800, color: "#B3441E", background: "#FBE7DE", borderRadius: 999, padding: "1px 7px" }}>OUT OF STOCK</span>}
                      </div>
                      <div style={{ fontSize: 10.5, color: C.inkSoft, display: "flex", gap: 8, marginTop: 2 }}>
                        <span>{p.shipping === 0 ? "Free shipping" : fmt(p.shipping) + " shipping"}</span>
                        <span>· {p.delivery}</span>
                      </div>
                      {p.couponCode && p.inStock && (
                        <div style={{ marginTop: 6 }}>
                          <CouponChip code={p.couponCode} />
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 16, color: C.blueDeep }}>{fmt(p.price)}</div>
                      {p.inStock ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // In production this click would also be logged
                            // (product id, store, price, timestamp) before
                            // redirecting, so you can see which stores/products
                            // actually convert into affiliate commissions.
                            window.open(p.affiliateLink, "_blank", "noopener,noreferrer");
                          }}
                          style={{ marginTop: 4, background: C.blue, color: "white", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 10.5, fontWeight: 700, cursor: "pointer" }}
                        >
                          Go to Store
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleStockAlert?.(alertKey); }}
                          style={{ marginTop: 4, background: wantsNotify ? C.green : C.blueSoft, color: wantsNotify ? "white" : C.blue, border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 10.5, fontWeight: 700, cursor: "pointer" }}
                        >
                          {wantsNotify ? "🔔 Notifying you" : "Notify when back"}
                        </button>
                      )}
                    </div>
                  </div>
                  {p.inStock && <PriceConfidenceBar price={p.price} all={product.prices.filter((x) => x.inStock !== false)} />}
                </div>
              );
            })}
          </div>
        </div>

        {(() => {
          const hasAlert = alerts?.some((a) => a.id === product.id);
          const target = alertTargets?.[product.id];
          if (!hasAlert) {
            return (
              <button
                onClick={() => {
                  addAlert(product);
                  const t = Math.round((lowest(product).price - 5) * 2) / 2;
                  showToast?.(`🔔 Alert set — we'll notify you if the price drops below ${fmt(t)}`);
                }}
                style={{ width: "100%", marginTop: 20, background: C.blueSoft, color: C.blue, border: "none", borderRadius: 14, padding: "13px 0", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
              >
                <Bell size={15} /> Set a price alert
              </button>
            );
          }
          return (
            <div style={{ width: "100%", marginTop: 20, background: C.greenSoft, border: `1px solid ${C.green}`, borderRadius: 14, padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: C.green }}>
                <Bell size={14} /> Alert active
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: C.inkSoft }}>Notify me below</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => adjustTarget?.(product.id, -1)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", background: C.card, color: C.blue, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.blueDeep, fontFamily: displayFont, minWidth: 62, textAlign: "center" }}>{fmt(target ?? 0)}</span>
                  <button onClick={() => adjustTarget?.(product.id, 1)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", background: C.card, color: C.blue, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>+</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const CATEGORY_LABELS = { electronics: "Electronics", fashion: "Fashion", home: "Home", grocery: "Grocery", sports: "Sports" };

function StoresDirectory({ onBack }) {
  const C = useTheme();
  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Partner Stores" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 16, lineHeight: 1.5 }}>
          Every store here has a direct partnership with PricePilot — a mix of major regional chains and local GCC businesses, so you're not limited to just the big names.
        </div>
        {Object.entries(STORE_GROUPS).map(([cat, stores]) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 8 }}>{CATEGORY_LABELS[cat] || cat}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stores.map((s) => (
                <div key={s.id} style={{ background: C.card, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.line}` }}>
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, padding: "3px 7px", borderRadius: 999, background: s.local ? C.greenSoft : C.blueSoft, color: s.local ? C.green : C.blueDeep }}>
                    {s.local ? "LOCAL / GCC" : "INTERNATIONAL"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Favorites({ favorites, toggleFav, openProduct }) {
  const C = useTheme();
  const items = PRODUCTS.filter((p) => favorites.includes(p.id));
  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Favorites" />
      <div style={{ padding: "0 20px" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80, color: C.inkSoft }}>
            <Heart size={40} color={C.line} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 13.5 }}>No favorites yet.<br />Tap the heart on any product to save it here.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {items.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} onFav={toggleFav} isFav />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Alerts({ alerts, removeAlert, targets, adjustTarget }) {
  const C = useTheme();
  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Price Alerts" />
      <div style={{ padding: "0 20px" }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80, color: C.inkSoft }}>
            <Bell size={40} color={C.line} style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 13.5 }}>No alerts set.<br />Open a product and tap "Set a price alert".</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a) => {
              const current = lowest(a).price;
              const target = targets[a.id] ?? Math.round((current - 5) * 2) / 2;
              const triggered = current <= target;
              return (
                <div key={a.id} style={{ background: C.card, borderRadius: 16, padding: 14, boxShadow: "0 2px 8px rgba(14,27,51,0.05)", border: triggered ? `1.5px solid ${C.green}` : "1.5px solid transparent" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ fontSize: 34, width: 54, height: 54, background: C.blueSoft, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.img}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.ink, fontFamily: displayFont }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 3 }}>Current: <span style={{ color: C.ink, fontWeight: 700 }}>{fmt(current)}</span></div>
                      {triggered && (
                        <div style={{ fontSize: 11, color: C.green, fontWeight: 800, marginTop: 2 }}>🎉 Price dropped to your target!</div>
                      )}
                    </div>
                    <button onClick={() => removeAlert(a.id)} style={{ background: "none", border: "none", alignSelf: "start" }}>
                      <X size={16} color={C.inkSoft} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
                    <span style={{ fontSize: 11.5, color: C.inkSoft }}>Notify me below</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => adjustTarget(a.id, -1)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", background: C.blueSoft, color: C.blue, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.blueDeep, fontFamily: displayFont, minWidth: 62, textAlign: "center" }}>{fmt(target)}</span>
                      <button onClick={() => adjustTarget(a.id, 1)} style={{ width: 24, height: 24, borderRadius: 8, border: "none", background: C.blueSoft, color: C.blue, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, right }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, padding: "13px 14px", borderRadius: 14, marginBottom: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} color={C.blue} />
      </div>
      <div style={{ flex: 1, fontSize: 13.5, color: C.ink, fontWeight: 600 }}>{label}</div>
      {right}
    </div>
  );
}

function Profile({ dark, setDark }) {
  const C = useTheme();
  const [notif, setNotif] = useState(true);
  return (
    <div style={{ paddingBottom: 90 }}>
      <TopBar title="Profile" />
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 999, background: C.blue, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, fontFamily: displayFont }}>A</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.ink, fontFamily: displayFont }}>Ahmed</div>
            <div style={{ fontSize: 11.5, color: C.inkSoft }}>Guest account</div>
          </div>
        </div>
        <ProfileRow icon={dark ? Moon : Sun} label="Dark mode" right={
          <button onClick={() => setDark(!dark)} style={{ width: 40, height: 22, borderRadius: 999, background: dark ? C.blue : C.line, border: "none", position: "relative" }}>
            <div style={{ width: 17, height: 17, borderRadius: 999, background: "white", position: "absolute", top: 2, left: dark ? 20 : 2, transition: "left .15s" }} />
          </button>
        } />
        <ProfileRow icon={Globe} label="Preferred country" right={<span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 700 }}>Bahrain</span>} />
        <ProfileRow icon={DollarSign} label="Preferred currency" right={<span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 700 }}>BHD</span>} />
        <ProfileRow icon={Bell} label="Notifications" right={
          <button onClick={() => setNotif(!notif)} style={{ width: 40, height: 22, borderRadius: 999, background: notif ? C.blue : C.line, border: "none", position: "relative" }}>
            <div style={{ width: 17, height: 17, borderRadius: 999, background: "white", position: "absolute", top: 2, left: notif ? 20 : 2, transition: "left .15s" }} />
          </button>
        } />
      </div>
    </div>
  );
}

/* ---------------- app shell ---------------- */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([1]);
  const [alerts, setAlerts] = useState([PRODUCTS[0]]);
  const [alertTargets, setAlertTargets] = useState({ 1: Math.round((lowest(PRODUCTS[0]).price - 5) * 2) / 2 });
  const [stockAlerts, setStockAlerts] = useState([]);
  const toggleStockAlert = (key) => setStockAlerts((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]));
  const [searchCategory, setSearchCategory] = useState("foryou");
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(null), 2600);
  };
  const theme = dark ? DARK : LIGHT;

  const toggleFav = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const addAlert = (p) => {
    setAlerts((a) => (a.find((x) => x.id === p.id) ? a : [...a, p]));
    setAlertTargets((t) => (t[p.id] != null ? t : { ...t, [p.id]: Math.round((lowest(p).price - 5) * 2) / 2 }));
  };
  const removeAlert = (id) => setAlerts((a) => a.filter((x) => x.id !== id));
  const adjustTarget = (id, delta) => setAlertTargets((t) => ({ ...t, [id]: Math.max(0, Math.round(((t[id] ?? 0) + delta) * 2) / 2) }));
  const openProduct = (p) => { setSelected(p); setScreen("product"); };
  const openSearch = (categoryId) => { setSearchCategory(categoryId || "foryou"); setScreen("search"); };

  return (
    <ThemeContext.Provider value={theme}>
    <div style={{ width: "100%", maxWidth: 480, minHeight: "100vh", margin: "0 auto", background: theme.bg, fontFamily: bodyFont, position: "relative", transition: "background .2s" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap" />
      {screen === "welcome" && <Welcome go={setScreen} />}
      {screen === "home" && <HomeScreen go={setScreen} openSearch={openSearch} favorites={favorites} toggleFav={toggleFav} openProduct={openProduct} />}
      {screen === "search" && <SearchResults go={setScreen} favorites={favorites} toggleFav={toggleFav} openProduct={openProduct} initialCategory={searchCategory} />}
      {screen === "product" && <ProductDetails product={selected} onBack={() => setScreen("search")} favorites={favorites} toggleFav={toggleFav} addAlert={addAlert} stockAlerts={stockAlerts} toggleStockAlert={toggleStockAlert} alerts={alerts} alertTargets={alertTargets} adjustTarget={adjustTarget} showToast={showToast} />}
      {screen === "favorites" && <Favorites favorites={favorites} toggleFav={toggleFav} openProduct={openProduct} />}
      {screen === "alerts" && <Alerts alerts={alerts} removeAlert={removeAlert} targets={alertTargets} adjustTarget={adjustTarget} />}
      {screen === "profile" && <Profile dark={dark} setDark={setDark} />}
      {screen === "stores" && <StoresDirectory onBack={() => setScreen("home")} />}
      {screen !== "welcome" && <BottomNav screen={screen} go={setScreen} />}
      <Toast message={toast} />
    </div>
    </ThemeContext.Provider>
  );
}
