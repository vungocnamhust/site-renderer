import { getPayload } from 'payload'
import config from '@payload-config'
import type { Tour, Blog, Experience, Faq } from '@/payload-types'

/**
 * Get the Payload instance with the project config
 */
const getPayloadClient = async () => {
    return await getPayload({ config })
}

/**
 * Fetch featured tours for the homepage
 * @param limit - Number of tours to fetch
 * @param options - Filter options (multiCountry: true for multi-country tours only)
 */
export async function getFeaturedTours(
    limit: number = 6, 
    options?: { multiCountry?: boolean }
): Promise<Tour[]> {
    const payload = await getPayloadClient()
    
    const whereConditions: any[] = [
        { isFeatured: { equals: true } },
        { isActive: { equals: true } }
    ]
    
    // Filter for multi-country tours if specified
    if (options?.multiCountry) {
        whereConditions.push({ tourType: { equals: 'multi-country' } })
    }
    
    const { docs } = await payload.find({
        collection: 'tours',
        where: { and: whereConditions },
        limit,
        depth: 1
    })
    return docs as unknown as Tour[]
}

/**
 * Fetch tours for a specific country
 */
export async function getToursByCountry(countrySlug: string): Promise<Tour[]> {
    const payload = await getPayloadClient()
    
    // First, lookup the country by slug to get its ID
    const { docs: countries } = await payload.find({
        collection: 'countries',
        where: { slug: { equals: countrySlug } },
        limit: 1
    })
    
    if (countries.length === 0) {
        console.warn(`Country not found for slug: ${countrySlug}`)
        return []
    }
    
    const countryId = countries[0].id
    
    // Guard against invalid ID
    if (!countryId) {
        console.warn(`Country ID not found for slug: ${countrySlug}`)
        return []
    }

    console.log(`[getToursByCountry] Fetching tours for country: ${countrySlug} (ID: ${countryId})`)
    
    const { docs } = await payload.find({
        collection: 'tours',
        where: {
            and: [
                { 'countries': { in: [countryId] } },
                { isActive: { equals: true } }
            ]
        },
        depth: 1
    })
    return docs as unknown as Tour[]
}

/**
 * Fetch multi-country tours
 */
export async function getMultiCountryTours(routeSlug?: string): Promise<Tour[]> {
    const payload = await getPayloadClient()
    
    const whereConditions: any[] = [
        { tourType: { equals: 'multi-country' } },
        { isActive: { equals: true } }
    ]

    if (routeSlug) {
        whereConditions.push({ routeSlug: { equals: routeSlug } })
    }

    const { docs } = await payload.find({
        collection: 'tours',
        where: {
            and: whereConditions
        },
        depth: 1
    })
    return docs as unknown as Tour[]
}

/**
 * Fetch a single tour by slug
 */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'tours',
        where: {
            and: [
                { slug: { equals: slug } },
                { isActive: { equals: true } }
            ]
        },
        limit: 1,
        depth: 1
    })
    return (docs[0] as unknown as Tour) || null
}

/**
 * Fetch a blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'blogs',
        where: {
            slug: { equals: slug }
        },
        limit: 1,
        depth: 1
    })
    return (docs[0] as unknown as Blog) || null
}

/**
 * Fetch experiences for a specific country
 */
export async function getExperiencesByCountry(countrySlug: string, destination?: string): Promise<Experience[]> {
    const payload = await getPayloadClient()
    
    // First, lookup the country by slug to get its ID
    const { docs: countries } = await payload.find({
        collection: 'countries',
        where: { slug: { equals: countrySlug } },
        limit: 1
    })
    
    if (countries.length === 0) {
        return []
    }
    
    const countryId = countries[0].id
    
    const query: any = {
        country: { equals: countryId }
    }

    if (destination && destination !== 'All') {
        query.location = { equals: destination }
    }

    const { docs } = await payload.find({
        collection: 'experiences',
        where: query,
        limit: 100
    })
    return docs as unknown as Experience[]
}

/**
 * Fetch a single experience by slug
 */
export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'experiences',
        where: {
            slug: { equals: slug }
        },
        limit: 1,
        depth: 1
    })
    return (docs[0] as unknown as Experience) || null
}

/**
 * Fetch general FAQs for Home Page
 */
export async function getGeneralFaqs(): Promise<Faq[]> {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'faqs',
        where: {
            is_general: { equals: true }
        },
        sort: 'order',
        limit: 10
    })
    return docs as unknown as Faq[]
}

/**
 * Fetch FAQs for a specific country (Tagged + Curated)
 */
export async function getFaqsByCountry(countrySlug: string): Promise<Faq[]> {
    const payload = await getPayloadClient()
    
    // Get Country ID and Curated FAQs
    const { docs: countries } = await payload.find({
        collection: 'countries',
        where: { slug: { equals: countrySlug } },
        limit: 1
    })
    
    if (countries.length === 0) return []
    
    const country = countries[0]
    const countryId = country.id
    
    // Extract manual curated FAQ IDs
    // Check if faqs is array of objects (populated) or IDs (not populated)
    // Theoretically depth=0 or 1, let's assume standard behavior.
    let curatedFaqIds: number[] = []
    if (country.faqs && Array.isArray(country.faqs)) {
        curatedFaqIds = country.faqs.map(f => (typeof f === 'object' ? f.id : f))
    }

    const whereConditions: any[] = [
        { countries: { in: [countryId] } } // Tagged
    ]

    if (curatedFaqIds.length > 0) {
        whereConditions.push({ id: { in: curatedFaqIds } }) // Curated
    }
    
    const { docs } = await payload.find({
        collection: 'faqs',
        where: {
            or: whereConditions
        },
        sort: 'order',
        limit: 20
    })
    
    return docs as unknown as Faq[]
}

/**
 * Fetch FAQs for a specific tour category (Tagged + Curated)
 */
export async function getFaqsByCategory(categorySlug: string): Promise<Faq[]> {
    const payload = await getPayloadClient()
    
    const { docs: categories } = await payload.find({
        collection: 'tour-categories',
        where: { slug: { equals: categorySlug } },
        limit: 1
    })
    
    if (categories.length === 0) return []
    
    const category = categories[0]
    const categoryId = category.id
    
    let curatedFaqIds: number[] = []
    if (category.faqs && Array.isArray(category.faqs)) {
        curatedFaqIds = category.faqs.map(f => (typeof f === 'object' ? f.id : f))
    }

    const whereConditions: any[] = [
        { tour_categories: { in: [categoryId] } }
    ]

    if (curatedFaqIds.length > 0) {
        whereConditions.push({ id: { in: curatedFaqIds } })
    }
    
    const { docs } = await payload.find({
        collection: 'faqs',
        where: {
            or: whereConditions
        },
        sort: 'order',
        limit: 20
    })
    
    return docs as unknown as Faq[]
}

/**
 * Fetch FAQs for multi-country context
 */
export async function getFaqsByMultiCountry(countryIds: number[]): Promise<Faq[]> {
    if (!countryIds || countryIds.length === 0) return []

    const payload = await getPayloadClient()
    
    const { docs } = await payload.find({
        collection: 'faqs',
        where: {
            countries: { in: countryIds }
        },
        sort: 'order',
        limit: 20
    })
    
    return docs as unknown as Faq[]
}
