export type ActivityItem = {
  time: string;
  place: string;
  description: string;
  estimatedCost: number;
};

export type DayPlan = {
  day: number;
  title: string;
  activities: ActivityItem[];
};

export type EstimatedBudgetBreakdown = {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
};

export type GeneratedItinerary = {
  destination: string;
  summary: string;
  days: DayPlan[];
  estimatedBudget: EstimatedBudgetBreakdown;
  tips: string[];
};

export type ItineraryRequestInput = {
  destination: string;
  days: number;
  budget: number;
  travelers: number;
  travelStyle?: string;
  interests?: string[];
};

const DESTINATION_HIGHLIGHTS: Record<string, { places: string[]; foods: string[]; tips: string[] }> = {
  goa: {
    places: ["Calangute Beach", "Fort Aguada", "Dudhsagar Waterfalls", "Anjuna Flea Market", "Old Goa Churches", "Baga Beach Sunset"],
    foods: ["Goan Fish Curry", "Pork Vindaloo", "Bebinca Dessert", "Feni Cocktail", "Prawn Balchão"],
    tips: ["Rent a scooter for easy beach hopping.", "Visit South Goa for quiet beaches and North Goa for nightlife.", "Carry light linen clothes and sunscreen."],
  },
  mumbai: {
    places: ["Gateway of India", "Marine Drive Promenade", "Elephanta Caves", "Colaba Causeway", "Chhatrapati Shivaji Terminus", "Juhu Beach"],
    foods: ["Vada Pav", "Pav Bhaji", "Bombay Sandwich", "Irani Chai & Bun Maska", "Seafood Thali"],
    tips: ["Use local trains during non-peak hours.", "Walk along Marine Drive at sunset.", "Bargain respectfully at street markets."],
  },
  delhi: {
    places: ["Red Fort", "Qutub Minar", "Humayun's Tomb", "Chandni Chowk", "Lotus Temple", "India Gate"],
    foods: ["Chole Bhature", "Butter Chicken", "Parathas at Gali Paranthe Wali", "Dahi Bhalla", "Kulfi Falooda"],
    tips: ["Use the Delhi Metro for fast transportation.", "Visit monuments early morning to avoid crowds.", "Stay hydrated during afternoon sightseeing."],
  },
  paris: {
    places: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre & Sacré-Cœur", "Seine River Cruise", "Palace of Versailles"],
    foods: ["Croissants & Café", "French Onion Soup", "Macarons from Ladurée", "Steak Frites", "Crêpes Suzette"],
    tips: ["Book museum tickets online in advance.", "Use the Metro pass for unlimited city transit.", "Enjoy sunset picnics along the Seine."],
  },
  london: {
    places: ["Big Ben & Parliament", "Tower Bridge", "British Museum", "Hyde Park", "Camden Market", "London Eye"],
    foods: ["Fish and Chips", "English Breakfast", "Afternoon Tea", "Sunday Roast", "Pie and Mash"],
    tips: ["Tap with contactless card for all tube rides.", "Many major museums offer free general entry.", "Pack an umbrella regardless of forecast."],
  },
  tokyo: {
    places: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Tower", "Shinjuku Gyoen National Garden", "Akihabara Electric Town", "Meiji Shrine"],
    foods: ["Ramen", "Fresh Sushi at Tsukiji Outer Market", "Tempura", "Takoyaki", "Matcha Parfait"],
    tips: ["Get a Suica or Pasmo IC card for transit.", "Carry cash as some traditional shops don't accept cards.", "Respect quiet rules on public trains."],
  },
  dubai: {
    places: ["Burj Khalifa", "Dubai Mall & Fountain", "Palm Jumeirah", "Desert Safari Dunes", "Dubai Marina", "Gold & Spice Souks"],
    foods: ["Shawarma", "Camel Milk Ice Cream", "Luqaimat Sweets", "Arabic Mixed Grill", "Machboos"],
    tips: ["Dress respectfully when visiting historical areas.", "Book Burj Khalifa observation deck tickets early.", "Take metro or taxis for air-conditioned transport."],
  },
  santorini: {
    places: ["Oia Sunset Point", "Red Beach", "Fira to Imerovigli Hike", "Akrotiri Ruins", "Caldera Boat Tour", "Pyrgos Village"],
    foods: ["Fava Santorinis", "Tomatokeftedes", "Grilled Octopus", "Vinsanto Wine", "Fresh Greek Salad"],
    tips: ["Book sunset dinner tables well in advance.", "Wear sturdy shoes for cobble paths and stairs.", "Rent an ATV for exploring secluded spots."],
  },
};

