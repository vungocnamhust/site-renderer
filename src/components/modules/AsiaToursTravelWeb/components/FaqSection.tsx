
'use client'

import { useState } from 'react'
import type { FaqItem } from '../types'

export function FaqSection({ items }: { items?: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  const toggle = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx))
  }

  return (
    <section className="mg-bottom">
      <div className="wrap-mini-intro">
        <h2 className="title-h2-line">FAQs about Asia Tours</h2>
      </div>
      <div className="container">
        <div className="wrap-faq">
          {items.map((item, idx) => (
            <div className="order-day" key={idx}>
              <a 
                href="javascript:;" 
                onClick={(e) => { e.preventDefault(); toggle(idx); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://d2lwt6tidfiof0.cloudfront.net/images/icon/icon_faq.svg" alt="" style={{ marginRight: '10px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>{item.question}</h3>
                </div>
                <button>
                  <i 
                    className="icon-font select-arrow-thin"
                    style={{ 
                        transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                    }}
                  ></i>
                </button>
              </a>
              <div 
                className="panel" 
                style={{ 
                    display: openIdx === idx ? 'block' : 'none',
                    padding: '15px 0 15px 40px'
                }}
              >
                <p className="paragraph">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
