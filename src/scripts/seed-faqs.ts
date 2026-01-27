import { getPayload } from 'payload'
import config from '../payload.config'

/** Lexical JSON builder for the answer field */
function buildLexicalAnswer(paragraphs: string[]) {
  const children = paragraphs.map(text => ({
    type: 'paragraph',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal' as const,
        style: '',
        text,
        type: 'text',
        version: 1,
      },
    ],
  }))

  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children,
    },
  }
}

interface FaqSeedData {
  question: string
  answer: string[]
  is_general?: boolean
  countries?: number[]
  tour_categories?: number[]
  order?: number
}

/**
 * FAQ Seed Data
 * - Countries: Vietnam=1, Laos=2, Thailand=3, Cambodia=4
 * - Categories: Best=1, Classic=2, Family=3, Beach=4, Luxury=5, Honeymoon=6, Active=7, Cruise=8, Day Trips=9, Special=10, Culinary=11, Local Life=12, Nature=13
 */
const faqsData: FaqSeedData[] = [
  // ====== GENERAL / HOME PAGE FAQs ======
  {
    question: 'What is the best time to visit Southeast Asia?',
    answer: [
      'The best time to visit Southeast Asia varies by region, but generally, the dry season from November to April is ideal for most countries.',
      'Vietnam has regional variations: North is best from October to April, while the South is pleasant year-round.',
    ],
    is_general: true,
    order: 1,
  },
  {
    question: 'Do I need a visa to travel in Asia?',
    answer: [
      'Visa requirements vary by nationality and destination. Many Southeast Asian countries offer visa-free entry or visa-on-arrival for common nationalities.',
      'We recommend checking with the embassy of each country you plan to visit or using our trip planning service for assistance.',
    ],
    is_general: true,
    order: 2,
  },
  {
    question: 'How can I customize my tour?',
    answer: [
      'All our tours can be fully customized! Simply contact our travel experts, and we will tailor the itinerary, accommodations, and activities to your preferences.',
      'Private tours offer the most flexibility for personalization.',
    ],
    is_general: true,
    order: 3,
  },

  // ====== VIETNAM FAQs ======
  {
    question: 'What currency is used in Vietnam?',
    answer: [
      'The official currency is the Vietnamese Dong (VND). USD is also widely accepted in tourist areas.',
      'ATMs are readily available in cities, and credit cards are accepted at hotels and larger restaurants.',
    ],
    countries: [1],
    order: 1,
  },
  {
    question: 'Is Vietnam safe for tourists?',
    answer: [
      'Yes, Vietnam is considered very safe for tourists. Petty theft can occur in crowded areas, so keep an eye on your belongings.',
      'The local people are generally friendly and welcoming to visitors.',
    ],
    countries: [1],
    order: 2,
  },
  {
    question: 'What are the must-see attractions in Vietnam?',
    answer: [
      'Ha Long Bay, Hoi An Ancient Town, the Cu Chi Tunnels, Sapa rice terraces, and the Mekong Delta are top highlights.',
      'Each region offers unique experiences from bustling cities to serene countryside.',
    ],
    countries: [1],
    order: 3,
  },

  // ====== THAILAND FAQs ======
  {
    question: 'What is the best time to visit Thailand?',
    answer: [
      'The best time is from November to February when the weather is cool and dry.',
      'The rainy season (June to October) still offers good travel opportunities, especially for lower prices and fewer crowds.',
    ],
    countries: [3],
    order: 1,
  },
  {
    question: 'Can I drink tap water in Thailand?',
    answer: [
      'It is not recommended to drink tap water. Bottled water is cheap and widely available.',
      'Ice in tourist areas is generally safe as it is made from purified water.',
    ],
    countries: [3],
    order: 2,
  },

  // ====== CAMBODIA FAQs ======
  {
    question: 'How many days do I need to explore Angkor Wat?',
    answer: [
      'We recommend at least 2-3 days to explore the main temples of the Angkor complex comfortably.',
      'A sunrise visit to Angkor Wat and a sunset at Pre Rup or Phnom Bakheng are unforgettable experiences.',
    ],
    countries: [4],
    order: 1,
  },
  {
    question: 'What currency is used in Cambodia?',
    answer: [
      'The US Dollar (USD) is the most commonly used currency, especially in tourist areas.',
      'The local Riel (KHR) is used for small change. ATMs dispense USD.',
    ],
    countries: [4],
    order: 2,
  },

  // ====== LAOS FAQs ======
  {
    question: 'What are the highlights of Laos?',
    answer: [
      'Luang Prabang (UNESCO World Heritage), the Kuang Si Waterfalls, the Plain of Jars, and the 4000 Islands are must-sees.',
      'Laos offers a slower pace of travel and authentic cultural experiences.',
    ],
    countries: [2],
    order: 1,
  },

  // ====== MULTI-COUNTRY FAQs (Vietnam + Cambodia, Vietnam + Laos, etc.) ======
  {
    question: 'Can I combine Vietnam and Cambodia in one trip?',
    answer: [
      'Absolutely! A classic Indochina itinerary combines Hanoi, Ha Long Bay, Hoi An in Vietnam with Siem Reap and Phnom Penh in Cambodia.',
      'We offer many multi-country packages ranging from 10 to 21 days.',
    ],
    countries: [1, 4], // Vietnam + Cambodia
    order: 1,
  },
  {
    question: 'How do I travel between Vietnam and Laos?',
    answer: [
      'You can fly from Hanoi to Luang Prabang or take a scenic overland journey through the border.',
      'We arrange all border crossings and transfers for a seamless experience.',
    ],
    countries: [1, 2], // Vietnam + Laos
    order: 2,
  },
  {
    question: 'Is a Thailand and Cambodia combination recommended?',
    answer: [
      'Yes, combining Bangkok beaches with the temples of Angkor is a very popular and rewarding itinerary.',
      'Direct flights connect Bangkok and Siem Reap in about an hour.',
    ],
    countries: [3, 4], // Thailand + Cambodia
    order: 3,
  },

  // ====== TOUR CATEGORY FAQs (Luxury, Family, etc.) ======
  {
    question: 'What is included in a Luxury Tour?',
    answer: [
      'Our Luxury Tours include 5-star accommodations, private transfers, expert guides, and curated dining experiences.',
      'We also offer VIP access to attractions and personalized services.',
    ],
    tour_categories: [5], // Luxury
    order: 1,
  },
  {
    question: 'Are your Family Tours suitable for young children?',
    answer: [
      'Yes! Our Family Tours are designed with age-appropriate activities, flexible pacing, and family-friendly accommodations.',
      'We can customize itineraries based on the ages of your children.',
    ],
    tour_categories: [3], // Family
    order: 1,
  },
  {
    question: 'What kind of activities are in Active Tours?',
    answer: [
      'Active Tours include trekking, cycling, kayaking, and other adventure activities.',
      'Fitness levels can be accommodated from moderate to challenging.',
    ],
    tour_categories: [7], // Active
    order: 1,
  },
  {
    question: 'Do Culinary Tours cater to dietary restrictions?',
    answer: [
      'Absolutely! We can accommodate vegetarian, vegan, gluten-free, and other dietary requirements on our Culinary Tours.',
      'Please inform us of any restrictions when booking.',
    ],
    tour_categories: [11], // Culinary
    order: 1,
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('--- Seeding FAQs ---')

  for (const faq of faqsData) {
    try {
      // Check for existing FAQ by question
      const existing = await payload.find({
        collection: 'faqs',
        where: {
          question: { equals: faq.question },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`FAQ already exists: "${faq.question.substring(0, 40)}..." Skipping.`)
        continue
      }

      await payload.create({
        collection: 'faqs',
        data: {
          question: faq.question,
          answer: buildLexicalAnswer(faq.answer) as any,
          is_general: faq.is_general ?? false,
          countries: faq.countries ?? [],
          tour_categories: faq.tour_categories ?? [],
          order: faq.order ?? 0,
        },
      })
      console.log(`Created FAQ: "${faq.question.substring(0, 50)}..."`)
    } catch (error) {
      console.error(`Error creating FAQ "${faq.question}":`, error)
    }
  }

  console.log('--- Seeding FAQs Completed ---')
  process.exit(0)
}

seed()
