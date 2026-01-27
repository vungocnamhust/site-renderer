'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Blog, Media, AsiaToursTravelWebData } from '../types'
import { BlogSidebar } from '../components/BlogDetail/BlogSidebar'
import '../blog.css'
import { Footer } from '../components/Footer'
import { BookingWidget } from '../components/BookingWidget'

interface TravelGuidePageProps {
    data: AsiaToursTravelWebData
    searchParams?: { [key: string]: string | string[] | undefined }
}

export function TravelGuidePage({ data, searchParams }: TravelGuidePageProps) {
    const [posts, setPosts] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    // Derived from data or static for now
    const featuredPost = posts.length > 0 ? posts[0] : null
    const gridPosts = posts.length > 0 ? posts.slice(1) : []

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                // Fetch Blogs from Payload CMS
                // Ensure we get enough depth for images/categories
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
                let url = `${baseUrl}/api/blogs?limit=13&sort=-publishedDate&depth=2`

                // Apply Country Filter if present
                if (searchParams?.country) {
                    const countrySlug = Array.isArray(searchParams.country) ? searchParams.country[0] : searchParams.country
                    // Assuming 'relatedCountries' is the relationship field and we filter by slug
                    // Payload REST query: where[relatedCountries.slug][equals]=vietnam
                    if (countrySlug) {
                        url += `&where[relatedCountries.slug][equals]=${countrySlug}`
                    }
                }

                const res = await fetch(url)
                const json = await res.json()

                if (json.docs) {
                    setPosts(json.docs)
                }
            } catch (err) {
                console.error('Failed to fetch blog posts', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [searchParams?.country])

    return (
        <div className="travel-guide-container">
            {/* 1. Hero / Banner Section */}
            <section className="banner-top banner-small banner-country-2" style={{ marginBottom: '40px' }}>
                <div className="bg-detail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                    <img
                        src="/images/asiatours/background/bg-travel-guide.png"
                        alt="Asia Travel Guide"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)' }}></div> */}
                </div>

                <div className="wrap-title-banner-top-line">
                    <h1 className="line">ASIA TRAVEL GUIDE</h1>
                    <p>Useful Tips, Hidden Gems & Inspiring Stories for your Journey</p>
                </div>
                <BookingWidget />

            </section>

            <div className="container">
                <div className="row">
                    {/* Main Content Column */}
                    <div className="col-lg-9 col-md-12">

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>Loading Guide...</div>
                        ) : (
                            <>
                                {/* Featured Post (First Item) */}
                                {featuredPost && (
                                    <div className="blog-item blog-item-featured" style={{ marginBottom: '40px' }}>
                                        <Link href={`/blog/${featuredPost.slug}`} className="block relative" style={{ display: 'block', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                                            {/* High Resolution Image for Featured */}
                                            <div style={{ paddingBottom: '50%', position: 'relative', overflow: 'hidden' }}>
                                                <Image
                                                    src={typeof featuredPost.featuredImage === 'string'
                                                        ? featuredPost.featuredImage
                                                        : (featuredPost.featuredImage as Media)?.url || 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours/placeholder.webp'}
                                                    alt={featuredPost.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    className="hover-scale"
                                                />
                                            </div>
                                            <div className="featured-content" style={{ marginTop: '20px' }}>
                                                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>{featuredPost.title}</h2>
                                                <p style={{ color: '#666', lineHeight: '1.6', fontSize: '16px', marginBottom: '15px' }}>
                                                    {featuredPost.excerpt || 'Explore the wonders of Asia with our latest travel guide detailed specifically for you.'}
                                                </p>
                                                <span className="btn-st2">Read Article</span>
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* Blog Grid */}
                                <div className="row wrap-blog-item-2">
                                    {gridPosts.map(post => {
                                        const imageUrl = typeof post.featuredImage === 'string'
                                            ? post.featuredImage
                                            : (post.featuredImage as Media)?.url || 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-2.webp'

                                        return (
                                            <div className="col-md-6 col-sm-12 blog-card-item" key={post.id} style={{ marginBottom: '40px' }}>
                                                <div className="blog-img" style={{ marginBottom: '15px', borderRadius: '4px', overflow: 'hidden', position: 'relative', paddingBottom: '65%' }}>
                                                    <Link href={`/blog/${post.slug}`}>
                                                        <Image
                                                            src={imageUrl}
                                                            alt={post.title}
                                                            fill
                                                            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                            className="hover-scale-img"
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="blog-content">
                                                    <h3 className="blog-title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', lineHeight: '1.4' }}>
                                                        <Link href={`/blog/${post.slug}`} className="hover-color-gold">
                                                            {post.title}
                                                        </Link>
                                                    </h3>
                                                    <div className="blog-meta" style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>
                                                        <span>{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ''}</span>
                                                    </div>
                                                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {post.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {gridPosts.length === 0 && !featuredPost && (
                                    <div className="text-center">No posts found.</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="col-lg-3 col-md-12 sidebar-guide" style={{ paddingLeft: '30px' }}>
                    <BlogSidebar recentPosts={posts} />
                </div>
            </div>
            <Footer data={data.footer} />
        </div>
    )
}
