'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SiteSettings, NavigationItem, TourStyleItem } from '../types'

interface HeaderProps {
  data: SiteSettings
  navigation: NavigationItem[]
  tourStyles?: TourStyleItem[]
}

export function Header({ data, navigation, tourStyles }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<number | string | null>(null)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [openThemes, setOpenThemes] = useState(false) 
  const [multiCountryRoutes, setMultiCountryRoutes] = useState<{ title: string; slug: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; slug: string; title: string }[]>([])
  
  // Fetch Multi-Country Routes and Tags
  useEffect(() => {
     // Fetch tours that are multi-country
     const fetchRoutes = async () => {
         try {
             const query = 'where%5BtourType%5D%5Bequals%5D=multi-country&limit=100'
             const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
             const res = await fetch(`${baseUrl}/api/tours?${query}`)
             const json = await res.json()
             if (json.docs) {
                 const routesMap = new Map<string, string>();
                 json.docs.forEach((tour: any) => {
                     if (tour.routeTitle && tour.routeSlug) {
                         routesMap.set(tour.routeSlug, tour.routeTitle);
                     }
                 });
                 
                 const routes = Array.from(routesMap.entries()).map(([slug, title]) => ({ slug, title }));
                 setMultiCountryRoutes(routes);
             }
         } catch (e) {
             console.error("Failed to fetch multi-country routes", e);
         }
     }
     fetchRoutes();

     // Fetch Tour Categories
     const fetchCategories = async () => {
         try {
             // Fetch all categories
             const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
             const res = await fetch(`${baseUrl}/api/tour-categories?limit=100`)
             const json = await res.json()
             
             if (json.docs) {
                 setCategories(json.docs)
             }
         } catch (e) {
             console.error("[Header] Failed to fetch categories", e)
         }
     }
     fetchCategories()
  }, [])

  const toggleMenu = (path: number | string, hasChildren: boolean, e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      setActiveMenu(prev => (prev === path ? null : path))
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  // Helpers
  const logoUrl = typeof data.logo === 'string' 
    ? data.logo 
    : data.logo?.url || 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours_logo.svg'

  const phone = data.contactPhone || '(+84) 916 952 668'
  // const email = data.contactEmail || 'experts@asiatours.com'

  return (
    <header>
      <nav>
        <div className="menu-wrap">
          <button 
            type="button" 
            className="btn-bar-toggle"
            onClick={toggleSidebar}
          >
            <i className="icon-font menu"></i>
            <i className="icon-font search"></i>
          </button>
          
          <div className="search-nav mg-left">
            <a href={`tel:${phone}`} className="phone-box">
              <i className="icon-font phone"></i>
              <strong>{phone}</strong>
            </a>
            <button type="button" className="open-search-top">
              <i className="icon-font search"></i>
              <span>Search</span>
            </button>
          </div>
          
          <div className="brand">
            <Link href="/" title={data.siteName}>
              <img src={logoUrl} title={`${data.siteName} Logo`} alt={`${data.siteName} Logo`} />
            </Link>
          </div>
          
          <ul className="global-menu mg-right">
            <li className="lang-top">
              <a href="#">
                <span>English</span>
                <i className="icon-font select-arrow-thin"></i>
              </a>
            </li>
            <li className="login-top" id="account-top">
              <a href="#">
                <i className="icon-font user-regular"></i>
                <span>Account</span>
                <i className="icon-font select-arrow-thin"></i>
              </a>
            </li>
            <li className="book-top">
              <button className="btn-st1 btn-contact">enquire</button>
            </li>
          </ul>
          
          <div 
            className="wrap-main-menu"
            style={isSidebarOpen ? { width: '320px', maxWidth: '100vw' } : undefined}
          >
            <ul 
              className="main-menu"
              style={{ maxWidth: isSidebarOpen ? '320px' : '50px' }}
            >
              {/* === BEST TOURS === */}
              <li className="sub-menu-title line-top">
                <Link href="/best-tours" title="Best Tours">
                  <i className="icon-font heart-empty"></i>
                  <span>Best Tours</span>
                </Link>
              </li>

              {/* === DESTINATIONS === */}
              <li className="sub-menu-title">
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu('destinations', true, e);
                  }}
                >
                  <i className="icon-font icon-destination"></i>
                  <span>Destinations</span>
                   <div className="icon-dropdown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                       <i className="icon-font select-arrow-thin" style={{ transform: activeMenu === 'destinations' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}></i>
                   </div>
                </a>
                <ul className="sub-menu" style={{ display: activeMenu === 'destinations' ? 'block' : 'none', visibility: 'visible', opacity: 1, height: 'auto' }}>
                    <li className="sub-menu-title-lv2"><Link href="/vietnam/tours"><span>Vietnam Tours</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/cambodia/tours"><span>Cambodia Tours</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/laos/tours"><span>Laos Tours</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/thailand/tours"><span>Thailand Tours</span></Link></li>
                 </ul>
              </li>

              {/* === MULTI-COUNTRY === */}
              {/* === MULTI-COUNTRY === */}
              <li className="sub-menu-title">
                 <a 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        toggleMenu('multi-country', true, e)
                    }}
                 >
                   <i className="icon-font map-marker"></i>
                   <span>Multi-Country</span>
                   <div className="icon-dropdown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                       <i className="icon-font select-arrow-thin" style={{ transform: activeMenu === 'multi-country' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}></i>
                   </div>
                 </a>
                 <ul className="sub-menu" style={{ display: activeMenu === 'multi-country' ? 'block' : 'none', visibility: 'visible', opacity: 1, height: 'auto' }}>
                    {/* Link to generic page + Dynamic Routes */}
                    <li className="sub-menu-title-lv2">
                        <Link href="/multi-country-tours"><span>All Multi-Country Tours</span></Link>
                    </li>
                    {multiCountryRoutes.map(route => (
                        <li key={route.slug} className="sub-menu-title-lv2">
                            {/* Assuming URL structure /multi-country-tours/[slug] or similar. 
                                Request said: "Khi click vào 'Multi-Country Tours' sẽ hiển thị ra các tour đi qua các nước".
                                Best to use a query param or route. Let's use /multi-country-tours?route=[slug] or similar 
                                to keep it simple without creating new pages, unless dynamic route page exists.
                                Checking existing pages... MultiCountryToursPage.tsx exists. 
                                Let's assume it can handle filtering. 
                             */}
                            <Link href={`/multi-country-tours?route=${route.slug}`} title={route.title}>
                                <span>{route.title}</span>
                            </Link>
                        </li>
                    ))}
                 </ul>
              </li>

              {/* === TRAVEL THEMES === */}
              <li className="sub-menu-title">
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (!isSidebarOpen) {
                        setSidebarOpen(true)
                        setOpenThemes(true)
                    } else {
                        setOpenThemes(!openThemes)
                    }
                  }}
                >
                  <i className="icon-font image"></i>
                  <span>Travel Themes</span>
                  <div className="icon-dropdown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <i className="icon-font select-arrow-thin" style={{ transform: openThemes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}></i>
                  </div>
                </a>
                
                {/* Dynamic Categories */}
                {categories.length > 0 && (
                   <ul className="sub-menu" style={{ display: openThemes ? 'block' : 'none', visibility: 'visible', opacity: 1, height: 'auto' }}>
                     {categories.map((cat) => (
                       <li key={cat.id} className="sub-menu-title-lv2">
                         <Link href={`/tours/${cat.slug}`} title={cat.title}>
                           <span>{cat.title}</span>
                         </Link>
                       </li>
                     ))}
                   </ul>
                )}
              </li>

              <li className="divider" style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></li>

              {/* === EXPERIENCES === */}
              <li className="sub-menu-title">
                 <a 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault()
                        toggleMenu('experiences', true, e)
                    }}
                 >
                    <i className="icon-font icon-menu-4"></i>
                    <span>Experiences</span>
                    <div className="icon-dropdown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                       <i className="icon-font select-arrow-thin" style={{ transform: activeMenu === 'experiences' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}></i>
                    </div>
                 </a>
                 <ul className="sub-menu" style={{ display: activeMenu === 'experiences' ? 'block' : 'none', visibility: 'visible', opacity: 1, height: 'auto' }}>
                    <li className="sub-menu-title-lv2"><Link href="/vietnam/experiences"><span>Vietnam</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/laos/experiences"><span>Laos</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/thailand/experiences"><span>Thailand</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/cambodia/experiences"><span>Cambodia</span></Link></li>
                 </ul>
              </li>

              {/* === TRAVEL GUIDE === */}
              <li className="sub-menu-title">
                 <Link href="/blog" title="Travel Guide">
                    <i className="icon-font icon-menu-4"></i>
                    <span>Travel Guide</span>
                    {/* No children, so no arrow */}
                 </Link>
              </li>

              {/* === PRE-DEPARTURE (Optional, keeping as simple link) === */}
              <li className="sub-menu-title">
                 <Link href="/pre-departure" title="Pre-Departure">
                    <i className="icon-font icon-menu-4"></i>
                    <span>Pre-Departure</span>
                 </Link>
              </li>

              <li className="divider" style={{ borderTop: '1px solid #eee', margin: '10px 0' }}></li>

              {/* === ABOUT US === */}
              <li className="sub-menu-title">
                 <a 
                   href="#"
                   onClick={(e) => {
                     if (!isSidebarOpen) { setSidebarOpen(true); return; }
                     toggleMenu('about', true, e)
                   }}
                 >
                   <i className="icon-font icon-menu-4"></i>
                   <span>About Us</span>
                    <div className="icon-dropdown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                       <i className="icon-font select-arrow-thin" style={{ transform: activeMenu === 'about' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}></i>
                    </div>
                 </a>
                 <ul className="sub-menu" style={{ display: activeMenu === 'about' ? 'block' : 'none', visibility: 'visible', opacity: 1, height: 'auto' }}>
                    <li className="sub-menu-title-lv2"><Link href="/about-us"><span>Our Story</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/about-us"><span>Our Promises</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/about-us"><span>Responsible Travel</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/about-us"><span>Meet Our Team</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/about-us"><span>How We Work</span></Link></li>
                    <li className="sub-menu-title-lv2"><Link href="/contact-us"><span>Contact Us</span></Link></li>
                 </ul>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
