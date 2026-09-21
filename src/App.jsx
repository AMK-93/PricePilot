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
    img: "💻", image: "https://media.stockinthechannel.com/pic/9Ist2BTU8k-ndga9fzAkNg.c-r.jpg", lastUpdated: "Today",
    specs: ["13.3\" Full HD display", "Intel Core i5-10210U", "8GB RAM / 256GB SSD", "Windows 10 Pro"],
    ai: "A compact business laptop built for travel — thin, light, and durable, with all-day battery life and Wi-Fi 6 connectivity.",
    history: [480.17],
    prices: [
      { store: "laptophub", price: 480.17, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-x13-gen-1-intel-intelr-coretm-i5-i5-10210u-laptop-33-8-cm-13-3-full-hd-8-gb-ddr4-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-10-pro-black.html", inStock: true },
    ],
  },
  {
    id: 2, name: "Microsoft Surface Laptop 7 Copilot+ PC (Core Ultra 5)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/oPvDTw7dCki3a2FbceHDWw.c-r.jpg", lastUpdated: "Today",
    specs: ["15\" touchscreen", "Intel Core Ultra 5 236V", "16GB RAM / 512GB SSD", "Windows 11 Pro"],
    ai: "A business-focused Copilot+ PC with AI-enabled performance, built for collaboration and productivity on the move.",
    history: [1568.33],
    prices: [
      { store: "laptophub", price: 1568.33, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-copilot-pc-intel-core-ultra-5-236v-38-1-cm-15-touchscreen-16-gb-lpddr5x-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black.html", inStock: true },
    ],
  },
  {
    id: 3, name: "HP Fortis G11 Chromebook (14\")", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/tGdi7dbCNE-bsLXNW3zDUQ.c-r.jpg", lastUpdated: "Today",
    specs: ["14\" Full HD display", "Intel N100 quad-core", "4GB RAM / 32GB eMMC", "ChromeOS, rugged design"],
    ai: "A ruggedized Chromebook built for everyday reliability, with a reinforced 180-degree hinge and long battery life.",
    history: [343.37],
    prices: [
      { store: "laptophub", price: 343.37, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-fortis-g11-intelr-n-n100-chromebook-35-6-cm-14-full-hd-4-gb-lpddr5-sdram-32-gb-emmc-wi-fi-6e-802-11ax-chromeos-black.html", inStock: true },
    ],
  },
  {
    id: 4, name: "Samsung Galaxy Book4 (15.6\", Core 3, 8GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kZ74a4Os8UKIVaEyG_DG_w.c-r.jpg", lastUpdated: "Today",
    specs: ["15.6\" display", "Intel Core 3", "8GB RAM", "NVIDIA GeForce MX570 A graphics"],
    ai: "A slim, well-connected laptop with a wide range of built-in ports and seamless integration with Samsung Galaxy devices.",
    history: [391.47],
    prices: [
      { store: "laptophub", price: 391.47, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book4-15-6-core-3-8gb.html", inStock: true },
    ],
  },
  {
    id: 5, name: "Apple MacBook Pro 2023 16.2\" M2 Pro (16GB/500GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/mnY4KKVKPEGo6llO0A3aLQ.c-r.jpg", lastUpdated: "Today",
    specs: ["16.2\" Liquid Retina XDR", "Apple M2 Pro chip", "16GB RAM / 500GB SSD", "Silver"],
    ai: "Apple's pro-tier laptop, built for demanding creative and professional workloads with exceptional battery efficiency.",
    history: [2220.02],
    prices: [
      { store: "laptophub", price: 2220.02, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-2023-16-2in-m2-pro-16gb-500gb-silver.html", inStock: true },
    ],
  },
  {
    id: 6, name: "Acer Predator Helios 18 AI (Core Ultra 9, RTX 5090)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/8DUbqpx8Q0O4vR8sKTKUWQ.c-r.jpg", lastUpdated: "Today",
    specs: ["18\" Mini LED display", "Intel Core Ultra 9", "192GB RAM / 5TB SSD", "NVIDIA GeForce RTX 5090"],
    ai: "A flagship gaming laptop with desktop-level performance, a 4K Mini LED display, and NVIDIA's latest RTX 50-series graphics.",
    history: [4340.99],
    prices: [
      { store: "laptophub", price: 4340.99, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-predator-helios-18-ai-ph18-73-intel-ultra-9-192gb-5tb-ssd-rtx5090-18-wquxga-windows-11-gaming-notebook.html", inStock: true },
    ],
  },
  {
    id: 7, name: "ASUS Chromebook Plus Enterprise CX54", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/WgMRlTF1AUegno3TD_M1Tg.c-r.jpg", lastUpdated: "Today",
    specs: ["14\" touchscreen, WQXGA", "Intel Core Ultra 7 155U", "8GB RAM / 512GB SSD", "ChromeOS"],
    ai: "A business-focused Chromebook Plus with enhanced video-call tools and offline productivity features.",
    history: [668.12],
    prices: [
      { store: "laptophub", price: 668.12, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-chromebook-plus-enterprise-cx54-cx5403cma-qm0381-intel-core-ultra-7-155u-35-6-cm-14-touchscreen-wqxga-8-gb-lpddr5x-sdram-512-gb-ssd-wi-fi-6e-802-11ax-chromeos-silver.html", inStock: true },
    ],
  },
  {
    id: 8, name: "ASUS Chromebook CZ11 CZ1104CM4A-MZ0022 MediaTek Kompanio 540 29.5 cm (", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/cwGDjqsmykGPkhDs_PGQBQ.c-r.jpg", lastUpdated: "Today",
    specs: ["MediaTek Kompanio 540", "Full specs on retailer page"],
    ai: "The rugged. student-centric study mate ASUS Chromebook CZ11 is an excellent study companion for K-12 students. with a portable and durable design that guarantees enduring value and empowers engaged learning - anywhere.",
    history: [239.37],
    prices: [
      { store: "laptophub", price: 239.37, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-chromebook-cz11-cz1104cm4a-mz0022-mediatek-kompanio-540-29-5-cm-11-6-hd-4-gb-lpddr5x-sdram-64-gb-emmc-wi-fi-6e-802-11ax-chromeos-grey-qwerty-uk-english.html", inStock: true },
    ],
  },
  {
    id: 9, name: "HP Fortis G1m 11 Chromebook MediaTek 520 29.5 cm (11.6\") HD 4 GB", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kOBbSka5uUmK58VZC3fpDA.c-r.jpg", lastUpdated: "Today",
    specs: ["11.6\" display", "MediaTek 520", "ChromeOS"],
    ai: "The HP Fortis G1m Chromebook is purpose-built to handle the demands of modern classrooms and busy work environments. Designed with reinforced edges. a rugged chassis. and a spill-resistant keyboard.",
    history: [245.02],
    prices: [
      { store: "laptophub", price: 245.02, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-fortis-g1m-11-chromebook-mediatek-520-29-5-cm-11-6-hd-4-gb-lpddr4x-sdram-32-gb-emmc-wi-fi-6-802-11ax-chromeos-black.html", inStock: true },
    ],
  },
  {
    id: 10, name: "Lenovo Chrome 100e G5 M89 MediaTek Kompanio 540 Chromebook 29.5 cm (11", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/-12992HXwU63W8BUQzZHGQ.c-r.jpg", lastUpdated: "Today",
    specs: ["MediaTek Kompanio 540", "Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [246.62],
    prices: [
      { store: "laptophub", price: 246.62, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-chrome-100e-g5-m89-mediatek-kompanio-540-chromebook-29-5-cm-11-6-hd-4-gb-lpddr5x-sdram-64-gb-ufs-wi-fi-6e-802-11ax-chromeos-english-grey.html", inStock: true },
    ],
  },
  {
    id: 11, name: "Acer Chromebook 314 CBOA314-2H-84H8", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/U9RpFkMc0kuNQz1bVqM9Nw.c-r.jpg", lastUpdated: "Today",
    specs: ["ChromeOS", "Full specs on retailer page"],
    ai: "The Acer Chromebook 314 CBOA314-2H is a lightweight and efficient 14\" Chromebook designed for fast browsing. cloud-based work and everyday learning. Its sharp WUXGA IPS display provides clear visuals.",
    history: [281.36],
    prices: [
      { store: "laptophub", price: 281.36, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-314-cboa314-2h-84h8.html", inStock: true },
    ],
  },
  {
    id: 12, name: "Acer Chromebook 311 C725-853M", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/PZAporhOS0-ObWy3_U1iXg.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [312.58],
    prices: [
      { store: "laptophub", price: 312.58, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-311-c725-853m.html", inStock: true },
    ],
  },
  {
    id: 13, name: "Acer Chromebook 311 (C725) - MediaTek Kompanio 540. 4GB RAM. 64GB. 11", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/BWBnY7OOVkaflas-IwSt3w.c-r.jpg", lastUpdated: "Today",
    specs: ["11.6\" display", "MediaTek Kompanio 540", "4GB RAM", "ChromeOS"],
    ai: "Acer Chromebook 311 (C725) - MediaTek Kompanio 540. 4GB RAM. 64GB. 11.6\" HD display. Chrome OS. Product type: Chromebook. Form factor: Clamshell. Processor family: MediaTek Kompanio. Processor model: 540.",
    history: [251.48],
    prices: [
      { store: "laptophub", price: 251.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-chromebook-311-c725-mediatek-kompanio-540-4gb-ram-64gb-11-6-hd-display-chrome-os.html", inStock: true },
    ],
  },
  {
    id: 14, name: "Acer Chromebook 514 (C937) - Intel N150. 4GB RAM. 128GB. 14\" WUXG", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/2_Za5rG2lyG75JIBtXJ1pA.c-r.png", lastUpdated: "Today",
    specs: ["Intel N150", "4GB RAM", "ChromeOS"],
    ai: "Acer Chromebook 514 (C937) - Intel N150. 4GB RAM. 128GB. 14\" WUXGA display. Chrome OS. Product type: Chromebook. Form factor: Clamshell. Processor family: Intel\u00ae N. Processor model: N150. Display diagonal: 35.6 cm (14\").",
    history: [347.76],
    prices: [
      { store: "laptophub", price: 347.76, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fcatalog%2Fproduct%2Fview%2Fid%2F3616003%2F", inStock: true },
    ],
  },
  {
    id: 15, name: "Lenovo V15 G4 AMN AMD Ryzen\u2122 5 7520U Laptop 39.6 cm (15.6\") Full", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/fgi6y43qLkSTfeYKDfCJNA.c-r.jpg", lastUpdated: "Today",
    specs: ["15.6\" display", "Full specs on retailer page"],
    ai: "Improves productivity everywhere- Powerful AMD Ryzen\u2122 processors with AMD Radeon\u2122 graphics- 15\" FHD (1920 x 1080) display with low-blue light to reduce eye strain- Enhanced security features keep critical data protected- Includes numeric keypad & Service Hot Key- Ideal for on-the-go multitasking",
    history: [482.49],
    prices: [
      { store: "laptophub", price: 482.49, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-v15-g4-amn-amd-ryzentm-5-7520u-laptop-39-6-cm-15-6-full-hd-16-gb-lpddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-black-uk-english.html", inStock: true },
    ],
  },
  {
    id: 16, name: "Acer Aspire Lite AL15-410P-R6JU Notebook", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/pJ-yK6KVI0GlbabLC5vhLw.c-r.jpg", lastUpdated: "Today",
    specs: ["AMD Ryzen 5 3500U", "8GB RAM", "Windows 11 Home"],
    ai: "The Acer Aspire Lite AL15-410P is a slim. lightweight 15.6-inch notebook designed for everyday productivity. Powered by the AMD Ryzen 5 3500U processor. 8GB DDR4 memory and fast 256GB PCIe NVMe SSD storage.",
    history: [491.73],
    prices: [
      { store: "laptophub", price: 491.73, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-aspire-lite-al15-410p-r6ju-notebook.html", inStock: true },
    ],
  },
  {
    id: 17, name: "HP ProBook 4 G1iR Intel Core 5 120U Laptop 35.6 cm (14\") WUXGA 16", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/wnHSrEl1aU-BiJ6zl4_vyA.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 14-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [770.58],
    prices: [
      { store: "laptophub", price: 770.58, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-intel-core-5-120u-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-256-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 18, name: "Acer Aspire Lite AL15-53P-56Z0 Notebook", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/ntzt_pFL5SCLaXd4Do_xng.c-r.png", lastUpdated: "Today",
    specs: ["8GB RAM", "Windows 11 Home"],
    ai: "The Acer Aspire Lite 15 AL15-53P is a slim and efficient 15.6-inch notebook built for everyday productivity. Powered by the Intel Core 5 120U processor. 8GB DDR4 memory and fast 512GB PCIe NVMe 4.0 SSD storage.",
    history: [571.9],
    prices: [
      { store: "laptophub", price: 571.9, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Facer-aspire-lite-al15-53p-56z0-notebook.html", inStock: true },
    ],
  },
  {
    id: 19, name: "Lenovo V14 G4 AMN AMD Ryzen\u2122 5 7520U Laptop 35.6 cm (14\") Full HD", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kRtyP69nWkmCaskGaSeaeQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Windows 11", "Full specs on retailer page"],
    ai: "Lets you do moreWith AMD Ryzen\u2122 mobile processors and AMD Radeon\u2122 graphics. the Lenovo V14 Gen 4 laptop delivers power to get through your workday-in the office. on campus. or at home.",
    history: [429.6],
    prices: [
      { store: "laptophub", price: 429.6, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-v14-g4-amn-amd-ryzentm-5-7520u-laptop-35-6-cm-14-full-hd-8-gb-lpddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-uk-english-black.html", inStock: true },
    ],
  },
  {
    id: 20, name: "HP 200 G2a 16 inch Notebook PC AMD Ryzen\u2122 5 220 Laptop 40.6 cm (16&quo", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/Bu_gdtujYUi3FhIzH-Jj4w.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Essential features in an updated. reliable designThe HP 200 G2a 16-inch Notebook PC is purpose-built for cost-conscious educators and professionals to pack immersive visuals. flexible specs.",
    history: [668.39],
    prices: [
      { store: "laptophub", price: 668.39, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-200-g2a-16-inch-notebook-pc-amd-ryzentm-5-220-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 21, name: "ASUS ExpertBook P1 P1503CV-582X Intel Core 5 210H Laptop 39.6 cm (15.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/p33LfYj9E0Cry3tC37cHtQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Elevate your efficiency. anywhereThe compact and elegant ASUS ExpertBook P1 weighs a mere 1.6 kg1 with a breathtaking new design.",
    history: [454.54],
    prices: [
      { store: "laptophub", price: 454.54, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-expertbook-p1-p1503cv-582x-intel-core-5-210h-laptop-39-6-cm-15-6-full-hd-8-gb-ddr5-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-grey.html", inStock: true },
    ],
  },
  {
    id: 22, name: "Lenovo V15 G5 IRL Intel\u00ae Core\u2122 i5 i5-13420H Laptop 39.6 cm (15.6\"", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/9SiHrV7zoUK_DtCvR2Cg2Q.c-r.jpg", lastUpdated: "Today",
    specs: ["15.6\" display", "Full specs on retailer page"],
    ai: "Tailored for Small-to-Medium Businesses- Cost-effective business laptop focused on business efficiency- Enhanced & secure conferencing capabilities- Proven to endure the demands of daily use",
    history: [457.99],
    prices: [
      { store: "laptophub", price: 457.99, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fcatalog%2Fproduct%2Fview%2Fid%2F3271548%2F", inStock: true },
    ],
  },
  {
    id: 23, name: "Samsung Galaxy Book4 NP754XGJ-CG2UK laptop Intel\u00ae Core\u2122 i7 i7-1355U 39", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/Zs7bYmTNXkWPXJNX050zfA.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Reliable performance for your daily hustleMaster your checklist with the 13th Gen Intel\u00ae Core\u2122 processor. delivering smooth performance for day-to-day productivity. Intel UHD Graphics.",
    history: [569.86],
    prices: [
      { store: "laptophub", price: 569.86, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book4-np754xgj-cg2uk-laptop-intelr-coretm-i7-i7-1355u-39-6-cm-15-6-full-hd-16-gb-lpddr4x-sdram-256-gb-ssd-wi-fi-6-802-11ax-windows-11-pro-grey.html", inStock: true },
    ],
  },
  {
    id: 24, name: "Lenovo ThinkPad L14 Gen 7 (Intel) Copilot+ PC Intel Core Ultra 5 325 L", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/SuavfOSunkmrqnAgwHyZoQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 5 325", "Full specs on retailer page"],
    ai: "Full product details available on LaptopHub's listing.",
    history: [1032.97],
    prices: [
      { store: "laptophub", price: 1032.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-l14-gen-7-intel-copilot-pc-intel-core-ultra-5-325-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black-uk-english.html", inStock: true },
    ],
  },
  {
    id: 25, name: "HP EliteBook 8 G2i 14 inch Notebook Next Gen AI PC Wolf Pro Security E", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/eNGIzOp7REyMAErZu13o5g.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Adaptable AI PC for your workforceAutomate tasks to save time and multitask without lag on the easy to carry HP EliteBook 8 G2i 14 inch AI PC. This HP Copilot+ PC[4] with HP Wolf Security[5]. enterprise management.",
    history: [1413.48],
    prices: [
      { store: "laptophub", price: 1413.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-elitebook-8-g2i-14-inch-notebook-next-gen-ai-pc-wolf-pro-security-edition-copilot-pc-intel-core-ultra-7-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 26, name: "Lenovo ThinkPad E16 Gen 4 (Intel) Copilot+ PC Intel Core Ultra 5 325 L", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/hCdrpOi9E0yesGM1klfFAg.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 5 325", "Full specs on retailer page"],
    ai: "Ready to make the most of your dayThe Lenovo ThinkPad E16 (16\u2033 Intel) laptop exudes power. reliable performance. and robust security-for all of your business requirements.",
    history: [1063.7],
    prices: [
      { store: "laptophub", price: 1063.7, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Flenovo-thinkpad-e16-gen-4-intel-copilot-pc-intel-core-ultra-5-325-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black-english.html", inStock: true },
    ],
  },
  {
    id: 27, name: "HP ProBook 4 G1iR 16 PC Intel Core 5 120U Laptop 40.6 cm (16\") WU", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/gDS2ePiTLkiigLalNRYX-Q.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 16-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [884.96],
    prices: [
      { store: "laptophub", price: 884.96, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-16-pc-intel-core-5-120u-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 28, name: "HP ProBook 4 G1iR 14 inch Notebook PC Intel Core 5 120U Laptop 35.6 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/wnHSrEl1aU-BiJ6zl4_vyA.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Optimize your work with a resilient. future-ready laptopThe HP ProBook 4 G1iR 14-inch Notebook PC provides growing businesses with commercial-grade performance. multi-layered endpoint security[5].",
    history: [884.96],
    prices: [
      { store: "laptophub", price: 884.96, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fhp-probook-4-g1ir-14-inch-notebook-pc-intel-core-5-120u-laptop-35-6-cm-14-wuxga-16-gb-ddr5-sdram-512-gb-ssd-wi-fi-6e-802-11ax-windows-11-pro-silver.html", inStock: true },
    ],
  },
  {
    id: 29, name: "Microsoft Surface Laptop 7 Copilot+ PC Intel Core Ultra 5 236V 38.1 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/oPvDTw7dCki3a2FbceHDWw.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 5 236V", "Full specs on retailer page"],
    ai: "Surface Laptop for Business AI-powered and built for business. Surface Laptop in 13.8-inch and 15-inch models.",
    history: [1398.72],
    prices: [
      { store: "laptophub", price: 1398.72, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-copilot-pc-intel-core-ultra-5-236v-38-1-cm-15-touchscreen-16-gb-lpddr5x-sdram-256-gb-ssd-wi-fi-7-802-11be-windows-11-pro-black.html", inStock: true },
    ],
  },
  {
    id: 30, name: "ASUS TUF Gaming A16 FA607NUQ-RL009W AMD Ryzen\u2122 7 170 Laptop 40.6 cm (1", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/-tJRW82kpUO-WUh-4OK4uQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Portable Power. Maximum ImpactThe design philosophy behind the TUF Gaming A16 is all about blending power with portability. With this lightweight all-around powerhouse. you can enjoy seamless performance wherever you go.",
    history: [909.31],
    prices: [
      { store: "laptophub", price: 909.31, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-tuf-gaming-a16-fa607nuq-rl009w-amd-ryzentm-7-170-laptop-40-6-cm-16-wuxga-16-gb-ddr5-sdram-512-gb-ssd-nvidia-geforce-rtx-4050-wi-fi-6-802-11ax-windows-11-home-grey-black.html", inStock: true },
    ],
  },
  {
    id: 31, name: "Microsoft Surface Laptop 7 Surface Intel Core Ultra 5 236V 16GB RAM 25", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/QZ3ipggX10Wv5svniI42Rw.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 5 236V", "16GB RAM"],
    ai: "Surface Laptop for Business AI-powered and built for business. Surface Laptop in 13.8-inch and 15-inch models.",
    history: [1334.06],
    prices: [
      { store: "laptophub", price: 1334.06, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmicrosoft-surface-laptop-7-surface-intel-core-ultra-5-236v-16gb-ram-256gb-ssd-13-8-touchscreen-windows-11-pro-laptop-ep2-22147.html", inStock: true },
    ],
  },
  {
    id: 32, name: "Samsung Galaxy Book5 Pro (16\". Core Ultra 7. 32GB)", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/zEKyX7721UeQOVOtXQhgvg.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Powerful processor driving the Next-Gen AI PCExperience a new level of transformative AI performance on Galaxy Book5 Pro 14\" with the super-fast Intel\u00ae Core\u2122 Ultra processor (Series 2).",
    history: [1231.2],
    prices: [
      { store: "laptophub", price: 1231.2, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fsamsung-galaxy-book5-pro-16-core-ultra-7-32gb.html", inStock: true },
    ],
  },
  {
    id: 33, name: "MSI Vector 16 HX AI A2XWHG-403UK Intel Core Ultra 7 255HX Laptop 40.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/NaplQvNh-UGrkZ0EmB2Hig.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 7 255HX", "Full specs on retailer page"],
    ai: "Designed for STEM professionals. the Vector 16 HX AI delivers cutting-edge performance and rock-solid stability. It acts as a high-tech brain. seamlessly processing complex data with speed and precision.",
    history: [1550.85],
    prices: [
      { store: "laptophub", price: 1550.85, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-vector-16-hx-ai-a2xwhg-403uk-intel-core-ultra-7-255hx-laptop-40-6-cm-16-quad-hd-16-gb-ddr5-sdram-512-gb-ssd-nvidia-geforce-rtx-5070-ti-wi-fi-6e-802-11ax-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 34, name: "ASUS Zenbook S14 OLED UX5406AA-SU033W Copilot+ PC Intel Core Ultra 9 3", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/kRjOz8wuWEKaAMCEB_lGFw.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 9 3", "Full specs on retailer page"],
    ai: "Pro-Level Performance. Sleek Design. ASUS Zenbook S14 is built from solid metal using an integrated molding process combined with CNC machining. This ensures uncompromised mobility with a sleek. lightweight.",
    history: [1575.97],
    prices: [
      { store: "laptophub", price: 1575.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-zenbook-s14-oled-ux5406aa-su033w-copilot-pc-intel-core-ultra-9-386h-laptop-35-6-cm-14-touchscreen-3k-32-gb-lpddr5x-sdram-1-tb-ssd-wi-fi-7-802-11be-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 35, name: "Apple MacBook Pro 14-inch : M5 chip with 10-core CPU and 10-core GPU", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/0nUgzFXHAUC7z7Mz_qEdxQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "MacBook Pro14-inch model. Now supercharged by M5.",
    history: [1603.65],
    prices: [
      { store: "laptophub", price: 1603.65, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-14-inch-m5-chip-with-10-core-cpu-and-10-core-gpu-16gb-1tb-ssd-space-black.html", inStock: true },
    ],
  },
  {
    id: 36, name: "ASUS ROG Zephyrus G14 GA403GM-SY118W AMD Ryzen AI 9 465 Laptop 35.6 cm", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/qV7hvqRYx0iDBDLT6_0hzQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Windows 11 Pro", "Full specs on retailer page"],
    ai: "ROG Zephyrus G14 (2026) GA403 with a Free ROG 20th Anniversary Football and T-shirtThe Dawn of A New AgeEffortlessly game. create. and collaborate on this next-gen Windows 11 Pro machine.",
    history: [1861.48],
    prices: [
      { store: "laptophub", price: 1861.48, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-rog-zephyrus-g14-ga403gm-sy118w-amd-ryzen-ai-9-465-laptop-35-6-cm-14-3k-16-gb-lpddr5x-sdram-1-tb-ssd-nvidia-geforce-rtx-5060-wi-fi-7-802-11be-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 37, name: "Apple MacBook Pro 16-inch : M5 Pro chip with 18-core CPU and 20-core G", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/JUfUQnsUGEmbhpX_kCR1mA.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "MacBook ProFast runs in the family. Now with M5. M5 Pro. and M5 Max.",
    history: [2397.97],
    prices: [
      { store: "laptophub", price: 2397.97, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-16-inch-m5-pro-chip-with-18-core-cpu-and-20-core-gpu-24gb-1tb-ssd-silver.html", inStock: true },
    ],
  },
  {
    id: 38, name: "ASUS Zenbook A16 UX3607OA-SQ005W Copilot+ PC Snapdragon X2E-94-100 Lap", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/jeZHzVAhdEqRAHbfdOaaxQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Snapdragon X2E", "Full specs on retailer page"],
    ai: "Ultra-light. ultra-powerfulZenbook A16 allows you to upgrade from a 14\u201d laptop to a 16\u201d laptop. at no extra weight thanks to ASUS exclusive Ceraluminum\u2122 used across the lid. frame. and base.",
    history: [2013.59],
    prices: [
      { store: "laptophub", price: 2013.59, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fasus-zenbook-a16-ux3607oa-sq005w-copilot-pc-snapdragon-x2e-94-100-laptop-40-6-cm-16-3k-48-gb-lpddr5x-sdram-1-tb-ssd-wi-fi-7-802-11be-windows-11-home-beige.html", inStock: true },
    ],
  },
  {
    id: 39, name: "MSI Vector 16 HX AI A2XWIG-283UK Intel Core Ultra 9 275HX Laptop 40.6", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/NaplQvNh-UGrkZ0EmB2Hig.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 9 275HX", "Full specs on retailer page"],
    ai: "Designed for STEM professionals. the Vector 16 HX AI delivers cutting-edge performance and rock-solid stability. It acts as a high-tech brain. seamlessly processing complex data with speed and precision.",
    history: [2003.68],
    prices: [
      { store: "laptophub", price: 2003.68, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-vector-16-hx-ai-a2xwig-283uk-intel-core-ultra-9-275hx-laptop-40-6-cm-16-quad-hd-16-gb-ddr5-sdram-1-tb-ssd-nvidia-geforce-rtx-5080-wi-fi-6e-802-11ax-windows-11-home-grey.html", inStock: true },
    ],
  },
  {
    id: 40, name: "Apple MacBook Pro 16-inch : M5 Max chip with 18-core CPU and 32-core G", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/nfVF6UTvdUmyw_-vusJUvQ.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "MacBook ProFast runs in the family. Now with M5. M5 Pro. and M5 Max.",
    history: [3511.51],
    prices: [
      { store: "laptophub", price: 3511.51, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fapple-macbook-pro-16-inch-m5-max-chip-with-18-core-cpu-and-32-core-gpu-36gb-2tb-ssd-space-black.html", inStock: true },
    ],
  },
  {
    id: 41, name: "MSI Raider A18 HX A9WIG-004UK AMD Ryzen\u2122 9 9955HX3D Laptop 45.7 cm (18", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/YxYoOJ4ZCkSNg7U2h0qAyA.c-r.jpg", lastUpdated: "Today",
    specs: ["Full specs on retailer page"],
    ai: "Two cosmic-level powers converged. lit up like a supernova. thus born the new cosmic-level gaming powerhouse: Raider A18 HX.",
    history: [3196.07],
    prices: [
      { store: "laptophub", price: 3196.07, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-raider-a18-hx-a9wig-004uk-amd-ryzentm-9-9955hx3d-laptop-45-7-cm-18-uhd-64-gb-ddr5-sdram-2-tb-ssd-nvidia-geforce-rtx-5080-wi-fi-7-802-11be-windows-11-home-advanced-black.html", inStock: true },
    ],
  },
  {
    id: 42, name: "MSI Raider 16 MAX HX B2WJ-065UK Intel Core Ultra 9 290HX Plus Laptop 4", cat: "electronics",
    img: "💻", image: "https://media.stockinthechannel.com/pic/81QBlSMgaUmnC5ybDoD4Zg.c-r.jpg", lastUpdated: "Today",
    specs: ["Intel Core Ultra 9 290HX", "32GB RAM", "2TB SSD"],
    ai: "The MSI Raider 16 Max HX B2WJ-065UK is a high-performance 16-inch gaming laptop powered by an Intel\u00ae Core\u2122 Ultra 9 290HX Plus processor and NVIDIA\u00ae GeForce RTX\u2122 5090 Laptop GPU. It features a QHD+ 240Hz OLED display.",
    history: [3363.31],
    prices: [
      { store: "laptophub", price: 3363.31, shipping: 0, delivery: "Standard delivery", affiliateLink: "https://www.laptophub.uk/hardware/?tt=30254_2466826_515952_&r=https%3A%2F%2Fwww.pchub.uk%2Fmsi-raider-16-max-hx-b2wj-065uk-intel-core-ultra-9-290hx-plus-laptop-40-6-cm-16-quad-hd-32-gb-ddr5-sdram-2-tb-ssd-nvidia-geforce-rtx-5090-wi-fi-7-802-11be-windows-11-home-black.html", inStock: true },
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
          {product.image ? <img src={product.image} alt={product.name} style={{ maxHeight: 140, maxWidth: "70%", objectFit: "contain" }} /> : product.img}
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
