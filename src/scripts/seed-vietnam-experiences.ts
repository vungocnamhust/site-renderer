
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const ASSETS_DIR = path.resolve(
  dirname,
  '../components/www.asiatours.com:experiences:experiencing-kayaking-in-halong-bay/d2lwt6tidfiof0.cloudfront.net/uploads/photo-e/experience'
)

// Map keys to folder names and metadata
const EXPERIENCES_DATA = [
  {
    folder: 'kayak-halong',
    slug: 'experiencing-kayaking-in-beautiful-halong-bay',
    title: 'Experience kayaking in the beautiful Halong Bay',
    location: 'Halong Bay',
    tags: [
        { label: 'Swimming', icon: 'icon-swimming' },
        { label: 'Heritage', icon: 'icon-heritage' },
        { label: 'Nature', icon: 'icon-nature' },
        { label: 'Kayaking', icon: 'icon-kayaking' }
    ],
    short_description: 'When in Halong Bay - the World Natural Heritage recognized by UNESCO, you should not miss the chance to join the outdoor activities to explore the beautiful nature in exciting experience. Kayaking is one of the most attractive choice.',
    description: 'When in Halong Bay - the World Natural Heritage recognized by UNESCO, you should not miss the chance to join the outdoor activities to explore the beautiful nature in exciting experience. Kayaking is one of the most attractive choice, is very easy for all levels and ages to do. Our expert and experienced guide surely instruct you basic paddling steps before leading you to explore the extraordinary beauty of Halong Bay.',
    content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Full detailed content for Kayaking in Halong Bay...',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
    }
  },
  {
    folder: 'Captal-Hanoi',
    slug: 'exploring-rich-history-culture-capital-hanoi',
    title: 'Great time to exploring the rich history and culture of Capital Hanoi',
    location: 'Hanoi',
    tags: [
        { label: 'Cultural', icon: 'icon-cultural' },
        { label: 'History', icon: 'icon-history' }
    ],
    short_description: 'Hanoi - a blend between the traditional and the modern beauties - a sedate capital with rich history and the unique architecture from East to West welcomes you.',
    description: 'Hanoi - a blend between the traditional and the modern beauties - a sedate capital with rich history and the unique architecture from East to West welcomes you. Ho Chi Minh complex with the Mausoleum, One Pillar Pagoda, Temple of Literature, Hoan Kiem Lake are must-see sites.',
  },
  {
    folder: 'hanoi-street-food',
    slug: 'amazing-hanoi-street-food-tour',
    title: 'Amazing Hanoi Street Food Tour',
    location: 'Hanoi',
    tags: [
        { label: 'Cultural', icon: 'icon-cultural' },
        { label: 'Cuisine', icon: 'icon-cuisine' }
    ],
    short_description: 'There is no doubt that food is one of the best way to immersing yourself in local culture. Hanoi Foodie tour takes loving food souls from around the world to the corners of the Old Quarter.',
    description: 'There is no doubt that food is one of the best way to immersing yourself in local culture. Hanoi Foodie tour takes loving food souls from around the world to the corners of the Old Quarter, tasting valuable ingredients and techniques involved in Vietnamese cuisine.',
  },
  {
    folder: 'trekking-sapa',
    slug: 'trekking-in-magnificent-scenery-of-sapa',
    title: 'Trekking in magnificent scenery of Sapa',
    location: 'Sapa',
    tags: [
        { label: 'Ethnic', icon: 'icon-ethnic' },
        { label: 'Nature', icon: 'icon-nature' },
        { label: 'Adventure', icon: 'icon-adventure' }
    ],
    short_description: 'Get on the night train from Hanoi and welcome to Sapa – a beautiful northern mountainous highland surrounding by magnificent nature and authentic ethnic minority lives.',
    description: 'Get on the night train from Hanoi and welcome to Sapa – a beautiful northern mountainous highland surrounding by magnificent nature and authentic ethnic minority lives. In Sapa, we will pass through terraced rice fields and visit local villages.',
  },
  {
    folder: 'walking-hoian',
    slug: 'walking-tour-in-hoi-an-ancient-town',
    title: 'Walking Tour in Hoi An Ancient Town',
    location: 'Hoi An',
    tags: [
        { label: 'Cultural', icon: 'icon-cultural' },
        { label: 'History', icon: 'icon-history' }
    ],
    short_description: 'In the past, Hoi An Ancient Town was famous for the reputation as a busy commercial port where worldwide businessmen arrived and carried out transaction with numororus types of goods.',
    description: 'In the past, Hoi An Ancient Town was famous for the reputation as a busy commercial port where worldwide businessmen arrived and carried out transaction with numororus types of goods. Nowadays, it is a peaceful town with well-preserved ancient architecture.',
  },
  {
    folder: 'muine-sand-dunes',
    slug: 'great-adventure-in-mui-ne-sand-dunes',
    title: 'Great Adventure in Mui Ne sand dunes',
    location: 'Mui Ne',
    tags: [
        { label: 'Nature', icon: 'icon-nature' },
        { label: 'Adventure', icon: 'icon-adventure' }
    ],
    short_description: 'Breathtaking is one of the best words to describe the a massive white sand dune in Mui Ne. Situated in the Southern Part of Vietnam.',
    description: 'Breathtaking is one of the best words to describe the a massive white sand dune in Mui Ne.Situated in the Southern Part of Vietnam, about 04 hours driving from Ho Chi Minh City, Mui Ne will definitely amaze you.',
  },
  {
    folder: 'mekong-delta',
    slug: 'enchanted-by-cultural-discovery-mekong-delta',
    title: 'Enchanted by the regional experiences and sympathetic locals in Mekong Delta',
    location: 'Mekong',
    tags: [
        { label: 'Boating', icon: 'icon-boating' },
        { label: 'Cultural', icon: 'icon-cultural' }
    ],
    short_description: 'The cultural heart of Southern Vietnam, Mekong Delta is picturesquely set among floating delta and remains a magnet for cultural discovery and local interaction.',
    description: 'The cultural heart of Southern Vietnam, Mekong Delta is picturesquely set among floating delta and remains a magnet for cultural discovery and local interaction. After driving about 02 hours from Ho Chi Minh City, you will explore the waterways.',
  },
  {
    folder: 'cu-chi-tunnel',
    slug: 'unique-experience-in-legendary-cu-chi-tunnel',
    title: 'Unique Experience in Legendary Cu Chi tunnel',
    location: 'Ho Chi Minh',
    tags: [
         { label: 'History', icon: 'icon-history' },
         { label: 'Cultural', icon: 'icon-cultural' }
    ],
    short_description: 'If you are around Ho Chi Minh City and wondering how to spend a day in this fascinating city, why do not get a closer look at Vietnam’s wartime by visiting the Cu Chi tunnels?',
    description: 'If you are around Ho Chi Minh City and wondering how to spend a day in this fascinating city, why do not get a closer look at Vietnam’s wartime by visiting the Cu Chi tunnels? Hiding the the underground network of tunnels is a unique experience.',
  },
  {
    folder: 'ao-show',
    slug: 'brilliant-a-o-show-in-ho-chi-minh-city',
    title: 'Brilliant A O Show in Ho Chi Minh City',
    location: 'Ho Chi Minh',
    tags: [
        { label: 'Cultural', icon: 'icon-cultural' }
    ],
    short_description: 'If you travel to Ho Chi Minh City, do not miss an A O Show at Saigon Opera House. The amazing show will be an exciting brilliance which will mesmerize and enthrall you.',
    description: 'If you travel to Ho Chi Minh City, do not miss an A O Show at Saigon Opera House. The amazing show will be an exciting brilliance which will mesmerize and enthrall you with the skillful talented performers.',
  },
  {
    folder: 'hue-pmperial',
    slug: 'trip-to-imperial-citadel-royal-tombs',
    title: 'Take a trip to Imperial Citadel, Royal Tombs and learn about royal history',
    location: 'Hue',
    tags: [
        { label: 'Heritage', icon: 'icon-heritage' },
        { label: 'History', icon: 'icon-history' }
    ],
    short_description: 'Whether it is the Royal Experience with Mysteric Tomb, Imperial Citadel and the ancient architecture, or the peaceful atmosphere in the streets, Hue City is appealing.',
    description: 'Whether it is the Royal Experience with Mysteric Tomb, Imperial Citadel and the ancient architecture, or the peaceful atmosphere in the streets, Hue City is one of the most appealing destinations for tourists.',
  }
]

