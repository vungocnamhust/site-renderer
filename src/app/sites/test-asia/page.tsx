/**
 * Test page for AsiaToursTravelWeb layout - uses sites layout for CSS
 * Access via: http://localhost:3005/sites/test-asia
 */

import { AsiaToursTravelWeb } from '@/components/modules/AsiaToursTravelWeb'
import type { AsiaToursTravelWebData } from '@/components/modules/AsiaToursTravelWeb/types'

const mockData: AsiaToursTravelWebData = {
  heroSection: {
    slides: [
      {
        image: 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp',
        title: 'Asia Tours',
        subtitle: '',
      },
    ],
  },
  siteSettings: {
    siteName: 'Asia Tours',
    logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours_logo.svg',
    contactPhone: '(+84) 916 952 668',
    contactEmail: 'experts@asiatours.com',
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
    {
      label: 'Travel themes',
      href: '#',
      children: [
        { label: 'Best Tours', href: '/tours/best-tours' },
        { label: 'Classic Highlights', href: '/tours/classic-highlights' },
        { label: 'Family Tours', href: '/tours/family' },
      ],
    },
  ],
  featuredTours: [],
  footer: {
    copyright: 'Copyright © 2026. All information, logos, designs, text, photos, graphics... on this website are owned by Asia Tours Co., Ltd',
    aboutText: 'We are proudly recommended by National Geographic, The Washington Post, CNN Travel... To be the Best Tour Operators in each Asia destination.',
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/AsiaToursOfficial' },
      { platform: 'twitter', url: '#' },
      { platform: 'instagram', url: '#' },
    ],
  },
}

export default function TestAsiaPage() {
  return <AsiaToursTravelWeb data={mockData} slug={[]} />
}
