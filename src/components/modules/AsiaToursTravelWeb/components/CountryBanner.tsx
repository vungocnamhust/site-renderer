import React from 'react'
import { BookingWidget } from './BookingWidget'

interface CountryBannerProps {
  bannerUrl: string
  title?: string   // Override title, defaults to country-based
  subtitle?: string
}

export function CountryBanner({ bannerUrl, title, subtitle }: CountryBannerProps) {
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
        <h2 className="line">{title}</h2>
        <p>{subtitle}</p>
      </div>
      
      {/* Booking Widget inside Hero Section */}
      <BookingWidget />

    </section>
  )
}
