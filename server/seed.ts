import { db } from "./db";
import { destinations, hotels, flights, packages } from "@shared/schema";

const destinationData = [
  {
    name: "Paris",
    description: "The City of Light awaits with its iconic landmarks and romantic atmosphere",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80",
    priceFrom: "299",
    country: "France"
  },
  {
    name: "Tokyo",
    description: "Experience the perfect blend of traditional culture and modern innovation",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    priceFrom: "599",
    country: "Japan"
  },
  {
    name: "New York",
    description: "The city that never sleeps offers endless possibilities",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    priceFrom: "399",
    country: "United States"
  },
  {
    name: "London",
    description: "Discover centuries of history in this vibrant European capital",
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    priceFrom: "349",
    country: "United Kingdom"
  },
  {
    name: "Sydney",
    description: "Stunning harbor views and iconic landmarks await",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    priceFrom: "699",
    country: "Australia"
  },
  {
    name: "Dubai",
    description: "Luxury and innovation in the heart of the desert",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    priceFrom: "499",
    country: "UAE"
  }
];

const hotelData = [
  {
    name: "Grand Plaza Hotel",
    location: "Manhattan, New York",
    description: "Luxury hotel in the heart of Manhattan with stunning city views",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    rating: "4.8",
    pricePerNight: "299",
    amenities: ["Free WiFi", "Pool", "Gym", "Room Service", "Concierge"],
    featured: true
  },
  {
    name: "Ocean View Resort",
    location: "Miami Beach, Florida",
    description: "Beachfront resort with panoramic ocean views and world-class amenities",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    rating: "4.7",
    pricePerNight: "389",
    amenities: ["Private Beach", "Spa", "Multiple Restaurants", "Water Sports"],
    featured: true
  },
  {
    name: "Mountain Lodge",
    location: "Aspen, Colorado",
    description: "Cozy mountain retreat perfect for ski enthusiasts",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    rating: "4.6",
    pricePerNight: "259",
    amenities: ["Ski Access", "Fireplace", "Mountain Views", "Hot Tub"],
    featured: false
  },
  {
    name: "City Center Hotel",
    location: "Downtown Los Angeles",
    description: "Modern hotel in the business district with rooftop bar",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    rating: "4.5",
    pricePerNight: "199",
    amenities: ["Rooftop Bar", "Business Center", "Parking", "24/7 Front Desk"],
    featured: false
  },
  {
    name: "Historic Inn",
    location: "Savannah, Georgia",
    description: "Charming historic inn with Southern hospitality",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    rating: "4.4",
    pricePerNight: "179",
    amenities: ["Historic Charm", "Garden Courtyard", "Complimentary Breakfast"],
    featured: false
  },
  {
    name: "Desert Oasis",
    location: "Scottsdale, Arizona",
    description: "Luxury desert resort with golf course and spa",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    rating: "4.9",
    pricePerNight: "449",
    amenities: ["Golf Course", "Full-Service Spa", "Desert Tours", "Fine Dining"],
    featured: true
  }
];

const flightData = [
  {
    airline: "Delta Airlines",
    flightNumber: "DL 1234",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departureTime: "08:30 AM",
    arrivalTime: "11:45 AM",
    duration: "6h 15m",
    price: "299",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
  },
  {
    airline: "American Airlines",
    flightNumber: "AA 567",
    origin: "Chicago (ORD)",
    destination: "Miami (MIA)",
    departureTime: "02:15 PM",
    arrivalTime: "06:30 PM",
    duration: "3h 15m",
    price: "189",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80"
  },
  {
    airline: "United Airlines",
    flightNumber: "UA 890",
    origin: "San Francisco (SFO)",
    destination: "Seattle (SEA)",
    departureTime: "10:00 AM",
    arrivalTime: "12:15 PM",
    duration: "2h 15m",
    price: "149",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80"
  },
  {
    airline: "JetBlue",
    flightNumber: "B6 123",
    origin: "Boston (BOS)",
    destination: "Orlando (MCO)",
    departureTime: "07:45 AM",
    arrivalTime: "11:00 AM",
    duration: "3h 15m",
    price: "199",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
  },
  {
    airline: "Southwest Airlines",
    flightNumber: "WN 456",
    origin: "Phoenix (PHX)",
    destination: "Denver (DEN)",
    departureTime: "01:30 PM",
    arrivalTime: "03:45 PM",
    duration: "2h 15m",
    price: "129",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80"
  },
  {
    airline: "Alaska Airlines",
    flightNumber: "AS 789",
    origin: "Portland (PDX)",
    destination: "Anchorage (ANC)",
    departureTime: "11:20 AM",
    arrivalTime: "03:35 PM",
    duration: "4h 15m",
    price: "349",
    stops: 0,
    imageUrl: "https://images.unsplash.com/photo-1583725799876-1c80e7c4f80e?w=800&q=80"
  }
];

