
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Experience } from '@/payload-types'

interface ExperienceCardProps {
  experience: Experience
}

function ExperienceCard({ experience }: ExperienceCardProps) {
    const imageUrl = experience.image && typeof experience.image === 'object' && 'url' in experience.image 
        ? (experience.image as any).url 
        : '/images/asiatours/placeholder.jpg'
    
    // Fallback logic for destination name
    const destinationName = experience.location || 
        (typeof experience.destination === 'object' ? experience.destination?.name : null) ||
        (typeof experience.country === 'object' ? experience.country?.name : 'Vietnam')
    
    const shortDescription = experience.description?.slice(0, 120) + (experience.description && experience.description.length > 120 ? '...' : '')
    const linkUrl = `/experiences/${experience.slug}`

    return (
        <div className="col-xlg-4 col-lg-4 col-md-6">
            <Link href={linkUrl} className="block group text-decoration-none">
                <article className="experience-card relative overflow-hidden bg-white mb-8 rounded shadow-sm" style={{ height: '400px' }}>
                    {/* Full Height Image */}
                    <div className="h-full w-full relative overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={experience.title} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        
                        {/* Destination Tag (Top Center) */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                            <span className="flex items-center gap-2 text-white text-[11px] font-bold uppercase tracking-wider text-shadow-md">
                                <span className="text-[#d0b316]">●</span> {destinationName}
                            </span>
                        </div>
                    </div>

                    {/* Sliding Content Box */}
                    {/* 
                        Logic: 
                        - Absolute bottom.
                        - Initial: Shows Title + maybe icons.
                        - Hover: Slides up to ~50% height.
                        - Transition transform.
                    */}
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-white transition-all duration-500 ease-in-out px-5 py-6 text-center z-20 flex flex-col items-center justify-end"
                        style={{
                            // Start partially hidden (translateY down). 
                            // We want it to occupy ~50% height on hover (200px).
                            // Let's assume content fits in that.
                            // Initial state: transform 'translateY-[calc(100%-80px)]'? - This is hard with dynamic height.
                            // Easier approach: Fixed height container for content, say 220px (approx 50% of 400).
                            // Then translate it down so only the top part (Title) shows.
                            height: '220px',
                            transform: 'translateY(110px)', // Pushes it down so only top ~110px is visible initially? Or use group-hover class.
                        }}
                    >
                        {/* Inline styles for the dynamic hover effect since Tailwind config might vary */}
                        <style jsx>{`
                            .group:hover .absolute-content-box {
                                transform: translateY(0) !important;
                            }
                            /* Gradient overlay to smooth transition from image? Optional. */
                        `}</style>

                        <div className="absolute-content-box w-full h-full flex flex-col justify-start items-center bg-white" 
                             style={{ 
                                 transform: 'translateY(80px)', // Initial Offset: Hide desc and button. Show Title (approx 60-80px height).
                                 transition: 'transform 0.5s ease-in-out',
                                 paddingTop: '20px'
                             }}
                        >
                            {/* Title */}
                            <h3 className="text-[16px] font-bold mb-3 leading-snug text-dark px-2">
                                {experience.title}
                            </h3>

                            {/* Icons - Optional: show on initial or reveal? 
                                User said: "before hover: see full image and 1 part text". 
                                Usually just title.
                            */}
                            <div className="flex gap-4 justify-center mb-3">
                                {experience.tags?.slice(0, 4).map((tag, idx) => (
                                    <div key={idx} title={tag.label}>
                                        {tag.icon ? (
                                            <i className={`icon-font ${tag.icon} text-lg text-gray-500`}></i>
                                        ) : (
                                            <span className="text-lg text-gray-500">⟡</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Description - Revealed on Hover */}
                            <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 px-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                {shortDescription}
                            </p>

                            {/* View More Button */}
                            <div className="mt-auto pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                <span className="inline-block px-6 py-2 border border-[#d0b316] text-[#d0b316] text-[11px] font-bold uppercase tracking-widest hover:bg-[#d0b316] hover:text-white transition-colors">
                                    View More
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    )
}

interface CountryExperiencesListProps {
  experiences: Experience[]
  title: string
  subtitle?: string
  description?: string
  filters: {
      tags: string[]
      durations: string[]
      destinations: string[]
  }
  activeDestination?: string
}

export function CountryExperiencesList({ experiences, title, subtitle, description, filters, activeDestination = 'All' }: CountryExperiencesListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-box')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDestinationChange = (dest: string) => {
      setOpenDropdown(null)
      // Server-side filter: Navigation
      if (dest === 'All') {
          router.push(pathname)
      } else {
          router.push(`${pathname}?destination=${encodeURIComponent(dest)}`)
      }
  }

  // Filter list grouping
  const uniqueDestinations = ['All', ...filters.destinations]

  return (
    <section className="section-experiences" style={{ marginTop: '30px', marginBottom: '30px' }}>
      <div className="container">
        {/* Header with title - Removed per design change (moved to Page component) or simplified */}
        {/* If title is provided passed loop it, but Page now handles the "Introduction" section separately with the sketch */}
        
        {/* Filter Bar - Center aligned */}
        <div className="wrap-filter" style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 40px',
          width: '100%'
        }}>
          {/* Destinations Filter Custom Dropdown */}
          <div className="filter-box" style={{ 
            width: '240px', // Adjusted width
            position: 'relative',
            backgroundColor: '#fff',
            height: '42px',
            border: '1px solid #e5e5e5',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)' // Proper shadow logic
          }}>
            {/* Clickable Area */}
            <div 
                style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '15px' }}
                onClick={() => setOpenDropdown(openDropdown === 'destinations' ? null : 'destinations')}
            >
                <span style={{ 
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '12px',
                color: '#333',
                letterSpacing: '1px'
                }}>
                {activeDestination === 'All' ? 'DESTINATIONS' : activeDestination}
                </span>
            </div>

            {/* Toggle Button - Yellow */}
            <div 
                onClick={() => setOpenDropdown(openDropdown === 'destinations' ? null : 'destinations')}
                style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: '#d0b316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: 'none' 
                }}
            >
                <svg 
                    viewBox="0 0 18 12" 
                    style={{ width: '12px', height: '8px', fill: '#fff', transform: openDropdown === 'destinations' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                    <rect x="4.344" y="0.172" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.1604 5.3702)" width="1.117" height="12.656"/>
                    <rect x="6.756" y="5.941" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -0.764 11.1554)" width="12.656" height="1.117"/>
                </svg>
            </div>

            {/* Dropdown Menu */}
            {openDropdown === 'destinations' && (
                <ul className="value" style={{ 
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    background: '#fff',
                    border: '1px solid #eee',
                    borderTop: 'none',
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                    zIndex: 10,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    {uniqueDestinations.map(dest => (
                        <li key={dest} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <a 
                                href="javascript:;" 
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleDestinationChange(dest)
                                }}
                                style={{
                                    display: 'block',
                                    padding: '10px 15px',
                                    fontSize: '13px',
                                    color: dest === activeDestination ? '#d0b316' : '#555',
                                    textDecoration: 'none',
                                    fontWeight: dest === activeDestination ? 600 : 400
                                }}
                                className="hover:text-[#d0b316] hover:bg-gray-50"
                            >
                                {dest === 'All' ? 'All Destinations' : dest}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
          </div>

          {/* Hidden Experiences Filter */}
        </div>

        {/* Results Grid */}
        <div className="experience-wrap row" style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center' // Center card grid
        }}>
          {experiences.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center" style={{ padding: '50px 0', color: '#888' }}>
            <p>No experiences found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
