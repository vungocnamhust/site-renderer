
import type { Tour } from '@/payload-types'

interface TourHighlightsSectionProps {
  tour: Tour
}

export function TourHighlightsSection({ tour }: TourHighlightsSectionProps) {
  // Get highlights from tour data
  const highlights = tour.highlights || [];

  // Fallback video/image URLs
  const videoImage = 'https://d2lwt6tidfiof0.cloudfront.net/uploads/slide/bana-hil6l-1565603169.jpg';
  const secondaryImage = 'https://d2lwt6tidfiof0.cloudfront.net/uploads/slide/1154324-1758274642.jpg';

  return (
    <section className="hightlight-tour">
      <div className="container">
        <h2 id="dt-highlight" className="title-h2-line">Highlights Of This Tour</h2>
        <div className="content-hl-tour">
          {/* Left Side: Images Grid */}
          <div>
            <a href="javascript:" className="video-box">
              <img src={videoImage} alt="Tour Video" />
              <i className="icon-font play-video"></i>
            </a>
            <a href="javascript:" className="open-img">
              <img src={secondaryImage} alt="Gallery" />
            </a>
            <a href="javascript:" className="img-box open-img">
              <i className="icon-font image"></i>
              <strong>See all photo</strong>
            </a>
          </div>
          {/* Right Side: Highlight List */}
          <div>
            <div>
              {highlights.map((item: any, idx: number) => (
                <p key={idx}>
                  <i className="icon-font checkmark"></i>
                  <span>{item.text}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
