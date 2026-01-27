import React from 'react'
import { AsiaToursTravelWeb } from '@/components/modules/AsiaToursTravelWeb'
import type { AsiaToursTravelWebData } from '@/components/modules/AsiaToursTravelWeb/types'

const MOCK_DATA: AsiaToursTravelWebData = {
  siteSettings: {
    siteName: 'Asia Tours',
    logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/logo/logo-asia-tours.png',
    contactPhone: '+84 90 123 4567',
    contactEmail: 'info@asiatours.com'
  },
  heroSection: {
    slides: [
      {
        image: 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp',
        title: 'Discover the Essence of Asia',
        subtitle: "Asia is our homeland. We'll show you Asia, better than anyone else!",
        linkText: 'Explore Now'
      },
      {
        image: 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp', // Using same image for mock
        title: 'Tailor-Made Holidays',
        subtitle: 'Experience the magic of Asia with our personalized tours.',
        linkText: 'Start Planning'
      }
    ]
  },
  navigation: [
    { label: 'Destinations', href: '#' },
    { label: 'Travel Styles', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' }
  ],
  bestSupport: [
      {
          title: '100% Personalized Itinerary',
          description: 'Hassle-free and uniquely personalized!',
          icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h1.webp'
      },
      {
          title: 'Private Guide, Car & Driver',
          description: 'Flexible private tours with experienced guides.',
          icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h2.webp'
      },
      {
          title: 'Handpicked Hotels & Meals',
          description: 'Best collection of accommodation and authentic cuisine.',
          icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h3.webp'
      },
      {
          title: 'Trip Managing Experts',
          description: '24/7 support from our dedicated team.',
          icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h4.webp'
      }
  ],
  signature: {
    icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/destination/vietnam.jpg'
  },

  footer: {
    copyright: '© 2024 Asia Tours. All rights reserved.',
    aboutText: 'Award-winning travel company offering professional, safe, hassle free and best Asia Private tours.',
    socialLinks: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'youtube', url: '#' }
    ],
    footerPartners: [
        { logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/footer-logo-asia-trust.jpg', name: 'ASTA' },
        { logo: 'https://d2lwt6tidfiof0.cloudfront.net/images/footer-logo-asia-trust.jpg', name: 'TripAdvisor' }
    ]
  },
  featuredTours: []
}

export default function HomePage() {
  return (
    <AsiaToursTravelWeb data={MOCK_DATA} slug={[]} />
  )
}

