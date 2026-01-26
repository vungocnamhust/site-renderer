
import Link from 'next/link'
import type { RecentTravelItem } from '../types'

export function CustomerReviewsSection({ items }: { items?: RecentTravelItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <section>
      <div className="wrap-mini-intro">
        <h2 className="title-h2-line">
          Our Customers' Recent Travel Experience
        </h2>
      </div>
      <div className="container recent-travel-block">
        <div className="wrap-recent-travel wrap-slide-st8">
          <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {items.map((item, idx) => {
               const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url
               return (
                <div className="col-xlg-3 col-md-6 col-sm-12 col-xsm-12" key={idx} style={{ marginBottom: '20px' }}>
                  <Link href={item.link || '#'} title={item.title} className="recent-travel-image" target="_blank">
                     {imageUrl && (
                        <img src={imageUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
                     )}
                     <div>
                        <div>
                            <span className="icon-address"><i className="icon-font icon-menu-4"></i></span>
                            <span className="text-address"> {item.location} </span>
                        </div>
                        <div>
                            <span className="text-view-tour">View Tour</span>
                            <span className="icon-view-tour"><i className="icon-font external-link"></i></span>
                        </div>
                     </div>
                  </Link>
                </div>
               )
            })}
          </div>
        </div>
        <div className="view-more-wrap" >
            <Link href="/customers-experiences" title="Customers Recent Travel Experience" className="link-st3">View More Our Customers' Experience</Link>
        </div>
      </div>
    </section>
  )
}
