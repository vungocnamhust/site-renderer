import React from 'react'
import { BlogBanner } from './BlogBanner'
import { BlogBreadcrumb } from './BlogBreadcrumb'
import { BlogShare } from './BlogShare'
import { BlogContent } from './BlogContent'
import { BlogRelatedSection } from './BlogRelatedSection'
import { BlogSidebar } from './BlogSidebar'
import type { Blog, HeroSlide } from '../../types'

interface BlogDetailLayoutProps {
  blog: Blog
  recentPosts?: Blog[]
}

export function BlogDetailLayout({ blog, recentPosts }: BlogDetailLayoutProps) {
  // Determine destination name from relatedCountries for share component
  const firstCountry = blog.relatedCountries?.[0]
  const destinationName = typeof firstCountry === 'object' ? (firstCountry as any).name : 'Travel'

  return (
    <>
      {/* Pass blog prop for dynamic banner background */}
      <BlogBanner blog={blog} />

      <section className="travel-guide-container detail-travel-guide-container">
        <div className="container">
          {/* Breadcrumb - Grid item 1 */}
          <div className="wrap-blog-item-1">
            <BlogBreadcrumb title={blog.title} />
          </div>

          {/* Main Content - Grid item 2 (Left Column) */}
          <div className='row'>
            <div className="wrap-blog-item-2">
              <div className="main-posts">
                <h1>{blog.title}</h1>
                <BlogShare destination={destinationName} />

                {/* Render content from DB - no hardcoded fallback */}
                <BlogContent content={blog.content} />
              </div>

              <BlogRelatedSection relatedPosts={blog.relatedPosts || undefined} />
            </div>

            {/* Right Sidebar - Grid item 3 */}
            <BlogSidebar recentPosts={recentPosts} />
          </div>
        </div>
      </section>
    </>
  )
}
