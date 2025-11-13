// src/data.js
export const SITE_NAME = "Hyde Park Cottage";
export const SITE_TAGLINE = "Historic Hyde Park";
export const ADDRESS = "4409 Albany Post Rd, Hyde Park, NY 12538";
export const CHECKOUT_TIME = "11:00am";
export const airbnbUrl = "https://airbnb.com/h/thehydeparkcottage";
export const images = [
  { src: "/photos/home page/front1.jpg", alt: "Front1" },
  { src: "/photos/home page/livingroom1.jpg", alt: "Living Room 1" },
  { src: "/photos/home page/livingroom3.jpg", alt: "Living Room 3" },
  { src: "/photos/home page/sunroom1.jpg", alt: "Sun Room 1" },
  { src: "/photos/home page/sunroom2.jpg", alt: "Sun Room 2" },
  { src: "/photos/home page/sunroom3.jpg", alt: "Sun Room 3" },
  { src: "/photos/home page/entry_to_back.jpg", alt: "Entry to Back" },
  { src: "/photos/home page/dinning2.jpg", alt: "Dinning 2" },
  { src: "/photos/home page/kitchen1.jpg", alt: "Kitchen 1" },
  { src: "/photos/home page/kitchen2.jpg", alt: "Kitchen 2" },
  { src: "/photos/home page/laundry1.jpg", alt: "Laundry 1" },
  { src: "/photos/home page/acorn1.jpg", alt: "Acorn Room 1" },
  { src: "/photos/home page/down_bath1.jpg", alt: "Down Bath 1" },
  { src: "/photos/home page/stairs.jpg", alt: "Stairs" },
  { src: "/photos/home page/up_bath2.jpg", alt: "Up Bath Room 2" },
  { src: "/photos/home page/up_bath1.jpg", alt: "Up Bath Room 1" },
  { src: "/photos/home page/mushroom2.jpg", alt: "Murshroom Room 2" },
  { src: "/photos/home page/fern1.jpg", alt: "Fern Room 1" },
  { src: "/photos/home page/fern_window_seat.jpg", alt: "Fern Window Seat" },
  { src: "/photos/home page/office1.jpg", alt: "Office 1" },
  { src: "/photos/home page/gym2.jpg", alt: "Gym 2" },
  { src: "/photos/home page/entry.jpg", alt: "Entry" },
  { src: "/photos/home page/front2.jpg", alt: "Front 2" },
  { src: "/photos/home page/back_of_house.jpg", alt: "Back of House" },
  { src: "/photos/home page/backyard.jpg", alt: "Backyard" },
];

export const amenities = [
  "4 bedrooms • 1.5 baths • Sleeps 6",
  "Wood-burning fireplace (seasonal)",
  "Dedicated office + small gym room",
  "Smart TVs + fast Wi-Fi",
  "Fully equipped kitchen",
  "Washer & dryer",
  "Large backyard with patio & grill",
  "Near CIA, Walkway Over the Hudson, Vanderbilt Mansion, Rhinebeck",
];

export const amenityCategories = [
  {
    key: "essentials",
    label: "Essentials",
    items: [
      "4 bedrooms • 1.5 baths • Sleeps 6",
      "Central heat & AC",
      "Fresh linens & extra blankets",
      "Washer & dryer",
      "Garment Steamer",
      "Hair dryer",
    ],
  },
  {
    key: "kitchen",
    label: "Kitchen",
    items: [
      "Full-size fridge & range",
      "Dishwasher",
      "Coffee maker & tea kettle",
      "Pots, pans, & basic spices",
      "Cooking utensils & baking sheets",
      "Plates, bowls, glassware, cutlery",
    ],
  },
  {
    key: "tech",
    label: "Tech & Work",
    items: [
      "Fast Wi-Fi",
      "Smart TV (streaming)",
      "Dedicated desk / office",
    ],
  },
  {
    key: "family",
    label: "Family",
    items: [
      "Board games",
      "Books",
      "Blackout shades in bedrooms",
    ],
  },
  {
    key: "comfort",
    label: "Comfort",
    items: [
      "Wood-burning fireplace (seasonal)",
      "Quality mattresses & pillows",
      "Shampoo, conditioner, body wash",
    ],
  },
  {
    key: "outdoors",
    label: "Outdoors",
    items: [
      "Large backyard",
      "Off-street parking",
    ],
  },
  {
    key: "safety",
    label: "Safety",
    items: [
      "Smoke & CO detectors",
      "Fire extinguisher",
      "First-aid kits",
      "Exterior security cameras",
    ],
  },
];

