import Link from 'next/link'
import React from 'react'
import type { Blog } from '../../types'

interface RelatedPostCardProps {
  blog: Blog
}

export function RelatedPostCard({ blog }: RelatedPostCardProps) {
    const imageUrl = typeof blog.featuredImage === 'string'
    ? blog.featuredImage
    : (blog.featuredImage && typeof blog.featuredImage === 'object' && 'url' in blog.featuredImage)
      ? (blog.featuredImage as { url: string }).url 
      : 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours/placeholder.webp'

    const link = `/blog/${blog.slug}`

  return (
    <div className="extra-posts">
      <Link href={link} title={blog.title}>
        <img src={imageUrl || '#'} alt={blog.title} />
      </Link>
      <h3>
        <Link href={link} title={blog.title}>
            {blog.title}
        </Link>
      </h3>
    </div>
  )
}
