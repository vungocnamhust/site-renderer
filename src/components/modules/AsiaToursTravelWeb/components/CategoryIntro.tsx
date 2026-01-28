
'use client'

import React from 'react'

interface CategoryIntroProps {
    title: string
    description?: string
}

export function CategoryIntro({ title, description }: CategoryIntroProps) {
    return (
        <section className="intro-country-tour py-12">
            <div className="container">
                <div className="wrap-mini-intro text-center max-w-4xl mx-auto">
                    {/* 1. Icons Row (Tailor-Made, Private Guide, Authentic) */}
                    <div className="flex justify-center gap-8 mb-8 text-gray-600" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', color: '#666' }}>
                        {/* Item 1 */}
                        <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="w-12 h-12 mb-2 rounded-full bg-gray-100 flex items-center justify-center" style={{ width: '48px', height: '48px', marginBottom: '10px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="icon-font user-regular text-2xl text-primary" style={{ fontSize: '24px', color: '#d0b316' }}></i>
                            </div>
                            <span className="text-sm font-semibold uppercase" style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Tailor-Made</span>
                        </div>
                        {/* Item 2 */}
                        <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="w-12 h-12 mb-2 rounded-full bg-gray-100 flex items-center justify-center" style={{ width: '48px', height: '48px', marginBottom: '10px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="icon-font users text-2xl text-primary" style={{ fontSize: '24px', color: '#d0b316' }}></i>
                            </div>
                            <span className="text-sm font-semibold uppercase" style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Private Guides</span>
                        </div>
                        {/* Item 3 */}
                        <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="w-12 h-12 mb-2 rounded-full bg-gray-100 flex items-center justify-center" style={{ width: '48px', height: '48px', marginBottom: '10px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="icon-font star-empty text-2xl text-primary" style={{ fontSize: '24px', color: '#d0b316' }}></i>
                            </div>
                            <span className="text-sm font-semibold uppercase" style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Authentic</span>
                        </div>
                    </div>

                    {/* 2. Description Title & Text */}
                    <h2 className="title-h2 mb-4 font-serif text-3xl">Why We Love {title}</h2>
                    <div className="paragraph text-gray-600 leading-relaxed mb-8">
                        {description || `Experience the magic of ${title} with our expertly curated tours. We specialize in creating unforgettable memories for families, couples, and adventurers alike. Let us handle the details while you enjoy the journey.`}
                    </div>

                    {/* 3. Experts Row (Reusing classes from IntroSection) */}
                    <div className="wrap-mini-intro wrap-mini-intro-st2" style={{ marginTop: '30px' }}>
                        <div className="team-quote">
                            {['a12', 'a2', 'a3', 'a5'].map(img => (
                                <img key={img} src={`https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/${img}.webp`} alt="Expert" />
                            ))}
                        </div>
                        <h4 className="font-handwriting text-2xl mb-4 text-gray-800" style={{ fontFamily: '"Reenie Beanie", cursive', fontSize: '24px', marginTop: '10px' }}>
                            Speak to our Asia {title} Experts
                        </h4>
                    </div>
                </div>
            </div>
        </section>
    )
}
