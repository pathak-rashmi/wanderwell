import santorini from "@/assets/dest-santorini.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import bali from "@/assets/dest-bali.jpg";
import swiss from "@/assets/dest-swiss.jpg";
import lisbon from "@/assets/dest-lisbon.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";

export type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  budget: string;
  bestTime: string;
  weather: "sun" | "cloud" | "rain" | "snow";
  temp: number;
  attractions: string[];
};

export const destinations: Destination[] = [
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image: santorini,
    rating: 4.9,
    budget: "$1,850",
    bestTime: "Apr – Oct",
    weather: "sun",
    temp: 27,
    attractions: ["Oia Sunset", "Red Beach", "Caldera Cruise"],
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    image: kyoto,
    rating: 4.8,
    budget: "$2,140",
    bestTime: "Mar – May",
    weather: "cloud",
    temp: 21,
    attractions: ["Fushimi Inari", "Arashiyama", "Gion District"],
  },
  {
    id: "bali",
    name: "Ubud, Bali",
    country: "Indonesia",
    image: bali,
    rating: 4.7,
    budget: "$1,120",
    bestTime: "May – Sep",
    weather: "rain",
    temp: 30,
    attractions: ["Tegallalang", "Monkey Forest", "Tirta Empul"],
  },
  {
    id: "swiss",
    name: "Interlaken",
    country: "Switzerland",
    image: swiss,
    rating: 4.9,
    budget: "$2,760",
    bestTime: "Jun – Sep",
    weather: "snow",
    temp: 14,
    attractions: ["Jungfraujoch", "Lake Brienz", "Harder Kulm"],
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    image: lisbon,
    rating: 4.6,
    budget: "$1,340",
    bestTime: "Mar – Oct",
    weather: "sun",
    temp: 24,
    attractions: ["Alfama", "Tram 28", "Belém Tower"],
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    image: marrakech,
    rating: 4.5,
    budget: "$980",
    bestTime: "Oct – Apr",
    weather: "sun",
    temp: 29,
    attractions: ["Jemaa el-Fnaa", "Majorelle", "Souks"],
  },
];

export const budgetCategories = [
  { id: "flights", label: "Flights", value: 850 },
  { id: "hotels", label: "Hotels", value: 1200 },
  { id: "food", label: "Food", value: 480 },
  { id: "transport", label: "Transport", value: 220 },
  { id: "activities", label: "Activities", value: 390 },
  { id: "shopping", label: "Shopping", value: 260 },
  { id: "emergency", label: "Emergency Fund", value: 300 },
];

export type ActivityKind =
  | "breakfast"
  | "sightseeing"
  | "transport"
  | "hotel"
  | "dinner"
  | "shopping";

export type Activity = { id: string; time: string; title: string; kind: ActivityKind };

export const initialItinerary: Record<string, Activity[]> = {
  "Day 1": [
    { id: "a1", time: "08:30", title: "Breakfast at Fira terrace café", kind: "breakfast" },
    { id: "a2", time: "10:00", title: "Caldera walk to Imerovigli", kind: "sightseeing" },
    { id: "a3", time: "15:00", title: "Check in — Cliffside Suites", kind: "hotel" },
    { id: "a4", time: "20:00", title: "Sunset dinner in Oia", kind: "dinner" },
  ],
  "Day 2": [
    { id: "b1", time: "09:00", title: "Ferry to Thirassia island", kind: "transport" },
    { id: "b2", time: "12:30", title: "Volcano hot springs swim", kind: "sightseeing" },
    { id: "b3", time: "18:00", title: "Local ceramics market", kind: "shopping" },
  ],
  "Day 3": [
    { id: "c1", time: "08:00", title: "Bakery breakfast run", kind: "breakfast" },
    { id: "c2", time: "11:00", title: "Akrotiri archaeological site", kind: "sightseeing" },
    { id: "c3", time: "19:30", title: "Farewell seafood dinner", kind: "dinner" },
  ],
};

export type PackItem = { id: string; label: string; done: boolean };
export type PackCategory = { id: string; label: string; items: PackItem[] };

