'use client'

import type { Media } from '@/payload-types'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css' 
import 'slick-carousel/slick/slick-theme.css'
import { BookingWidget } from './BookingWidget'
import type { HeroSection as HeroSectionType } from '../types'

export function HeroSection({ slides }: HeroSectionType) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
  }

  // Fallback if no slides
  if (!slides || slides.length === 0) {
      return null
  }

  return (
    <section className="banner-top-slider">
      <div className="wrap-slide-st7" id="slick-slider-home">
        <Slider {...settings}>
            {slides.map((slide, index) => {
                const imageUrl = typeof slide.image === 'string' 
                    ? slide.image 
                    : slide.image?.url || ''
                
                return (
                    <div key={index} className="gallery">
                        <div className="item">
                            <img 
                                src={imageUrl} 
                                alt={slide.title || 'Asia Tours'} 
                            />
                        </div>
                    </div>
                )
            })}
        </Slider>
      </div>
      
      <div className="wrap-title-banner-top-line">
        <h1>
          <img 
            src="https://d2lwt6tidfiof0.cloudfront.net/images/WTA-logo.png" 
            alt="World Travel Awards" 
            style={{ width: '886px', paddingTop: '10px' }} 
          />
        </h1>
        {/* We can use the first slide's subtitle or a global setting. 
            The schema suggests titles are per slide? 
            Original HTML seemed static overlay. 
            For now, let's use the first slide's subtitle if available, 
            or keep it static if users prefer. 
            But schema has subtitle in slides. 
        */}
        {slides[0]?.subtitle && <p>{slides[0].subtitle}</p>}
      </div>
      
      {/* Booking Widget inside Hero Section */}
      <BookingWidget />
    </section>
  )
}
