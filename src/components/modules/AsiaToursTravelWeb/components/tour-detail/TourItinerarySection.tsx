
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
            {itinerary.map((item: any, idx: number) => (
              <div key={idx} className={`itinerary-item ${idx === 0 ? '' : 'hidden'}`} style={{ padding: '20px', display: idx === 0 ? 'block' : 'none' }}>
                <h3 style={{ marginBottom: '15px', fontWeight: 600 }}>
                  {item.day}
                </h3>
                <div
                  style={{ lineHeight: 2, color: '#555', marginBottom: '20px' }}
                  dangerouslySetInnerHTML={{ __html: getContentText(item.content) }}
                />

                {/* New Service Slot Display */}
                {item.services && item.services.length > 0 && (
                  <div className="day-services" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>Included Services:</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {item.services.map((slot: any, sIdx: number) => {
                        const mainService = typeof slot.service === 'object' ? slot.service : null;
                        return (
                          <li key={sIdx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="icon-font icon-check" style={{ color: '#27ae60' }}></i>
                            <span>
                              {mainService ? mainService.title : 'Service'}
                              {mainService?.level && <span className="badge badge-sm" style={{ marginLeft: '8px', fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{mainService.level.toUpperCase()}</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Auto-generated districts from beforeChange hook */}
                {item.districts && item.districts.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
                    <i className="icon-font icon-map-marker" style={{ marginRight: '5px' }}></i>
                    {item.districts.length} Locations visited
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
