import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seedTenant() {
  const payload = await getPayload({ config })

  // Check if tenant exists
  const existing = await payload.find({
    collection: 'tenants',
    where: {
      subdomain: { equals: 'capellatravel' }
    }
  })

  if (existing.totalDocs > 0) {
    console.log('Tenant "capellatravel" already exists, updating...')
    await payload.update({
      collection: 'tenants',
      id: existing.docs[0].id as any,
      data: {
        name: 'Capella Travel',
        subdomain: 'capellatravel',
        templateId: 'asia-tours-travel-web',
        isActive: true,
        content_asia_tours_travel_web: {
          heroSection: {
            slides: [
              {
                image: 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp' as any,
                title: 'Capella Travel - Asia Tours',
                subtitle: 'Your Gateway to Asia',
              },
            ],
          },
          siteSettings: {
            siteName: 'Capella Travel',
            logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours_logo.svg' as any,
            contactPhone: '(+84) 916 952 668',
            contactEmail: 'experts@capellatravel.com',
          },
          navigation: [
            {
              label: 'Best Tours',
              href: '/best-tours',
            },
            {
              label: 'Destinations',
              href: '#',
              children: [
                { label: 'Vietnam Tours', href: '/vietnam/tours' },
                { label: 'Cambodia Tours', href: '/cambodia/tours' },
                { label: 'Thailand Tours', href: '/thailand/tours' },
                { label: 'Laos Tours', href: '/laos/tours' },
              ],
            },
          ],
          footer: {
            copyright: 'Copyright © 2026. Capella Travel Co., Ltd',
            aboutText: 'We are proudly recommended by National Geographic, The Washington Post, CNN Travel...',
            socialLinks: [
              { platform: 'facebook', url: 'https://www.facebook.com/CapellaTravel' },
            ],
          },
        },
      },
    })
    console.log('Tenant updated successfully!')
  } else {
    console.log('Creating tenant "capellatravel"...')
    await payload.create({
      collection: 'tenants',
      data: {
        name: 'Capella Travel',
        subdomain: 'capellatravel',
        templateId: 'asia-tours-travel-web',
        isActive: true,
        content_asia_tours_travel_web: {
          heroSection: {
            slides: [
              {
                image: 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp' as any,
                title: 'Capella Travel - Asia Tours',
                subtitle: 'Your Gateway to Asia',
              },
            ],
          },
          siteSettings: {
            siteName: 'Capella Travel',
            logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours_logo.svg' as any,
            contactPhone: '(+84) 916 952 668',
            contactEmail: 'experts@capellatravel.com',
          },
          navigation: [
            {
              label: 'Best Tours',
              href: '/best-tours',
            },
            {
              label: 'Destinations',
              href: '#',
              children: [
                { label: 'Vietnam Tours', href: '/vietnam/tours' },
                { label: 'Cambodia Tours', href: '/cambodia/tours' },
                { label: 'Thailand Tours', href: '/thailand/tours' },
                { label: 'Laos Tours', href: '/laos/tours' },
              ],
            },
          ],
          footer: {
            copyright: 'Copyright © 2026. Capella Travel Co., Ltd',
            aboutText: 'We are proudly recommended by National Geographic, The Washington Post, CNN Travel...',
            socialLinks: [
              { platform: 'facebook', url: 'https://www.facebook.com/CapellaTravel' },
            ],
          },
        },
      },
    })
    console.log('Tenant created successfully!')
  }

  process.exit(0)
}

seedTenant().catch((err) => {
  console.error('Error seeding tenant:', err)
  process.exit(1)
})
