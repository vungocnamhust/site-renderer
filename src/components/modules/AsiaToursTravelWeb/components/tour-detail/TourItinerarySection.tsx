
import type { Tour } from '@/payload-types'

interface TourItinerarySectionProps {
  tour: Tour
}

export function TourItinerarySection({ tour }: TourItinerarySectionProps) {
  // @ts-ignore - itinerary field
  const itinerary = tour.itinerary || [];

  // Helper to extract text from rich text content
  const getContentText = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content?.root?.children) {
      return content.root.children
        .map((node: any) => {
          if (node.children) {
            return node.children.map((child: any) => child.text || '').join('');
          }
          return node.text || '';
        })
        .join(' ');
    }
    return '';
  };

  return (
    <section className="section-map-day" id="dt-map">
      <div className="wrap-mini-intro">
        <h2 className="title-h2-line">Overview of this tour</h2>
        <p className="paragraph">{tour.title} - {tour.duration}</p>
      </div>
      <div className="container">
        <div className="wrap-map-loca">
          {/* Left - Day by Day List */}
          <div className="left-daybyday">
            <a href="javascript:;" className="btn-day btn-day-up">
              <i className="icon-font select-arrow-thin"></i>
            </a>
            <a href="javascript:;" className="btn-day btn-day-down">
              <i className="icon-font select-arrow-thin"></i>
            </a>
            <ul>
              {itinerary.map((item: any, idx: number) => (
                <li key={idx} className={idx === 0 ? 'active' : ''}>
                  <a href="javascript:;" title="">
                    <i className="icon-font icon-car"></i>
                    <span><b>{item.day}</b></span>
                  </a>
                  <i className="triagle-st1"></i>
                </li>
              ))}
            </ul>
          </div>
          {/* Right - Map or Details */}
          <div className="right-map-box">
            {itinerary.length > 0 && (
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '15px', fontWeight: 600 }}>
                  {itinerary[0]?.day}
                </h3>
                <p style={{ lineHeight: 2, color: '#555' }}>
                  {getContentText(itinerary[0]?.content)}
                </p>
                {itinerary[0]?.meals && itinerary[0].meals.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Meals:</strong> {itinerary[0].meals.join(', ')}
                  </div>
                )}
                {itinerary[0]?.accommodation && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Accommodation:</strong> {itinerary[0].accommodation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
