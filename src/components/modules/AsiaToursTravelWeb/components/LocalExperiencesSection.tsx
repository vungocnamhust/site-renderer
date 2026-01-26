
import type { LocalExperiencesData } from '../types'

export function LocalExperiencesSection({ data }: { data?: LocalExperiencesData }) {
  if (!data) return null

  const { stats, gallery } = data

  return (
    <>
      <section>
        <div className="container">
          <div className="water-mask">real local experiences</div>
        </div>
      </section>
      <section className="section-crowd">
        <div className="container">
          <div className="parameter-box">
            <div>
              <b>{stats.countries || '18'}</b>
              <span>Countries</span>
            </div>
            <div>
              <b>{stats.destinations || '316'}</b>
              <span>Destinations</span>
            </div>
            <div>
              <b>{stats.experiences || '900+'}</b>
              <span>Unique Experiences</span>
            </div>
            <div>
              <b>{stats.reviews || '98%'}</b>
              <span>Reviews Rated Excellent</span>
            </div>
            <div>
              <b>{stats.guests || '20.000+'}</b>
              <span>Happy Guests</span>
            </div>
          </div>
        </div>
        {/* Chunk gallery items into rows of 5 for correct layout structure */
          gallery && gallery.length > 0 && Array.from({ length: Math.ceil(gallery.length / 5) }).map((_, i) => (
            <div className="row-crowd" key={i}>
              {gallery.slice(i * 5, (i + 1) * 5).map((item, idx) => {
                const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url
                return (
                  <a href="javascript:;" className={`crowd-box ${item.size || 'crow-size-1'}`} key={idx}>
                    <div className="box-img">
                      {imageUrl && <img src={imageUrl} alt={item.name} />}
                    </div>
                    <i className="icon-font external-link"></i>
                    <div>
                      <i className="icon-font asiatours-black"></i>
                      <span className="font-size-text">{item.name}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          ))
        }
      </section>
    </>
  )
}
