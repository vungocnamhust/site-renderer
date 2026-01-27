import type { AsiaToursTravelWebData, HeroSlide } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { BestSupportSection } from '../components/BestSupportSection'
import { AboutSection } from '../components/AboutSection'
import { FeaturedToursSection } from '../components/FeaturedToursSection'
import { FeaturedToursGrid } from '../components/FeaturedToursGrid'
import { TourStylesSection } from '../components/TourStylesSection'
import { InquiryFormSection } from '../components/InquiryFormSection'
import { UniqueExperiencesSection } from '../components/UniqueExperiencesSection'
import { TravelGuideSection } from '../components/TravelGuideSection'
import { FaqSection } from '../components/FaqSection'
import { CustomerReviewsSection } from '../components/CustomerReviewsSection'
import { LocalExperiencesSection } from '../components/LocalExperiencesSection'
import { COUNTRIES } from '../data/countries'
import { notFound } from 'next/navigation'
import { getToursByCountry, getFaqsByCountry } from '../lib/api'
import { lexicalToString } from '../lib/utils'
import type { Tour } from '@/payload-types' 

interface CountryToursPageProps {
  data: AsiaToursTravelWebData
  countrySlug: string
}

export async function CountryToursPage({ data, countrySlug }: CountryToursPageProps) {
  const { siteSettings, navigation, footer } = data
  
  // Find country data from mock or props
  const country = COUNTRIES[countrySlug]

  if (!country) {
    return notFound()
  }

  // Fetch Tours for this Country
  const allTours = await getToursByCountry(countrySlug)
  
  // Fetch FAQs for this Country
  const faqsDocs = await getFaqsByCountry(countrySlug)
  const faqs = faqsDocs.map(f => ({
      question: f.question,
      answer: lexicalToString(f.answer)
  }))
  
  const faqsToDisplay = faqs.length > 0 ? faqs : data.faqs

  // 1. Filter Feature Tours (isFeatured = true)
  const featuredTours = allTours.filter(t => t.isFeatured)

  // 2. Group Tours by Category
  const categoriesMap = new Map<string, { title: string, tours: Tour[] }>()

  allTours.forEach(tour => {
    if (tour.categories && Array.isArray(tour.categories)) {
      tour.categories.forEach(cat => {
        // Ensure category is populated (object) and has a title
        if (typeof cat === 'object' && cat !== null && 'title' in cat) {
          const catId = String(cat.id) // Using ID as map key
          const catTitle = cat.title
          
          if (!categoriesMap.has(catId)) {
            categoriesMap.set(catId, { title: catTitle, tours: [] })
          }
          // Avoid duplicates if needed, but simple push is okay for now
          // Check if tour is already in this category list to be safe?
          // (Usually not needed if iterating tours once, but a tour belongs to cat X once)
          categoriesMap.get(catId)!.tours.push(tour)
        }
      })
    }
  })

  // Sort categories if needed? Map order is insertion order usually.
  const categorySections = Array.from(categoriesMap.values())

  // Construct Hero Slides from Country Data
  const heroSlides: HeroSlide[] = [{
    image: country.bannerImage,
    title: country.title,
    subtitle: country.subtitle,
    // link: '#' // Optional
  }]

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        {/* Section 1: Hero Banner (Using Country Data) */}
        <HeroSection slides={heroSlides} />
        
        {/* Section 2: Best Support (Generic) */}
        <BestSupportSection />
        
        {/* Section 3: About (Generic - keeping layout consistency) */}
        <AboutSection />

        {/* Section 4: Featured Tours (Country Specific) */}
        {featuredTours.length > 0 && (
          <FeaturedToursSection tours={featuredTours} />
        )}

        {/* Section 5+: Dynamic Category Sections */}
        {categorySections.map((cat, idx) => (
          <FeaturedToursGrid 
            key={idx}
            tours={cat.tours}
            title={`${country.title} - ${cat.title}`}
            subtitle={`Explore our best ${cat.title} in ${country.title}`}
          />
        ))}
        
        {/* Fallback if no tours found */}
        {allTours.length === 0 && (
           <div className="container text-center p-10">
             <p>Coming soon: Tours for {country.title}</p>
           </div>
        )}

        {/* Section 6: Asia Tours by Styles (Global) */}
        <TourStylesSection items={data.tourStyles} />

        {/* Section 7: Inquiry Form (Global) */}
        <InquiryFormSection />

        {/* Section 8: Unique Experiences (Global) */}
        <UniqueExperiencesSection items={data.uniqueExperiences} />

        {/* Section 9: Travel Guide & Inspirations (Global) */}
        <TravelGuideSection items={data.featuredBlogs} />

        {/* Section 10: FAQs (Global) */}
        <FaqSection items={faqsToDisplay} />

        {/* Section 11: Customer Reviews (Global) */}
        <CustomerReviewsSection items={data.recentTravels} />

        {/* Section 12: Real Local Experiences (Global) */}
        <LocalExperiencesSection data={data.locExp} />
      </main>

      <Footer data={footer} />
    </div>
  )
}
