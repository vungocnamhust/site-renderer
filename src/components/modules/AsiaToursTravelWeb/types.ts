/**
 * TypeScript Interfaces for AsiaToursTravelWeb Module
 * Re-export types from payload-types and extend as needed
 */

// Import and re-export from payload-types
import type { Tour as PayloadTour, Blog as PayloadBlog, Media as PayloadMedia } from '@/payload-types'

export type Tour = PayloadTour
export type Blog = PayloadBlog
export type Media = PayloadMedia

// Extended types for components that need simplified Tour data
export interface SimplifiedTour {
  id: string | number
  title: string
  slug: string
  country?: string
  countries?: string[]
  tourType?: 'single-country' | 'multi-country' | null
  duration?: string | null
  price?: number | null
  priceNote?: string | null
  featuredImage?: { url?: string } | string | number | null
  shortDescription?: string | null
  itinerary?: unknown // Can be string or rich text object
  isFeatured?: boolean
  isActive?: boolean
}

export interface NavigationItem {
  id?: string
  label: string
  href: string
  children?: {
    id?: string
    label?: string
    href?: string
  }[]
}

export interface SiteSettings {
  siteName: string
  logo?: PayloadMedia | string
  contactPhone?: string
  contactEmail?: string
}

export interface HeroSlide {
  image: PayloadMedia | string
  title?: string
  subtitle?: string
  link?: string
  linkText?: string
}

export interface HeroSection {
  slides: HeroSlide[]
}

export interface Footer {
  aboutText?: string
  copyright?: string
  socialLinks?: {
    platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'tripadvisor'
    url: string
  }[]
  footerPartners?: {
    logo: PayloadMedia | string
    name?: string
    link?: string
  }[]
}

export interface BestSupportItem {
  icon?: PayloadMedia | string
  title: string
  description?: string
}

export interface SignatureItem {
  icon: PayloadMedia | string
}



export interface TourStyleItem {
  title: string
  image: PayloadMedia | string
  description?: string
  link?: string
}

export interface UniqueExperienceItem {
  title: string
  location?: string
  country?: string
  image: PayloadMedia | string
  description?: string
  link?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface RecentTravelItem {
  title?: string
  location?: string
  image: PayloadMedia | string
  link?: string
}

export interface LocalExperiencesData {
  stats: {
    countries?: string
    destinations?: string
    experiences?: string
    reviews?: string
    guests?: string
  }
  gallery?: {
    image: PayloadMedia | string
    name?: string
    size?: 'crow-size-1' | 'crow-size-2' | 'crow-size-3'
  }[]
}

export interface AsiaToursTravelWebData {
  siteSettings: SiteSettings
  heroSection: HeroSection
  navigation: NavigationItem[]
  multiCountryTours?: (PayloadTour | string)[]
  featuredTours?: (PayloadTour | string)[] // Relationship can be ID or Object
  featuredBlogs?: (PayloadBlog | string)[]
  bestSupport?: BestSupportItem[]
  signature?: SignatureItem
  tourStyles?: TourStyleItem[]
  uniqueExperiences?: UniqueExperienceItem[]
  faqs?: FaqItem[]
  recentTravels?: RecentTravelItem[]
  locExp?: LocalExperiencesData
  footer: Footer
}

// Props for the main module component
export interface ModuleProps {
  data: AsiaToursTravelWebData
  slug?: string[]
}
