
'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Slider from 'react-slick'
import { Experience, Media, Tour } from '@/payload-types'
import { TourCard } from '../TourCard'

// Slick slider styles should be imported globally or here if needed, 
// but assuming they are present in the project as per reference HTML links.
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

interface ExperienceDetailProps {
  experience: Experience
  relatedTours: Tour[]
}

const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <button className={`arrow-right slick-arrow ${className}`} style={{ ...style, display: "block" }} onClick={onClick}>
            <i className="icon-font select-arrow-thin"></i>
        </button>
    );
};

const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
        <button className={`arrow-left slick-arrow ${className}`} style={{ ...style, display: "block" }} onClick={onClick}>
            <i className="icon-font select-arrow-thin"></i>
        </button>
    );
};


export function ExperienceDetail({ experience, relatedTours }: ExperienceDetailProps) {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
  };

  const galleryImages = experience.gallery?.map(item => {
    const img = item.image
    if (typeof img === 'string') return { url: img, alt: item.caption || experience.title }
    return { url: (img as Media)?.url || '', alt: item.caption || experience.title }
  }) || []

  // Ensure unique Key for list rendering
  const uniqueTours = relatedTours.filter((tour, index, self) =>
    index === self.findIndex((t) => t.id === tour.id)
  )

  return (
    <>
      <section className="experience-dt-container opacity-background" style={{ backgroundImage: "url('https://d2lwt6tidfiof0.cloudfront.net/images/icon/icon-experience.svg')" }}>
        <article className="wrap-mini-intro">
          <div className="desti">{experience.location || 'Vietnam'}, {experience.country ? experience.country.charAt(0).toUpperCase() + experience.country.slice(1) : ''}</div>
          <h1 className="title-h2">{experience.title}</h1>
          
          {experience.tags && experience.tags.length > 0 && (
            <div className="wrap-tooltip">
              {experience.tags.map((tag, idx) => (
                <a key={idx} href="javascript:;" title={tag.label} className="tooltip">
                  {tag.icon && <i className={`icon-font ${tag.icon}`}></i>}
                  <span>{tag.label.toLowerCase()}<i></i></span>
                </a>
              ))}
            </div>
          )}

          <div className="paragraph">
             {experience.short_description}
          </div>

          {galleryImages.length > 0 && (
            <div className="wrap-media-st2">
              <div className="wrap-slide-st9">
                <div className="synch-carousels" id="slide-st-exp-0">
                  <Slider {...sliderSettings} className="gallery">
                    {galleryImages.map((img, idx) => (
                      <div className="item" key={idx}>
                        <a href="javascript:;">
                            <div style={{ position: 'relative', width: '100%', height: '388px' }}>
                                <Image 
                                    src={img.url} 
                                    alt={img.alt} 
                                    fill 
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </a>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          )}

          <div className="view-out">
             {uniqueTours.length > 0 && (
                <a href="#related-tours" id="btn-detail-exp-tour" className="link-st3">View tours with this experience<i className="icon-font external-link"></i></a>
             )}
            <Link href="/experiences" id="btn-detail-exp" className="link-st3">View Other Experiences<i className="icon-font external-link"></i></Link>
          </div>
        </article>
      </section>

      {uniqueTours.length > 0 && (
        <section className="list-trip" id="related-tours">
          <div className="wrap-mini-intro">
            <h2 id="div-detail-exp-tour" className="title-h2-line">Vietnam Tours with this experience</h2>
            <p className="paragraph">All Vietnam tours can be privately customized & designed to suit your personal desire: budget, travel schedules, destinations, special requirements...</p>
          </div>
          
          <div className="container">
            {/* Filter UI - Omitted for now as per task scope, focusing on display first. Can be added later if needed. */}
             
             {/* Tours List */}
             {/* Using a grid layout similar to reference */}
             <div className="row"> 
                 {uniqueTours.map((tour) => (
                     <div key={tour.id} className="col-xlg-4 col-md-6 col-sm-12 mg-bot-30">
                        <TourCard tour={tour} />
                     </div>
                 ))}
             </div>

             <div className="booking-step-submit" style={{ textAlign: 'center', marginTop: '30px' }}>
                <a className="btn-st3 btn-create-trip" href="/tours/search">Customize Tours</a>
             </div>
             
          </div>
           
           <div className="container" style={{ textAlign: 'center', marginTop: '40px' }}>
             <button className="btn-st3 btn-create-trip">Build Your Own Trip</button>
           </div>
        </section>
      )}
    </>
  )
}