export const initialPacking: PackCategory[] = [
  {
    id: "clothing",
    label: "Clothing",
    items: [
      { id: "c1", label: "Linen shirts ×4", done: true },
      { id: "c2", label: "Swimwear", done: true },
      { id: "c3", label: "Light jacket", done: false },
      { id: "c4", label: "Walking shoes", done: false },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    items: [
      { id: "e1", label: "Phone + charger", done: true },
      { id: "e2", label: "Power bank", done: false },
      { id: "e3", label: "Travel adapter", done: false },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    items: [
      { id: "d1", label: "Passport", done: true },
      { id: "d2", label: "Travel insurance", done: true },
      { id: "d3", label: "Boarding passes", done: false },
    ],
  },
  {
    id: "medicines",
    label: "Medicines",
    items: [
      { id: "m1", label: "Motion sickness pills", done: false },
      { id: "m2", label: "First-aid kit", done: true },
    ],
  },
  {
    id: "toiletries",
    label: "Toiletries",
    items: [
      { id: "t1", label: "Sunscreen SPF 50", done: true },
      { id: "t2", label: "Toothbrush kit", done: false },
      { id: "t3", label: "Aftersun lotion", done: false },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    items: [
      { id: "ac1", label: "Sunglasses", done: true },
      { id: "ac2", label: "Daypack", done: false },
      { id: "ac3", label: "Reusable bottle", done: true },
    ],
  },
];

export const forecast = [
  { day: "Mon", temp: 27, kind: "sun" as const },
  { day: "Tue", temp: 28, kind: "sun" as const },
  { day: "Wed", temp: 25, kind: "cloud" as const },
  { day: "Thu", temp: 23, kind: "rain" as const },
  { day: "Fri", temp: 26, kind: "cloud" as const },
  { day: "Sat", temp: 29, kind: "sun" as const },
  { day: "Sun", temp: 30, kind: "sun" as const },
];

export const essentials = [
  {
    title: "Must-Try Food",
    icon: "utensils",
    items: ["Fava santorinis", "Tomatokeftedes", "Grilled octopus", "Vinsanto wine"],
  },
  {
    title: "Popular Attractions",
    icon: "landmark",
    items: ["Oia Castle", "Akrotiri ruins", "Amoudi Bay", "Pyrgos village"],
  },
  {
    title: "Local Festivals",
    icon: "party",
    items: ["Ifestia Volcano Show", "Wine Festival", "Easter processions"],
  },
  {
    title: "Travel Tips",
    icon: "lightbulb",
    items: ["Book sunset spots early", "Rent an ATV", "Carry cash for tavernas"],
  },
  {
    title: "Emergency Numbers",
    icon: "phone",
    items: ["General: 112", "Police: 100", "Ambulance: 166"],
  },
  {
    title: "Transport Options",
    icon: "bus",
    items: ["KTEL buses", "Water taxis", "ATV rental", "Cable car"],
  },
  {
    title: "Currency Info",
    icon: "coins",
    items: ["Euro (€)", "1 USD ≈ 0.92 €", "Cards widely accepted"],
  },
];

export const testimonials = [
  {
    name: "Amara Okafor",
    trip: "Kyoto, 9 days",
    quote:
      "I used to juggle five apps and a notes file. Travel Planner replaced all of it — the itinerary and budget stayed in sync the entire trip.",
  },
  {
    name: "Lucas Moreau",
    trip: "Patagonia, 14 days",
    quote:
      "The packing checklist saved me twice. Categorised, percentage-tracked, and shareable with my partner before we left.",
  },
  {
    name: "Sofia Rinaldi",
    trip: "Santorini, 6 days",
    quote:
      "The dashboard countdown made the whole trip feel real weeks early. Budget tracking kept us €300 under plan.",
  },
];

export const faqs = [
  {
    q: "Do I need an account to start planning?",
    a: "No. You can build a full itinerary, budget and packing list right away — everything is stored on your device until you decide to save it.",
  },
  {
    q: "Can I plan trips with multiple destinations?",
    a: "Yes. Add as many stops as you like and the itinerary timeline groups activities by day across every city on your route.",
  },
  {
    q: "How accurate is the budget calculator?",
    a: "It uses your own numbers plus regional averages for flights, stays and food, so the estimate sharpens as you fill in real bookings.",
  },
  {
    q: "Does the packing checklist adapt to my trip?",
    a: "It suggests categories based on climate and trip length, and you can add custom items to any category in one tap.",
  },
  {
    q: "Can I share a plan with travel companions?",
    a: "Share a read-only link to any trip. Companions see the same itinerary, packing progress and notes without needing an account.",
  },
];

export const quotes = [
  "Travel is the only thing you buy that makes you richer.",
  "The world is a book, and those who do not travel read only one page.",
  "Jobs fill your pocket, adventures fill your soul.",
  "Take only memories, leave only footprints.",
];