const packageData = [
  {
    title: "Caribbean Paradise",
    location: "Barbados",
    duration: "7 days, 6 nights",
    description: "All-inclusive resort experience with pristine beaches and crystal-clear waters",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    price: "1299",
    originalPrice: "1899",
    savings: "600",
    includes: ["Round-trip flights", "All-inclusive resort", "Airport transfers", "Daily activities"],
    highlights: ["Private beach access", "Water sports included", "Spa treatments", "Gourmet dining"]
  },
  {
    title: "European Grand Tour",
    location: "Paris, Rome, Barcelona",
    duration: "14 days, 13 nights",
    description: "Explore three magnificent European capitals with guided tours and cultural experiences",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80",
    price: "2499",
    originalPrice: "3299",
    savings: "800",
    includes: ["Round-trip flights", "4-star hotels", "High-speed rail", "Guided tours", "Some meals"],
    highlights: ["Skip-the-line museum passes", "Local food tours", "Professional guides", "Central locations"]
  },
  {
    title: "Asian Adventure",
    location: "Tokyo, Kyoto, Osaka",
    duration: "10 days, 9 nights",
    description: "Immerse yourself in Japanese culture, cuisine, and breathtaking landscapes",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    price: "1899",
    originalPrice: "2599",
    savings: "700",
    includes: ["Round-trip flights", "Traditional ryokans", "JR Rail Pass", "Cultural experiences"],
    highlights: ["Tea ceremony", "Temple visits", "Mount Fuji excursion", "Traditional kaiseki meals"]
  },
  {
    title: "African Safari",
    location: "Kenya & Tanzania",
    duration: "12 days, 11 nights",
    description: "Witness the Great Migration and experience Africa's incredible wildlife",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    price: "3499",
    originalPrice: "4299",
    savings: "800",
    includes: ["Round-trip flights", "Safari lodges", "Game drives", "Park fees", "Professional guide"],
    highlights: ["Big Five viewing", "Serengeti & Masai Mara", "Hot air balloon safari", "Cultural village visits"]
  },
  {
    title: "Australian Highlights",
    location: "Sydney, Melbourne, Cairns",
    duration: "16 days, 15 nights",
    description: "From iconic cities to the Great Barrier Reef, discover Australia's wonders",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    price: "2799",
    originalPrice: "3699",
    savings: "900",
    includes: ["Round-trip flights", "Premium hotels", "Domestic flights", "Great Barrier Reef tour"],
    highlights: ["Opera House tour", "Uluru excursion", "Reef snorkeling", "Wine country visits"]
  },
  {
    title: "South American Explorer",
    location: "Peru, Chile, Argentina",
    duration: "18 days, 17 nights",
    description: "From Machu Picchu to Patagonia, explore South America's diverse landscapes",
    imageUrl: "https://images.unsplash.com/photo-1587837073080-448bc2a2725c?w=800&q=80",
    price: "3199",
    originalPrice: "4199",
    savings: "1000",
    includes: ["Round-trip flights", "Boutique hotels", "Domestic flights", "Machu Picchu permits"],
    highlights: ["Machu Picchu sunrise", "Wine tastings", "Patagonia glaciers", "Tango lessons"]
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Insert destinations
    await db.insert(destinations).values(destinationData);
    console.log("✓ Destinations seeded");

    // Insert hotels
    await db.insert(hotels).values(hotelData);
    console.log("✓ Hotels seeded");

    // Insert flights
    await db.insert(flights).values(flightData);
    console.log("✓ Flights seeded");

    // Insert packages
    await db.insert(packages).values(packageData);
    console.log("✓ Packages seeded");

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}