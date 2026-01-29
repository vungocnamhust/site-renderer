import Link from 'next/link'
import type { Tour } from '../types'

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  // @ts-ignore - countries is a relationship field
  const countries = (tour as any).countries as any[] || [];
  const firstCountry = countries.length > 0 && typeof countries[0] === 'object' ? countries[0] : null;
  const countrySlug = firstCountry?.slug || 'vietnam';
  const countryName = firstCountry?.name || 'Asia';

  // Construct URL
  const href = countrySlug
    ? `/${countrySlug}/tours/${tour.slug}`
    : `/tours/${tour.slug}`

  // Image URL handling
  const imageUrl = typeof tour.featuredImage === 'string'
    ? tour.featuredImage
    : typeof tour.featuredImage === 'object' && tour.featuredImage !== null
      ? (tour.featuredImage as { url?: string }).url || '/images/asiatours/placeholder.webp'
      : '/images/asiatours/placeholder.webp'

  const price = tour.price ? `$${tour.price}` : 'Contact us'

  return (
    <article className="trip trip-itine">
      <Link href={href} title={tour.title}>
        <img src={imageUrl} alt={tour.title} className="w-full h-auto object-cover" />
      </Link>
      <div className="content-trip">
        <h3 className="title-h2-line">
          <Link href={href}>{tour.title}</Link>
        </h3>
        <span>{tour.duration || 'N/A'} from <strong>{price}</strong>/ person</span>
        <p className="paragraph line-clamp-3">
          {tour.shortDescription || 'Experience the beauty of Asia with our tailored tour package.'}
        </p>
      </div>
      <div className="count-day">
        {countryName}
      </div>

      {/* Tooltip wrapper (Simplified for now) */}
      <div className="wrap-tooltip">
        <a href="#" title="Cultural" className="tooltip"><i className="icon-font icon-cultural"></i><span>cultural<i></i></span></a>
        <a href="#" title="Heritage" className="tooltip"><i className="icon-font icon-heritage"></i><span>heritage<i></i></span></a>
      </div>

      <Link className="btn-st2" href={href}>explore this trip</Link>
    </article>
  )
}
