
import type { Tour } from '@/payload-types'

interface TourHeroSectionProps {
  tour: Tour
}

export function TourHeroSection({ tour }: TourHeroSectionProps) {
  // Handle Image URL
  const imageUrl =
    typeof tour.featuredImage === 'string'
      ? tour.featuredImage
      : (typeof tour.featuredImage === 'object' && tour.featuredImage?.url)
        ? tour.featuredImage.url
        : 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo-tour/cheerful-vietnam-family-tour-2187-1389-570.jpg'

  // Extract days from duration (e.g., "14 Days / 13 Nights" -> 14)
  const daysMatch = tour.duration?.match(/(\d+)/);
  const days = daysMatch ? daysMatch[1] : '14';
  
  // @ts-ignore - destinations may exist on tour
  const destinationsCount = tour.destinations?.length || 7;

  return (
    <section className="banner-top banner-top-detail mg-bot-0">
      <div className="bg-detail">
        <img className="nolazy" src={imageUrl} alt={tour.title} />
      </div>
      <div className="wrap-title-banner-detail">
        <h1 style={{ width: '83%' }}>{tour.title}</h1>
        <div className="detail-subtitle-box">
          <div className="subtitle">
            {/* @ts-ignore */}
            <strong>{tour.subtitle || 'Private & Tailored Tour'}</strong>
          </div>
          <div className="heart-tour">
            <a href="javascript:;" rel="nofollow" className="heart-tour" title="Like">
              <i className="icon-font heart-empty"></i>
            </a>
          </div>
          <div className="price">
            from<strong>US${tour.price || 2282}</strong>/ Person
          </div>
          <a id="btn-detail-book-tour" className="btn-st2" href="#price-options">
            Choose Budget & Enquiry Now
          </a>
        </div>
        <div className="summary-tour">
          <div>
            <span>Days</span>
            <b>{days}</b>
          </div>
          <div>
            <span>Country</span>
            <b>1</b>
          </div>
          <div>
            <span>Destinations</span>
            <b>{destinationsCount}</b>
          </div>
        </div>
        <div className="wrap-push-down">
          <button type="button"><i className="icon-font select-arrow-thin"></i></button>
        </div>
      </div>
    </section>
  )
}
