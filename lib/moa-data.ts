export const MOA_STATS = {
  sqFt:        { value: 5.6,   unit: "M sq ft",  label: "Total Area" },
  visitors:    { value: 40,    unit: "M+",        label: "Annual Visitors" },
  stores:      { value: 520,   unit: "+",         label: "Retail Stores" },
  statesReached:{ value: 16,   unit: " states",   label: "Regional Draw" },
  hotelRooms:  { value: 4200,  unit: "+",         label: "Hotel Rooms On-Site" },
  eventCapacity:{ value: 20000,unit: "+",         label: "Event Capacity" },
  parkingSpots:{ value: 13000, unit: "+",         label: "Parking Spaces" },
  restaurants: { value: 50,    unit: "+",         label: "Dining Venues" },
};

export const RETAIL_BRANDS = [
  "Apple", "Tesla", "Lego", "Nike", "Adidas", "H&M",
  "Zara", "Nordstrom", "Bloomingdale's", "Macy's",
  "Louis Vuitton", "Coach", "Michael Kors", "Tiffany & Co.",
  "Sephora", "Lululemon", "Anthropologie", "Free People",
];

export const LUXURY_BRANDS = [
  "Louis Vuitton",
  "Tiffany & Co.",
  "Coach",
  "Michael Kors",
  "Kate Spade",
  "Pandora",
  "Swarovski",
];

export const DINING_VENUES = [
  { name: "Crayola Cafe",        category: "Experiential", description: "Immersive branded dining, a destination in itself" },
  { name: "Rainforest Cafe",     category: "Experiential", description: "Destination dining — draws families from across the region" },
  { name: "Bubba Gump Shrimp",   category: "Casual",       description: "Iconic national brand with high tourist draw" },
  { name: "The Grill at Ike's",  category: "American",     description: "Full-service sit-down dining, local favorite" },
  { name: "Twin City Grill",     category: "Local",        description: "Minnesota flavors, regional pride" },
  { name: "California Pizza Kitchen", category: "National", description: "Consistent high-traffic casual dining" },
];

export const ATTRACTIONS = [
  { name: "Nickelodeon Universe", desc: "7-acre indoor theme park, 27 rides", icon: "🎢" },
  { name: "SEA LIFE Aquarium",    desc: "10,000+ sea creatures across 12 zones", icon: "🐠" },
  { name: "Crayola Experience",   desc: "Immersive 60,000 sq ft kids destination", icon: "🎨" },
  { name: "FlyOver America",      desc: "Cinematic immersive flight experience", icon: "✈️" },
  { name: "Mirror Maze & Escape", desc: "Interactive entertainment for all ages", icon: "🔮" },
  { name: "Comedy Club MN",       desc: "Live performance venue, 300+ capacity", icon: "🎭" },
];

export const EVENTS_HIGHLIGHTS = [
  { name: "Nickelodeon Universe Live", capacity: "7,000+",         type: "Entertainment" },
  { name: "National Championships",    capacity: "15,000+",        type: "Sports" },
  { name: "Brand Activations",         capacity: "50,000+ reach/day", type: "Marketing" },
  { name: "Holiday Programming",       capacity: "6-week season",  type: "Seasonal" },
];

export const CTA_PATHS = [
  {
    id: "lease",
    title: "Lease Space",
    subtitle: "Retail, F&B, Pop-Up, Flagship",
    cta: "Start Leasing Conversation",
    email: "leasing@mallofamerica.com",
    color: "#C9A84C",
  },
  {
    id: "sponsor",
    title: "Become a Sponsor",
    subtitle: "Brand Partnerships & Activations",
    cta: "Explore Sponsorship",
    email: "partnerships@mallofamerica.com",
    color: "#E8C97A",
  },
  {
    id: "events",
    title: "Book a Venue",
    subtitle: "Concerts, Launches, Conventions",
    cta: "Book Your Event",
    email: "events@mallofamerica.com",
    color: "#C9A84C",
  },
] as const;

export type CTAType = "lease" | "sponsor" | "events";
