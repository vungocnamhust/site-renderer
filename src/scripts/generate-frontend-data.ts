import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DATA_PATH = path.resolve(dirname, 'data/pages_data.json')
const TARGET_PATH = path.resolve(process.cwd(), 'src/components/modules/AsiaToursTravelWeb/data/countries.ts')

interface PageData {
  slug: string
  title: string
  introTitle: string
  introContent: string
  bannerImage: string
  metaTitle: string
  metaDescription: string
}

async function generate() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Page data file not found: ${DATA_PATH}`)
    process.exit(1)
  }

  const pages: PageData[] = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  console.log(`Generating countries.ts from ${pages.length} extracted pages...`)

  const countriesObj: Record<string, any> = {}

  for (const page of pages) {
    if (!page.slug || page.slug === 'unknown' || page.slug === 'home') continue

    // Normalize slug (e.g. vietnam-tours -> vietnam is handled in parser, but double check)
    // Actually parser produced 'vietnam', 'cambodia' etc.
    
    // Clean intro description
    // Remove HTML tags for introDescription (short)
    const plainText = page.introContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const shortDesc = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')

    // For full description, keep HTML but maybe escape quotes?
    // We'll trust the JSON stringify to handle escaping.

    countriesObj[page.slug] = {
      slug: page.slug,
      title: page.title,
      subtitle: page.introTitle,
      bannerImage: page.bannerImage || '', 
      introSlogan: page.introTitle,
      introDescription: shortDesc,
      introFullDescription: page.introContent,
      stats: [], // Parser didn't extract these yet, leave empty or manual fill later
      highlights: [] // Parser didn't extract these yet
    }
  }

  const fileContent = `
import { CountryData } from './types' // Assuming types are exported or defined here

export interface CountryData {
  slug: string
  title: string
  subtitle: string
  bannerImage: string
  introSlogan: string
  introDescription: string
  introFullDescription: string
  stats: { label: string; value: string }[]
  highlights: { title: string; description: string; image: string }[]
}

export const COUNTRIES: Record<string, CountryData> = ${JSON.stringify(countriesObj, null, 2)}
`

  fs.writeFileSync(TARGET_PATH, fileContent)
  console.log(`Frontend data generated at ${TARGET_PATH}`)
}

generate()
