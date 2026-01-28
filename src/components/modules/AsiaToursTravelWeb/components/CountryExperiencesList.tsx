
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
            <Link href={linkUrl} style={{ display: 'block', textDecoration: 'none' }} className="group">
                <article className="experience-card" style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    marginBottom: '30px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    height: '400px'
                }}>
                    {/* Full Height Image - Absolute Config to ensure it covers */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                        <img
                            src={imageUrl}
                            alt={experience.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.7s ease-out',
                                display: 'block'
                            }}
                            className="card-image"
                        />

                        {/* Destination Tag (Top Center) */}
                        <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10
                        }}>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#fff',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                <span style={{ color: '#d0b316' }}>●</span> {destinationName}
                            </span>
                        </div>
                    </div>

                    {/* Sliding Content Box */}
                    <div
                        className="content-box-slide"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                            transition: 'all 0.5s ease-in-out',
                            padding: '20px',
                            textAlign: 'center',
                            zIndex: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start', // Align to top of box so title is consistent
                            height: '220px', // Slightly more than 50% to accommodate spacing
                            transform: 'translateY(140px)' // Pushed down: 220px total - 80px visible = 140px hidden
                        }}
                    >
                        <style jsx>{`
                            /* Hover Effects */
                            :global(.group:hover) .card-image {
                                transform: scale(1.1);
                            }
                            :global(.group:hover) .content-box-slide {
                                transform: translateY(0) !important;
                            }
                            :global(.group:hover) .desc-fade,
                            :global(.group:hover) .btn-fade {
                                opacity: 1 !important;
                                transform: translateY(0) !important;
                            }
                        `}</style>

                        {/* Title Section (Always Visible) */}
                        <div style={{ marginBottom: '10px', width: '100%' }}>
                            {/* Title */}
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                marginBottom: '8px',
                                lineHeight: '1.4',
                                color: '#333'
                            }}>
                                {experience.title}
                            </h3>

                            {/* Icons (Visible initially or hover? User said "text moves up". Let's keep icons visible) */}
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '5px' }}>
                                {experience.tags?.slice(0, 4).map((tag, idx) => (
                                    <div key={idx} title={tag.label}>
                                        {tag.icon ? (
                                            <i className={`icon-font ${tag.icon}`} style={{ fontSize: '18px', color: '#666' }}></i>
                                        ) : (
                                            <span style={{ fontSize: '18px', color: '#666' }}>⟡</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description - Revealed on Hover */}
                        <div style={{ flex: 1, overflow: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p
                                className="desc-fade"
                                style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    lineHeight: '1.6',
                                    marginBottom: '10px',
                                    opacity: 0,
                                    transform: 'translateY(10px)',
                                    transition: 'all 0.3s ease 0.1s',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {shortDescription}
                            </p>

                            {/* View More Button */}
                            <div
                                className="btn-fade"
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(10px)',
                                    transition: 'all 0.3s ease 0.2s',
                                    marginTop: 'auto'
                                }}
                            >
                                <span style={{
                                    display: 'inline-block',
                                    padding: '8px 24px',
                                    border: '1px solid #d0b316',
                                    color: '#d0b316',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer'
                                }}>
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
                                <rect x="4.344" y="0.172" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.1604 5.3702)" width="1.117" height="12.656" />
                                <rect x="6.756" y="5.941" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -0.764 11.1554)" width="12.656" height="1.117" />
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
