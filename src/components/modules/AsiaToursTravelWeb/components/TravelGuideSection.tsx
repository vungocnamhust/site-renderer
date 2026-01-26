
import Link from 'next/link'
import type { Blog } from '../types'

export function TravelGuideSection({ items }: { items?: (Blog | string)[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="section-blog-st2">
      <div className="wrap-mini-intro">
        <h2 className="title-h2-line">Asia Travel Guide & Inspirations</h2>
      </div>
      <div className="container">
        <div className="wrap-slide-st8">
          <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {items.map((item, idx) => {
               // Handle relation
               if (typeof item === 'string') return null
               const blog = item as Blog
               const featuredImage = blog.featuredImage
               const imageUrl = typeof featuredImage === 'string'
                 ? featuredImage
                 : (typeof featuredImage === 'object' && featuredImage?.url)
                   ? featuredImage.url
                   : null

               // Helper for destinations (assuming taxonomy exists or fallback to static)
               const destination = "Asia" 

               return (
                <div className="col-xlg-4 col-md-6 col-xsm-12" key={idx} style={{ marginBottom: '30px' }}>
                  <Link href={`/blog/${blog.slug}`} title={blog.title}>
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={blog.title} 
                        style={{ width: '100%', height: '230px', objectFit: 'cover' }} 
                      />
                    )}
                  </Link>
                  <div>
                    <div className="desti" style={{ color: '#d0b316', textTransform: 'uppercase', fontSize: '12px', marginTop: '10px' }}>
                      {destination}
                    </div>
                    <h3>
                      <Link href={`/blog/${blog.slug}`} title={blog.title}>{blog.title}</Link>
                    </h3>
                    <p>{blog.excerpt}</p>
                  </div>
                </div>
               )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
