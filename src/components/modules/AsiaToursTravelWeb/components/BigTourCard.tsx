import Link from 'next/link'
import type { Media } from '@/payload-types'

interface BigTourCardProps {
  title: string
  slug: string
  duration: string
  countries: string
  itinerary: string
  description: string
  price: number
  featuredImage: string | Media
  expertImage?: string
  isFeatured?: boolean
}

export function BigTourCard({ 
  title,
  slug,
  duration,
  countries,
  itinerary,
  description,
  price,
  featuredImage,
  expertImage = 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/a7.webp',
  isFeatured = true
}: BigTourCardProps) {
  // Extract image URL
  const imageUrl = typeof featuredImage === 'string'
    ? featuredImage
    : featuredImage?.url || '/images/placeholder.webp'
    
  const href = `/tours/${slug}`

  return (
    <div className="big-first-tour-box">
      <div className="head-box">
        <Link href={href} className="img-box-st2" title={title}>
          <img src={imageUrl} alt={title} />
        </Link>
        {isFeatured && <div className="count-day">Featured</div>}
        <h2><Link href={href}>{title}</Link></h2>
        <div className="expert-box">
          <div>
            <h6>AsiaTours Expert</h6>
            <p>We are here to help you</p>
          </div>
          <div>
            <img src={expertImage} alt="Asia Tours Expert" />
          </div>
        </div>
      </div>
      
      <div className="body-box">
        <div className="address-box">
          <div className="day-trip">
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/icon/wrap-img_optimized.png" alt="" />
            <span><b>{duration}</b>Days</span>
          </div>
          <address className="address">
            {itinerary}
          </address>
        </div>
        <button className="btn-st2 tooltip" type="button">
          <i className="icon-font icon-itine"></i>
          <b>{countries}</b>
          <span>{countries}</span>
        </button>
        <p className="paragraph">{description}</p>
      </div>
      
      <div className="foot-trip">
        <div className="hand-picked">
          <span>Handpicked:</span>
          <div>
            <a href="#" className="tooltip tooltip-handpick">
              <div><i className="icon-font bed"></i><span>Hotels</span></div>
              <span>Handpicked Hotels</span>
            </a>
            <a href="#" className="tooltip tooltip-handpick">
              <div><i className="icon-font exchange"></i><i className="icon-font icon-plane"></i><span>Transfer</span></div>
              <span>Private Car & Driver</span>
            </a>
            <a href="#" className="tooltip tooltip-handpick">
              <div><i className="icon-font spoon-knife"></i><span>Meals</span></div>
              <span>Handpicked Restaurants</span>
            </a>
            <a href="#" className="tooltip tooltip-handpick">
              <div><i className="icon-font image"></i><span>Experiences</span></div>
              <span>Tailored Unique Experiences</span>
            </a>
            <a href="#" className="tooltip tooltip-handpick">
              <div><i className="icon-font icon-users"></i><span>Experts</span></div>
              <span>Private Guide & Trip Managers</span>
            </a>
          </div>
        </div>
        <span>Only from <strong>${price}</strong>/ person</span>
        <Link className="btn-st2" href={href}>
          explore this trip <span>→</span>
        </Link>
      </div>
    </div>
  )
}
