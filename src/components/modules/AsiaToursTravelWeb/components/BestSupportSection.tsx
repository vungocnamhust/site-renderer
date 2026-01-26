import type { BestSupportItem } from '../types'
import type { Media } from '@/payload-types'

interface BestSupportSectionProps {
  teamQuoteImages?: string[]
  tagline?: string
  awardsImage?: string
  highlights?: BestSupportItem[]
}

export function BestSupportSection({ 
  teamQuoteImages,
  tagline,
  awardsImage,
  highlights 
}: BestSupportSectionProps) {
  // Default team images
  const defaultTeamImages = ['a12', 'a2', 'a3', 'a5', 'a6', 'a10'].map(
    img => `https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/${img}.webp`
  )
  
  const teamImages = teamQuoteImages || defaultTeamImages
  
  // Default highlights matching asiatours.com
  const defaultHighlights: BestSupportItem[] = [
    {
      icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h1.webp',
      title: '100% Personalized Itinerary',
      description: 'Hassle-free and uniquely personalized! You\'ll get a completely flexible trip plan tailored to your individual interests, wishes and budget. Our Inside Travel Experts will give you professional advice, and it\'s you who decides how many days to travel, where to visit and where to stay.'
    },
    {
      icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h2.webp',
      title: 'Private Guide, Car & Driver',
      description: 'You always have private driver & private car flexible upon your travel schedules. Especially, in your Private Tour, our experienced and knowledgeable private guide will show you the hidden gems and inspire you with the most interesting local stories to gain a more in-depth understanding of each exotic country.'
    },
    {
      icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h3.webp',
      title: 'Handpicked Hotels & Meals',
      description: 'Whether you are looking for a romantic resort or a boutique hotel, authentic cuisine or street food style; our Asia Tour Experts\'ll create the lifetime journey around your needs & wants with our best hand-picked collection of accommodation and restaurants.'
    },
    {
      icon: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h4.webp',
      title: 'Trip Managing Experts',
      description: 'Travelling with us means having a dedicated, friendly & professional team by your side every step of the way and always ready to help whenever you need. Our Inside Travel Experts are available 24/7 and take care of everything to make sure you can enjoy the travel experience of a lifetime and get unforgettable memories.'
    }
  ]
  
  const serviceHighlights = highlights || defaultHighlights
  
  const defaultTagline = 'We are proudly Asia Tour Experts'
  const defaultAwardsImage = 'https://d2lwt6tidfiof0.cloudfront.net/images/asia-geo-post-wta.png'

  return (
    <section className="best-support">
      <div className="wrap-mini-intro wrap-mini-intro-st2">
        {/* Team Quote Images */}
        <div className="team-quote">
          {teamImages.map((img, idx) => (
            <img key={idx} src={img} alt="Expert" />
          ))}
        </div>
        
        <h1 className="team-name line">
          {tagline || defaultTagline}
          <br /> 
          Specializing in <b>Asia Private Tours</b> & Tailored Travel
          <br />
          <img 
            src={awardsImage || defaultAwardsImage}
            style={{ width: '886px', paddingTop: '10px' }} 
            alt="Awards" 
          />
        </h1>
      </div>
      
      <div className="container">
        {serviceHighlights.map((highlight, idx) => {
            const iconUrl = typeof highlight.icon === 'string'
                ? highlight.icon
                : (highlight.icon as Media)?.url || ''

            return (
                <div key={idx} className="col-xlg-3 col-sm-6">
                    <img 
                    src={iconUrl} 
                    alt={highlight.title}
                    style={idx === 1 ? { paddingBottom: '8px' } : undefined}
                    />
                    <article>
                    <h3>{highlight.title}</h3>
                    <p className="paragraph">{highlight.description}</p>
                    </article>
                </div>
            )
        })}
      </div>
    </section>
  )
}
