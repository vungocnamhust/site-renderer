
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function fixTenantData() {
  const payload = await getPayload({ config })

  console.log('--- FIXING TENANT DATA (MISSING IMAGES) ---')

  const tenants = await payload.find({
    collection: 'tenants',
    limit: 100,
  })

  // Find a fallback image
  const media = await payload.find({
    collection: 'media',
    where: { 
      filename: { contains: '.webp' } 
    },
    limit: 1,
  })

  const fallbackImageId = media.docs[0]?.id

  if (!fallbackImageId) {
    console.error('No media found to use as fallback!')
    process.exit(1)
  }

  for (const tenant of tenants.docs) {
    const content = (tenant as any).content_asia_tours_travel_web
    if (!content) continue

    let updated = false

    // Fix tourStyles
    if (content.tourStyles) {
      content.tourStyles = content.tourStyles.map((style: any) => {
        if (!style.image) {
          console.log(`Fixing missing image in tourStyles for tenant: ${tenant.subdomain}`)
          updated = true
          return { ...style, image: fallbackImageId }
        }
        return style
      })
    }

    // Fix uniqueExperiences
    if (content.uniqueExperiences) {
      content.uniqueExperiences = content.uniqueExperiences.map((exp: any) => {
        if (!exp.image) {
          console.log(`Fixing missing image in uniqueExperiences for tenant: ${tenant.subdomain}`)
          updated = true
          return { ...exp, image: fallbackImageId }
        }
        return exp
      })
    }

    if (updated) {
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          content_asia_tours_travel_web: content,
        },
      })
      console.log(`Updated tenant: ${tenant.subdomain}`)
    }
  }

  console.log('--- FIX COMPLETED ---')
  process.exit(0)
}

fixTenantData().catch(err => {
  console.error(err)
  process.exit(1)
})
