
import Link from 'next/link'
import { BigTourCard } from './BigTourCard'
import type { Tour } from '../types'

interface FeaturedToursSectionProps {
    tours?: (Tour | string)[]
    title?: string
}

export function FeaturedToursSection({
    tours,
    title = 'Inspiring Best Asia Tour Itineraries'
}: FeaturedToursSectionProps) {
    if (!tours || tours.length === 0) return null

    return (
        <section className="list-trip mg-top-30">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <h2 className="title-h2-line" style={{ marginBottom: '40px', textAlign: 'center' }}>{title}</h2>

                <div className="list-featured-tours">
                    {tours.map((tour, idx) => {
                        if (typeof tour === 'string') return null

                        // Extract country names
                        // @ts-ignore
                        const countriesList = tour.countries || []
                        const countriesText = countriesList
                            .map((c: any) => typeof c === 'object' ? c.name : c)
                            .join(', ')

                        // For itinerary, if it's an array of objects (like in some schemas), join them
                        // For now, if it's missing, we could use shortDescription or a placeholder
                        // The image shows "Luzon -> Palawan -> ..."
                        // If tour.itinerary exists as a string or can be formatted:
                        let itineraryText = ''
                        if (Array.isArray((tour as any).itinerary)) {
                            itineraryText = (tour as any).itinerary
                                .map((item: any) => item.title || item.location)
                                .filter(Boolean)
                                .join(' → ')
                        } else if (typeof (tour as any).itinerary === 'string') {
                            itineraryText = (tour as any).itinerary
                        } else {
                            // Fallback to a placeholder or derived from destinations
                            itineraryText = countriesText
                        }

                        return (
                            <BigTourCard
                                key={tour.id || idx}
                                title={tour.title}
                                slug={tour.slug}
                                duration={String(tour.duration || '12')}
                                countries={countriesText || 'Asia'}
                                itinerary={itineraryText || 'Featured Itinerary'}
                                description={tour.shortDescription || ''}
                                price={tour.price || 2500}
                                featuredImage={tour.featuredImage as any}
                                isFeatured={true}
                            />
                        )
                    })}
                </div>

                <div className="view-more-wrap" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link href="/featured-tours" className="link-st3">VIEW ALL FEATURED TOURS</Link>
                </div>
            </div>
        </section>
    )
}
