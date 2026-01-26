
import Link from 'next/link'
import { TourCard } from './TourCard' // We might need to adjust TourCard styling via props or create a new WideTourCard if existing one is strictly grid-boxed
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
        <h2 className="title-h2-line">{title}</h2>
        
        <div className="container" style={{maxWidth: '1200px'}}>
            {/* 
               The reference image shows a vertical stack of wide cards.
               Each card takes full width of the container. 
            */}
            {tours.map((tour, idx) => {
                if (typeof tour === 'string') return null
                
                // Using a wide layout wrapper for the card
                return (
                    <div key={tour.id || idx} className="row-list-trip" style={{ marginBottom: '40px' }}>
                        <div className="col-12" style={{ padding: 0 }}>
                             {/* 
                                Reuse TourCard but force it to behave in a "wide" or "list" context if supported.
                                If TourCard is strictly column-based, we might need custom markup here matching the image.
                                The image shows: Huge image, Title overlay Top-Left (or similar), bottom white bar not seen or very subtle.
                                Actually the image shows FULL WIDTH BANNER style cards. 
                                Let's assume standard TourCard for now but styled widely, or create simple markup mimicking the image.
                             */}
                             <div className="trip-box" style={{ width: '100%', display: 'block' }}>
                                <div className="box-img" style={{ height: '400px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                                    <Link href={`/tours/${tour.slug}`}>
                                        {/* Handle image safely */}
                                        {(() => {
                                            const imageUrl = typeof tour.featuredImage === 'string' 
                                                ? tour.featuredImage 
                                                : (typeof tour.featuredImage === 'object' && tour.featuredImage?.url) 
                                                ? tour.featuredImage.url 
                                                : '/images/placeholder.jpg'
                                            
                                            return <img src={imageUrl} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        })()}
                                        
                                        {/* Duration Label */}
                                        <div className="day-tour" style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#d0b316', color:'#fff', padding: '5px 15px', fontWeight: 'bold' }}>
                                            {tour.duration || 'N/A'}
                                        </div>

                                        {/* Title Overlay or Bottom Bar */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                            padding: '20px',
                                            color: '#fff'
                                        }}>
                                            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{tour.title}</h3>
                                            <div style={{ marginTop: '10px', display: 'flex', gap: '15px', fontSize: '14px' }}>
                                                 {/* Simple location/price if needed */}
                                                 {/* @ts-ignore */}
                                                 {tour.countries && <span><i className="icon-font icon-destination"></i> {tour.countries.join(', ')}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="box-text-content" style={{ padding: '20px', border: '1px solid #eee', borderTop: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     {/* Additional info line below image if desired, or keep it clean like typical list views */}
                                     {/* Based on the user image (which is very tall/vertical stack), it usually has some summary text below. */}
                                     <div className="left-info">
                                         {/* Reviews or short text */}
                                         <p style={{margin:0, color:'#666'}}>{tour.shortDescription?.substring(0, 150)}...</p>
                                     </div>
                                     <div className="right-action">
                                         <Link href={`/tours/${tour.slug}`} className="btn-st2">View Details</Link>
                                     </div>
                                </div>
                             </div>
                        </div>
                    </div>
                )
            })}
            
             <div className="view-more-wrap">
                <Link href="/featured-tours" className="link-st3">VIEW ALL FEATURED TOURS</Link>
             </div>
        </div>
    </section>
  )
}