export const thingsToDo = [
  { name: "Franklin D. Roosevelt Presidential Library & Home", time: "6 min", desc: "Museum, archives, and tours of Springwood at the National Historic Site." },
  { name: "Culinary Institute of America", time: "8 min", desc: "World-class dining and campus tours." },
  { name: "Walkway Over the Hudson", time: "15 min", desc: "Scenic pedestrian bridge with sweeping views." },
  { name: "Vanderbilt Mansion National Historic Site", time: "7 min", desc: "Stately grounds, tours, and river vistas." },
  { name: "Rhinebeck Village", time: "18 min", desc: "Charming shops, eateries, and weekend markets." },
];

export const faqs = [
  { q: "Where is the house?", a: `${ADDRESS}. Exact check-in details are sent after booking.` },
  { q: "How many guests can stay?", a: "Up to 6 guests comfortably (4 bedrooms)." },
  { q: "Is there parking?", a: "Yes, off-street parking is available on site." },
  { q: "Do you allow pets?", a: "No—this home is not pet-friendly." },
];
// --- quick stats for the Welcome section ---
export const welcomeStats = [
  { value: "3", label: "Bedrooms" },
  { value: "1.5", label: "Baths" },
  { value: "6", label: "Sleeps" },
];

// --- top six features for the Welcome section ---
export const topFeatures = [
  { title: "Wood-burning Fireplace", desc: "Cozy evenings in the living room (seasonal use)." },
  { title: "Dedicated Office + Fast Wi-Fi", desc: "Comfortable desk setup for remote work." },
  { title: "Compact Home Gym", desc: "TV, free weights, and yoga mats." },
  { title: "Sun Room", desc: "Relaxing reading corner or breakfast nook." },
  { title: "Smart TVs", desc: "Stream your favorites throughout the home." },
  { title: "Well-Stocked Kitchen", desc: "Cookware, basics, and plenty of prep space." },
];
// src/data.js (add at the bottom)
export const heroAmenities = [
  {
  key: "fireplace",
  title: "Wood-burning Fireplace",
  desc: "Cozy, seasonal use for relaxed evenings.",
  images: [
  "/photos/amenities/fireplace/fireplace1.HEIC",
  "/photos/amenities/fireplace/fireplace2.HEIC",
  "/photos/amenities/fireplace/fireplace3.HEIC",
  "/photos/amenities/fireplace/fireplace4.HEIC",
],
},
  {
    key: "office",
    title: "Dedicated Office",
    desc: "Desk, chair, and fast Wi-Fi for remote work.",
    images: [
      "/photos/amenities/office/office1.HEIC",
  "/photos/amenities/office/office2.HEIC",
  "/photos/amenities/office/office3.HEIC",
  "/photos/amenities/office/office4.HEIC",
    ],
  },
  {
    key: "gym",
    title: "Compact Home Gym",
    desc: "Treadmill, light weights, and yoga mat.",
    images: [
      "/photos/amenities/gym/gym1.HEIC",
  "/photos/amenities/gym/gym2.HEIC",
  "/photos/amenities/gym/gym3.HEIC",
    ],
  },
  {
    key: "sunroom",
    title: "Sunroom",
    desc: "Bright, relaxing nook perfect for morning coffee.",
    images: [
      "/photos/amenities/sunroom/sunroom1.HEIC",
  "/photos/amenities/sunroom/sunroom2.HEIC",
  "/photos/amenities/sunroom/sunroom3.HEIC",
  "/photos/amenities/sunroom/sunroom4.HEIC",
    ],
  },
];
// --- Bedrooms: 3-image sliders (stock placeholders for now)
export const bedroomGalleries = {
  acorn: [
     "/photos/rooms/acorn/acorn1.HEIC",
  "/photos/rooms/acorn/acorn2.HEIC",
  "/photos/rooms/acorn/acorn3.HEIC",
  "/photos/rooms/acorn/acorn4.HEIC",
  ],
  mushroom: [
    "/photos/rooms/mushroom/mushroom1.HEIC",
  "/photos/rooms/mushroom/mushroom2.HEIC",
  "/photos/rooms/mushroom/mushroom3.HEIC",
  "/photos/rooms/mushroom/mushroom4.HEIC",
  ],
  fern: [
    "/photos/rooms/fern/fern1.HEIC",
  "/photos/rooms/fern/fern2.HEIC",
  "/photos/rooms/fern/fern3.HEIC",
  "/photos/rooms/fern/fern4.HEIC",
  "/photos/rooms/fern/fern5.HEIC",
  ],
};

