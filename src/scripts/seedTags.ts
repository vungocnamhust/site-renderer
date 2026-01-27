import { getPayload } from 'payload'
import config from '../payload.config'

const tagsData = [
  { code: 'LOCAL', name: 'Local Life', notes: 'Experiences focusing on the daily lives, traditions, and culture of local communities.' },
  { code: 'HIST', name: 'History', notes: 'Tours that explore historical sites, monuments, and narratives of the region.' },
  { code: 'ART', name: 'Arts & Crafts', notes: 'Activities centered around traditional arts, handicrafts, and artisan workshops.' },
  { code: 'PHOTO', name: 'Photography', notes: 'Trips designed for photography enthusiasts to capture landscapes, people, and culture.' },
  { code: 'WILD', name: 'Wildlife', notes: 'Adventures aimed at observing and learning about local flora and fauna in their natural habitats.' },
  { code: 'CYCLE', name: 'Cycling', notes: 'Active tours involving bicycle riding through various terrains and scenic routes.' },
  { code: 'TREK', name: 'Trekking', notes: 'Hiking and walking expeditions, often in mountainous or remote areas.' },
  { code: 'SOFT', name: 'Soft Adventure', notes: 'Light adventure activities suitable for most fitness levels, such as easy hiking or kayaking.' },
  { code: 'BIRD', name: 'Bird Watching', notes: 'Specialized tours for observing various bird species in their natural environments.' },
  { code: 'CAVE', name: 'Caves & Karst Exploration', notes: 'Exploration of cave systems and karst landscapes, often involving spelunking or boat trips.' },
  { code: 'ETHN', name: 'Ethnic Minority', notes: 'Cultural immersion experiences with indigenous and ethnic minority groups.' },
  { code: 'WELL', name: 'Wellness', notes: 'Retreats and activities focused on health, relaxation, yoga, and meditation.' },
  { code: 'SLOW', name: 'Slow Travel', notes: 'Immersive travel style emphasizing connection to local people, cultures, and food at a leisurely pace.' },
  { code: 'PHIL', name: 'Philanthropy', notes: 'Travel experiences that include charitable activities or community service.' },
  { code: 'GOLF', name: 'Golf', notes: 'Tours centered around playing golf at various courses in the destination.' },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('--- Seeding Tags ---')

  for (const tag of tagsData) {
    try {
      const existingTags = await payload.find({
        collection: 'tags',
        where: {
          tag_code: {
            equals: tag.code,
          },
        },
      })

      if (existingTags.docs.length > 0) {
        console.log(`Tag ${tag.code} already exists. Skipping...`)
      } else {
        await payload.create({
          collection: 'tags',
          data: {
            tag_code: tag.code,
            tag_name: tag.name,
            active: 'Y', // Setting active to 'Y' as per requirement
            notes: tag.notes,
          },
        })
        console.log(`Created Tag: ${tag.name} (${tag.code})`)
      }
    } catch (error) {
      console.error(`Error creating tag ${tag.name}:`, error)
    }
  }

  console.log('--- Seeding Completed ---')
  process.exit(0)
}

seed()