function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase()
    if (ext === '.png') return 'image/png'
    if (ext === '.webp') return 'image/webp'
    return 'image/jpeg'
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding experiences...')

  for (const exp of EXPERIENCES_DATA) {
    console.log(`Processing: ${exp.title}`)
    
    // Find images in folder
    const folderPath = path.join(ASSETS_DIR, exp.folder)
    
    let images: string[] = []
    if (fs.existsSync(folderPath)) {
        images = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    }

    if (images.length === 0) {
        console.warn(`No images found for ${exp.folder}`)
        continue
    }

    // Upload featured image (first one)
    const featuredImageFile = images[0]
    const featuredImagePath = path.join(folderPath, featuredImageFile)
    const featuredImageBuffer = fs.readFileSync(featuredImagePath)

    let featuredMedia;
    try {
        console.log(`Uploading featured image: ${featuredImageFile} (${featuredImageBuffer.length} bytes, ${getMimeType(featuredImageFile)})`)
        featuredMedia = await payload.create({
            collection: 'media',
            data: {
                alt: exp.title,
            },
            file: {
                data: featuredImageBuffer,
                name: featuredImageFile,
                mimetype: getMimeType(featuredImageFile),
                size: featuredImageBuffer.length,
            }
        })
        console.log(`Featured media created: ${featuredMedia.id}`)
    } catch (err) {
        console.error(`Failed to upload ${featuredImageFile}:`, err)
        continue // Skip this experience if main image fails
    }

    // Upload gallery images (up to 10)
    const galleryIds: { image: string, caption?: string }[] = []
    for (const imgFile of images.slice(1, 10)) {
        const imgPath = path.join(folderPath, imgFile)
        const imgBuffer = fs.readFileSync(imgPath)
        const media = await payload.create({
            collection: 'media',
            data: {
                alt: `${exp.title} - Gallery`,
            },
            file: {
                data: imgBuffer,
                name: imgFile,
                mimetype: getMimeType(imgFile),
                size: imgBuffer.length,
            }
        })
        galleryIds.push({ image: media.id as string })
    }

    // Check if exists
    const existing = await payload.find({
        collection: 'experiences',
        where: {
            slug: { equals: exp.slug }
        }
    })

    if (existing.docs.length > 0) {
        console.log(`Skipping existing experience: ${exp.slug}`)
        
        // Update images if needed, but for now skip
        await payload.update({
            collection: 'experiences',
            id: existing.docs[0].id,
            data: {
                image: featuredMedia.id,
                gallery: galleryIds,
                tags: exp.tags,
                short_description: exp.short_description,
                location: exp.location,
                country: 'vietnam'
            }
        })
    } else {
        await payload.create({
            collection: 'experiences',
            data: {
                title: exp.title,
                slug: exp.slug,
                description: exp.description,
                short_description: exp.short_description,
                image: featuredMedia.id,
                gallery: galleryIds,
                tags: exp.tags,
                location: exp.location,
                country: 'vietnam',
                content: exp.content || {
                    root: {
                        children: [
                            {
                                children: [{ text: exp.description, version: 1 }],
                                direction: 'ltr',
                                type: 'paragraph',
                                version: 1
                            }
                        ],
                        direction: 'ltr',
                        type: 'root',
                        version: 1,
                    }
                }
            }
        })
    }
  }

  console.log('Seeding completed!')
  process.exit(0)
}

seed()
