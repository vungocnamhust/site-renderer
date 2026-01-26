/**
 * BasicLandingPage Module Component
 * 
 * Server Component cho Landing Page tĩnh.
 * Render HTML hoàn chỉnh từ dữ liệu CMS.
 */

import styles from './styles.module.css'
import type { Media } from '@/payload-types'

interface Feature {
  icon?: string
  title: string
  description?: string
}

interface CTAButton {
  text?: string
  link?: string
}

interface ContactInfo {
  email?: string
  phone?: string
  address?: string
}

interface BasicLandingPageData {
  heroTitle: string
  heroSubtitle?: string
  heroBanner?: Media | string
  ctaButton?: CTAButton
  features?: Feature[]
  contactInfo?: ContactInfo
  footerText?: string
}

export function BasicLandingPage({ data }: { data: BasicLandingPageData }) {
  const {
    heroTitle,
    heroSubtitle,
    heroBanner,
    ctaButton,
    features,
    contactInfo,
    footerText,
  } = data || {}

  // Get banner URL
  const bannerUrl = typeof heroBanner === 'object' ? heroBanner?.url : heroBanner

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section 
        className={styles.hero}
        style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{heroTitle}</h1>
            {heroSubtitle && (
              <p className={styles.heroSubtitle}>{heroSubtitle}</p>
            )}
            {ctaButton?.text && (
              <a href={ctaButton.link || '#'} className={styles.ctaButton}>
                {ctaButton.text}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className={styles.features}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                {feature.icon && (
                  <span className={styles.featureIcon}>{feature.icon}</span>
                )}
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                {feature.description && (
                  <p className={styles.featureDescription}>{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contactInfo && (contactInfo.email || contactInfo.phone || contactInfo.address) && (
        <section id="contact" className={styles.contact}>
          <h2 className={styles.contactTitle}>Liên hệ</h2>
          <div className={styles.contactInfo}>
            {contactInfo.email && (
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </p>
            )}
            {contactInfo.phone && (
              <p>
                <strong>Điện thoại:</strong>{' '}
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </p>
            )}
            {contactInfo.address && (
              <p>
                <strong>Địa chỉ:</strong> {contactInfo.address}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>{footerText || '© 2025 All rights reserved.'}</p>
      </footer>
    </div>
  )
}

export default BasicLandingPage
