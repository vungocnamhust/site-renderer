
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'


// Helper to create minimal valid Lexical RichText structure
const createRichText = (text: string) => ({
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: text,
            version: 1
          }
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        version: 1
      }
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1
  }
})

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding Cheerful Vietnam Family Tour...')

  const data = {
    title: 'Cheerful Vietnam Family Tour',
    slug: 'cheerful-vietnam-family-tour',
    subtitle: 'Private & Tailored Tour',
    price: 2282,
    priceNote: 'From US$2282 / Person',
    duration: '14 Days / 13 Nights',
    country: 'vietnam' as any,
    tourType: 'single-country' as any,
    shortDescription: `Create unforgettable memories with your loved ones on this cheerful 14-day Vietnam family vacation. From the lively streets of Hanoi to the breathtaking limestone cliffs of Halong Bay, every stop is filled with fun, discovery, and bonding moments. Watch your kids’ eyes light up during a cyclo ride through the Old Quarter, a colorful lantern night in Hoi An, or a playful basket boat trip in the coconut forest. Share joyful moments together at Ba Na Hills and the Golden Bridge, explore the fascinating Cu Chi Tunnels, and cruise through the lush waterways of the Mekong Delta. End your holiday with carefree family time by the turquoise sea in Nha Trang, where parents unwind while the kids splash, play, and enjoy endless fun under the sun. This is the perfect journey for families to explore, learn, laugh, and simply enjoy being together.`,
    highlights: [
        { text: "Immerse in the charming atmosphere of Hanoi's Old Quarter with a cyclo ride and an interesting Water Puppet show" },
        { text: "Visit Hanoi’s most iconic landmarks" },
        { text: "Cruise together through the natural wonder of Halong Bay" },
        { text: "Stroll hand in hand under hundreds of lanterns in Hoi An Ancient Town and create your own colorful lantern as a special keepsake" },
        { text: "Cycle through peaceful rural villages around Hoi An" },
        { text: "Ride a basket boat in Bay Mau water coconut forest and learn simple fishing techniques" },
        { text: "Join a mini cooking class with a local family" },
        { text: "Have fun with plenty of games for kids at Ba Na Hills and take gorgeous family photos on the Golden Bridge" },
        { text: "Explore vibrant Ho Chi Minh City and the historic Cu Chi Tunnels" },
        { text: "Discover the daily life of locals in the Mekong Delta on a family-friendly day trip" },
        { text: "Spend quality beach time together on the white sand coastline of Nha Trang" },
        { text: "Enjoy endless fun at the resort water park featuring slides, splash zones, and a lazy river - perfect for both kids and adults" }
    ],
    destinations: [
        { name: 'Hanoi', duration_days: 2 },
        { name: 'Halong Bay', duration_days: 1 },
        { name: 'Hoi An', duration_days: 3 },
        { name: 'Danang', duration_days: 1 },
        { name: 'Ho Chi Minh', duration_days: 2 },
        { name: 'Mekong', duration_days: 1 },
        { name: 'Nha Trang', duration_days: 4 }
    ],
    itinerary: [
        { day: 'Day 1: Hanoi', content: createRichText("Arrival in Hanoi. Welcome dinner."), meals: ['Dinner'], accommodation: 'Hotel in Hanoi' },
        { day: 'Day 2: Hanoi', content: createRichText("Hanoi City Tour. Cyclo ride and Water Puppet Show."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Hanoi' },
        { day: 'Day 3: Hanoi, Halong Bay', content: createRichText("Transfer to Halong Bay. Overnight Cruise."), meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Halong Bay Cruise' },
        { day: 'Day 4: Halong Bay, Hanoi, Hoi An', content: createRichText("Morning cruise. Return to Hanoi. Flight to Danang. Transfer to Hoi An."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Hoi An' },
        { day: 'Day 5: Hoi An', content: createRichText("Walking tour of Hoi An Ancient Town. Lantern making class."), meals: ['Breakfast'], accommodation: 'Hotel in Hoi An' },
        { day: 'Day 6: Hoi An, Danang, Hoi An', content: createRichText("Day trip to Ba Na Hills & Golden Bridge."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Hoi An' },
        { day: 'Day 7: Hoi An', content: createRichText("Eco-tour: Basket boat ride and cooking class."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Hoi An' },
        { day: 'Day 8: Hoi An, Danang, Ho Chi Minh', content: createRichText("Flight to Ho Chi Minh City. City tour."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Ho Chi Minh' },
        { day: 'Day 9: Ho Chi Minh', content: createRichText("Cu Chi Tunnels excursion."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Ho Chi Minh' },
        { day: 'Day 10: Ho Chi Minh, Mekong, Ho Chi Minh', content: createRichText("Mekong Delta day trip."), meals: ['Breakfast', 'Lunch'], accommodation: 'Hotel in Ho Chi Minh' },
        { day: 'Day 11: Ho Chi Minh, Nha Trang', content: createRichText("Flight to Nha Trang. Beach relaxation."), meals: ['Breakfast'], accommodation: 'Hotel in Nha Trang' },
        { day: 'Day 12: Nha Trang', content: createRichText("Island hopping or VinWonders amusement park."), meals: ['Breakfast'], accommodation: 'Hotel in Nha Trang' },
        { day: 'Day 13: Nha Trang', content: createRichText("Free day at leisure."), meals: ['Breakfast'], accommodation: 'Hotel in Nha Trang' },
        { day: 'Day 14: Nha Trang', content: createRichText("Departure."), meals: ['Breakfast'] }
    ] as any,
    includes: [
        { item: "Accommodation with daily breakfast" },
        { item: "Private car or shared vehicle with driver" },
        { item: "Airport transfers" },
        { item: "Local English-speaking guides" },
        { item: "Package on Halong cruise" },
        { item: "Meals as mentioned" },
        { item: "Entrance fees and performances" }
    ],
    excludes: [
        { item: "International flights" },
        { item: "Visa fees" },
        { item: "Travel Insurance" },
        { item: "Personal expenses" }
    ],
    priceOptions: [
      { name: 'Economy', price: 2282, description: '3* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners' },
      { name: 'Deluxe', price: 2966, description: '4* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners' },
      { name: 'Luxury', price: 4107, description: '5* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners' }
    ],
    isActive: true
  }

  // Check existing
  const existing = await payload.find({
    collection: 'tours',
    where: { slug: { equals: data.slug } }
  })

  // Basic Image Seeding (Using Placeholders or uploading if I can)
  // I will skip image uploading logic here to keep it simple, or assume default image ID if known.
  // Ideally we would upload content of 'featuredImage' here. 
  // Let's assume we update only data.

  if (existing.totalDocs > 0) {
    console.log('Updating existing tour...')
    await payload.update({
      collection: 'tours',
      id: existing.docs[0].id,
      data
    })
  } else {
    console.log('Creating new tour...')
    await payload.create({
      collection: 'tours',
      data
    })
  }

  console.log('Done.')
  process.exit(0)
}

seed()
