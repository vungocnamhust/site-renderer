
import Link from 'next/link'
import { TourCard } from './TourCard'
import type { Tour } from '../types'

interface FeaturedToursGridProps {
  title?: string
  subtitle?: string
  tours: (Tour | string)[]
}

export function FeaturedToursGrid({ 
  title = 'Most Popular Multi-Country Asia Tours',
  subtitle = 'Our carefully curated selection showcases the very best multi-country experiences this diverse continent has to offer.',
  tours 
}: FeaturedToursGridProps) {
  return (
    <section className="list-trip mg-top-0">
      <div className="wrap-mini-intro" style={{ width: '75%', paddingBottom: '20px' }}>
        <h2 className="title-h2-line">{title}</h2>
        <div className="paragraph-hide">
          <p className="paragraph">{subtitle}</p>
        </div>
      </div>
      
      <div className="container">
        {tours && tours.length > 0 ? (
          tours.map((tour, idx) => {
            if (typeof tour === 'string') return null
            
            return (
              <div className="col-xlg-4 col-lg-6 col-md-12" key={tour.id || idx} style={{ marginBottom: '20px' }}>
                <TourCard tour={tour} />
              </div>
            )
          })
        ) : (
          <div className="text-center p-10">
            <p>No featured tours available. Please add tours in the CMS.</p>
          </div>
        )}
        
        <div className="view-more-wrap">
          <Link href="/best-tours" className="link-st3">VIEW ALL TOURS</Link>
        </div>
      </div>
    </section>
  )
}
