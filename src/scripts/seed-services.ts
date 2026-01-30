
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedServices() {
  const payload = await getPayload({ config })
  console.log('--- SEEDING SERVICES LIBRARY (UPDATED SCHEMA) ---')

  // Get tenant
  const tenants = await payload.find({ collection: 'tenants', limit: 1 })
  if (tenants.docs.length === 0) {
    console.log('No tenant found.')
    process.exit(1)
  }
  const tenantId = tenants.docs[0].id

  // Get service types
  const stRes = await payload.find({ collection: 'service-types', limit: 0 })
  const serviceTypes = stRes.docs
  const findST = (code: string) => serviceTypes.find((t: any) => t.code === code)?.id

  // Get destinations
  const destRes = await payload.find({ collection: 'destinations', limit: 0 })
  const destinations = destRes.docs
  const findDest = (slug: string) => destinations.find((d: any) => d.slug.includes(slug))?.id

  const sampleServices = [
    { 
        serviceCode: 'CT-SRV-TIC-VN-HAN-0001',
        title: 'Water Puppet Show Ticket (standard)', 
        status: 'draft',
        typeCode: 'TIC',
        destSlug: 'hanoi',
        unit: 'per ticket',
        leadTime: '24h',
        cancellationPolicy: 'Non-refundable after booking'
    },
    { 
        serviceCode: 'CT-SRV-TRF-VN-HAN-0001',
        title: 'Airport Transfer (Private Sedan) - Noi Bai', 
        status: 'published',
        typeCode: 'TRF',
        destSlug: 'hanoi',
        unit: 'per vehicle',
        leadTime: '12h',
        cancellationPolicy: 'Free cancellation up to 24h before arrival'
    },
    { 
        serviceCode: 'CT-SRV-GUI-VN-HAN-0001',
        title: 'Full Day English Speaking Guide (Hanoi)', 
        status: 'published',
        typeCode: 'GUI',
        destSlug: 'hanoi',
        unit: 'per day',
        leadTime: '48h',
        cancellationPolicy: '50% refund if cancelled within 48h'
    }
  ]

  for (const s of sampleServices) {
    const stId = findST(s.typeCode)
    const destId = findDest(s.destSlug)
    
    if (!stId) {
        console.log(`Skipping ${s.title}: Service type ${s.typeCode} not found.`);
        continue;
    }

    // Check if exists
    const existing = await payload.find({
        collection: 'services',
        where: { serviceCode: { equals: s.serviceCode } }
    })

    const data = {
        serviceCode: s.serviceCode,
        title: s.title,
        status: s.status,
        type: stId,
        destination: destId,
        unit: s.unit,
        leadTime: s.leadTime,
        cancellationPolicy: s.cancellationPolicy,
        tenant: tenantId,
    };

    if (existing.docs.length === 0) {
        console.log(`Creating service: ${s.title}`);
        await payload.create({
            collection: 'services',
            data: data as any
        })
    } else {
        console.log(`Updating service: ${s.title}`);
        await payload.update({
            collection: 'services',
            id: existing.docs[0].id,
            data: data as any
        })
    }
  }

  console.log('--- DONE ---')
  process.exit(0)
}

seedServices()
