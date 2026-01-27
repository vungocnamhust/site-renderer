import Link from 'next/link'
import React from 'react'

interface BlogBreadcrumbProps {
  title: string
  country?: string // e.g., 'Vietnam'
}

export function BlogBreadcrumb({ title, country = 'Asia' }: BlogBreadcrumbProps) {
  return (
    <div className="wrap-blog-item-1">
      <nav className="blogs-tab" style={{ display: 'none' }}>
        {/* Hidden on detail page per HTML source */}
      </nav>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li>
            <Link href="/" title="Asia Tours">Asia Tours</Link>
          </li>
          <li>
            <Link href="/travel-guide" title="Travel Guide">Travel Guide</Link>
          </li>
          <li>
            <a href="javascript:;" className="active">{title}</a>
          </li>
        </ol>
      </nav>
    </div>
  )
}
