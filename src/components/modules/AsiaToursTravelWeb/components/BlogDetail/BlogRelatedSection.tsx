import React from 'react'
import type { Blog } from '../../types'
import { RelatedPostCard } from './RelatedPostCard'

interface BlogRelatedSectionProps {
  relatedPosts?: (string | number | Blog)[]
}

export function BlogRelatedSection({ relatedPosts }: BlogRelatedSectionProps) {
    if (!relatedPosts || relatedPosts.length === 0) return null

    // Filter out string/number IDs if they haven't been populated
    const posts = relatedPosts.filter((p): p is Blog => typeof p !== 'string' && typeof p !== 'number')

    if (posts.length === 0) return null

  return (
    <div className="wrap-extra-posts">
      <h2>Explore more <b>Vietnam Travel Guide</b></h2>
      <div className="row">
        {posts.map((post) => (
            <RelatedPostCard key={post.id} blog={post} />
        ))}
      </div>
    </div>
  )
}
