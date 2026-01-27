
import type { AsiaToursTravelWebData } from '../types'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BestSupportSection } from '../components/BestSupportSection'
import { ExperienceDetail } from '../components/ExperienceDetail'
import { InquiryFormSection } from '../components/InquiryFormSection'
import { FaqSection } from '../components/FaqSection'
import { CustomerReviewsSection } from '../components/CustomerReviewsSection'
import { notFound } from 'next/navigation'
import { getExperienceBySlug } from '../lib/api'

interface ExperienceDetailPageProps {
  data: AsiaToursTravelWebData
  slug: string
}

export async function ExperienceDetailPage({ data, slug }: ExperienceDetailPageProps) {
  const { siteSettings, navigation, footer } = data
  
  // Fetch Experience Data
  const experience = await getExperienceBySlug(slug)

  if (!experience) {
    return notFound()
  }

  return (
    <div className="app">
      <Header data={siteSettings} navigation={navigation} tourStyles={data.tourStyles} />
      
      <main>
        {/* Detail Organism includes its own Hero/Title structure usually, or we can add a Breadcrumb here */}
        <div className="bg-light py-3">
            <div className="container">
                <span className="text-muted small">Home / Experiences / {experience.title}</span>
            </div>
        </div>

        <ExperienceDetail experience={experience} />
        
        {/* Section: Inquiry Form */}
        <div id="inquiry-form">
            <InquiryFormSection />
        </div>

        {/* Section: Best Support */}
        <BestSupportSection />

        {/* Section: FAQs */}
        <FaqSection items={data.faqs} />

        {/* Section: Customer Reviews */}
        <CustomerReviewsSection items={data.recentTravels} />
      </main>

      <Footer data={footer} />
    </div>
  )
}