// --- Other rooms: single tile images (stock placeholders)
export const otherRooms = [
  { name: "Living Room", img: "/photos/rooms/livingroom/livingroom.HEIC", desc: "Cozy seating with smart TV and fireplace." },
  { name: "Sunroom", img: "/photos/rooms/sunroom/sunroom.HEIC", desc: "Bright nook for morning coffee." },
  { name: "Kitchen", img: "/photos/rooms/kitchen/kitchen.HEIC", desc: "Well-stocked with full-size appliances." },
  { name: "Laundry Room", img: "/photos/rooms/laundry/laundry.HEIC", desc: "Washer & dryer, supplies provided." },
  { name: "Office", img: "/photos/rooms/office/office.HEIC", desc: "Dedicated desk and fast Wi-Fi." },
  { name: "Gym", img: "/photos/rooms/gym/gym.HEIC", desc: "Treadmill, light weights, and mat." },
];
// --- Things To Do (from welcome book)

// Towns to explore (with rough driving distance)
export const townsToExplore = [
  { name: "Rhinebeck", dist: "9 mi" },
  { name: "Beacon", dist: "26 mi" },
  { name: "Cold Spring", dist: "27 mi" },
  { name: "New Paltz", dist: "27 mi" },
  { name: "Woodstock", dist: "28 mi" },
  { name: "Hudson", dist: "36 mi" },
];

// Top highlights (tours + icons)
export const hvHighlights = [
  { key: "fdr", title: "FDR Presidential Library & Home", blurb: "Museum, archives, and tours at Springwood.", dist: "≈ 6 min", imgs: [
    "/photos/things_to_do/featured/fdr/fdr.jpg",
    "/photos/things_to_do/featured/fdr/fdr2.jpg",
  ]},
  { key: "vanderbilt", title: "Vanderbilt Mansion National Historic Site", blurb: "Stately grounds, river views, and guided tours.", dist: "≈ 7 min", imgs: [
    "/photos/things_to_do/featured/vanderbilt/vanderbilt3.jpg",
    "/photos/things_to_do/featured/vanderbilt/vanderbilt2.jpg",
    "/photos/things_to_do/featured/vanderbilt/vanderbilt.jpg",
  ]},
  { key: "walkway", title: "Walkway Over the Hudson", blurb: "One of the longest pedestrian bridges in the world.", dist: "≈ 15 min", imgs: [
    "/photos/things_to_do/featured/walkway/walkway2.jpg",
    "/photos/things_to_do/featured/walkway/walkway.jpg",
  ]},
  { key: "railtrail", title: "Hudson Valley Rail Trail", blurb: "Leisurely cycling from Highland to New Paltz.", dist: "≈ 20–25 min", imgs: [
    "/photos/things_to_do/featured/bike/bike2.jpg",
    "/photos/things_to_do/featured/bike/bike.jpg",
    "/photos/things_to_do/featured/vanderbilt/bike3.jpg",
  ]},
];

