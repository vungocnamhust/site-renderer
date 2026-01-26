'use client'

import { useState, useRef, useEffect } from 'react'

export function BookingWidget() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('Where you want to go')
  const [selectedActivity, setSelectedActivity] = useState<string>('What you want to do')
  
  // Close dropdown when clicking outside
  const widgetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country)
    setActiveDropdown(null)
  }

  const handleSelectActivity = (activity: string) => {
    setSelectedActivity(activity)
    setActiveDropdown(null)
  }

  return (
    <div id="booking-widget-homepage" ref={widgetRef}>
      <div className="form-banner-top">
        <div className={`booking-step-where select-st1 ${activeDropdown === 'where' ? 'open' : ''}`}>
          <span className="text" onClick={() => toggleDropdown('where')}>
            <i className="icon-font icon-destination"></i>
            <b>{selectedCountry}</b>
            <i className="icon-font select-arrow-thin"></i>
          </span>
          <ul className="value" style={{ display: activeDropdown === 'where' ? 'block' : 'none' }}>
            {['Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'China', 'Hong Kong', 'Japan', 'South Korea', 'Bhutan', 'Nepal'].map(country => (
              <li key={country}>
                  <a href="#" className="btn-value" onClick={(e) => { e.preventDefault(); handleSelectCountry(country); }}>
                    <i className="icon-font icon-destination"></i>
                    <b>{country}</b>
                    <i className="icon-font checkmark"></i>
                  </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={`booking-step-what select-st1 ${activeDropdown === 'what' ? 'open' : ''}`}>
          <span className="text" onClick={() => toggleDropdown('what')}>
            <i className="icon-font hiking"></i>
            <b>{selectedActivity}</b>
            <i className="icon-font select-arrow-thin"></i>
          </span>
          <ul className="value" style={{ display: activeDropdown === 'what' ? 'block' : 'none' }}>
             {['Culture & Highlights', 'Food & Local Life', 'Active & Nature', 'Beach & Relaxation', 'Couple & Honeymoon', 'Family Holiday', 'Luxury Hotels', 'Boutique Hotels', 'Standard Hotels'].map((item, idx) => (
                <li key={idx}>
                    <a href="#" className="btn-value" onClick={(e) => { e.preventDefault(); handleSelectActivity(item); }}>
                        <i className="icon-font hiking"></i>
                        <b>{item}</b>
                        <i className="icon-font checkmark"></i>
                    </a>
                </li>
             ))}
          </ul>
        </div>
        <div className="booking-step-who select-st1">
          <span className="text">
            <i className="icon-font icon-users"></i>
            <b>Number of travelers</b>
            <i className="icon-font select-arrow-thin"></i>
          </span>
          {/* ... Simplified Logic for Travelers ... */}
        </div>
        <div className="booking-step-submit">
          <button className="btn-st3 btn-create-trip">Customize Tours</button>
        </div>
      </div>
      <button className="btn-st3 btn-create-trip">Build Your Own Trip</button>
    </div>
  )
}
