import Link from 'next/link'
import type { Blog } from '../types'

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  const href = `/blog/${blog.slug}`
  
  const imageUrl = typeof blog.featuredImage === 'string'
    ? blog.featuredImage
    : typeof blog.featuredImage === 'object' && blog.featuredImage !== null
      ? (blog.featuredImage as { url?: string }).url || '/images/asiatours/placeholder.webp'
      : '/images/asiatours/placeholder.webp'
    
  const publishDate = blog.publishDate 
    ? new Date(blog.publishDate).toLocaleDateString() 
    : ''

  return (
    <article className="trip trip-blog flex flex-col h-full border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={href} className="block relative h-48 overflow-hidden group">
        <img 
            src={imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-2">{publishDate}</div>
        <h3 className="title-h3-line text-lg font-bold mb-2">
          <Link href={href} className="hover:text-orange-600 transition-colors">
            {blog.title}
          </Link>
        </h3>
        {blog.excerpt && (
            <p className="paragraph text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                {blog.excerpt}
            </p>
        )}
        <Link href={href} className="text-orange-600 text-sm font-bold uppercase tracking-wider hover:underline mt-auto">
            Read More
        </Link>
      </div>
    </article>
  )
}
