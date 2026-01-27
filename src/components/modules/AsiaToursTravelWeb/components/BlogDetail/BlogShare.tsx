import React from 'react'

interface BlogShareProps {
    destination?: string
}

export function BlogShare({ destination = 'Asia' }: BlogShareProps) {
  return (
    <div className="box-share">
      <div className="desti">{destination}</div>
      <a rel="nofollow" href="#" title="Share on Facebook">
        <i className="icon-font facebook-square-brands"></i>
      </a>
      <a rel="nofollow" href="#" title="Share on Twitter">
        <i className="icon-font twitter-brands"></i>
      </a>
      <a rel="nofollow" href="#" title="Share on Instagram">
        <i className="icon-font instagram-brands"></i>
      </a>
    </div>
  )
}