// Local hikes (sample distances / pairings)
export const localHikes = [
  { name: "Roosevelt Farm & Forest", dist: "3.1 mi", level: "Easy–Moderate" },
  { name: "Walkway Over the Hudson", dist: "3.2 mi", level: "Easy" },
  { name: "Hyde Park Trail", dist: "3.6 mi", level: "Easy–Moderate" },
  { name: "Norrie Point Trail", dist: "5.1 mi", level: "Easy" },
  { name: "Ashokan Rail Trail", dist: "11.2 mi", level: "Easy" },
  { name: "Fishkill Ridge & Wilkinson", dist: "5.5 mi", level: "Moderate–Strenuous" },
  { name: "Cold Spring → Beacon", dist: "7 mi", level: "Moderate" },
  { name: "Bull Hill → Beacon", dist: "13.2 mi", level: "Strenuous" },
  { name: "Breakneck Ridge", dist: "2.9 mi", level: "Strenuous" },
];

// Nearby ideas (bulleted quick hits)
export const nearbyIdeas = [
  { title: "Walkway Over the Hudson", desc: "Stroll or bike the iconic span in Poughkeepsie." },
  { title: "Apple / Berry Picking", desc: "Seasonal orchards around Red Hook, Tivoli, Highland." },
  { title: "Hudson Valley Rail Trail by Bike", desc: "Leisurely ride; rentals available in Highland/New Paltz." },
  { title: "Local Farmers Markets", desc: "Rhinebeck & Hyde Park—check seasonal hours." },
  { title: "Scenic Hudson River Cruise", desc: "Kingston departures (seasonal) with classic views." },
];

// Local eats (grouped)
// ----------------- Local Eats -----------------
export const localEats = {
  breakfast: [
    { name: "Eveready Diner", dist: "3 min drive (1 mi)" },
    { name: "Kelly’s Bakery", dist: "5 min drive (2 mi)" },
    { name: "Bread Alone Bakery", dist: "10 min drive (5 mi)" },
    { name: "Moonrise Bagels", dist: "10 min drive (5 mi)" },
  ],
  lunchDinner: [
    { name: "Hyde Park Pizza", dist: "4 min drive (1.5 mi)" },
    { name: "Foster’s Coach House", dist: "10 min drive (5 mi)" },
    { name: "Mizu Sushi Hyde Park", dist: "4 min drive (1.5 mi)" },
    { name: "Palace Dumpling (Poughkeepsie)", dist: "12 min drive (6 mi)" },
    { name: "Ichiddo Ramen (Poughkeepsie)", dist: "12 min drive (6 mi)" },
    { name: "Matchbox Café (Rhinebeck)", dist: "13 min drive (7 mi)" },
  ],
  iceCream: [
    { name: "Nana’s Ice Cream and Grill", dist: "4 min drive (1.5 mi)" },
    { name: "Village Creamery", dist: "10 min drive (5 mi)" },
  ],
  fineDining: [
    {
      name: "Terrapin Restaurant & Bistro",
      dist: "≈ 12 min drive (≈ 6 mi)",
      desc:
        "Inventive New American cuisine in a converted church—upscale yet relaxed, emphasizing local farms.",
      link: "https://www.terrapinrestaurant.com/",
    },
    {
      name: "End Cut (West Park)",
      dist: "≈ 25 min drive (≈ 14 mi)",
      desc:
        "Intimate steakhouse with Italian–French influences, curated wines, and a cozy atmosphere on Route 9W.",
      link: "https://www.endcutwestpark.com/",
    },
  ],
};
// Center on Hyde Park
export const hydeParkCenter = { lat: 41.7679, lng: -73.9350 };

// Town coordinates (approx downtowns)
export const townsCoords = [
  { name: "Rhinebeck", lat: 41.9260, lng: -73.9120 },
  { name: "Beacon", lat: 41.5048, lng: -73.9696 },
  { name: "Cold Spring", lat: 41.4201, lng: -73.9543 },
  { name: "New Paltz", lat: 41.7476, lng: -74.0868 },
  { name: "Woodstock", lat: 42.0409, lng: -74.1182 },
  { name: "Hudson", lat: 42.2529, lng: -73.7909 },
];
