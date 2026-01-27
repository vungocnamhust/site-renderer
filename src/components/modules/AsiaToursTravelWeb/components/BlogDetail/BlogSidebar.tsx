import Link from 'next/link'
import React from 'react'
import type { Blog } from '../../types'

interface BlogSidebarProps {
  recentPosts?: Blog[]
}

export function BlogSidebar({ recentPosts = [] }: BlogSidebarProps) {
  return (
    <div className="col-lg-3 col-md-12 sidebar-guide">
      <div className="wrap-blog-item-3">
        <div className="sticky-box">
          {/* Destinations Widget */}
          <div className="box-blog blog-des-list">
            <a href="#">
              <span>Destinations</span>
              <i>&raquo;</i>
            </a>
            <ul>
              <li><Link href="/blog?country=vietnam">Vietnam (37)</Link></li>
              <li><Link href="/blog?country=cambodia">Cambodia (18)</Link></li>
              <li><Link href="/blog?country=laos">Laos (3)</Link></li>
              <li><Link href="/blog?country=thailand">Thailand (21)</Link></li>
              <li><Link href="/blog?country=myanmar">Myanmar (17)</Link></li>
            </ul>
          </div>

          {/* Useful Info Widget */}
          <div className="box-blog blog-userful">
            <a href="#">
              <span>Useful Info</span>
            </a>
            <ul>
              <li><Link href="/pre-departure">Pre-departures</Link></li>
              <li><Link href="/experiences">Unique Experiences</Link></li>
            </ul>
          </div>

          {/* Social Widget */}
          <div className="box-blog blog-social-list">
            <a href="#">
              <span>Let&apos;s get social</span>
            </a>
            <ul>
              <li><a href="#"><i className="icon-font twitter-brands"></i></a></li>
              <li><a href="#"><i className="icon-font facebook-square-brands"></i></a></li>
              <li><a href="#"><i className="icon-font instagram-brands"></i></a></li>
            </ul>
          </div>

          {/* Recent Posts Widget */}
          {recentPosts.length > 0 && (
            <div className="recent-posts">
              <a href="javascript:;">
                <span>Recent posts</span>
              </a>
              <div className="box-blog-flex">
                {recentPosts.slice(0, 3).map(post => {
                  const imageUrl = typeof post.featuredImage === 'string'
                    ? post.featuredImage
                    : (post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage)
                      ? (post.featuredImage as { url: string }).url
                      : 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours/placeholder.webp'
                  const link = `/blog/${post.slug}`

                  return (
                    <div className="row" key={post.id}>
                      <div className="col-xlg-6">
                        <Link href={link}>
                          <img src={imageUrl || '#'} alt={post.title} />
                        </Link>
                      </div>
                      <div className="col-xlg-6">
                        <h3><Link href={link}>{post.title}</Link></h3>
                        <div className="desti">Asia</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}
