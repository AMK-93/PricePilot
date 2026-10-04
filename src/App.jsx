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

/* Every store below has a CONFIRMED, live UK affiliate feed — verified
   directly in the network dashboard (product feed present, not just
   tracking links) before being added here. "local: true" marks UK-based
   retailers, shown to the user so it's clear which stores are UK
   businesses vs. international sellers shipping into the UK.
   Currently just LaptopHub (via TradeTracker) — more stores get added
   here only once their own feed is confirmed the same way, not before. */
const STORES = {
  laptophub: { name: "LaptopHub", color: "#1E3A8A", cat: "electronics", local: true },
  duckandcover: { name: "Duck and Cover", color: "#111111", cat: "fashion", local: true },
  gotraka: { name: "Gotraka", color: "#16A34A", cat: "electronics", local: true },
  tekshop: { name: "TEKshop", color: "#22C55E", cat: "electronics", local: true },
  vevor: { name: "Vevor", color: "#334155", cat: "home", local: false },
};

/* Stores grouped by category, for the browsable directory */
const STORE_GROUPS = Object.entries(STORES).reduce((groups, [id, store]) => {
  (groups[store.cat] ||= []).push({ id, ...store });
  return groups;
}, {});

/* REAL data pulled from LaptopHub's live TradeTracker product feed
   (Electronics/Laptops category only — the only vertical with a
   confirmed real feed so far). No rating/reviews/AI-summary/price-history
   are fabricated — those UI elements gracefully hide or show an honest
   message when this data isn't available (see RatingRow, PriceHistoryChart,
   and the PRODUCT OVERVIEW block). shipping/delivery fields are NOT in the
   feed — using neutral placeholders (shipping: 0, "Standard delivery")
   until LaptopHub's actual shipping terms are verified directly. */