export async function generateItinerary(input: ItineraryRequestInput): Promise<GeneratedItinerary> {
  const dest = input.destination?.trim() || "Destination";
  const destKey = dest.toLowerCase();
  const numDays = Math.max(1, Math.min(input.days || 3, 14));
  const budgetVal = Math.max(100, input.budget || 1000);
  const travelers = Math.max(1, input.travelers || 1);
  const style = input.travelStyle || "Adventure";
  const interests = input.interests || [];

  const matched = DESTINATION_HIGHLIGHTS[destKey] || {
    places: [
      `${dest} City Center Walk`,
      `Historic ${dest} Old Town`,
      `${dest} Scenic Viewpoint`,
      `${dest} Regional Market`,
      `Local Art Gallery & Heritage Site`,
      `${dest} Botanical Gardens`,
    ],
    foods: [
      `Local Speciality Dish`,
      `Regional Café Lunch`,
      `Street Food Tasting`,
      `Sunset Waterfront Dinner`,
    ],
    tips: [
      `Book popular attraction tickets for ${dest} in advance.`,
      `Keep local currency and digital maps accessible.`,
      `Check local weather forecasts daily to refine outdoor plans.`,
    ],
  };

  const transport = Math.round(budgetVal * 0.22);
  const accommodation = Math.round(budgetVal * 0.40);
  const food = Math.round(budgetVal * 0.20);
  const activitiesCost = Math.round(budgetVal * 0.12);
  const miscellaneous = Math.round(budgetVal * 0.06);
  const total = transport + accommodation + food + activitiesCost + miscellaneous;

  const days: DayPlan[] = [];

  for (let d = 1; d <= numDays; d++) {
    const p1 = matched.places[(d * 2 - 2) % matched.places.length] || `${dest} Sightseeing`;
    const p2 = matched.places[(d * 2 - 1) % matched.places.length] || `${dest} Landmark`;
    const fItem = matched.foods[d % matched.foods.length] || "Local Specialty";

    const actCost = Math.round(activitiesCost / (numDays * 3));

    const dayActivities: ActivityItem[] = [
      {
        time: "09:00",
        place: p1,
        description: `Morning exploration of ${p1} with sightseeing and local walks.`,
        estimatedCost: actCost,
      },
      {
        time: "13:00",
        place: `Local Dining — ${fItem}`,
        description: `Enjoy authentic ${fItem} and local regional specialties.`,
        estimatedCost: Math.round(food / (numDays * 2)),
      },
      {
        time: "16:00",
        place: p2,
        description: `Afternoon visit to ${p2} tailored for ${style.toLowerCase()} travel.`,
        estimatedCost: actCost + 10,
      },
      {
        time: "19:30",
        place: `${dest} Evening & Sunset Experience`,
        description: `Relaxing evening walk, photography, and local waterfront atmosphere.`,
        estimatedCost: Math.round(food / (numDays * 2)),
      },
    ];

    days.push({
      day: d,
      title: d === 1
        ? `Arrival & Highlights of ${dest}`
        : d === numDays
        ? `Final Sights & Departure from ${dest}`
        : `Exploring ${dest} — Day ${d}`,
      activities: dayActivities,
    });
  }

  const interestSummary = interests.length > 0 ? ` focused on ${interests.join(", ")}` : "";
  const summary = `Customized ${numDays}-day ${style.toLowerCase()} itinerary for ${travelers} traveler(s) visiting ${dest}${interestSummary} with an estimated budget of $${total.toLocaleString()}.`;

  return {
    destination: dest,
    summary,
    days,
    estimatedBudget: {
      transport,
      accommodation,
      food,
      activities: activitiesCost,
      miscellaneous,
      total,
    },
    tips: matched.tips,
  };
}
