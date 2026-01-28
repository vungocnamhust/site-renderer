
'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Tour } from '../types'
import { TourCard } from './TourCard'

interface CategoryTourListProps {
    tours: Tour[]
    title?: string
    destinations: string[]
    experiences: string[]
}

export function CategoryTourList({ tours, title, destinations, experiences }: CategoryTourListProps) {
    const router = useRouter()
    const pathname = usePathname()

    // Filter States
    const [destinationFilter, setDestinationFilter] = useState('All')
    const [experienceFilter, setExperienceFilter] = useState('All')
    const [durationFilter, setDurationFilter] = useState('All')

    // Dropdown States
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

    const handleFilterChange = (type: 'dest' | 'exp' | 'dur', value: string) => {
        if (type === 'dest') setDestinationFilter(value)
        if (type === 'exp') setExperienceFilter(value)
        if (type === 'dur') setDurationFilter(value)
        setOpenDropdown(null)
    }

    // Filter Logic
    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            // Destination
            if (destinationFilter !== 'All') {
                const hasDest = tour.countries?.some((c: any) => (typeof c === 'string' ? c : c.name) === destinationFilter)
                if (!hasDest) return false
            }
            // Experience
            if (experienceFilter !== 'All') {
                const specs = (tour as any).specs_experiences;
                const hasExp = specs?.items?.some((item: any) => (typeof item === 'object' ? item.title : '') === experienceFilter)
                if (!hasExp) return false
            }
            // Duration
            if (durationFilter !== 'All') {
                const durationStr = typeof tour.duration === 'string' ? tour.duration : ''
                const days = parseInt(durationStr) || 0

                if (durationFilter === 'Short (< 5 Days)' && days >= 5) return false
                if (durationFilter === 'Medium (5-10 Days)' && (days < 5 || days > 10)) return false
                if (durationFilter === 'Long (> 10 Days)' && days <= 10) return false
            }

            return true
        })
    }, [tours, destinationFilter, experienceFilter, durationFilter])


    // Filter Options
    const uniqueDestinations = ['All', ...destinations]
    const uniqueExperiences = ['All', ...experiences]
    const durations = ['All', 'Short (< 5 Days)', 'Medium (5-10 Days)', 'Long (> 10 Days)']

    // Helper to render dropdown
    const renderDropdown = (id: string, label: string, currentVal: string, options: string[], type: 'dest' | 'exp' | 'dur') => (
        <div className="col-lg-4 col-md-4 col-sm-12 mb-4">
            <div className="filter-box" style={{
                width: '100%',
                position: 'relative',
                backgroundColor: '#fff',
                height: '42px',
                border: '1px solid #e5e5e5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
                <div
                    style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '15px' }}
                    onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                >
                    <span style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        color: '#333',
                        letterSpacing: '1px'
                    }}>
                        {currentVal === 'All' ? label : currentVal}
                    </span>
                </div>

                <div
                    onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                    className="icon-dropdown" // Use class from css
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
                    <i className="icon-font select-arrow-thin" style={{
                        color: '#fff',
                        fontSize: '10px',
                        transform: openDropdown === id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        display: 'block'
                    }}></i>
                </div>

                {openDropdown === id && (
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
                        {options.map(opt => (
                            <li key={opt} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <a
                                    href="javascript:;"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleFilterChange(type, opt)
                                    }}
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        fontSize: '13px',
                                        color: opt === currentVal ? '#d0b316' : '#555',
                                        textDecoration: 'none',
                                        fontWeight: opt === currentVal ? 600 : 400
                                    }}
                                    className="btn-value"
                                >
                                    <span>{opt === 'All' ? `All ${label}s` : opt}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )

    return (
        <section className="section-experiences bg-white" style={{ marginTop: '0', marginBottom: '30px', paddingTop: '30px' }}>
            <div className="container">
                {title && (
                    <h3 className="section-title text-center text-2xl font-bold mb-2 uppercase tracking-wide">
                        {title}
                    </h3>
                )}
                <p className="text-center text-gray-500 mb-10 italic">Explore our collection of hand-crafted itineraries</p>

                {/* Filter Bar */}
                <div className="wrap-filter" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 40px' }}>
                    <div className="row w-full flex flex-wrap">
                        {renderDropdown('dest', 'Destination', destinationFilter, uniqueDestinations, 'dest')}
                        {renderDropdown('exp', 'Experience', experienceFilter, uniqueExperiences, 'exp')}
                        {renderDropdown('dur', 'Duration', durationFilter, durations, 'dur')}
                    </div>

                    {(destinationFilter !== 'All' || experienceFilter !== 'All' || durationFilter !== 'All') && (
                        <div className="w-full text-center mt-2">
                            <button
                                onClick={() => {
                                    setDestinationFilter('All')
                                    setExperienceFilter('All')
                                    setDurationFilter('All')
                                }}
                                className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="experience-wrap row" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour, idx) => (
                            <div key={tour.id || idx} className="col-xlg-4 col-lg-4 col-md-6 mb-8">
                                <TourCard tour={tour} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-20 col-12">
                            <p className="text-gray-500">No tours match your current filters. Try adjusting them.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
