'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Experience, Media } from '@/payload-types'
import '../blog.css'

export function TravelGuidePage({ data, searchParams }: any) {
    const searchParamsHook = useSearchParams()
    // Tab functionality could be kept or hidden if we just want to show the list as per "Experiences" page request
    // The reference url is /experiences/, which implies a dedicated page. 
    // We are simulating it under /travel-guide?tab=experiences but let's make it look like the reference regardless of tab if logical,
    // or just strictly for the 'experiences' tab. Given the task "UI của Experience", I will focus on that tab content.
    
    const currentTab = searchParamsHook.get('tab') || 'experiences'
    const countryParam = searchParamsHook.get('country')

    const [experiences, setExperiences] = useState<Experience[]>([])
    const [posts, setPosts] = useState<any[]>([]) // For Blog Posts
    const [loading, setLoading] = useState(false)
    const [destinations, setDestinations] = useState<string[]>([])

    useEffect(() => {
        if (currentTab === 'experiences') {
            const fetchExperiences = async () => {
                setLoading(true)
                try {
                    let url = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/experiences?limit=100`

                    // Filter by country if present
                    if (countryParam) {
                         const cLo = countryParam.toLowerCase()
                         url += `&where[country][equals]=${cLo}`
                    } else {
                         // Default to the 4 main countries if no specific country selected, or keep all
                         url += `&where[country][in][0]=vietnam&where[country][in][1]=laos&where[country][in][2]=cambodia&where[country][in][3]=thailand`
                    }

                    const res = await fetch(url)
                    const json = await res.json()
                    
                    if (json.docs) {
                        setExperiences(json.docs)
                        // Extract unique locations for sidebar
                        const uniqueDestinations = Array.from(new Set(json.docs.map((exp: Experience) => exp.location).filter(Boolean))) as string[]
                        setDestinations(uniqueDestinations)
                    }
                } catch (err) {
                    console.error('Failed to fetch experiences', err)
                } finally {
                    setLoading(false)
                }
            }
            fetchExperiences()
        } else if (currentTab === 'guide') {
             // Fetch Blogs
             const fetchPosts = async () => {
                setLoading(true)
                try {
                    // Assuming 'posts' collection exists. Review if we need to check schema.
                    // Based on previous knowledge, AsiaTours likely has 'posts' or similar.
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/posts?limit=50&sort=-publishedDate`)
                    const json = await res.json()
                    
                    if (json.docs) {
                        setPosts(json.docs)
                    }
                } catch (err) {
                    console.error('Failed to fetch posts', err)
                } finally {
                    setLoading(false)
                }
            }
            fetchPosts()
        }
    }, [currentTab, countryParam])


    // Simplified Tab Handlers (if we want to render strictly based on tab)
    // Note: The UI requested 'Travel Guide' to show list of blogs. 
    // And 'Experience' to show list of experiences.
    
    // We already handle fetching above. Now we handle rendering.

    return (
        <div className="travel-guide-experiences">
            {/* Banner Section */}
            <section className="banner-top banner-small banner-country-2">
                <div className="bg-detail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
                    <img 
                        src="https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-vietnam.webp" 
                        alt="Vietnam Background" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                
                <div className="wrap-title-banner-top-line">
                    <h1 className="line">All Vietnam Tour Experiences</h1>
                    <p>Vietnam is our homeland. We’ll show you Vietnam, better than anyone else!</p>
                </div>

                {/* Booking Widget Placeholder - matching HTML structure roughly */}
                <div id="booking-widget-homepage">
                    <div className="form-banner-top">
                         {/* Visual placeholder for the search bar in the banner if needed, 
                             but focusing on the main list content first as per primary request. 
                             Adding the button to match reference. */}
                         <div className="booking-step-submit">
                            <button className="btn-st3 btn-create-trip">Customize Tours</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="experience-container">
                <article className="wrap-mini-intro">
                    <div className="box-img-st2">
                        <img className="lag-img" src="https://d2lwt6tidfiof0.cloudfront.net/images/destination/vietnam.jpg" alt="Vietnam Map" />
                    </div>
                    <h2 className="title-h2">Top Vietnam Tour Experiences<br/>You can expect</h2>
                    <p className="paragraph">
                        From the boisterous city to peaceful countryside, from the breathtaking beaches to ancient town, from the rich history to diverse culture, Vietnam delights all your senses. Enjoy these unforgettable experiences of your holiday in Vietnam and more below:
                    </p>
                </article>
            </section>

            {/* Filter & List Section */}
            <section className="experience-container">
                 {/* Filter Bar (Acting as Sidebar/Top Filter) */}
                 <div id="box_exp_cat">
                    <div className="wrap-filter">
                        <div className="col-xlg-4 col-sm-12">
                            <div className="filter-box filter-des">
                                <a href="javascript:;">
                                    <span className="text-2">Destinations</span>
                                    <div className="icon-dropdown"><i className="icon-font select-arrow-thin"></i></div>
                                </a>
                                <ul className="value" style={{ display: 'none' }}> {/* Hidden by default, JS would toggle */}
                                    {destinations.map(dest => (
                                        <li key={dest}>
                                            <a href="javascript:;" className="btn-value" title={dest}><span>{dest}</span></a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Content Grid */}
            <div id="tab-experience" className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>Loading...</div>
                ) : (
                    <div className="row">
                        {currentTab === 'experiences' && experiences.map(exp => {
                             const imageUrl = typeof exp.image === 'string' 
                                ? exp.image 
                                : (exp.image as Media)?.url || ''
                            
                             return (
                                <div className="col-xlg-4 col-md-6 col-sm-12" key={exp.id} style={{ marginBottom: '30px' }}>
                                    <Link href={`/experiences/${exp.slug}`} title={exp.title}>
                                        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60%' }}>
                                             <Image 
                                                src={imageUrl} 
                                                alt={exp.title} 
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                data-img={imageUrl} 
                                             />
                                             <div className="wrap-text-abso">
                                                <div className="desti">{exp.location || exp.country || 'Asia'}</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <article>
                                        <h3>
                                            <Link href={`/experiences/${exp.slug}`} title={exp.title}>
                                                {exp.title}
                                            </Link>
                                        </h3>
                                        {/* Optional Tags or Tooltip logic here */}
                                        <p className="paragraph line-clamp-3">
                                            {exp.description}
                                        </p>
                                        <Link className="btn-st2" href={`/experiences/${exp.slug}`} title={exp.title}>
                                            view more
                                        </Link>
                                    </article>
                                </div>
                             )
                        })}

                        {currentTab === 'guide' && posts.map(post => {
                             const imageUrl = typeof post.heroImage === 'string' 
                                ? post.heroImage 
                                : (post.heroImage as Media)?.url || ''
                             
                             // Adapt Blog Display
                             return (
                                <div className="col-xlg-4 col-md-6 col-sm-12" key={post.id} style={{ marginBottom: '30px' }}>
                                    <Link href={`/blog/${post.slug || '#'}`} title={post.title}>
                                        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60%' }}>
                                             <Image 
                                                src={imageUrl || 'https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-vietnam.webp'} 
                                                alt={post.title} 
                                                fill
                                                style={{ objectFit: 'cover' }}
                                             />
                                        </div>
                                    </Link>
                                    <article style={{ marginTop: '15px' }}>
                                        <h3>
                                            <Link href={`/blog/${post.slug || '#'}`} title={post.title}>
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <div className="meta" style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                                            {new Date(post.publishedDate).toLocaleDateString()}
                                        </div>
                                        <p className="paragraph line-clamp-3">
                                            {post.excerpt || post.meta?.description || ''}
                                        </p>
                                        <Link className="btn-st2" href={`/blog/${post.slug || '#'}`} title={post.title}>
                                            read more
                                        </Link>
                                    </article>
                                </div>
                             )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
