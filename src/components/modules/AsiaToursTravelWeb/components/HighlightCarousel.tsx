
interface HighlightItem {
  title: string
  description: string
  image: string
}

interface HighlightCarouselProps {
  highlights: HighlightItem[]
}

export function HighlightCarousel({ highlights }: HighlightCarouselProps) {
  if (!highlights || highlights.length === 0) return null

  return (
    <section>
      <div className="container">
        <div className="wrap-slide-sp">
          {/* Note: This is a static grid representation for now, 
              since we don't have the original slick-slider js linked up perfectly yet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, idx) => (
              <div key={idx} className="item">
                <a href="#" className="box-img-sp block mb-2 relative overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Fixed empty <i> tag issue */}
                  <i className="icon-font external-link absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100" />
                </a>
                <article>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="paragraph text-sm">{item.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
