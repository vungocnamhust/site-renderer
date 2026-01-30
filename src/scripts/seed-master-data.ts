
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedMasterData() {
  const payload = await getPayload({ config })
  console.log('--- SEEDING MASTER DATA (SERVICE TYPES & EXPERIENCE THEMES) ---')

  const serviceTypes = [
    { code: 'TRF', name: 'Transport / Transfer', defaultUnit: 'per vehicle' },
    { code: 'GUI', name: 'Guide', defaultUnit: 'per day' },
    { code: 'TIC', name: 'Ticket / Entrance', defaultUnit: 'per ticket' },
    { code: 'ACT', name: 'Activity / Experience', defaultUnit: 'per pax' },
    { code: 'CRU', name: 'Cruise', defaultUnit: 'per pax' },
    { code: 'HTL', name: 'Hotel / Accommodation', defaultUnit: 'per room/night' },
    { code: 'MEA', name: 'Meal / Restaurant', defaultUnit: 'per pax' },
    { code: 'SPA', name: 'Spa / Wellness', defaultUnit: 'per pax' },
    { code: 'FST', name: 'Fast Track', defaultUnit: 'per pax' },
    { code: 'RAI', name: 'Train', defaultUnit: 'per ticket' },
    { code: 'BOA', name: 'Boat (local)', defaultUnit: 'per pax' },
    { code: 'MSC', name: 'Misc / Other', defaultUnit: 'per item' },
    { code: 'VIS', name: 'Visa', defaultUnit: 'per pax' },
    { code: 'INS', name: 'Insurance', defaultUnit: 'per pax' },
    { code: 'TRA', name: 'Overnight Train', defaultUnit: 'per pax/night' },
    { code: 'FLT', name: 'Flights', defaultUnit: 'per ticket' },
    { code: 'EVT', name: 'Event/MICE', defaultUnit: 'per item' },
    { code: 'SUR', name: 'Surcharge', defaultUnit: 'Per service' },
    { code: 'TIP', name: 'Tips', defaultUnit: 'Per pax' },
    { code: 'OTH', name: 'Others', defaultUnit: 'Per items' },
  ]

  const serviceTypeMap = new Map<string, string>()

  console.log('Seeding Service Types...')
  for (const st of serviceTypes) {
    const existing = await payload.find({
      collection: 'service-types',
      where: { code: { equals: st.code } },
    })

    let id: any
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'service-types',
        data: st,
      })
      id = created.id
    } else {
      const updated = await payload.update({
        collection: 'service-types',
        id: existing.docs[0].id,
        data: st,
      })
      id = updated.id
    }
    serviceTypeMap.set(st.code, id)
  }

  const experienceThemes = [
    { code: 'SHOW', name: 'Cultural Shows & Performances', stCode: 'TIC' },
    { code: 'FOOD', name: 'Food Tasting & Street Food', stCode: 'ACT' },
    { code: 'COOK', name: 'Cooking Class & Home-hosted Meal', stCode: 'ACT' },
    { code: 'MARK', name: 'Market Visit & Food Culture', stCode: 'ACT' },
    { code: 'CAFE', name: 'Coffee & Tea Culture', stCode: 'ACT' },
    { code: 'CRAF', name: 'Arts, Crafts & Workshops', stCode: 'ACT' },
    { code: 'VILL', name: 'Village & Community Visit', stCode: 'ACT' },
    { code: 'FARM', name: 'Farm-to-Table & Agriculture', stCode: 'ACT' },
    { code: 'BOAT', name: 'Boat / Water Activities', stCode: 'BOA' },
    { code: 'CRUI', name: 'Cruise Experiences', stCode: 'CRU' },
    { code: 'RAIL', name: 'Rail Journeys', stCode: 'RAI' },
    { code: 'BIKE', name: 'Cycling Experience', stCode: 'ACT' },
    { code: 'TREK', name: 'Trekking & Hiking', stCode: 'ACT' },
    { code: 'CAVE', name: 'Caves & Karst Exploration', stCode: 'ACT' },
    { code: 'WILD', name: 'Wildlife & Birding', stCode: 'ACT' },
    { code: 'PHOTO', name: 'Photography Experience', stCode: 'ACT' },
    { code: 'MUSE', name: 'Museums & Heritage Sites', stCode: 'TIC' },
    { code: 'WAR', name: 'War History & Memory', stCode: 'TIC' },
    { code: 'WELL', name: 'Wellness & Mindfulness', stCode: 'SPA' },
    { code: 'SPA', name: 'Spa & Healing Treatments', stCode: 'SPA' },
    { code: 'GOLF', name: 'Golf Experience', stCode: 'ACT' },
    { code: 'BEACH', name: 'Beach & Leisure', stCode: 'ACT' },
    { code: 'IMPA', name: 'Impact / Philanthropy', stCode: 'ACT' },
    { code: 'FEST', name: 'Festivals & Events', stCode: 'ACT' },
  ]

  console.log('Seeding Experience Themes...')
  for (const et of experienceThemes) {
    const stId = serviceTypeMap.get(et.stCode)
    if (!stId) {
      console.error(`Service Type Code ${et.stCode} not found for Theme ${et.code}`)
      continue
    }

    const existing = await payload.find({
      collection: 'experience-themes',
      where: { code: { equals: et.code } },
    })

    const data: any = {
      code: et.code,
      name: et.name,
      serviceType: stId,
      isActive: true,
    }

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'experience-themes',
        data,
      })
    } else {
      await payload.update({
        collection: 'experience-themes',
        id: existing.docs[0].id,
        data,
      })
    }
  }

  const markets = [
    { code: 'US', name: 'United States', isActive: true },
    { code: 'EU', name: 'Europe', isActive: true },
    { code: 'AU', name: 'Australia & New Zealand', isActive: true },
    { code: 'GCC', name: 'GCC / Middle East', isActive: true },
    { code: 'SEA', name: 'Southeast Asia', isActive: true },
    { code: 'KR', name: 'Korea', isActive: false },
    { code: 'JP', name: 'Japan', isActive: false },
    { code: 'CN', name: 'China', isActive: false },
  ]

  console.log('Seeding Markets...')
  for (const m of markets) {
    const existing = await payload.find({
      collection: 'markets',
      where: { code: { equals: m.code } },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'markets',
        data: m,
      })
    } else {
      await payload.update({
        collection: 'markets',
        id: existing.docs[0].id,
        data: m,
      })
    }
  }

  console.log('--- SEEDING COMPLETED ---')
  process.exit(0)
}

seedMasterData()
