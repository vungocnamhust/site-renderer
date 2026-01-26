'use client'

import Link from 'next/link'
import { useState } from 'react'

interface CountryDestination {
  name: string
  slug: string
  tagline: string
  description: string
  backgroundImage: string
}

interface CountryMapCarouselProps {
  destinations?: CountryDestination[]
  mapImage?: string
}

const defaultDestinations: CountryDestination[] = [
  {
    name: 'Vietnam',
    slug: 'vietnam',
    tagline: 'The Land of Timeless Charm',
    description: 'Charming beaches, breathtaking scenery, outstanding caves, golden terraced rice fields, rich history, cultural diversity, delicious and healthy cuisine. Vietnam is a country situating on the Indochina Peninsula in Southeast Asia where is the home to many fantastic destinations...',
    backgroundImage: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/bg-map-vietnam.jpg'
  },
  {
    name: 'Cambodia',
    slug: 'cambodia',
    tagline: 'The Land of Temples and Towers',
    description: 'Awe-inspiring famous ruins & temples (Angkor Wat Complex), turbulent past, laidback islands, untouched jungles, rich heritage & natural beauty. Cambodia, the Kingdom of Wonder, situates to the South portion of the Indochina Peninsula. The country is known to be the Khmer...',
    backgroundImage: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/bg-map-cambodia.jpg'
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    tagline: 'The Land of Smiles',
    description: 'Crystal turquoise beaches & luxury bungalows/hotels, ancient monasteries, off-the-beaten trekking adventure, delicious & tasty food and meditation retreat. Thailand, "Land of Smile", is regarded as one of the most attractive destinations in Southeast Asia...',
    backgroundImage: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/bg-map-thailand.jpg'
  },
  {
    name: 'Laos',
    slug: 'laos',
    tagline: 'The Land of a Million Elephants',
    description: 'Ancient temples, stunning waterfalls, friendly locals, and peaceful Buddhist culture. Laos offers a more laid-back travel experience with its rich heritage and natural beauty...',
    backgroundImage: 'https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/bg-map-laos.jpg'
  }
]

export function CountryMapCarousel({ 
  destinations = defaultDestinations,
  mapImage = 'https://d2lwt6tidfiof0.cloudfront.net/images/map-h.webp'
}: CountryMapCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? destinations.length - 1 : prev - 1))
  }
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === destinations.length - 1 ? 0 : prev + 1))
  }
  
  const current = destinations[currentIndex]

  return (
    <div className="wrap-map-st2">
      <div className="map-home">
        <img className="nolazy" src={mapImage} alt="map-sea" />
        <div className="synch-carousels" id="slick-slider-map">
          <div className="gallery">
            <div className="item">
              <Link href={`/${current.slug}/tours`} title={`${current.name} Tours`}>
                <img 
                  src={current.backgroundImage} 
                  alt={current.name} 
                />
              </Link>
              <article>
                <h3>
                  <Link href={`/${current.slug}/tours`} title={`${current.name} Tours`}>
                    {current.name}
                  </Link>
                </h3>
                <h4>{current.tagline}</h4>
                <p className="paragraph">{current.description}</p>
              </article>
              <Link 
                href={`/${current.slug}/tours`} 
                title={`${current.name} Tours`} 
                className="link-st3"
              >
                Discover more
              </Link>
            </div>
          </div>
          <div className="nav-arrows">
            <button className="arrow-left" onClick={handlePrev}>
              <i className="icon-font select-arrow-thin"></i>
            </button>
            <span>
              <strong>{currentIndex + 1}</strong> of {destinations.length} Destinations
            </span>
            <button className="arrow-right" onClick={handleNext}>
              <i className="icon-font select-arrow-thin"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
