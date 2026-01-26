
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const categories = [
  { title: 'Best Tours', slug: 'best-tours' },
  { title: 'Classic Highlights', slug: 'classic-highlights' },
  { title: 'Family Tours', slug: 'family-tours' },
  { title: 'Beach Holidays', slug: 'beach-holidays' },
  { title: 'Luxury Tours', slug: 'luxury-tours' },
  { title: 'Honeymoon Tours', slug: 'honeymoon-tours' },
  { title: 'Active Tours', slug: 'active-tours' },
  { title: 'Cruise Packages', slug: 'cruise-packages' },
  { title: 'Day Trips & Short Breaks', slug: 'day-trips-short-breaks' },
  { title: 'Special Interests Tours', slug: 'special-interests-tours' },
  { title: 'Culinary Tours', slug: 'culinary-tours' },
  { title: 'Local Life Tours', slug: 'local-life-tours' },
  { title: 'Nature & Wildlife Tours', slug: 'nature-wildlife-tours' },
]

async function seedCategories() {
  console.log('Starting category seed...')
  const payload = await getPayload({ config })

  for (const cat of categories) {
    try {
      // Check if exists
      const existing = await payload.find({
        collection: 'tour-categories',
        where: {
          slug: { equals: cat.slug },
        },
      })

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'tour-categories',
          data: {
            title: cat.title,
            slug: cat.slug,
             // Optional: Add a default description
            description: `Experience the best of ${cat.title} with Asia Tours. Curated itineraries for unforgettable memories.`,
          },
        })
        console.log(`Created: ${cat.title}`)
      } else {
        console.log(`Skipped: ${cat.title} (Already exists)`)
      }
    } catch (error) {
      console.error(`Error creating ${cat.title}:`, error)
    }
  }

  console.log('Category seed completed.')
  process.exit(0)
}

seedCategories()
