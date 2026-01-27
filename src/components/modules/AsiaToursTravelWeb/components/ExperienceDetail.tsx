
import React from 'react'
import Link from 'next/link'
import type { Experience } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react' // Ensure we have a RichText renderer

interface ExperienceDetailProps {
  experience: Experience
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  const { 
    title, 
    location, 
    duration, 
    tags, 
    gallery, 
    image, 
    description, 
    content 
  } = experience

  // Helper to get image URL
  const getImageUrl = (img: any) => {
    if (!img) return '/assets/images/placeholder.jpg'
    return typeof img === 'string' ? img : img.url
  }

  const featuredImg = getImageUrl(image)

  return (
    <div className="experience-detail-container container my-5">
      <div className="row">
        {/* Left Column: Gallery/Image */}
        <div className="col-lg-7 col-md-12 mb-4">
          <div className="experience-main-image mb-3">
             <img 
               src={featuredImg} 
               alt={title} 
               className="w-100 rounded shadow-sm"
               style={{ maxHeight: '500px', objectFit: 'cover' }}
             />
          </div>
          {/* Gallery Thumbnails (if any) */}
          {gallery && gallery.length > 0 && (
            <div className="experience-gallery row g-2">
              {gallery.map((item, idx) => (
                <div key={idx} className="col-3 col-sm-2">
                   <img 
                    src={getImageUrl(item.image)} 
                    alt={item.caption || `Gallery ${idx}`} 
                    className="w-100 rounded cursor-pointer"
                    style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                   />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="col-lg-5 col-md-12">
           <h1 className="title-h1 mb-3">{title}</h1>
           
           <div className="experience-meta mb-4">
              {location && (
                 <div className="meta-item mb-2">
                   <i className="icon-font icon-pin-map text-primary me-2"></i>
                   <span className="fw-bold text-dark">{location}</span>
                 </div>
              )}
              {duration && (
                 <div className="meta-item mb-2">
                   <i className="icon-font icon-clock text-primary me-2"></i>
                   <span>{duration}</span>
                 </div>
              )}
           </div>

           {/* Tags */}
           {tags && tags.length > 0 && (
             <div className="experience-tags mb-4">
               {tags.map((tag, idx) => (
                 <span key={idx} className="badge bg-light text-dark border me-2 mb-2 p-2">
                   {tag.icon && <i className={`${tag.icon} me-1`}></i>}
                   {tag.label}
                 </span>
               ))}
             </div>
           )}

           <div className="experience-summary mb-4 text-secondary">
             <p>{description}</p>
           </div>

           <div className="experience-actions">
              <button className="btn-st2" onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Book This Experience
              </button>
           </div>
        </div>
      </div>

      {/* Detailed Content */}
      <div className="experience-content mt-5">
         <h2 className="title-h2-line mb-4">Detailed Experience</h2>
         <div className="content-body">
            {content && (
              <RichText data={content} />
            )}
            {!content && <p>No detailed content available.</p>}
         </div>
      </div>
    </div>
  )
}
