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
    <article className="big-first-tour-box" style={{
      background: '#fff',
      borderRadius: '0',
      overflow: 'hidden',
      marginBottom: '50px',
      boxShadow: '0 15px 45px rgba(0,0,0,0.07)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div className="head-box" style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
        <Link href={href} className="img-box-st2" title={title} style={{ width: '100%', height: '100%', display: 'block' }}>
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease'
            }}
            className="tour-banner-img"
          />
        </Link>

        {isFeatured && (
          <div className="count-day" style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            background: '#d0b316',
            color: '#fff',
            padding: '8px 24px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            zIndex: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Featured
          </div>
        )}

        <div className="heart-tour" style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          zIndex: 10,
          fontSize: '32px',
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}>
          <i className="icon-font icon-heart-o"></i>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '80px 40px 40px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          zIndex: 5
        }}>
          <h2 style={{ margin: 0, maxWidth: '70%' }}>
            <Link href={href} style={{
              color: '#fff',
              fontSize: '40px',
              fontWeight: '800',
              textTransform: 'none',
              lineHeight: '1.2',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 15px rgba(0,0,0,0.6)'
            }}>
              {title}
            </Link>
          </h2>

          <div className="expert-box" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#fff',
            textAlign: 'right',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '10px 15px',
            borderRadius: '50px',
            backdropFilter: 'blur(5px)'
          }}>
            <div>
              <h6 style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>ASIATOURS EXPERT</h6>
              <p style={{ margin: 0, fontSize: '10px', opacity: 0.8, fontWeight: '600' }}>We are here to help you</p>
            </div>
            <img src={expertImage} alt="Expert" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
          </div>
        </div>
      </div>

      <div className="body-box" style={{ padding: '45px 40px', borderBottom: '1px dashed #e0e0e0' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          <div className="day-trip" style={{
            minWidth: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '10px solid #f2f2f2',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#d0b316',
            lineHeight: '1.2',
            flexShrink: 0,
            gap: '2px'
          }}>
            <span style={{ position: 'static', fontSize: '28px', fontWeight: '900', display: 'block' }}>{duration}</span>
            <span style={{ position: 'static', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', display: 'block' }}>DAYS</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div style={{ fontSize: '17px', color: '#777', lineHeight: '1.6', fontWeight: '600', flex: 1, paddingRight: '20px' }}>
                {itinerary}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '12px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                <i className="icon-font icon-destination" style={{ fontSize: '24px', color: '#d0b316' }}></i>
                <span>{countries}</span>
              </div>
            </div>

            <p className="paragraph" style={{
              margin: 0,
              fontSize: '17px',
              color: '#444',
              lineHeight: '1.8',
              fontWeight: '400'
            }}>{description}</p>
          </div>
        </div>
      </div>

      <div className="foot-trip" style={{ padding: '35px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', color: '#d0b316', fontWeight: '800', letterSpacing: '1px' }}>
          ONLY FROM <strong style={{ fontSize: '28px', fontWeight: '900' }}>${price}</strong> / PERSON
        </div>
        <Link
          href={href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 45px',
            border: '1.5px solid #d0d0d0',
            borderRadius: '40px',
            color: '#333',
            fontSize: '14px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'transparent'
          }}
          className="btn-explore-trip"
        >
          explore this trip <span style={{ marginLeft: '12px', fontSize: '18px' }}>→</span>
        </Link>
      </div>
    </article>
  )
}
