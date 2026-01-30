
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedLocationsAndHubs() {
  const payload = await getPayload({ config })
  console.log('--- SEEDING LOCATIONS & TRANSIT HUBS ---')

  // 1. Seed Country
  console.log('Seeding Country: Vietnam...')
  const vnRes = await payload.find({
    collection: 'countries',
    where: { slug: { equals: 'vietnam' } }
  })
  let vnId: any
  if (vnRes.docs.length === 0) {
    const created: any = await payload.create({
      collection: 'countries',
      data: { name: 'Vietnam', slug: 'vietnam', code: 'VN', region: 'southeast-asia' } as any
    })
    vnId = created.id
  } else {
    vnId = vnRes.docs[0].id
  }

  // 2. Seed Destination
  console.log('Seeding Destination: Hanoi...')
  const hanRes = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: 'hanoi' } }
  })
  let hanoiId: any
  if (hanRes.docs.length === 0) {
    const created: any = await payload.create({
      collection: 'destinations',
      data: { name: 'Hanoi', slug: 'hanoi', country: vnId } as any
    })
    hanoiId = created.id
  } else {
    hanoiId = hanRes.docs[0].id
  }

  // 3. Seed Districts (Hub areas)
  console.log('Seeding District: Soc Son (Hanoi)...')
  const ssRes = await payload.find({
    collection: 'districts',
    where: { slug: { equals: 'soc-son' } }
  })
  let socSonId: any
  if (ssRes.docs.length === 0) {
    const created: any = await payload.create({
      collection: 'districts',
      data: { name: 'Soc Son', slug: 'soc-son', destination: hanoiId, isHub: true } as any
    })
    socSonId = created.id
  } else {
    socSonId = ssRes.docs[0].id
  }

  // 4. Seed Transit Hubs
  console.log('Seeding Transit Hub: Noi Bai Airport...')
  const nbRes = await payload.find({
    collection: 'transit-hubs',
    where: { code: { equals: 'HAN' } }
  })
  let noiBaiId: any
  const nbData: any = {
    name: 'Noi Bai International Airport',
    code: 'HAN',
    type: 'airport',
    district: socSonId,
    country: vnId,
    latitude: 21.2187,
    longitude: 105.8042
  }
  if (nbRes.docs.length === 0) {
    const created: any = await payload.create({
      collection: 'transit-hubs',
      data: nbData
    })
    noiBaiId = created.id
  } else {
    noiBaiId = nbRes.docs[0].id
  }

  // 5. Link other Districts to this Hub
  console.log('Seeding District: Hoan Kiem and linking to Noi Bai...')
  const hkRes = await payload.find({
    collection: 'districts',
    where: { slug: { equals: 'hoan-kiem' } }
  })
  if (hkRes.docs.length === 0) {
    await payload.create({
      collection: 'districts',
      data: { 
        name: 'Hoan Kiem', 
        slug: 'hoan-kiem', 
        destination: hanoiId,
        logistics: {
            nearestAirport: noiBaiId,
            transferNotes: 'Approx 45-60 mins transfer to Hanoi Old Quarter'
        }
      } as any
    })
  } else {
    await payload.update({
        collection: 'districts',
        id: hkRes.docs[0].id,
        data: {
            logistics: {
                nearestAirport: noiBaiId,
                transferNotes: 'Approx 45-60 mins transfer to Hanoi Old Quarter'
            }
        } as any
    })
  }

  console.log('--- SEEDING COMPLETED ---')
  process.exit(0)
}

seedLocationsAndHubs()
