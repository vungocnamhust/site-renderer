
'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TourStyleItem } from '../types'

export function TourStylesSection({ items }: { items?: TourStyleItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items || items.length === 0) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const activeItem = items[currentIndex]
  const imageUrl = typeof activeItem.image === 'string' ? activeItem.image : activeItem.image?.url

  return (
    <section className="mg-bottom mg-top-0">
      <h2 className="title-h2-line">ASIA TOURS BY STYLES</h2>
      
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="arrow-radius"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            fontSize: '40px',
            color: '#ccc',
            cursor: 'pointer'
          }}
        >
          <i className="icon-font select-arrow-thin" style={{ transform: 'rotate(90deg)', display: 'block' }}></i>
        </button>

        <button 
          onClick={nextSlide}
          className="arrow-radius"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            fontSize: '40px',
            color: '#ccc',
            cursor: 'pointer'
          }}
        >
          <i className="icon-font select-arrow-thin" style={{ transform: 'rotate(-90deg)', display: 'block' }}></i>
        </button>

        <div className="wrap-slide-st1">
          <div className="synch-carousels">
             <div className="item-active" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <Link href={activeItem.link || '#'} title={activeItem.title} style={{ display: 'block', position: 'relative' }}>
                  <div style={{ position: 'relative', width: '100%', height: '600px', overflow: 'hidden' }}>
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={activeItem.title} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                    )}
                  </div>
                  
                  {/* Overlay or Text Below - Reference image shows text below with "View itineraries" link */}
                  <div className="box-text" style={{ marginTop: '20px' }}>
                    {/* The reference image shows the title ABOVE the image or as a section header, but let's keep it consistent with design if inside */}
                  </div>
                </Link>

                <div className="paragraph" style={{ marginTop: '20px', fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                  {activeItem.description}
                </div>
                
                <Link href={activeItem.link || '#'} className="link-st3" style={{ marginTop: '15px', display: 'inline-block' }}>
                  View itineraries
                </Link>
             </div>
          </div>
        </div>
        
        {/* Dots/Indicators optional if needed */}
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {items.map((_, idx) => (
            <span 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: idx === currentIndex ? '#d0b316' : '#ccc',
                cursor: 'pointer',
                display: 'block'
              }}
            ></span>
          ))}
        </div>

      </div>
    </section>
  )
}
