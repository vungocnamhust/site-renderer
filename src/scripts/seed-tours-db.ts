import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DATA_PATH = path.resolve(dirname, 'data/tours_data.json')

async function seed() {
  const payload = await getPayload({ config })

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Data file not found: ${DATA_PATH}`)
    process.exit(1)
  }

  const matches = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  console.log(`seeding ${matches.length} tours...`)

  for (const tour of matches) {
    if (!tour.slug) continue;
    
    // Normalize slug to lowercase to match Schema validation
    const normalizedSlug = tour.slug.toLowerCase();

    try {
      // Check for existing
      const existing = await payload.find({
        collection: 'tours',
        where: {
          slug: { equals: normalizedSlug }
        }
      })

      let imageId: string | number | null = null
      
      // Map Country to Country ID (needs to be looked up)
      let countrySlug: string = 'vietnam'
      let tourType: any = 'single-country'
      
      const slugParts = tour.countryRef?.split('-') || []
      if (slugParts.includes('vietnam')) countrySlug = 'vietnam'
      else if (slugParts.includes('cambodia')) countrySlug = 'cambodia'
      else if (slugParts.includes('thailand')) countrySlug = 'thailand'
      else if (slugParts.includes('laos')) countrySlug = 'laos'
      
      if (slugParts.length > 1) tourType = 'multi-country'
      
      // Look up country ID
      let countryIds: number[] = []
      try {
        const countryDoc = await payload.find({
          collection: 'countries',
          where: { slug: { equals: countrySlug } }
        })
        if (countryDoc.docs.length > 0) {
          countryIds = [countryDoc.docs[0].id]
        }
      } catch (e) {
        console.warn(`Country lookup failed for ${countrySlug}`)
      }
      
      // Upload Media
      if (tour.image) {
         try {
           const filename = path.basename(tour.image);
           const filePath = path.resolve(process.cwd(), 'public', tour.image.replace(/^\//, ''));
           
           if (fs.existsSync(filePath)) {
             // Check if media exists
             const existingMedia = await payload.find({
               collection: 'media',
               where: { filename: { equals: filename } }
             })
             
             if (existingMedia.totalDocs > 0) {
               imageId = existingMedia.docs[0].id
             } else {
               // Create new media with Buffer
               const fileBuffer = fs.readFileSync(filePath);
               const media = await payload.create({
                 collection: 'media',
                 data: { alt: tour.title },
                 file: {
                   data: fileBuffer,
                   name: filename,
                   mimetype: 'image/jpeg', // Simple assumption
                   size: fs.statSync(filePath).size
                 }
               })
               imageId = media.id
             }
           }
         } catch (e: any) {
           console.warn(`Failed to seed image for ${tour.slug}:`, e.message)
         }
      }
      
      const data: any = {
        title: tour.title,
        slug: normalizedSlug,
        shortDescription: tour.overview, 
        price: tour.price ? parseFloat(tour.price.replace(/[$,]/g, '')) || 0 : undefined,
        duration: tour.duration,
        countries: countryIds.length > 0 ? countryIds : undefined,
        tourType: tourType,
        featuredImage: imageId,
        isActive: true
      }

      if (existing.totalDocs > 0) {
        console.log(`Updating: ${tour.slug}`)
        await payload.update({
          collection: 'tours',
          id: existing.docs[0].id,
          data
        })
      } else {
        console.log(`Creating: ${tour.slug}`)
        // @ts-ignore - draft requirement for create seems to be a strict TypeScript inference issue
        await payload.create({
          collection: 'tours',
          data
        })
      }

    } catch (e) {
      console.error(`Error processing ${tour.slug}:`, e)
    }
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed()
