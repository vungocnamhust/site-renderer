import type { Media } from '../types'

interface CountryBannerProps {
  title: string
  subtitle?: string
  backgroundImage: string | Media
}

export function CountryBanner({ title, subtitle, backgroundImage }: CountryBannerProps) {
  const bgUrl = typeof backgroundImage === 'string' 
    ? backgroundImage 
    : backgroundImage?.url || ''

  return (
    <section className="banner-top banner-small-2 banner-country-2">
      <div 
        className="bg-detail" 
        style={{ backgroundImage: `url(${bgUrl})` }}
      ></div>
      <div className="wrap-title-banner-top-line">
        <h1 className="title-h1">{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
    </section>
  )
}
