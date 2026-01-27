import React from 'react'
import type { Blog, Media } from '../../types'
import { BookingWidget } from '../BookingWidget'

interface BlogBannerProps {
  blog?: Blog
  title?: string   // Override title, defaults to country-based
  subtitle?: string
}

export function BlogBanner({ blog, title, subtitle }: BlogBannerProps) {
  // Extract banner image URL from blog's featuredImage
  let bannerUrl: string | undefined
  if (blog?.featuredImage) {
    const featuredImage = blog.featuredImage
    if (typeof featuredImage === 'object' && featuredImage?.url) {
      bannerUrl = featuredImage.url
    } else if (typeof featuredImage === 'string') {
      bannerUrl = featuredImage
    }
  }
  
  // Determine title/subtitle from blog or relatedCountries
  const firstCountry = blog?.relatedCountries?.[0]
  const countryName = typeof firstCountry === 'object' ? (firstCountry as any).name : 'Travel'
  const bannerTitle = title || blog?.title || `${countryName} Travel Guide`
  const bannerSubtitle = subtitle || blog?.excerpt || 
    "Discover amazing destinations and experiences!"

  return (
    <section className="banner-top mg-bot-0 banner-small">
      <div 
        className="bg-parallax bg-travel-guide"
        style={bannerUrl ? { 
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      />
      <div className="wrap-title-banner-top-line">
        <h2 className="line">{bannerTitle}</h2>
        <p>{bannerSubtitle}</p>
      </div>
      
      {/* Booking Widget inside Hero Section */}
      <BookingWidget />

    </section>
  )
}
