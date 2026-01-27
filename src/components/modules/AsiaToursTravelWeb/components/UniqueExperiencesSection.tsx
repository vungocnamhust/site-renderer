
import Link from 'next/link'
import type { UniqueExperienceItem } from '../types'

export function UniqueExperiencesSection({ items }: { items?: UniqueExperienceItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <section>
      <div className="wrap-mini-intro">
        <h2 className="title-h2-line">The authentic & unique experiences in asia<br />you can expect</h2>
        <p className="paragraph">Home to some of the world's most ancient cultures and captivating destinations, Asia is a wonderful land of diverse beauty and uniqueness that offers a variety of dreamy journeys for every type of traveler.</p>
      </div>
      <div className="container">
        <div className="wrap-slide-st2">
          {/* Changed from inline flex carousel to Responsive Grid */}
          <div className="row justify-content-center">
            {items.map((item, idx) => {
               const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url
               return (
                <div className="col-xlg-4 col-lg-6 col-md-12 mb-5" key={idx}>
                  <div className="item">
                    <div className="theme-slide-img">
                      <Link href={item.link || '#'} title={item.title}>
                        {imageUrl && (
                          <img src={imageUrl} alt={item.title} className="w-100 h-auto" style={{ objectFit: 'cover' }} />
                        )}
                      </Link>
                    </div>
                    <div className="theme-slide-text">
                      <div className="type-rotate">{item.location}</div>
                      <Link href="#" title={`${item.country} Tours`}>{item.country}</Link>
                      <h3>
                        <Link href={item.link || '#'} title={item.title}>{item.title}</Link>
                      </h3>
                      <p>{item.description}</p>
                      <div className="box-button">
                        <Link href={item.link || '#'} className="link-st3" title={item.title}>View More Info</Link>
                      </div>
                    </div>
                  </div>
                </div>
               )
            })}
          </div>
            
          <div className="view-more-wrap text-center mt-5">
            <Link href="/experiences" className="arrow-radius">
                <i className="icon-font select-arrow-thin"></i>
            </Link>
            <div className="mt-2">
              <Link href="/experiences" className="link-st3" title="All Tour Experiences">Click to view more experiences</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
