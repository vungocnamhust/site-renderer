
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
          <div className="synch-carousels">
            <div className="gallery" style={{ display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '20px' }}>
              {items.map((item, idx) => {
                 const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url
                 return (
                  <div className="item" key={idx} style={{ minWidth: '350px', flex: '0 0 auto' }}>
                    <div className="theme-slide-img">
                      <Link href={item.link || '#'} title={item.title}>
                        {imageUrl && (
                          <img src={imageUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
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
                 )
              })}
            </div>
            
            <div className="view-more-wrap">
              <Link href="/experiences" className="arrow-radius">
                  <i className="icon-font select-arrow-thin"></i>
              </Link>
              <Link href="/experiences" className="link-st3" title="All Tour Experiences">Click to view more experiences</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