const PRODUCTS = [
  {
    id: 1, name: "Lenovo ThinkPad X13 Gen 1 (Intel Core i5)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/9Ist2BTU8k-ndga9fzAkNg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["13.3\" Full HD display", "Intel Core i5-10210U", "8GB RAM / 256GB SSD", "Windows 10 Pro"],
    ai: "A compact business laptop built for travel — thin, light, and durable, with all-day battery life and Wi-Fi 6 connectivity.",
    history: [480.17],
    prices: [
      { store: "laptophub", price: 480.17, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-x13-gen-1-intel-intelr-coretm-i5-i5-10210u-laptop-33-8-cm-13-3-full-hd-8-gb-ddr4-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-10-pro-black.html", inStock: true },
    ],
  },
  {
    id: 2, name: "Microsoft Surface Laptop 7 Copilot+ PC (Core Ultra 5)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/oPvDTw7dCki3a2FbceHDWw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["15\" touchscreen", "Intel Core Ultra 5 236V", "16GB RAM / 512GB SSD", "Windows 11 Pro"],
    ai: "A business-focused Copilot+ PC with AI-enabled performance, built for collaboration and productivity on the move.",
    history: [1568.33],
    prices: [
      { store: "laptophub", price: 1568.33, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-copilot-pc-intel-core-ultra-5-236v-38-1-cm-15-touchscreen-16-gb-lpddr5x-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black.html", inStock: true },
    ],
  },
  {
    id: 3, name: "HP Fortis G11 Chromebook (14\")", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/tGdi7dbCNE-bsLXNW3zDUQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["14\" Full HD display", "Intel N100 quad-core", "4GB RAM / 32GB eMMC", "ChromeOS, rugged design"],
    ai: "A ruggedized Chromebook built for everyday reliability, with a reinforced 180-degree hinge and long battery life.",
    history: [343.37],
    prices: [
      { store: "laptophub", price: 343.37, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-fortis-g11-intelr-n-n100-chromebook-35-6-cm-14-full-hd-4-gb-lpddr5-sdram-32-gb-emmc-wi-fi-6e-802-11ax-chromeos-black.html", inStock: true },
    ],
  },
  {
    id: 4, name: "Samsung Galaxy Book4 (15.6\", Core 3, 8GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kZ74a4Os8UKIVaEyG_DG_w.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["15.6\" display", "Intel Core 3", "8GB RAM", "NVIDIA GeForce MX570 A graphics"],
    ai: "A slim, well-connected laptop with a wide range of built-in ports and seamless integration with Samsung Galaxy devices.",
    history: [391.47],
    prices: [
      { store: "laptophub", price: 391.47, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book4-15-6-core-3-8gb.html", inStock: true },
    ],
  },
  {
    id: 5, name: "Apple MacBook Pro 2023 16.2\" M2 Pro (16GB/500GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/mnY4KKVKPEGo6llO0A3aLQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["16.2\" Liquid Retina XDR", "Apple M2 Pro chip", "16GB RAM / 500GB SSD", "Silver"],
    ai: "Apple's pro-tier laptop, built for demanding creative and professional workloads with exceptional battery efficiency.",
    history: [2220.02],
    prices: [
      { store: "laptophub", price: 2220.02, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-2023-16-2in-m2-pro-16gb-500gb-silver.html", inStock: true },
    ],
  },
  {
    id: 6, name: "Acer Predator Helios 18 AI (Core Ultra 9, RTX 5090)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/8DUbqpx8Q0O4vR8sKTKUWQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["18\" Mini LED display", "Intel Core Ultra 9", "192GB RAM / 5TB SSD", "NVIDIA GeForce RTX 5090"],
    ai: "A flagship gaming laptop with desktop-level performance, a 4K Mini LED display, and NVIDIA's latest RTX 50-series graphics.",
    history: [4340.99],
    prices: [
      { store: "laptophub", price: 4340.99, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-predator-helios-18-ai-ph18-73-intel-ultra-9-192gb-5tb-ssd-rtx5090-18-wquxga-windows-11-gaming-notebook.html", inStock: true },
    ],
  },
  {
    id: 7, name: "ASUS Chromebook Plus Enterprise CX54", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/WgMRlTF1AUegno3TD_M1Tg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["14\" touchscreen, WQXGA", "Intel Core Ultra 7 155U", "8GB RAM / 512GB SSD", "ChromeOS"],
    ai: "A business-focused Chromebook Plus with enhanced video-call tools and offline productivity features.",
    history: [668.12],
    prices: [
      { store: "laptophub", price: 668.12, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-chromebook-plus-enterprise-cx54-cx5403cma-qm0381-intel-core-ultra-7-155u-35-6-cm-14-touchscreen-wqxga-8-gb-lpddr5x-sdram-512-gb-ssd-wi-fi-6e-802-11ax-chromeos-silver.html", inStock: true },
    ],
  },
  {
    id: 8, name: "ASUS Chromebook CZ11 CZ1104CM4A-MZ0022 MediaTek Kompanio 540 29.5 cm (", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/cwGDjqsmykGPkhDs_PGQBQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["MediaTek Kompanio 540", "Full specs on retailer page"],
    ai: "The rugged. student-centric study mate ASUS Chromebook CZ11 is an excellent study companion for K-12 students. with a portable and durable design that guarantees enduring value and empowers engaged learning - anywhere.",
    history: [239.37],
    prices: [
      { store: "laptophub", price: 239.37, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-chromebook-cz11-cz1104cm4a-mz0022-mediatek-kompanio-540-29-5-cm-11-6-hd-4-gb-lpddr5x-sdram-64-gb-emmc-wi-fi-6e-802-11ax-chromeos-grey-qwerty-uk-english.html", inStock: true },
    ],
  },
  {
    id: 9, name: "HP Fortis G1m 11 Chromebook MediaTek 520 29.5 cm (11.6\") HD 4 GB", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kOBbSka5uUmK58VZC3fpDA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["11.6\" display", "MediaTek 520", "ChromeOS"],
    ai: "The HP Fortis G1m Chromebook is purpose-built to handle the demands of modern classrooms and busy work environments. Designed with reinforced edges. a rugged chassis. and a spill-resistant keyboard.",
    history: [245.02],
    prices: [
      { store: "laptophub", price: 245.02, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-fortis-g1m-11-chromebook-mediatek-520-29-5-cm-11-6-hd-4-gb-lpddr4x-sdram-32-gb-emmc-wi-fi-6-802-11ax-chromeos-black.html", inStock: true },
    ],
  },
  {
    id: 10, name: "Lenovo Chrome 100e G5 M89 MediaTek Kompanio 540 Chromebook 29.5 cm (11", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/-12992HXwU63W8BUQzZHGQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["MediaTek Kompanio 540", "Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [246.62],
    prices: [
      { store: "laptophub", price: 246.62, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-chrome-100e-g5-m89-mediatek-kompanio-540-chromebook-29-5-cm-11-6-hd-4-gb-lpddr5x-sdram-64-gb-ufs-wi-fi-6e-802-11ax-chromeos-english-grey.html", inStock: true },
    ],
  },
  {
    id: 11, name: "Acer Chromebook 314 CBOA314-2H-84H8", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/U9RpFkMc0kuNQz1bVqM9Nw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["ChromeOS", "Full specs on retailer page"],
    ai: "The Acer Chromebook 314 CBOA314-2H is a lightweight and efficient 14\" Chromebook designed for fast browsing. cloud-based work and everyday learning. Its sharp WUXGA IPS display provides clear visuals.",
    history: [281.36],
    prices: [
      { store: "laptophub", price: 281.36, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-314-cboa314-2h-84h8.html", inStock: true },
    ],
  },
  {
    id: 12, name: "Acer Chromebook 311 C725-853M", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/PZAporhOS0-ObWy3_U1iXg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [312.58],
    prices: [
      { store: "laptophub", price: 312.58, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-311-c725-853m.html", inStock: true },
    ],
  },
  {
    id: 13, name: "Acer Chromebook 311 (C725) - MediaTek Kompanio 540. 4GB RAM. 64GB. 11", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/BWBnY7OOVkaflas-IwSt3w.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["11.6\" display", "MediaTek Kompanio 540", "4GB RAM", "ChromeOS"],
    ai: "Acer Chromebook 311 (C725) - MediaTek Kompanio 540. 4GB RAM. 64GB. 11.6\" HD display. Chrome OS. Product type: Chromebook. Form factor: Clamshell. Processor family: MediaTek Kompanio. Processor model: 540.",
    history: [251.48],
    prices: [
      { store: "laptophub", price: 251.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-311-c725-mediatek-kompanio-540-4gb-ram-64gb-11-6-hd-display-chrome-os.html", inStock: true },
    ],
  },
  {
    id: 14, name: "Acer Chromebook 514 (C937) - Intel N150. 4GB RAM. 128GB. 14\" WUXG", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/2_Za5rG2lyG75JIBtXJ1pA.c-r.png", lastUpdated: "20 Sept 2026",
    specs: ["Intel N150", "4GB RAM", "ChromeOS"],
    ai: "Acer Chromebook 514 (C937) - Intel N150. 4GB RAM. 128GB. 14\" WUXGA display. Chrome OS. Product type: Chromebook. Form factor: Clamshell. Processor family: Intel\u00ae N. Processor model: N150. Display diagonal: 35.6 cm (14\").",
    history: [347.76],
    prices: [
      { store: "laptophub", price: 347.76, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fcatalog%2Fproduct%2Fview%2Fid%2F3616003%2F", inStock: true },
    ],
  },
  {
    id: 15, name: "Lenovo V15 G4 AMN AMD Ryzen\u2122 5 7520U Laptop 39.6 cm (15.6\") Full", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/fgi6y43qLkSTfeYKDfCJNA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["15.6\" display", "Full specs on retailer page"],
    ai: "Improves productivity everywhere- Powerful AMD Ryzen\u2122 processors with AMD Radeon\u2122 graphics- 15\" FHD (1920 x 1080) display with low-blue light to reduce eye strain- Enhanced security features keep critical data protected- Includes numeric keypad & Service Hot Key- Ideal for on-the-go multitasking",
    history: [482.49],
    prices: [
      { store: "laptophub", price: 482.49, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-v15-g4-amn-amd-ryzentm-5-7520u-laptop-39-6-cm-15-6-full-hd-16-gb-lpddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-black-uk-english.html", inStock: true },
    ],
  },
  {
    id: 16, name: "Acer Aspire Lite AL15-410P-R6JU Notebook", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/pJ-yK6KVI0GlbabLC5vhLw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["AMD Ryzen 5 3500U", "8GB RAM", "Windows 11 Home"],
    ai: "The Acer Aspire Lite AL15-410P is a slim. lightweight 15.6-inch notebook designed for everyday productivity. Powered by the AMD Ryzen 5 3500U processor. 8GB DDR4 memory and fast 256GB PCIe NVMe SSD storage.",
    history: [491.73],
    prices: [
      { store: "laptophub", price: 491.73, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-aspire-lite-al15-410p-r6ju-notebook.html", inStock: true },
    ],
  },
  {
    id: 17, name: "HP ProBook 4 G1iR Intel Core 5 120U Laptop 35.6 cm (14\") WUXGA 16", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/wnHSrEl1aU-BiJ6zl4_vyA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 14-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [770.58],
    prices: [
      { store: "laptophub", price: 770.58, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-intel-core-5-120u-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-256-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 18, name: "Acer Aspire Lite AL15-53P-56Z0 Notebook", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/ntzt_pFL5SCLaXd4Do_xng.c-r.png", lastUpdated: "20 Sept 2026",
    specs: ["8GB RAM", "Windows 11 Home"],
    ai: "The Acer Aspire Lite 15 AL15-53P is a slim and efficient 15.6-inch notebook built for everyday productivity. Powered by the Intel Core 5 120U processor. 8GB DDR4 memory and fast 512GB PCIe NVMe 4.0 SSD storage.",
    history: [571.9],
    prices: [
      { store: "laptophub", price: 571.9, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-aspire-lite-al15-53p-56z0-notebook.html", inStock: true },
    ],
  },
  {
    id: 19, name: "Lenovo V14 G4 AMN AMD Ryzen\u2122 5 7520U Laptop 35.6 cm (14\") Full HD", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kRtyP69nWkmCaskGaSeaeQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Windows 11", "Full specs on retailer page"],
    ai: "Lets you do moreWith AMD Ryzen\u2122 mobile processors and AMD Radeon\u2122 graphics. the Lenovo V14 Gen 4 laptop delivers power to get through your workday-in the office. on campus. or at home.",
    history: [429.6],
    prices: [
      { store: "laptophub", price: 429.6, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-v14-g4-amn-amd-ryzentm-5-7520u-laptop-35-6-cm-14-full-hd-8-gb-lpddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-uk-english-black.html", inStock: true },
    ],
  },
  {
    id: 20, name: "HP 200 G2a 16 inch Notebook PC AMD Ryzen\u2122 5 220 Laptop 40.6 cm (16&quo", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/Bu_gdtujYUi3FhIzH-Jj4w.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Essential features in an updated. reliable designThe HP 200 G2a 16-inch Notebook PC is purpose-built for cost-conscious educators and professionals to pack immersive visuals. flexible specs.",
    history: [668.39],
    prices: [
      { store: "laptophub", price: 668.39, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-200-g2a-16-inch-notebook-pc-amd-ryzentm-5-220-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 21, name: "ASUS ExpertBook P1 P1503CV-582X Intel Core 5 210H Laptop 39.6 cm (15.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/p33LfYj9E0Cry3tC37cHtQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Elevate your efficiency. anywhereThe compact and elegant ASUS ExpertBook P1 weighs a mere 1.6 kg1 with a breathtaking new design.",
    history: [454.54],
    prices: [
      { store: "laptophub", price: 454.54, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-expertbook-p1-p1503cv-582x-intel-core-5-210h-laptop-39-6-cm-15-6-full-hd-8-gb-ddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-grey.html", inStock: true },
    ],
  },
  {
    id: 22, name: "Lenovo V15 G5 IRL Intel\u00ae Core\u2122 i5 i5-13420H Laptop 39.6 cm (15.6\"", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/9SiHrV7zoUK_DtCvR2Cg2Q.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["15.6\" display", "Full specs on retailer page"],
    ai: "Tailored for Small-to-Medium Businesses- Cost-effective business laptop focused on business efficiency- Enhanced & secure conferencing capabilities- Proven to endure the demands of daily use",
    history: [457.99],
    prices: [
      { store: "laptophub", price: 457.99, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fcatalog%2Fproduct%2Fview%2Fid%2F3271548%2F", inStock: true },
    ],
  },
  {
    id: 23, name: "Samsung Galaxy Book4 NP754XGJ-CG2UK laptop Intel\u00ae Core\u2122 i7 i7-1355U 39", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/Zs7bYmTNXkWPXJNX050zfA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Reliable performance for your daily hustleMaster your checklist with the 13th Gen Intel\u00ae Core\u2122 processor. delivering smooth performance for day-to-day productivity. Intel UHD Graphics.",
    history: [569.86],
    prices: [
      { store: "laptophub", price: 569.86, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book4-np754xgj-cg2uk-laptop-intelr-coretm-i7-i7-1355u-39-6-cm-15-6-full-hd-16-gb-lpddr4x-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-grey.html", inStock: true },
    ],
  },
  {
    id: 24, name: "Lenovo ThinkPad L14 Gen 7 (Intel) Copilot+ PC Intel Core Ultra 5 325 L", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/SuavfOSunkmrqnAgwHyZoQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 5 325", "Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [1032.97],
    prices: [
      { store: "laptophub", price: 1032.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-l14-gen-7-intel-copilot-pc-intel-core-ultra-5-325-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black-uk-english.html", inStock: true },
    ],
  },
  {
    id: 25, name: "HP EliteBook 8 G2i 14 inch Notebook Next Gen AI PC Wolf Pro Security E", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/eNGIzOp7REyMAErZu13o5g.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Adaptable AI PC for your workforceAutomate tasks to save time and multitask without lag on the easy to carry HP EliteBook 8 G2i 14 inch AI PC. This HP Copilot+ PC[4] with HP Wolf Security[5]. enterprise management.",
    history: [1413.48],
    prices: [
      { store: "laptophub", price: 1413.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-elitebook-8-g2i-14-inch-notebook-next-gen-ai-pc-wolf-pro-security-edition-copilot-pc-intel-core-ultra-7-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 26, name: "Lenovo ThinkPad E16 Gen 4 (Intel) Copilot+ PC Intel Core Ultra 5 325 L", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/hCdrpOi9E0yesGM1klfFAg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 5 325", "Full specs on retailer page"],
    ai: "Ready to make the most of your dayThe Lenovo ThinkPad E16 (16\u2033 Intel) laptop exudes power. reliable performance. and robust security-for all of your business requirements.",
    history: [1063.7],
    prices: [
      { store: "laptophub", price: 1063.7, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-e16-gen-4-intel-copilot-pc-intel-core-ultra-5-325-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black-english.html", inStock: true },
    ],
  },
  {
    id: 27, name: "HP ProBook 4 G1iR 16 PC Intel Core 5 120U Laptop 40.6 cm (16\") WU", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/gDS2ePiTLkiigLalNRYX-Q.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 16-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [884.96],
    prices: [
      { store: "laptophub", price: 884.96, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-16-pc-intel-core-5-120u-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 28, name: "HP ProBook 4 G1iR 14 inch Notebook PC Intel Core 5 120U Laptop 35.6 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/wnHSrEl1aU-BiJ6zl4_vyA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 14-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [884.96],
    prices: [
      { store: "laptophub", price: 884.96, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-14-inch-notebook-pc-intel-core-5-120u-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 29, name: "Microsoft Surface Laptop 7 Copilot+ PC Intel Core Ultra 5 236V 38.1 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/oPvDTw7dCki3a2FbceHDWw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 5 236V", "Full specs on retailer page"],
    ai: "Surface Laptop for Business AI-powered and built for business. Surface Laptop in 13.8-inch and 15-inch models.",
    history: [1398.72],
    prices: [
      { store: "laptophub", price: 1398.72, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-copilot-pc-intel-core-ultra-5-236v-38-1-cm-15-touchscreen-16-gb-lpddr5x-sdram-256-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black.html", inStock: true },
    ],
  },
  {
    id: 30, name: "ASUS TUF Gaming A16 FA607NUQ-RL009W AMD Ryzen\u2122 7 170 Laptop 40.6 cm (1", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/-tJRW82kpUO-WUh-4OK4uQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Portable Power. Maximum ImpactThe design philosophy behind the TUF Gaming A16 is all about blending power with portability. With this lightweight all-around powerhouse. you can enjoy seamless performance wherever you go.",
    history: [909.31],
    prices: [
      { store: "laptophub", price: 909.31, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-tuf-gaming-a16-fa607nuq-rl009w-amd-ryzentm-7-170-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-nvidia-geforce-rtx-4050-wi-fi-6-802-11ax-windows-11-home-grey-black.html", inStock: true },
    ],
  },
  {
    id: 31, name: "Microsoft Surface Laptop 7 Surface Intel Core Ultra 5 236V 16GB RAM 25", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/QZ3ipggX10Wv5svniI42Rw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 5 236V", "16GB RAM"],
    ai: "Surface Laptop for Business AI-powered and built for business. Surface Laptop in 13.8-inch and 15-inch models.",
    history: [1334.06],
    prices: [
      { store: "laptophub", price: 1334.06, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-surface-intel-core-ultra-5-236v-16gb-ram-256gb-ssd-13-8-touchscreen-windows-11-pro-laptop-ep2-22147.html", inStock: true },
    ],
  },
  {
    id: 32, name: "Samsung Galaxy Book5 Pro (16\". Core Ultra 7. 32GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/zEKyX7721UeQOVOtXQhgvg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Powerful processor driving the Next-Gen AI PCExperience a new level of transformative AI performance on Galaxy Book5 Pro 14\" with the super-fast Intel\u00ae Core\u2122 Ultra processor (Series 2).",
    history: [1231.2],
    prices: [
      { store: "laptophub", price: 1231.2, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book5-pro-16-core-ultra-7-32gb.html", inStock: true },
    ],
  },
  {
    id: 33, name: "MSI Vector 16 HX AI A2XWHG-403UK Intel Core Ultra 7 255HX Laptop 40.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/NaplQvNh-UGrkZ0EmB2Hig.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 7 255HX", "Full specs on retailer page"],
    ai: "Designed for STEM professionals. the Vector 16 HX AI delivers cutting-edge performance and rock-solid stability. It acts as a high-tech brain. seamlessly processing complex data with speed and precision.",
    history: [1550.85],
    prices: [
      { store: "laptophub", price: 1550.85, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-vector-16-hx-ai-a2xwhg-403uk-intel-core-ultra-7-255hx-laptop-40-6-cm-16-quad-hd-16-gb-ddr5-sdram-512-gb-ssd-nvidia-geforce-rtx-5070-ti-wi-fi-6e-802-11ax-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 34, name: "ASUS Zenbook S14 OLED UX5406AA-SU033W Copilot+ PC Intel Core Ultra 9 3", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kRjOz8wuWEKaAMCEB_lGFw.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 9 3", "Full specs on retailer page"],
    ai: "Pro-Level Performance. Sleek Design. ASUS Zenbook S14 is built from solid metal using an integrated molding process combined with CNC machining. This ensures uncompromised mobility with a sleek. lightweight.",
    history: [1575.97],
    prices: [
      { store: "laptophub", price: 1575.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-zenbook-s14-oled-ux5406aa-su033w-copilot-pc-intel-core-ultra-9-386h-laptop-35-6-cm-14-touchscreen-3k-32-gb-lpddr5x-sdram-1-tb-ssd-wi-fi-7-802-11be-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 35, name: "Apple MacBook Pro 14-inch : M5 chip with 10-core CPU and 10-core GPU", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/0nUgzFXHAUC7z7Mz_qEdxQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "MacBook Pro14-inch model. Now supercharged by M5.",
    history: [1603.65],
    prices: [
      { store: "laptophub", price: 1603.65, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-14-inch-m5-chip-with-10-core-cpu-and-10-core-gpu-16gb-1tb-ssd-space-black.html", inStock: true },
    ],
  },
  {
    id: 36, name: "ASUS ROG Zephyrus G14 GA403GM-SY118W AMD Ryzen AI 9 465 Laptop 35.6 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/qV7hvqRYx0iDBDLT6_0hzQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Windows 11 Pro", "Full specs on retailer page"],
    ai: "ROG Zephyrus G14 (2026) GA403 with a Free ROG 20th Anniversary Football and T-shirtThe Dawn of A New AgeEffortlessly game. create. and collaborate on this next-gen Windows 11 Pro machine.",
    history: [1861.48],
    prices: [
      { store: "laptophub", price: 1861.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-rog-zephyrus-g14-ga403gm-sy118w-amd-ryzen-ai-9-465-laptop-35-6-cm-14-3k-16-gb-lpddr5x-sdram-1-tb-ssd-nvidia-geforce-rtx-5060-wi-fi-7-802-11be-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 37, name: "Apple MacBook Pro 16-inch : M5 Pro chip with 18-core CPU and 20-core G", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/JUfUQnsUGEmbhpX_kCR1mA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "MacBook ProFast runs in the family. Now with M5. M5 Pro. and M5 Max.",
    history: [2397.97],
    prices: [
      { store: "laptophub", price: 2397.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-16-inch-m5-pro-chip-with-18-core-cpu-and-20-core-gpu-24gb-1tb-ssd-silver.html", inStock: true },
    ],
  },
  {
    id: 38, name: "ASUS Zenbook A16 UX3607OA-SQ005W Copilot+ PC Snapdragon X2E-94-100 Lap", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/jeZHzVAhdEqRAHbfdOaaxQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Snapdragon X2E", "Full specs on retailer page"],
    ai: "Ultra-light. ultra-powerfulZenbook A16 allows you to upgrade from a 14\u201d laptop to a 16\u201d laptop. at no extra weight thanks to ASUS exclusive Ceraluminum\u2122 used across the lid. frame. and base.",
    history: [2013.59],
    prices: [
      { store: "laptophub", price: 2013.59, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-zenbook-a16-ux3607oa-sq005w-copilot-pc-snapdragon-x2e-94-100-laptop-40-6-cm-16-3k-48-gb-lpddr5x-sdram-1-tb-ssd-wi-fi-7-802-11be-windows-11-home-beige.html", inStock: true },
    ],
  },
  {
    id: 39, name: "MSI Vector 16 HX AI A2XWIG-283UK Intel Core Ultra 9 275HX Laptop 40.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/NaplQvNh-UGrkZ0EmB2Hig.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 9 275HX", "Full specs on retailer page"],
    ai: "Designed for STEM professionals. the Vector 16 HX AI delivers cutting-edge performance and rock-solid stability. It acts as a high-tech brain. seamlessly processing complex data with speed and precision.",
    history: [2003.68],
    prices: [
      { store: "laptophub", price: 2003.68, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-vector-16-hx-ai-a2xwig-283uk-intel-core-ultra-9-275hx-laptop-40-6-cm-16-quad-hd-16-gb-ddr5-sdram-1-tb-ssd-nvidia-geforce-rtx-5080-wi-fi-6e-802-11ax-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 40, name: "Apple MacBook Pro 16-inch : M5 Max chip with 18-core CPU and 32-core G", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/nfVF6UTvdUmyw_-vusJUvQ.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "MacBook ProFast runs in the family. Now with M5. M5 Pro. and M5 Max.",
    history: [3511.51],
    prices: [
      { store: "laptophub", price: 3511.51, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-16-inch-m5-max-chip-with-18-core-cpu-and-32-core-gpu-36gb-2tb-ssd-space-black.html", inStock: true },
    ],
  },
  {
    id: 41, name: "MSI Raider A18 HX A9WIG-004UK AMD Ryzen\u2122 9 9955HX3D Laptop 45.7 cm (18", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/YxYoOJ4ZCkSNg7U2h0qAyA.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Full specs on retailer page"],
    ai: "Two cosmic-level powers converged. lit up like a supernova. thus born the new cosmic-level gaming powerhouse: Raider A18 HX.",
    history: [3196.07],
    prices: [
      { store: "laptophub", price: 3196.07, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-raider-a18-hx-a9wig-004uk-amd-ryzentm-9-9955hx3d-laptop-45-7-cm-18-uhd-64-gb-ddr5-sdram-2-tb-ssd-nvidia-geforce-rtx-5080-wi-fi-7-802-11be-windows-11-home-advanced-black.html", inStock: true },
    ],
  },
  {
    id: 42, name: "MSI Raider 16 MAX HX B2WJ-065UK Intel Core Ultra 9 290HX Plus Laptop 4", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/81QBlSMgaUmnC5ybDoD4Zg.c-r.jpg", lastUpdated: "20 Sept 2026",
    specs: ["Intel Core Ultra 9 290HX", "32GB RAM", "2TB SSD"],
    ai: "The MSI Raider 16 Max HX B2WJ-065UK is a high-performance 16-inch gaming laptop powered by an Intel\u00ae Core\u2122 Ultra 9 290HX Plus processor and NVIDIA\u00ae GeForce RTX\u2122 5090 Laptop GPU. It features a QHD+ 240Hz OLED display.",
    history: [3363.31],
    prices: [
      { store: "laptophub", price: 3363.31, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-raider-16-max-hx-b2wj-065uk-intel-core-ultra-9-290hx-plus-laptop-40-6-cm-16-quad-hd-32-gb-ddr5-sdram-2-tb-ssd-nvidia-geforce-rtx-5090-wi-fi-7-802-11be-windows-11-home-black.html", inStock: true },
    ],
  },
  {
    id: 43, name: "Elix Straight Leg Jeans Mid Wash", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/d2d72d8b-e455-4caf-bdcb-2b9f1a8c89e6.jpg?v=1773061055", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/f241a452-2192-4b14-822e-f0c7cabf10ef.jpg?v=1773061055", lastUpdated: "26 Sept 2026",
    specs: ["Straight Leg", "Category: Jeans"],
    ai: "Mens Elix Straight Leg Jeans - Duck and Cover Upgrade your everyday denim with the Duck and Cover Elix Straight Leg Jeans.",
    history: [30.0],
    prices: [
      { store: "duckandcover", price: 30.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Felix-straight-leg-jeans-mid-wash%3Fvariant%3D57095309492607%26sfdr_ptcid%3D43189_100_762367965%26sfdr_hash%3Dd5f16faf067d6b238d9155c459477f4d", inStock: true },
    ],
  },
  {
    id: 44, name: "Elix Straight Leg Jeans Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/98a9972f-d3f1-443b-b117-6f9e3d406b5d.jpg?v=1773061053", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/6bdce419-74bf-4c38-a554-c89237135868.jpg?v=1773061053", lastUpdated: "26 Sept 2026",
    specs: ["Straight Leg", "Category: Jeans"],
    ai: "Mens Elix Straight Leg Jeans - Duck and Cover Upgrade your everyday denim with the Duck and Cover Elix Straight Leg Jeans.",
    history: [30.0],
    prices: [
      { store: "duckandcover", price: 30.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Felix-straight-leg-jeans-black%3Fvariant%3D57095308411263%26sfdr_ptcid%3D43189_100_762389427%26sfdr_hash%3D8d103b889dbc7ae8dd75c57464bfe927", inStock: true },
    ],
  },
  {
    id: 45, name: "Caplaz & Frankinz T-Shirt 10pcs Assorted", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/7e5cc18e-2b07-4b9d-bb78-17fd4522dc1e_9a54f328-9a55-467d-bbc8-49a0785b7f60.jpg?_=1729244382&v=1751031217", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/fb0f2d48-a7c4-4b58-8da0-32a5debec33c_97015282-c745-40e2-8fa5-e7f6ed462932.jpg?v=1751031217", lastUpdated: "26 Sept 2026",
    specs: ["Category: T-Shirts", "See retailer page for full details"],
    ai: "Stock up on essentials with the Caplaz & Frankinz T-Shirt 10-Pack. Made from cotton, these soft and breathable tees offer comfort and durability in a variety of colours, perfect for everyday wear. Fabric: 100% Cotton",
    history: [49.99],
    prices: [
      { store: "duckandcover", price: 49.99, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fcaplaz-frankinz-t-shirt-10pcs-assorted%3Fvariant%3D51628903563647%26sfdr_ptcid%3D43189_100_710474130%26sfdr_hash%3De26f4472584edf7c1f8690a24959532c", inStock: true },
    ],
  },
  {
    id: 46, name: "Haltecks T-Shirt 5pk Assorted", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/8c5b8716-d0bd-40e1-8835-78b9430746b9.jpg?v=1774014730", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/a632a3c2-93ca-4e9b-bdef-1acbf4a01802.jpg?v=1783343447", lastUpdated: "26 Sept 2026",
    specs: ["Category: T-Shirts", "See retailer page for full details"],
    ai: "A 5-pack of cotton T-shirts from Duck and Cover, designed for everyday wear. Featuring self-fabric inner back neck tape and soft-touch prints across the collection, offering versatile styling options.",
    history: [29.99],
    prices: [
      { store: "duckandcover", price: 29.99, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fhaltecks-t-shirt-5pk-assorted%3Fvariant%3D56900227694975%26sfdr_ptcid%3D43189_100_760076169%26sfdr_hash%3Dd0e865df2a6c73087cfea9879fa43877", inStock: true },
    ],
  },
  {
    id: 47, name: "Adamsberg Black Hoodie", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/322b6df4-4d2b-4086-8dc5-76a9482e09de.jpg?v=1787905473", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/eafceea0-3aad-4916-94c1-6417285be357.jpg?v=1787905474", lastUpdated: "26 Sept 2026",
    specs: ["Category: Hoodies", "See retailer page for full details"],
    ai: "Carbon fleece men's hoodie - zip sleeve pocket, kangaroo pocket, self-lined hood. 65% cotton. Was \u00a360, now \u00a319.99. In stock now.",
    history: [35.0],
    prices: [
      { store: "duckandcover", price: 35.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fadamsberg-hoodie-black%3Fvariant%3D55995271151999%26sfdr_ptcid%3D43189_100_752161310%26sfdr_hash%3Db3a07d87ce0eaf62bca8825a04a287dd", inStock: true },
    ],
  },
  {
    id: 48, name: "Adamsberg Off White Hoodie", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/af9b0f32-1357-4519-b247-a65489e11c8b.jpg?v=1787905476", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/809cfe66-4f03-40c4-affd-eb20b2666385.jpg?v=1787905476", lastUpdated: "26 Sept 2026",
    specs: ["Category: Hoodies", "See retailer page for full details"],
    ai: "Carbon fleece mens hoodie with zip sleeve pocket, lined hood and kangaroo pocket. Was \u00a360.00, now \u00a319.99. In stock now.",
    history: [35.0],
    prices: [
      { store: "duckandcover", price: 35.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fadamsberg-hoodie-off-white%3Fvariant%3D55995271414143%26sfdr_ptcid%3D43189_100_752161315%26sfdr_hash%3D11cf4f5aec2a4936bfb5b6f1db65c6ab", inStock: true },
    ],
  },
  {
    id: 49, name: "Moretor Chinos Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/6c23084b-8817-4913-bdba-28b5ec58cacf.jpg?_=1723215585&v=1771325408", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/62e6056a-4a43-491b-92eb-97971d71529f.jpg?v=1771325408", lastUpdated: "26 Sept 2026",
    specs: ["slim fit", "Category: Chinos"],
    ai: "Men's slim fit chino lightweight canvas inner waistband facing and inner pocket badge.",
    history: [30.99],
    prices: [
      { store: "duckandcover", price: 30.99, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fmoretor-chinos-black%3Fvariant%3D44039094272250%26sfdr_ptcid%3D43189_100_695965461%26sfdr_hash%3D98c911a5b31828c27a18d113501b7951", inStock: true },
    ],
  },
  {
    id: 50, name: "Mens Slim Fit Chinos Navy", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/a62ff1e9-8fc7-473d-b8f5-2f2c46115e2d.jpg?_=1723215602&v=1771325402", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/670b5552-aa2d-4eb1-8dac-6836be55b49b.jpg?v=1771325403", lastUpdated: "26 Sept 2026",
    specs: ["Slim fit", "Category: Chinos"],
    ai: "Slim fit navy chinos with stretch canvas fabric, clean tailoring and welt pockets. Was \u00a360.00, now \u00a330.99. Multiple sizes. Order today.",
    history: [30.99],
    prices: [
      { store: "duckandcover", price: 30.99, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fmoretor-chinos-navy%3Fvariant%3D44039096828154%26sfdr_ptcid%3D43189_100_695965491%26sfdr_hash%3D1d22f4f8345ca03cfd499ad066b2e6c3", inStock: true },
    ],
  },
  {
    id: 51, name: "Adamsberg Hoodie & Joggers Set Off White", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/6f48d0e8-e88e-4306-8d85-f9ff787f17a5.jpg?v=1787905870", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/6c00de4e-9d65-464d-b3bf-dc6ce8005d77.jpg?v=1787905871", lastUpdated: "26 Sept 2026",
    specs: ["Category: Tracksuits", "See retailer page for full details"],
    ai: "The Adamsberg Tracksuit provide modern comfort, pairing the hoodie and joggers for a complete everyday look. Mens carbon fleece hoodie with printed chest detail. Front kangaroo pocket and left sleeve zip pocket.",
    history: [59.0],
    prices: [
      { store: "duckandcover", price: 59.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fadamsberg-hoodie-joggers-set-off-white%3Fvariant%3D56218777354623%26sfdr_ptcid%3D43189_100_753401111%26sfdr_hash%3D020d1d36d5f7ee73eecb5d1dfeb63780", inStock: true },
    ],
  },
  {
    id: 52, name: "Danvers Zip Knit Polo Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/f18178d3-ce68-4a92-9d0a-cd2c47ce6b7b.jpg?v=1787905877", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/c0510390-5a01-4010-9b1a-6955f79b42f4.jpg?v=1787905877", lastUpdated: "26 Sept 2026",
    specs: ["Category: Polos", "See retailer page for full details"],
    ai: "A modern knitted zip polo from Duck and Cover featuring a basket weave pattern for a clean, textured look. Finished with a branded quarter zip and ribbed trims, it offers a sharp option for everyday wear.",
    history: [25.0],
    prices: [
      { store: "duckandcover", price: 25.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fdanvers-zip-knit-polo-black%3Fvariant%3D56900713644415%26sfdr_ptcid%3D43189_100_761095407%26sfdr_hash%3Da2391ce2b642e59bbecd64e4eab0d8fe", inStock: true },
    ],
  },
  {
    id: 53, name: "Wrentham Polo Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/871ba975-204e-4b83-96c5-df22db3bdb86.jpg?v=1787905878", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/2bc61109-120d-403a-af60-ad2fb2c660ec.jpg?v=1787905879", lastUpdated: "26 Sept 2026",
    specs: ["Category: Polos", "See retailer page for full details"],
    ai: "A classic cotton pique polo from Duck and Cover featuring a clean button placket and subtle tipping for a refined finish. Designed with sleeve panel detailing and branded accents, it's an easy everyday essential.",
    history: [25.0],
    prices: [
      { store: "duckandcover", price: 25.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fwrentham-polo-black%3Fvariant%3D56904606253439%26sfdr_ptcid%3D43189_100_762241027%26sfdr_hash%3Ddc6949147f888c2ed37cc2a442872e1c", inStock: true },
    ],
  },
  {
    id: 54, name: "Applewold Joggers Raisin", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/e6da2522-2755-40fe-a81b-2ed7022fa2c5.jpg?v=1787905664", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/e442db74-f23c-409b-848f-90ae31ff8776.jpg?v=1787905665", lastUpdated: "26 Sept 2026",
    specs: ["Category: Joggers", "See retailer page for full details"],
    ai: "Introducing the Applewold Jogger, a cuffed fleece jogger built for relaxed comfort with modern details.",
    history: [30.0],
    prices: [
      { store: "duckandcover", price: 30.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fapplewold-joggers-raisin%3Fvariant%3D56001216840063%26sfdr_ptcid%3D43189_100_752624629%26sfdr_hash%3D395f81ff382aa339c91eb605966033a9", inStock: true },
    ],
  },
  {
    id: 55, name: "Applewold Joggers Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/a0aa6eb8-a6ef-459d-8596-39e5b811136e.jpg?v=1787905666", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/4a82ac29-6c06-4b69-a434-6be510903338.jpg?v=1787905666", lastUpdated: "26 Sept 2026",
    specs: ["Category: Joggers", "See retailer page for full details"],
    ai: "Introducing the Applewold Jogger, a cuffed fleece jogger built for relaxed comfort with modern details.",
    history: [30.0],
    prices: [
      { store: "duckandcover", price: 30.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fapplewold-joggers-black%3Fvariant%3D56001217036671%26sfdr_ptcid%3D43189_100_752624634%26sfdr_hash%3D771b20091786438d7802faa0eb296736", inStock: true },
    ],
  },
  {
    id: 56, name: "Men's Chino Shorts Navy - Stretch Canvas, Sizes W30", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/845a87f2-79a8-42a6-b31e-0ab1ded254c9.jpg?_=1723215551&v=1771333998", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/e594a116-cd23-464f-9c10-cb98a92f3ed1.jpg?v=1771333998", lastUpdated: "26 Sept 2026",
    specs: ["Category: Shorts", "See retailer page for full details"],
    ai: "Navy stretch canvas chino shorts at \u00a316 (was \u00a349). Zip fly, welt pockets, W30-W38. Lightweight and breathable for summer. In stock now.",
    history: [16.0],
    prices: [
      { store: "duckandcover", price: 16.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fmoreshore-chino-shorts-navy%3Fvariant%3D44039093158138%26sfdr_ptcid%3D43189_100_695965448%26sfdr_hash%3Dd8c6022eda52d2991bbf9d81679e2fc2", inStock: true },
    ],
  },
  {
    id: 57, name: "Moreshore Chino Shorts Olive", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/2b65d479-28a5-4b72-909a-0e752151e7ec.jpg?_=1723215566&v=1771333993", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/740cd21f-18b3-4485-9cea-6aa6918e8997.jpg?v=1771333994", lastUpdated: "26 Sept 2026",
    specs: ["Category: Shorts", "See retailer page for full details"],
    ai: "Men's chino short lightweight canvas inner waistband facing and inner pocket bags.",
    history: [16.0],
    prices: [
      { store: "duckandcover", price: 16.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fmoreshore-chino-shorts-olive%3Fvariant%3D44039093256442%26sfdr_ptcid%3D43189_100_695965450%26sfdr_hash%3D6b75f43c6e5800c44234f4460d67afa3", inStock: true },
    ],
  },
  {
    id: 58, name: "Jelforth Jacket Dark Olive", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/81911040-ead1-4681-aadb-27819d05808f.jpg?v=1787905218", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/37b4751b-895f-4b00-b0f2-304e330654f2.jpg?v=1787905218", lastUpdated: "26 Sept 2026",
    specs: ["100% Polyester, lining 100% Polyester", "Category: Outerwear"],
    ai: "Introducing the Jelforth Jacket Khaki - perfect for everyday wear in the cooler months.",
    history: [85.0],
    prices: [
      { store: "duckandcover", price: 85.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fjelforth-jacket-khaki%3Fvariant%3D55894415999359%26sfdr_ptcid%3D43189_100_750950787%26sfdr_hash%3D1d9cf84d609d96f06e62e62378f774f1", inStock: true },
    ],
  },
  {
    id: 59, name: "Jelforth Jacket Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/8522ffe2-2fc0-498a-81fe-9dbd2eaa6c54.jpg?v=1787905214", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/e48e7a24-681a-4516-8c44-d094d3373584.jpg?v=1787905214", lastUpdated: "26 Sept 2026",
    specs: ["100% Polyester, lining 100% Polyester", "Category: Outerwear"],
    ai: "Introducing the Jelforth Jacket Black - a parka designed for both function and style in cold weather.",
    history: [85.0],
    prices: [
      { store: "duckandcover", price: 85.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fjelforth-jacket-black%3Fvariant%3D55894415671679%26sfdr_ptcid%3D43189_100_750668246%26sfdr_hash%3D7895811eed071bfe469fccc8fa0a3c88", inStock: true },
    ],
  },
  {
    id: 60, name: "Potenza 1/4 Zip Knit Raisin", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/1f131e9f-a3f0-49e2-8ec5-0135b67e1276.jpg?v=1787905685", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/5fc664e6-56e8-434c-9ddf-2eee7476805a.jpg?v=1787905685", lastUpdated: "26 Sept 2026",
    specs: ["Category: Knitwear", "See retailer page for full details"],
    ai: "Introducing the Potenza Quarter Zip Knit, crafted for easy layering and modern style.",
    history: [40.0],
    prices: [
      { store: "duckandcover", price: 40.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fpotenza-1-4-zip-knit-raisin%3Fvariant%3D56001522991487%26sfdr_ptcid%3D43189_100_752935167%26sfdr_hash%3D88da091a518895d145b6a6d1d40020e5", inStock: true },
    ],
  },
  {
    id: 61, name: "Potenza 1/4 Zip Knit Stone", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/2d208a18-cc5b-473f-a4ae-7d8b44aa735b.jpg?v=1787905687", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/c4136f8a-ce28-4ebf-b6ea-c04216bc3856.jpg?v=1787905687", lastUpdated: "26 Sept 2026",
    specs: ["Category: Knitwear", "See retailer page for full details"],
    ai: "Introducing the Potenza Quarter Zip Knit, crafted for easy layering and modern style.",
    history: [40.0],
    prices: [
      { store: "duckandcover", price: 40.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fpotenza-1-4-zip-knit-stone%3Fvariant%3D56001523679615%26sfdr_ptcid%3D43189_100_752935183%26sfdr_hash%3De74a380d354fb8214667ea05aea90ee1", inStock: true },
    ],
  },
  {
    id: 62, name: "Quendle Boxers 5pk Assorted", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/0f045987-65d3-4a10-b0ca-2039b7e4b613.jpg?_=1723215993&v=1773433138", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/9fa67895-8634-432f-a8cd-ef844f372f52.jpg?v=1773433138", lastUpdated: "26 Sept 2026",
    specs: ["95% Cotton and 5% Elastane", "Category: Underwear"],
    ai: "Introducing our Men's 5-Pack Boxershorts-an ultimate combination of style and comfort. Each pair features a jacquard waistband with contrasting raised logo text for a touch of sophistication.",
    history: [30.0],
    prices: [
      { store: "duckandcover", price: 30.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fquendle-boxers-5pk-assorted%3Fvariant%3D45181973561594%26sfdr_ptcid%3D43189_100_702219423%26sfdr_hash%3D2de7b86e81455cde780ffb1730dd7653", inStock: true },
    ],
  },
  {
    id: 63, name: "Vianney Loungewear Set Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/72df2bd9-3c06-413a-ad8e-4e91355dedc7.jpg?v=1787904509", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/63316825-3ec3-4bc1-b4af-f4ad5be0b49d.jpg?v=1787904509", lastUpdated: "26 Sept 2026",
    specs: ["Category: Loungewear", "See retailer page for full details"],
    ai: "Men's 2-part loungewear set: Men's raglan printed tee and pant lounge set. Fabric:100% Cotton",
    history: [36.0],
    prices: [
      { store: "duckandcover", price: 36.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fvianney-loungewear-set-black%3Fvariant%3D58287611412863%26sfdr_ptcid%3D43189_100_769184207%26sfdr_hash%3D679ca9e3c00e44ba637b890256edcbf4", inStock: true },
    ],
  },
  {
    id: 64, name: "Nesta Trainers Black", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/f8eb8506-0c2a-4f9f-9427-75d239e0d848.jpg?v=1742375061", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/0359675a-cf7d-4be7-86e6-3be8b3026396.jpg?v=1742375061", lastUpdated: "26 Sept 2026",
    specs: ["Category: Footwear", "See retailer page for full details"],
    ai: "Introducing the Nesta Sneaker, a stylish canvas sneaker with a rubber toe cap and chunky sole for comfort and durability. It has contrast stitching, metal eyelets, and thick laces for a modern look.",
    history: [25.0],
    prices: [
      { store: "duckandcover", price: 25.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fnesta-trainers-black%3Fvariant%3D55213555286399%26sfdr_ptcid%3D43189_100_726214679%26sfdr_hash%3Dc0f639125ad8239ca5c634b9e0e08d62", inStock: true },
    ],
  },
  {
    id: 65, name: "Francore Overshirt Navy Check", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/2b1c528b-ca7b-4793-b9ee-9fd81c02f771.jpg?_=1723203636&v=1773433123", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/c5e6e39b-2f3c-4bfb-aeb7-0494d2495bf8.jpg?v=1773433123", lastUpdated: "26 Sept 2026",
    specs: ["Category: Shirts", "See retailer page for full details"],
    ai: "The Francore Overshirt Navy Check is the ideal winter shirt for men.",
    history: [29.99],
    prices: [
      { store: "duckandcover", price: 29.99, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Ffrancore-overshirt-navy-check%3Fvariant%3D44655293071610%26sfdr_ptcid%3D43189_100_700118185%26sfdr_hash%3Db96f17b1f67975ee9fc6898f8d2170fa", inStock: true },
    ],
  },
  {
    id: 66, name: "Venture Suitcase 3pk Charcoal", cat: "fashion",
    img: "👕", image: "https://cdn.shopify.com/s/files/1/1543/1853/files/5d2d44c5-9b45-4a05-9c6c-4d7f41286eeb.jpg?v=1756909351", image2: "https://cdn.shopify.com/s/files/1/1543/1853/files/82880ad4-595a-4f82-9dc0-a2c84a1b1c71.jpg?v=1756909351", lastUpdated: "26 Sept 2026",
    specs: ["Category: Accessories", "See retailer page for full details"],
    ai: "Introducing the Venture 3 Pack Suitcase Charcoal , a practical 3-piece luggage set designed for every journey. This istem is excluded from further discounts due to its size.",
    history: [115.0],
    prices: [
      { store: "duckandcover", price: 115.0, shipping: 1.99, delivery: "Standard delivery", affiliateLink: "https://tc.tradetracker.net/?c=35470&m=2038490&a=515952&r=&u=https%3A%2F%2Fwww.duckandcover.co.uk%2Fproducts%2Fventure-suitcase-3pk-charcoal%3Fvariant%3D55995114226047%26sfdr_ptcid%3D43189_100_751007336%26sfdr_hash%3D0f89621b57ecccbfce738ac77132d788", inStock: true },
    ],
  },
  {
    id: 67, name: "LaCie Mobile Drive Secure 4 TB External HDD | USB 3.2 Grey", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/fa9be20d3144ae320933d5829db635e0_ead3f1e2-a3ad-4e49-b2e4-d00beb752855.jpg?v=1736912055", lastUpdated: "27 Sept 2026",
    specs: ["External Hard Drives", "Brand: LaCie", "2 days delivery", "Free shipping"],
    ai: "LaCie Mobile Drive Secure. HDD capacity: 4000 GB. USB version: 3.2 Gen 1 (3.1 Gen 1). Product colour: GreyPremium Space, Sleek Design.",
    history: [226.0],
    prices: [
      { store: "gotraka", price: 226.0, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Flacie-mobile-drive-secure-external-hard-drive-4000-gb-grey", inStock: true },
    ],
  },
  {
    id: 68, name: "Kingston 2TB XS1000 Red External USB 3.2 Gen 2 Portable Solid State", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/5c035a23bd0eeddc69527778ba324891.jpg?v=1736868062", lastUpdated: "27 Sept 2026",
    specs: ["External Solid State Drives", "Brand: Kingston", "2 days delivery", "Free shipping"],
    ai: "Kingston Technology 2TB XS1000 Red External USB 3.2 Gen 2 Portable Solid State Drive. SSD capacity: 2 TB. USB connector: USB Type-C, USB version: 3.2 Gen 2 (3.1 Gen 2). Read speed: 1050 MB/s, Write speed: 1000 MB/s.",
    history: [335.42],
    prices: [
      { store: "gotraka", price: 335.42, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fkingston-technology-2tb-xs1000-red-external-usb-32-gen-2-portable-solid-state-drive", inStock: true },
    ],
  },
  {
    id: 69, name: "ASUS VA27DCP 27\" Full HD Monitor | 1920 x 1080 75Hz USB-C HDMI", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/893d2e4d0c9af0cf41b9e66cdfafac46.jpg?v=1736843680", lastUpdated: "27 Sept 2026",
    specs: ["Computer Monitors", "Brand: ASUS", "2 days delivery", "Free shipping"],
    ai: "The ASUS VA27DCP 27\" Full HD Monitor combines stunning visuals with advanced eye-care technology, making it an ideal choice for both work and play.",
    history: [275.7],
    prices: [
      { store: "gotraka", price: 275.7, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fasus-va27dcp-68-6-cm-27-1920-x-1080-pixels-full-hd-lcd-black", inStock: true },
    ],
  },
  {
    id: 70, name: "ASUS GeForce RTX 3050 6 GB GDDR6 Overclocked Graphics Card | PCIe 4.0", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/26ec3ab8b30bdb78c2ffc643d2678bb9.jpg?v=1736940906", lastUpdated: "27 Sept 2026",
    specs: ["Graphics Cards", "Brand: ASUS", "2 days delivery", "Free shipping"],
    ai: "Perfect for gamers wanting smooth frame rates, the ASUS GeForce RTX 3050 offers immersive visuals and responsive play.",
    history: [281.95],
    prices: [
      { store: "gotraka", price: 281.95, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fasus-geforce-rtx-3050-lp-brk-oc-edition-nvidia-6-gb-gddr6", inStock: true },
    ],
  },
  {
    id: 71, name: "Targus City Gear 3 backpack Black Polyurethane", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/e937fe74c05ad1882dca51840126475d.jpg?v=1737127894", lastUpdated: "27 Sept 2026",
    specs: ["Backpacks", "Brand: Targus", "2 days delivery", "Free shipping"],
    ai: "Targus City Gear 3. Product main colour: Black, Material: Polyurethane, Style: City. Width: 190 mm, Depth: 280 mm, Height: 462 mm. Package width: 192 mm, Package depth: 282 mm, Package height: 462.9 mm.",
    history: [54.49],
    prices: [
      { store: "gotraka", price: 54.49, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Ftargus-city-gear-3-backpack-black-polyurethane", inStock: true },
    ],
  },
  {
    id: 72, name: "Razer Wolverine V3 Pro Black, White USB Gamepad Analogue PC, Xbox", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/51b01d187bd860eca42924cc35ef24cd.jpg?v=1736868098", lastUpdated: "27 Sept 2026",
    specs: ["Gaming Controllers", "Brand: Razer", "2 days delivery", "Free shipping"],
    ai: "Input deviceDevice typeGamepadGaming platforms supported PC, Xbox Series S, Xbox Series XGaming control technologyAnalogueAnalog thumbsticksYesNumber of joysticks2Programmable buttonsYesPorts & interfacesConnectivity technologyWired & WirelessDevice interface USBHeadphone outYesErgonomicsProduct colourBlackCable length3 mDetachable cableYesPlug and PlayYesPowerPower sourceBatteryBattery typeBuilt-inBattery life (max)20 hSoftwareWindows operating systems supportedWindows 11 x64Weight & dimensionsWidth156.7 mmDepth105.7 mmHeight65 mmWeight304 gPackaging dataPackage width82 mmPackage depth222 mmPackage height205 mmPackage weight907 gPackaging contentTravel caseYesLogistics dataCommodity code9504500000Country of originChina",
    history: [212.24],
    prices: [
      { store: "gotraka", price: 212.24, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Frazer-wolverine-v3-pro-black-white-usb-gamepad-analogue-pc-xbox-series-s-xbox-series-x%3Fvariant%3D53524035993979", inStock: true },
    ],
  },
  {
    id: 73, name: "DELL Pro 2K Webcam - WB5023", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/baf2db68fc65c69f2739dd9387f8e595.jpg?v=1736957095", lastUpdated: "27 Sept 2026",
    specs: ["Webcams", "Brand: DELL", "2 days delivery", "Free shipping"],
    ai: "DELL Pro 2K Webcam - WB5023. Maximum video resolution: 2560 x 1440 pixels, Camera HD type: Full HD, Maximum frame rate: 60 fps. Interface: USB 2.0, Product colour: Black, Mounting type: Clip.",
    history: [71.41],
    prices: [
      { store: "gotraka", price: 71.41, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fdell-wb5023-webcam-2560-x-1440-pixels-usb-2-0-black", inStock: true },
    ],
  },
  {
    id: 74, name: "Kensington Pro Fit? Low-Profile Wireless Desktop Set Keyboard |", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/0a3aad9a99d0c2110dbabdcfc99bc9a0.jpg?v=1739712872", lastUpdated: "27 Sept 2026",
    specs: ["Keyboards", "Brand: Kensington", "2 days delivery", "Free shipping"],
    ai: "Kensington Pro Fit\u00ae Low-Profile Wireless Desktop Set. Keyboard form factor: Full-size (100%). Keyboard style: Straight. Device interface: RF Wireless, Keyboard layout: QWERTY, Recommended usage: Office.",
    history: [43.97],
    prices: [
      { store: "gotraka", price: 43.97, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fkensington-pro-fit-low-profile-wireless-desktop-set", inStock: true },
    ],
  },
  {
    id: 75, name: "TP-Link Archer AX3000 Dual-Band Wi-Fi 6 Air Router", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/c5abb99f0518825ea3cbfb8e435c925c.jpg?v=1736940688", lastUpdated: "27 Sept 2026",
    specs: ["Wireless Routers", "Brand: TP-LINK", "2 days delivery", "Free shipping"],
    ai: "TP-Link Archer AX3000 Dual-Band Wi-Fi 6 Air Router. WAN connection type: RJ-45. Wi-Fi band: Dual-band (2.4 GHz / 5 GHz), Top Wi-Fi standard: Wi-Fi 6 (802.11ax), WLAN data transfer rate (max): 2976 Mbit/s.",
    history: [123.62],
    prices: [
      { store: "gotraka", price: 123.62, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Ftp-link-archer-ax3000-dual-band-wi-fi-6-air-router", inStock: true },
    ],
  },
  {
    id: 76, name: "Trust Primo Lithium-Ion (Li-Ion) 20000 mAh Black", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/474169932ff0b1a8c1ab66944599abf7.jpg?v=1736888765", lastUpdated: "27 Sept 2026",
    specs: ["Power Banks", "Brand: Trust", "2 days delivery", "Free shipping"],
    ai: "Trust Primo. Battery capacity: 20000 mAh, Battery technology: Lithium-Ion (Li-Ion), Battery voltage: 3.7 V. USB A output ports: 2, USB Type-C ports quantity: 1. Total output power: 15 W.",
    history: [32.99],
    prices: [
      { store: "gotraka", price: 32.99, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Ftrust-primo-lithium-ion-li-ion-20000-mah-black", inStock: true },
    ],
  },
  {
    id: 77, name: "SanDisk Ultra Dual Drive Luxe USB flash drive 64 GB USB Type-A / USB", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/16e8c9f29b3273b4390e53e6a8779481.jpg?v=1737013492", lastUpdated: "27 Sept 2026",
    specs: ["USB Flash Drives", "Brand: Sandisk", "2 days delivery", "Free shipping"],
    ai: "SanDisk Ultra Dual Drive Luxe. Capacity: 64 GB, Device interface: USB Type-A / USB Type-C, USB version: 3.2 Gen 1 (3.1 Gen 1), Read speed: 150 MB/s.",
    history: [23.1],
    prices: [
      { store: "gotraka", price: 23.1, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fsandisk-ultra-dual-drive-luxe-usb-flash-drive-64-gb-usb-type-a-usb-type-c-3-2-gen-1-3-1-gen-1-stainless-steel", inStock: true },
    ],
  },
  {
    id: 78, name: "Antec 0-761345-10133-2 Midi Tower PC Case Black, Wood | Liquid", cat: "electronics",
    img: "\ud83d\udd0c", image: "https://cdn.shopify.com/s/files/1/0549/5678/5895/files/b43ef70e934b24c1815dcc2c4c32788f.jpg?v=1736873657", lastUpdated: "27 Sept 2026",
    specs: ["Computer Cases", "Brand: Antec", "2 days delivery", "Free shipping"],
    ai: "Flow LuxuryF-LUX Platform, abbreviation of Flow Luxury, features ultra case structure design for excellent airflow and 5 fans included, delivering enhanced GPU cooling performance.",
    history: [93.4],
    prices: [
      { store: "gotraka", price: 93.4, shipping: 0.0, delivery: "2 days", affiliateLink: "https://deals.gotraka.com/c?c=38822&m=2490651&a=515952&r=&u=https%3A%2F%2Fwww.gotraka.com%2Fproducts%2Fantec-0-761345-10133-2-computer-case-midi-tower-black-wood", inStock: true },
    ],
  },
  {
    id: 79, name: "HP 15s-fq5021na 15.6\" Laptop Intel i5 12th Gen 8GB RAM 256GB SSD", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Laptops", "Brand: HP", "Free shipping", "Condition: New"],
    ai: "Thin and light with a micro-edge display Super-portable with a lightweight design and a more comfortable view on flicker-free, micro-edge display.",
    history: [399.0],
    prices: [
      { store: "tekshop", price: 399.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2F8r554ea-hp-15s-fq5021na-laptop-171800-a", inStock: true },
    ],
  },
  {
    id: 80, name: "Samsung Galaxy Book 4 Laptop 15.6\" Intel Core 3 100U 8GB RAM 256GB", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Laptops", "Brand: Samsung", "Free shipping", "Condition: New"],
    ai: "Performance you can count on Conquer your day with the latest Intel Core 3/5/7 processor and integrated Intel graphics, delivering super-smooth performance for streaming and seamless multitasking.",
    history: [649.0],
    prices: [
      { store: "tekshop", price: 649.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fnp750xgk-kg4uk-samsung-galaxy-book-4-8gb-256gb-171912", inStock: true },
    ],
  },
  {
    id: 81, name: "Lenovo LOQ 15IAX9E 15.6\" Gaming Laptop Intel Core i7 16GB 512GB RTX", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Laptops", "Brand: Lenovo", "Free shipping", "Condition: New"],
    ai: "Premium Entry-Level Gaming Lenovo LOQ 15IAX9E 15.6\" Gaming Laptop Step into the competitive arena with confidence.",
    history: [999.0],
    prices: [
      { store: "tekshop", price: 999.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2F83lk00dbuk-lenovo-loq-15iax9e-174616", inStock: true },
    ],
  },
  {
    id: 82, name: "Dell Pro Max 16 Plus 16\" Laptop Intel Core Ultra 7 265HX 32GB RAM", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Laptops", "Brand: Dell", "Free shipping", "Condition: New"],
    ai: "Power Your Professional Potential Step into a new era of productivity with the Dell Pro Max 16 Plus .",
    history: [2799.0],
    prices: [
      { store: "tekshop", price: 2799.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fmb16250-dell-pro-max-16-plus-16-laptop-175186", inStock: true },
    ],
  },
  {
    id: 83, name: "HP 24-cr0058na 23.8\" All-in-One Desktop PC Intel Core i3 8GB RAM", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Desktops", "Brand: HP", "Free shipping", "Condition: New"],
    ai: "Get the most out of your content with the 24 IPS LCD display. The Full HD resolution shows sharp detail and clarity, and the three-sided micro-edge design means you won't get distracted by chunky borders.",
    history: [599.0],
    prices: [
      { store: "tekshop", price: 599.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fbn4m9ea-hp-24-cr0058na-23-8-all-in-one-desktop-pc-173992-b", inStock: true },
    ],
  },
  {
    id: 84, name: "Acer Aspire TC-1785 Desktop PC Intel i7-14700 16GB RAM 1TB SSD Black", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Desktops", "Brand: Acer", "Free shipping", "Condition: New"],
    ai: "No more getting flustered on work calls either. WiFi 6E will give lag its marching orders, and your 1 TB SSD storage will find and open your files before you can even say 'screen share'.",
    history: [799.0],
    prices: [
      { store: "tekshop", price: 799.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fdt-blnek-00p-acer-aspire-tc-1785-tower-desktop-pc-172367-a", inStock: true },
    ],
  },
  {
    id: 85, name: "Acer Nitro 20 N20-13H5U Gaming Desktop Intel i5 16GB RAM 1TB SSD RTX", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Desktops", "Brand: Acer", "Free shipping", "Condition: New"],
    ai: "Sony PlayStation 5 Pro 4K AI Upscaling | Advanced Ray Tracing | 2TB SSD | WiFi 7 Support You'd better hold on to your controller because the PlayStation 5 Pro is blazing fast.",
    history: [999.0],
    prices: [
      { store: "tekshop", price: 999.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fdg-bqbek-00f-acer-nitro-20-n20-13h5u-gaming-desktop-174468", inStock: true },
    ],
  },
  {
    id: 86, name: "Honor Pad X9 11.5\" Tablet 2K Display Snapdragon 685 4GB RAM 128GB", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Phones & Tablets", "Brand: Honor", "Free shipping", "Condition: New"],
    ai: "Honor Pad X9 HONOR Pad X9 is a 11.5-inch 2K Tablet with Fullview display and 86% screen to body ratio which shows every detail for better user viewing experience and entertain the whole family by playing music through your speakers or sharing your best videos and photos.",
    history: [179.0],
    prices: [
      { store: "tekshop", price: 179.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2F5301aghx-honor-pad-x9-11-5-tablet-171295-a", inStock: true },
    ],
  },
  {
    id: 87, name: "Lenovo Idea Tab 11\" 2.5K Tablet 8GB 256GB Storage with Tab Pen Blue", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Phones & Tablets", "Brand: Lenovo", "Free shipping", "Condition: New"],
    ai: "11\" 2.5K Display Silky smooth 90Hz touchscreen Octa-Core Speed MediaTek Dimensity 6300 Tab Pen Included Sketch, write, and create 256GB Storage Expandable up to 2TB Stand Out in Striking Blue A Digital Canvas for Your Everyday Life Picture yourself unwinding on the sofa with a hot drink, catching up on your favourite streaming series, or lightly sketching out ideas for your next big project.",
    history: [279.0],
    prices: [
      { store: "tekshop", price: 279.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fzafr0815se-lenovo-idea-tab-11-2-5k-tablet-174842", inStock: true },
    ],
  },
  {
    id: 88, name: "Nothing Phone (2) 6.7\" 120Hz AMOLED Snapdragon 8+ 12GB 256GB Android", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Phones & Tablets", "Free next-day delivery", "Free shipping", "Condition: New"],
    ai: "The new Glyph Interface- Love at first light For a world craving more me-time and less screen-time, we bring you the Glyph Interface.",
    history: [329.0],
    prices: [
      { store: "tekshop", price: 329.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fa10400028-nothing-phone-2-6-7-120hz-amoled-snapdragon-8-12gb-256gb-android-white-173163-a", inStock: true },
    ],
  },
  {
    id: 89, name: "Lenovo ThinkVision P25i-30 24.5\" FHD IPS 100Hz Monitor 4ms 63F4MAT1UK", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Monitors", "Brand: Lenovo", "Free shipping", "Condition: New"],
    ai: "At a glance 24.5\" FHD Display A crisp 1920 x 1080 IPS anti-glare screen offering striking clarity from any viewing angle.",
    history: [199.0],
    prices: [
      { store: "tekshop", price: 199.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2F63f4mat1uk-lenovo-thinkvision-p25i-30-24-5-fhd-ips-100hz-monitor-175104", inStock: true },
    ],
  },
  {
    id: 90, name: "Dell Pro 27 Plus 27\" Quad HD Monitor 100Hz Refresh USB Hub", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Monitors", "Brand: Dell", "Free shipping", "Condition: New"],
    ai: "At a Glance 27\" Quad HD (2560 x 1440) IPS Display Ultra-Smooth 100Hz Refresh Rate Pop-Out USB Hub with 15W Charging Fully Adjustable Stand (Height, Tilt, Swivel, Pivot) Clarity That Transforms Your Work Imagine sitting down at your desk and being greeted by incredibly sharp, vivid visuals.",
    history: [239.0],
    prices: [
      { store: "tekshop", price: 239.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fp2725d-dell-pro-27-plus-27-quad-hd-monitor-175028-a", inStock: true },
    ],
  },
  {
    id: 91, name: "HyperX Cloud Alpha Wireless Gaming Headset - Black & Red", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Games Consoles", "Brand: HP", "Free shipping", "Condition: New"],
    ai: "Over 300 hours of battery Get a massive 300 hours[1] of battery life and play for over a week without the battery getting low.",
    history: [119.0],
    prices: [
      { store: "tekshop", price: 119.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2F4p5d4aa-hyperx-cloud-alpha-wireless-gaming-headset-black-red-175131", inStock: true },
    ],
  },
  {
    id: 92, name: "ASUS TUF Gaming 750W 80 Plus Gold ATX 3.1 Fully Modular Power Supply", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["PC Components", "Brand: Asus", "Free shipping", "Condition: New"],
    ai: "At a glance 750W Gold Efficiency 80 PLUS Gold certification ensures superb power delivery with minimal energy wasted as heat.",
    history: [109.0],
    prices: [
      { store: "tekshop", price: 109.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Ftuf-gaming-750g-asus-tuf-gaming-750w-80-plus-gold-atx-3-1-fully-modular-power-supply-175127", inStock: true },
    ],
  },
  {
    id: 93, name: "Ubiquiti UniFi G6 Pro Bullet 4K PoE+ CCTV Security Camera in Black", cat: "electronics",
    img: "\ud83d\udcbb", lastUpdated: "27 Sept 2026",
    specs: ["Audio Visual", "Free next-day delivery", "Free shipping", "Condition: New"],
    ai: "Professional 4K Security Ubiquiti UniFi G6 Pro Bullet 4K PoE+ CCTV Security Camera Imagine stepping away from your home or business knowing every entrance, driveway, and perimeter is being watched with uncompromising precision .",
    history: [489.0],
    prices: [
      { store: "tekshop", price: 489.0, shipping: 0.0, delivery: "Next day", affiliateLink: "https://conversions.tekshop.co.uk/c?c=38998&m=2423314&a=515952&r=&u=https%3A%2F%2Fwww.tekshop.co.uk%2Fuvc-g6-pro-bullet-b-174633", inStock: true },
    ],
  },
  {
    id: 94, name: "VEVOR BBQ Access Door, 407x559 mm Single Outdoor Kitchen Door,", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FDMMBSCJM16X2GR6D9V0%2Fgoods_img-v2%2Foutdoor-kitchen-door-m100-1.2.jpg?timestamp=1711434634000", lastUpdated: "27 Sept 2026",
    specs: ["Outdoors", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR BBQ Access Door, 407x559 mm Single Outdoor Kitchen Door, Stainless Steel Flush Mount Door, Wall Vertical Door with Handle, for BBQ Island, Grilling Station, Outside CabinetPrecise DimensionsPremium MaterialsHumanized DesignEasy to InstallVersatile ApplicationsCompact StructureColor: Stainless Steel Color,Item Model Number: B015D,Product Weight: 3.0 kg / 6.6 lbs,Product Dimensions: 407x559x46 mm / 16x22x2 inches,Main Material: Stainless Steel",
    history: [33.9],
    prices: [
      { store: "vevor", price: 33.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Foutdoor-kitchen-door-c_10622%2Fvevor-407x559-mm-bbq-island-access-door-outdoor-kitchen-door-stainless-steel-p_010851369911", inStock: true },
    ],
  },
  {
    id: 95, name: "VEVOR Single Folding Security Gate, Lockable Scissor Gate with 360\u00b0", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FGZDZDAQM5157HX49X001V0%2Fgoods_img-v3%2Ffolding-security-gate-m100-1.2.jpg?timestamp=1750751655000", lastUpdated: "27 Sept 2026",
    specs: ["Outdoors", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Single Folding Security Gate, Lockable Scissor Gate with 360\u00b0 Swivel Casters, Outdoor Barricade Steel Retractable Gates, for Entry Security, Garage, Warehouse & Pool, 43.31 x 51.57 in (W x H)Lockable Swivel WheelsRetractable X TubeSecure Lock SystemSecure Hasp LockEasy InstallationWide ApplicationSingle Door / Double Sided: Single Door,Door Dimensions: 43.31 x 51.57 in / 1100 x 1310 mm,Item Model Number: XSJ-25-ZDM01,Product Weight: 32.41 lbs / 14.7 kg,Product Dimensions: 43.31 x 1.57 x 51.57 in / 1100 x 40 x 1310 mm",
    history: [58.9],
    prices: [
      { store: "vevor", price: 58.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Ffolding-security-gate-c_10269%2Fvevor-single-folding-security-gate-lockable-scissor-gate-43-31-x-51-57-in-wxh--p_010517332213", inStock: true },
    ],
  },
  {
    id: 96, name: "VEVOR 7-in-1 Wi-Fi Weather Station, 7\" TFT Color Display, Wireless", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FTYN70TFTWIFI71ZZTY2%2Fgoods_img-v3%2Fweather-station-m100-1.2.jpg?timestamp=1732849132000", lastUpdated: "27 Sept 2026",
    specs: ["Outdoors", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR 7-in-1 Wi-Fi Weather Station, 7\" TFT Color Display, Wireless Weather Station with Solar-Powered Sensor, Indoor Outdoor Monitoring for Temperature, Humidity, Wind Speed Direction, and Rainfall7-in-1 SensorIntelligent MonitoringLong Distance TransmissionHigh-Definition ScreenAluminum Rod Fixed Bracket4 x 3 in Solar PanelSolar Panel: Illuminance 38000 LUX, 5.4V, 200mA,Input: 100-240V AC, 50/60 Hz, 0.4A,Display Dimensions: 7.3 x 5.4 x 1.1 in/185.9 x 137.4 x 28.5 mm,RF Frequency: 915MHz for US, 868MHz for EU/AU/UK,IP Rating: IPX6,Output: 5.0V DC, 1000mA, 5W,Item Model Number: YT60233,Solar Panel Size: 4 x 3 in/100 x 70 mm,Net Weight: 1.36 kg/3 lbs,Sensor Dimensions: 16 x 15.6 x 14.4 in/408 x 396 x 367 mm,Main Material: ABS+PC,Wi-Fi Operation Frequency: 2.4 GHz",
    history: [101.9],
    prices: [
      { store: "vevor", price: 101.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fweather-station-c_12074%2Fvevor-7-in-1-solar-powered-wi-fi-weather-station-7-tft-with-outdoor-sensor-p_010459792132", inStock: true },
    ],
  },
  {
    id: 97, name: "VEVOR Kick Scooter for Kids Ages 8+, Teens & Adults, 2-Wheel Toddler", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FJTHBC2L8INCHQB6MP001V0%2Fgoods_img-v1%2Fkick-scooter-m100-1.2.jpg?timestamp=1759117437000", lastUpdated: "27 Sept 2026",
    specs: ["Sports & Outdoors", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Kick Scooter for Kids Ages 8+, Teens & Adults, 2-Wheel Toddler Scooter with Adjustable Height Handlebar, Wide Anti-Slip Deck, Foldable Lightweight for Boys & Girls up to 220 lbs, White + BlackKick StandNon-Slip HandleSurface Spraying ProcessAdjustable for Growing KidsSmooth & Stable RideSturdy & Durable BuildWheel Outer Diameter: \u03c68 in/\u03c6200 mm,Color: White + Black,Item Model Number: S200D,Product Dimensions: 35.4 x 15 x 39.4 in/900 x 380 x 1000 mm,Net Weight: 9.9 lbs/4.5 kg,Wheel Material: PU",
    history: [38.9],
    prices: [
      { store: "vevor", price: 38.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fscooters-equipment-c_12697%2Fvevor-kick-scooter-for-kids-ages-8-teens-adults-2-wheel-toddler-scooter-with-adjustable-height-handlebar-wide-anti-slip-deck-foldable-lightweight-for-boys-girls-up-to-220-lbs-white-black-p_010800687500", inStock: true },
    ],
  },
  {
    id: 98, name: "VEVOR Squat Machine, Deep Squat Rowing Machine for Home, Easy Setup &", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FQMSDJZLS3SZXM6XU1001V0%2Fgoods_img-v3%2Fsquat-machine-m100-1.2.jpg?timestamp=1757639937000", lastUpdated: "27 Sept 2026",
    specs: ["Sports & Outdoors", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Squat Machine, Deep Squat Rowing Machine for Home, Easy Setup & Foldable Exercise Equipment, Glute Trainer Machine with 3 High-Strength Resistance Bands, Glutes & Leg Home Workout Machine, BlackComfortable GripHigh-Quality MaterialsEasy to CleanEasy StorageMultiple Exercise ModesA Perfect Addition to Home FitnessResistance: 3 Resistance Ropes,Cushion Material: Leather, Sponge, Wood,Item Model Number: YZJ-523-3,Maximum Load Capacity: 300 lbs / 136 kg,Seat Cushion Adjustment Levels: 5 Levels,Cushion Color: Black with Red Edges,Product Dimensions: 35.4 x 22.8 x 44.1 in / 900 x 580 x 1120 mm,Cushion Dimensions: 11.3 x 8.1 x 1.8 in / 288 x 207 x 45 mm,Net Weight: 23.8 lbs / 10.8 kg",
    history: [61.9],
    prices: [
      { store: "vevor", price: 61.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fsquat-machine-c_14231%2Fvevor-squat-machine-deep-squat-rowing-machine-for-home-easy-setup-foldable-exercise-equipment-glute-trainer-machine-with-3-high-strength-resistance-bands-glutes-leg-home-workout-machine-black-p_010837343597", inStock: true },
    ],
  },
  {
    id: 99, name: "VEVOR Bike Repair Stand, 36 kg Heavy-duty Steel Bicycle Repair Stand,", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FZXCWXZJGZLDSC784IV0%2Fgoods_img-v3%2Fbike-repair-stand-m100-1.2.jpg?timestamp=1705642878000", lastUpdated: "27 Sept 2026",
    specs: ["Automotive", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Bike Repair Stand, 36 kg Heavy-duty Steel Bicycle Repair Stand, Adjustable Height Bike Maintenance Workstand with Magnetic Tool Tray Telescopic Arm, Foldable Bike Work Stand for Home, ShopsSturdy and Rust-Proof ConstructionEffortless Maintenance360\u00b0 Rotating Clamp80 LBS Load CapacityEnhanced StabilityTool Tray and Easy StorageSupport Legs: 4,Clamp Opening Range: 1-1.6 inch/25-40 mm,Height Range: 42.5-74.8 inch/1079.5-1900 mm,Item Model Number: TQXL-03,Max.",
    history: [35.9],
    prices: [
      { store: "vevor", price: 35.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fbike-workstands-c_12254%2Fvevor-bike-repair-stand-80lbs-adjustable-maintenance-folding-bike-rack-tool-tray-p_010397285369", inStock: true },
    ],
  },
  {
    id: 100, name: "VEVOR Electric Hoist Support Arm, 600 kg Max Load Capacity, Electric", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FHLZJTZ200100C8VC9V0%2Fgoods_img-v2%2Fhoist-support-m100-1.2.jpg?timestamp=1715044119000", lastUpdated: "27 Sept 2026",
    specs: ["Automotive", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Electric Hoist Support Arm, 600 kg Max Load Capacity, Electric Hoist Holder Swing Arm with Pole, Steel Hoist Frame, 180\u00b0 Swivel Scaffold Hoist Lifting Arm, Winch Hoist Arm for Workshop, GarageLift Heavy Loads with EaseStable Triangular DesignEasy Multi-Angle AdjustmentQuick and Simple InstallationVersatile and ReliableUniversal CompatibilityExtension Tube Extension Length: 14.37\u00b10.24 inches/365\u00b16 mm,Product Size (Extension Tube Extended): 51.18 x 6.69 x 31.5 inches/1300 x 170 x 800 mm,Item Model Number: DHZJ-300/600KG,Rotatable Angle: 180\u00b0,Product Weight: 40.12 lbs/18.2 kg,Material: Carbon Steel,Extended Small Square Tube: 661.39 lbs/300 kg,Swing Arm Large Square Tube: 1322.78 lbs/600 kg",
    history: [56.9],
    prices: [
      { store: "vevor", price: 56.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Felectric-wire-rope-hoist-c_10453%2Fvevor-electric-hoist-support-arm-1320-lbs-max-load-capacity-electric-hoist-holder-swing-arm-with-pole-steel-hoist-frame-180-swivel-scaffold-hoist-lifting-arm-winch-hoist-arm-for-workshop-garage-p_010680499173", inStock: true },
    ],
  },
  {
    id: 101, name: "VEVOR 5 Ton/4999.9 kg Pneumatic Jack Triple Bag Air Jack Lifting", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FQJD5TSBQNS0000001V0%2Fgoods_img-v8%2Fpneumatic-jack-m100-1.2.jpg?timestamp=1650616546000", lastUpdated: "27 Sept 2026",
    specs: ["Automotive", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR 5 Ton/4999.9 kg Pneumatic Jack Triple Bag Air Jack Lifting Height 16.5-40.6 cm Inflatable Car Jack Lifter Pneumatic Air Jack 4999.9 kg Capacity Extremely Fast Lifting11000lbs Loading Capacity6.3\"-15.75\" Lifting RangeSolid ConstructionEasy OperationLong Lever HandleWide ApplicationMin.",
    history: [98.9],
    prices: [
      { store: "vevor", price: 98.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fpneumatic-car-jack-c_10308%2Fpneumatic-car-jack-5-ton-11023-lbs-air-jack-lifting-height-up-to-16--p_010540950130", inStock: true },
    ],
  },
  {
    id: 102, name: "VEVOR 5 Pcs Diamond Hole Saw Set Diamond Drill Core Bits, M14", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FQGJJGSKKQ5JT20001V0%2Fgoods_img-v7%2Fdiamond-hole-saw-set-m100-1.2.jpg?timestamp=1632649931000", lastUpdated: "27 Sept 2026",
    specs: ["Tools", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR 5 Pcs Diamond Hole Saw Set Diamond Drill Core Bits, M14 25/40/45/50/68MM Hole Saw Cutter Drill Bits, M14 thread Point-Accurate Drilling for Tiles Ceramic GraniteRugged Diamond DustFit for M14 ThreadSmall Gaps BetweenEasy Slug RemovalClean & ConvenientWide ApplicationGross Weight: 3 lbs / 1.36 kg,Carborundum Height: 15 mm / 0.59 in,Package Dimensions (L x W x H): 7.9 x 6.7 x 4.3 in / 20 x 17 x 11 cm,Total Length of Each Drilling Bit: 60 mm / 2.3 in,Drill Bits Diameter: 25/40/45/50/68 mm / 1/1.6/1.8/2/2.7 in,Mounting Thread: M14",
    history: [29.9],
    prices: [
      { store: "vevor", price: 29.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fhole-saw-kit-c_11426%2F5pcs-diamond-holesaw-set-25-40-45-50-68mm-m14-porcelain-25-40-45-50-68mm-granite-p_010262700622", inStock: true },
    ],
  },
  {
    id: 103, name: "VEVOR Portable Folding Workstand, 1267 x 665 mm Collapsible", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FBXSGZTPPSL4FAB6G7001V0%2Fgoods_img-v2%2Fportable-work-stand-m100-1.2.jpg?timestamp=1745551892000", lastUpdated: "27 Sept 2026",
    specs: ["Tools", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Portable Folding Workstand, 1267 x 665 mm Collapsible Workbench, 1135 kg Weight Capacity, No Assembly Foldable Work Stand with Storage Bag, Table Top NOT Included, for Garage Workshop OutdoorPortable Workstand with High Weight CapacityReinforced Tubing for Stability and StrengthEfficient Work SetupMulti-Purpose WorkstationThoughtful Design DetailsWide Rubber Pads for Secure GripExpanded Size: 4.16 x 2.18 ft / 1267 x 665 mm,Weight Capacity: \u22642500 lbs / 1135 kg,Number of Support Legs: 6,Item Model Number: SNT-6A,Support Surface Height: 34.13 in / 867 mm,Product Weight: 10.89 lbs / 4.94 kg,Main Material: Aluminum Alloy + Carbon Steel,Product Size: 49.88 x 26.18 x 34.13 in / 1267 x 665 x 867 mm",
    history: [50.9],
    prices: [
      { store: "vevor", price: 50.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fportable-work-stand-c_14101%2Fvevor-portable-folding-workstand-1267-x-665-mm-collapsible-work-stand-1135-kg-p_010147339727", inStock: true },
    ],
  },
  {
    id: 104, name: "VEVOR Crowd Control Stanchion, Set of 4 Pieces Stanchion Set,", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FGLZHSHDJTZGT4HKJUV0%2Fgoods_img-v9%2Fcrowd-control-stanchion-m100-1.2.jpg?timestamp=1640829863000", lastUpdated: "27 Sept 2026",
    specs: ["Tools", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Crowd Control Stanchion, Set of 4 Pieces Stanchion Set, Stanchion Set with 6.6 ft/2 m Black Retractable Belt, Black Crowd Control Barrier with Concrete and Metal Base - Easy Connect AssemblySteel & Iron MaterialRetractable Belt4-Way ConnectionSteady BaseEasy to AssembleWidely UsedBelt Material: Nylon,Overall Height: (Approx.) 35.4 in / 90 cm,Pole Thickness: 0.03 in / 0.8 mm,Base Diameter: 12.6 in / 32 cm,Number: 4 Pcs,Model: Heavy Duty,Belt Length: 6.6 ft / 2 m,Main Material: Stainless Steel, Iron,Belt Color: Black,Item Weight: 49 lbs / 22 kg",
    history: [89.9],
    prices: [
      { store: "vevor", price: 89.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fstanchion-c_10268%2Fvevor-4-x-retractable-crowd-control-barriers-queue-pole-post-stanchions-belt-set-p_010875136057", inStock: true },
    ],
  },
  {
    id: 105, name: "VEVOR 6-Tier Bamboo Shelf, Open Wood Bookshelf, Display Storage Rack", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FTBSJTBZZZFX69RI3MV0%2Fgoods_img-v3%2Frattan-bookshelves-m100-1.2.jpg?timestamp=1731295423000", lastUpdated: "27 Sept 2026",
    specs: ["Furniture", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR 6-Tier Bamboo Shelf, Open Wood Bookshelf, Display Storage Rack Organizer, Freestanding Flower Plant Stand, Multifunctional Bamboo Bookshelf Ideal for Bathroom, Bedroom, Office, Study, NaturalOpen StorageSturdy & DurableSafety ProtectionQuick AssemblyVersatile UseUser-Friendly MaterialsBack Strip: 22.44 x 0.98 x 0.59 inches / 570 x 25 x 15 mm,Main Materials: Long Piece 1.30 x 0.59 inches / 33 x 15 mm, 0.98 x 0.59 inches / 25 x 15 mm,Weight Capacity: 22 lbs per Layer,Shelf Dimensions: 22.44 x 10.04 x 0.79 inches / 570 x 255 x 20 mm,Color: Bamboo Natural Color,Materials: Long Piece: 22.44 x 0.98 x 0.55 inches / 570 x 25 x 14 mm, Short Piece: 9.96 x 1.18 x 0.24 inches / 253 x 30 x 6 mm,Item Model Number: OPX-BSS-24IN-6T-N,Product Weight: 18.52 lbs / 8.4 kg,Material: Nan Bamboo,Frame Dimensions: 22.44 x 10.04 x 0.79 inches / 863 x 33 x 15 mm, 33.98 x 1.30 x 0.59 inches / 830 x 33 x 15 mm,Product Dimensions: 23.62 x 10.24 x 63.39 inches / 600 x 260 x 1610 mm,Layers: 5",
    history: [45.9],
    prices: [
      { store: "vevor", price: 45.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fbookshelves-c_13502%2Fvevor-bamboo-bookshelf-6-tiers-bamboo-ladder-bookcase-rectangle-storage-rack-p_010415805710", inStock: true },
    ],
  },
  {
    id: 106, name: "VEVOR Table Legs, 29.5\" H x 29.9\" W Steel Furniture Legs, Modular", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FZTCFKXX2830I85NBJ001V0%2Fgoods_img-v1%2Ftable-legs-m100-1.2.jpg?timestamp=1770861591000", lastUpdated: "27 Sept 2026",
    specs: ["Furniture", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Table Legs, 29.5\" H x 29.9\" W Steel Furniture Legs, Modular Design, Easy Assembly, 2204 lbs Max Load Heavy Duty, for Home Office Desk, Coffee Dinner Bar Tables, Workbench,2 PCS, X Frame, BlackCarbon Steel ConstructionAll-Black ScrewsNon-Slip FeetVersatile UseEasy InstallationEasy MaintenanceColor: Black,Item Model Number: HXZTXX28-30,Max Load Capacity: 2204 lbs / 1000 kg,Quantity: 2,Material: Carbon Steel,Product Dimensions: 29.9 x 4.7 x 29.5 in / 760 x 120 x 750 mm,Net Weight: 39.5 lbs / 17.9 kg",
    history: [69.99],
    prices: [
      { store: "vevor", price: 69.99, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Ftable-legs-c_42696%2Fvevor-table-legs-29-5-h-x-29-9-w-steel-furniture-legs-modular-design-easy-assembly-2204-lbs-max-load-heavy-duty-for-home-office-desk-coffee-dinner-bar-tables-workbench-2-pcs-x-frame-black-p_010305032940", inStock: true },
    ],
  },
  {
    id: 107, name: "VEVOR Stainless Steel Food Prep Table Commercial Kitchen Work Table", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FCFBXGGZTSCGZCKBE4V0%2Fgoods_img-v6%2Fstainless-steel-work-table-m100-1.2.jpg?timestamp=1787821380000", lastUpdated: "27 Sept 2026",
    specs: ["Furniture", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Stainless Steel Food Prep Table Commercial Kitchen Work Table 45.7x121.9 cmStylish Work TableMultiple Styles AvailableDurable, Safe, and StableFlexible SetupEasy to InstallVersatile ApplicationsProduct Size (L x W x H): 18 x 48 x 34 inch / 457 x 1219 x 864 mm,Item Model Number: SCGZT1220*455T,Product Weight: 39 lbs / 17.75 kg,Material: Stainless Steel",
    history: [107.9],
    prices: [
      { store: "vevor", price: 107.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fstainless-steel-work-table-c_10625%2Fvevor-stainless-steel-food-prep-table-commercial-kitchen-work-table-18-x48--p_010922258104", inStock: true },
    ],
  },
  {
    id: 108, name: "VEVOR 4 Tiers Water Jug Holder, 5 Gallon Water Bottle Holder, Double", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2F5JLTZSSTSTZCX729CV0%2Fgoods_img-v2%2Fwater-jug-holder-m100-1.2.jpg?timestamp=1722396838000", lastUpdated: "27 Sept 2026",
    specs: ["Storage & Organization", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR 4 Tiers Water Jug Holder, 5 Gallon Water Bottle Holder, Double Row Water Bottle Rack for 8 Bottles, Heavy Duty Water Jug Rack for Kitchen, Office, Living Room, BlackWater Bottle RackAdjustable SlotsEasy InstallationThoughtful DetailsVersatile UseVariety of SizesPrimary Material: Iron,Number of Rows: Double Row,Capacity: 8 Bottles,Number of Tiers: 4 Tiers,Color: Black,Product Model: 8 Water Bottle Rack-B,Product Dimensions: 25.6 \u00d7 13.0 \u00d7 42.9 in / 650 \u00d7 330 \u00d7 1090 mm,Net Weight: 13.71 lbs /6.22 kg,Overall Load Capacity: 335.1 lbs / 152 kg",
    history: [35.9],
    prices: [
      { store: "vevor", price: 35.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fshelving-c_13349%2Fvevor-4-tiers-water-jug-holder-double-row-water-bottle-rack-for-8-bottles-black-p_010647350818", inStock: true },
    ],
  },
  {
    id: 109, name: "VEVOR Over Washer and Dryer Storage Shelves, 6 Tiers Laundry Room", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FLDXYJZJTJK2PRT0BR001V0%2Fgoods_img-v2%2Fover-washer-and-dryer-storage-shelf-m100-1.2.jpg?timestamp=1750904226000", lastUpdated: "27 Sept 2026",
    specs: ["Storage & Organization", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Over Washer and Dryer Storage Shelves, 6 Tiers Laundry Room Drying Rack with Hanger Rod and Hooks, Two Rows Adjustable Washer Shelves Space Saver, for Laundry Room Storage & Organization, WhiteIncrease Storage SpaceAdjustable Shelf HeightMulti-Function DesignStable and SecureDurable QualityFit Multiple SpacesTotal Width: 63.39 in / 1610 mm,Storage Layers: 6 layers,Single Cone 4 Hooks Capacity: 22 lbs / 10 kg each,Columns: 2 columns,Depth: 13.4 in / 340 mm; 21.9 in / 555 mm,Total Height: 77.36 in / 1965 mm,Hanging Rod Capacity: 11 lbs / 5 kg each,Shelf Mesh Capacity: 44 lbs / 20 kg each,Item Model Number: SHSS8234196-6W,Maximum Load Capacity: 573 lbs / 260 kg,Working Load Capacity: 330.7 lbs / 150 kg,Net Weight: 27.78 lbs / 12.60 kg,Main Material: Carbon Steel,Washing Machine Size Fit: 29.92 in / 760 mm",
    history: [55.9],
    prices: [
      { store: "vevor", price: 55.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fwasher-pedestal-c_10860%2Fvevor-over-washer-and-dryer-storage-shelf-two-row-6-tiers-washer-rack-white-p_010475840906", inStock: true },
    ],
  },
  {
    id: 110, name: "VEVOR Pizza Stone, 15 in Round Cordierite Pizza Stone, Extra Large", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FPSSJQSYX15INBTVJF001V0%2Fgoods_img-v3%2Fpizza-stone-m100-1.2.jpg?timestamp=1758006669000", lastUpdated: "27 Sept 2026",
    specs: ["Kitchen", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Pizza Stone, 15 in Round Cordierite Pizza Stone, Extra Large Baking-Stone with Aluminum Peel, 0.67 in Thickness Heat-Resistant Cooking Cordierite, for Kitchen Oven, Baking Pizzas, BBQ GrillingEnhanced Baking ResultsHigh-Temperature CordieriteEasy to UseVersatile CompatibilityWide ApplicationsSmooth EdgesThickness: 0.67 in/17 mm,Product Type: Round,Item Model Number: VV38015P,Heat Tolerance: 1450 \u00b0F/787 \u00b0C,Product Dimensions: 15 x 15 x 0.67 in/381 x 381 x 17 mm,Net Weight: 8.11 lbs/3.68 kg,Main Material: Cordierite",
    history: [23.9],
    prices: [
      { store: "vevor", price: 23.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fbaking-steel-c_10611%2Fvevor-pizza-stone-15-in-round-cordierite-pizza-stone-extra-large-baking-stone-with-aluminum-peel-0-67-in-thickness-heat-resistant-cooking-cordierite-for-kitchen-oven-baking-pizzas-bbq-grilling-p_010691905513", inStock: true },
    ],
  },
  {
    id: 111, name: "VEVOR White Round Tablecloths 6 Pack, 132 Inches in Diameter, Stain-", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FDLZB132INCHBQ9NPD001V0%2Fgoods_img-v1%2Ftable-cover-m100-1.2.jpg?timestamp=1763516990000", lastUpdated: "27 Sept 2026",
    specs: ["Kitchen", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR White Round Tablecloths 6 Pack, 132 Inches in Diameter, Stain- & Wrinkle- Resistant, Machine Washable Table Clothes, Polyester Fabric Table Covers for Wedding, Party, Banquet, Formal EventsSkin-Friendly and BreathablePrecision SewingWrinkle-ResistantEasy to MaintainIdeal PresentMultiple OptionsCounts: 6 Pcs/Box,Item Model Number: RD-TB-13,Net Weight: 14.8 lbs / 6.72 kg,Product Size: 132 inch / 3352 mm",
    history: [48.9],
    prices: [
      { store: "vevor", price: 48.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Ftablecloths-c_14264%2Fvevor-white-round-tablecloths-6-pack-132-inches-in-diameter-stain-wrinkle-resistant-machine-washable-table-clothes-polyester-fabric-table-covers-for-wedding-party-banquet-formal-events-p_010438666033", inStock: true },
    ],
  },
  {
    id: 112, name: "VEVOR Artificial Wedding Arch Flowers Kit, Yellow Wedding Arch", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FHLGMHTJ3JTHS78U39V0%2Fgoods_img-v1%2Fwedding-arch-flower-kit-m100-1.2.jpg?timestamp=1739179464000", lastUpdated: "27 Sept 2026",
    specs: ["Home Decor", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Artificial Wedding Arch Flowers Kit, Yellow Wedding Arch Flowers with Drapes Kit (Pack of 3) - 2 Pcs Floral Arrangement, 1 Pcs Sheer Drapes, for Ceremony Bouquets Reception Backdrop DecorationWedding Arch KitFull, Realistic BloomsElegant DrapesExquisite DetailsEasy SetupRomantic Wedding DecorDrapes Material: Translucent Fabric,Flower Material: Silk Fabric,Drapes Size: 21 x 2.5 ft / 6400 x 760 mm,Curtain Color: White,Item Model Number: XH-HQ02,Flower Type: Sunflower + Peony + Rose + Button Chrysanthemum + Dahlia,Set Type: 3-Piece Set,Flower Color: Yellow + White,Corner Flower Size(Natural): 35.82 x 24.01 in / 910 x 610 mm,Tie-Back Flower Size(Natural): 27.16 x 17.12 in / 690 x 435 mm,Net Weight: 1.61 lb / 0.73 kg,Corner Flower Size(Straightened): 41.33 x 17.32 in / 1050 x 440 mm",
    history: [34.9],
    prices: [
      { store: "vevor", price: 34.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fartificial-flowers-c_13639%2Fvevor-artificial-wedding-arch-flowers-kit-yellow-with-2-pcs-flowers-1-pcs-drapes-p_010679699815", inStock: true },
    ],
  },
  {
    id: 113, name: "VEVOR Flower Ball Arrangement Bouquet 10 PCS, 19.6 x 8.6 Inch", cat: "home",
    img: "\ud83d\udee0\ufe0f", image: "https://image.vevor.com/us%2FZSHQTXLSBS190GWMF001V0%2Fgoods_img-v2%2Fflower-balls-centerpiece-m100-1.2.jpg?timestamp=1751018217000", lastUpdated: "27 Sept 2026",
    specs: ["Home Decor", "2-5 days delivery", "Free shipping", "New"],
    ai: "VEVOR Flower Ball Arrangement Bouquet 10 PCS, 19.6 x 8.6 Inch Artificial Flower Balls Wedding Table Centerpieces, Faux Rose Arrangements for Wedding Centerpiece Home Decoration, Blue and White RosesPremium Lush Floral BallsPremium QualityQuick Fluff RestorationVersatile for Every MomentBefore PurchaseCustomizable OptionsItem Dimensions (L x W x H): 19.7 x 8.7 x 4.7 inch / 500 x 220 x 120 mm ,Number of Pieces: 10,Base Size: 17.32 x 4.72 inch / 440 x 120 mm,Color: Blue,Item Model Number: JN-CT-01,Material: Silk Fabric Petals, Plastic Aquatic Plants,Net Weight: 3.9 lbs / 1.79 kg",
    history: [48.9],
    prices: [
      { store: "vevor", price: 48.9, shipping: 0.0, delivery: "2-5 days", affiliateLink: "https://tc.tradetracker.net/?c=34772&m=1962969&a=515952&r=&u=https%3A%2F%2Fwww.vevor.co.uk%2Fdecorative-wreaths-c_13558%2Fvevor-flower-ball-arrangement-bouquet-10-pcs-19-6-x-8-6-inch-artificial-flower-balls-wedding-table-centerpieces-faux-rose-arrangements-for-wedding-centerpiece-home-decoration-blue-and-white-roses-p_010429194946", inStock: true },
    ],
  },
];

const TRENDING = [PRODUCTS[0], PRODUCTS[3], PRODUCTS[4]];
/* Each recent search links to the specific product the customer was
   actually looking at, so tapping it re-opens that product directly
   instead of re-running a text search and making them find it again. */
const RECENT_SEARCHES = [
  { label: "iPhone 15", productId: 1 },
  { label: "Wireless headphones", productId: 2 },
  { label: "Running shoes", productId: 4 },
];

/* "For You" — trending items plus anything matching the customer's recent
   searches, deduplicated. Replaces a flat "All" tab so the default view
   feels curated rather than every category mixed together. In production
   this would also factor in past purchases/clicks, not just searches. */
const FOR_YOU = (() => {
  const seen = new Set();
  const list = [];
  const add = (p) => { if (!seen.has(p.id)) { seen.add(p.id); list.push(p); } };
  TRENDING.forEach(add);
  RECENT_SEARCHES.forEach((r) => {
    const p = PRODUCTS.find((x) => x.id === r.productId);
    if (p) add(p);
  });
  return list;
})();

const fmt = (n) => `£${n.toFixed(2)}`;
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

/* Shows every real photo the feed actually provided for this product
   (usually 1, sometimes 2 — affiliate feeds rarely include the full
   gallery a retailer shows on its own site), with small thumbnails to
   switch between them when there's more than one. Same plain <img>
   pattern used everywhere else in the app — no extra logic, so it
   can't behave differently from the image tags that already work. */
function ProductGallery({ product }) {
  const C = useTheme();
  const images = [product.image, product.image2].filter(Boolean);
  const [active, setActive] = useState(0);
  return (
    <>
      {images[active] ? (
        <img src={images[active]} alt={product.name} style={{ maxHeight: 140, maxWidth: "70%", objectFit: "contain" }} />
      ) : product.img}
      {images.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: 44, height: 44, borderRadius: 10, overflow: "hidden", padding: 0,
                border: i === active ? `2px solid ${C.blueDeep}` : "1px solid rgba(0,0,0,0.12)",
                background: C.card, cursor: "pointer",
              }}
            >
              <img src={img} alt={`${product.name} view ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function RatingRow({ rating, reviews }) {
  const C = useTheme();
  // No fabricated ratings: if a product has no real rating data, show
  // nothing rather than inventing a number or star.
  if (!rating) return null;
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
  // Honest handling: a single real price snapshot isn't a "history" —
  // don't fabricate past prices to draw a trend line. Say so instead.
  if (!history || history.length < 2) {
    return (
      <div style={{ fontSize: 12, color: C.inkSoft, textAlign: "center", padding: "18px 0" }}>
        Just added — price history builds up as we track this over time.
      </div>
    );
  }
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
      <span style={{ fontWeight: 700, color: C.blueDeep }}>{storeCount} partner store{storeCount === 1 ? "" : "s"} across {catCount} categor{catCount === 1 ? "y" : "ies"} </span>
      — we only compare stores we have a direct relationship with, so every price shown is real and current. Still growing as we add more retailers.
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
      {/* "Best value" only means something once there's a real second store
          to compare against — with a single store, the score is 10.0 by
          construction, not because it's actually beaten any competition. */}
      {product.prices.length > 1 && (
        <div style={{ position: "absolute", top: 10, left: 10, background: C.greenSoft, color: C.green, fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 999 }}>
          BEST VALUE
        </div>
      )}
      <button onClick={(e) => { e.stopPropagation(); onFav(product.id); }} style={{ position: "absolute", top: 10, right: 10, background: C.card, border: "none", borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <Heart size={15} fill={isFav ? "#E4572E" : "none"} color={isFav ? "#E4572E" : C.inkSoft} />
      </button>
      <div style={{ fontSize: 48, textAlign: "center", padding: "18px 0 10px" }}>
        {product.image ? <img src={product.image} alt={product.name} style={{ maxHeight: 80, maxWidth: "80%", objectFit: "contain" }} /> : product.img}
      </div>
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
          {RECENT_SEARCHES.map((r) => {
            const p = PRODUCTS.find((x) => x.id === r.productId);
            return (
              <div key={r.label} onClick={() => p && openProduct(p)} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 14px", fontSize: 12.5, color: C.ink, cursor: "pointer" }}>{r.label}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SearchResults({ go, favorites, toggleFav, openProduct, q, setQ, cat, setCat }) {
  const C = useTheme();
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for any product…" style={{ border: "none", outline: "none", fontSize: 14, flex: 1, fontFamily: bodyFont }} />
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
            <div style={{ fontSize: 40, width: 64, height: 64, background: C.blueSoft, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : p.img}
            </div>
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

function ProductDetails({ product, onBack, favorites, toggleFav, addAlert, removeAlert, stockAlerts, toggleStockAlert, alerts, alertTargets, adjustTarget, showToast }) {
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
          <ProductGallery product={product} />
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

        {product.ai && (
          <div style={{ marginTop: 16, background: C.greenSoft, borderRadius: 16, padding: 14 }}>
            {/* Honest labeling: this is the retailer's own product description,
                not an AI-generated summary of real customer reviews — we don't
                have review data for real products, so we don't fabricate it. */}
            <div style={{ fontSize: 11, fontWeight: 800, color: C.green, letterSpacing: 0.4 }}>PRODUCT OVERVIEW</div>
            <div style={{ fontSize: 13, color: C.ink, marginTop: 5, lineHeight: 1.5 }}>{product.ai}</div>
          </div>
        )}

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
                            window.open(p.affiliateLink, "_blank", "noopener");
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: C.green }}>
                  <Bell size={14} /> Alert active
                </div>
                <button
                  onClick={() => { removeAlert?.(product.id); showToast?.("Alert removed"); }}
                  style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Remove
                </button>
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
          Every store here has a direct partnership with PricePilot — a mix of major names and UK-based specialists, so you're not limited to just the big names.
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
                    {s.local ? "UK" : "INTERNATIONAL"}
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
                    <div style={{ fontSize: 34, width: 54, height: 54, background: C.blueSoft, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {a.image ? <img src={a.image} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : a.img}
                    </div>
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
        <ProfileRow icon={Globe} label="Preferred country" right={<span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 700 }}>United Kingdom</span>} />
        <ProfileRow icon={DollarSign} label="Preferred currency" right={<span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 700 }}>GBP</span>} />
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
  const [searchQuery, setSearchQuery] = useState("");
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
  const openSearch = (categoryId) => { setSearchCategory(categoryId || "foryou"); setSearchQuery(""); setScreen("search"); };

  return (
    <ThemeContext.Provider value={theme}>
    <div style={{ width: "100%", maxWidth: 480, minHeight: "100vh", margin: "0 auto", background: theme.bg, fontFamily: bodyFont, position: "relative", transition: "background .2s" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap" />
      {screen === "welcome" && <Welcome go={setScreen} />}
      {screen === "home" && <HomeScreen go={setScreen} openSearch={openSearch} favorites={favorites} toggleFav={toggleFav} openProduct={openProduct} />}
      {screen === "search" && <SearchResults go={setScreen} favorites={favorites} toggleFav={toggleFav} openProduct={openProduct} q={searchQuery} setQ={setSearchQuery} cat={searchCategory} setCat={setSearchCategory} />}
      {screen === "product" && <ProductDetails product={selected} onBack={() => setScreen("search")} favorites={favorites} toggleFav={toggleFav} addAlert={addAlert} removeAlert={removeAlert} stockAlerts={stockAlerts} toggleStockAlert={toggleStockAlert} alerts={alerts} alertTargets={alertTargets} adjustTarget={adjustTarget} showToast={showToast} />}
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
