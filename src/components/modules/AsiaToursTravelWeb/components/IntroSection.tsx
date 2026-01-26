export function IntroSection() {
  return (
    <>
      <section className="best-support">
        <div className="wrap-mini-intro wrap-mini-intro-st2">
          {/* Team Quote Images */}
           <div className="team-quote">
            {['a12', 'a2', 'a3', 'a5', 'a6', 'a10'].map(img => (
              <img key={img} src={`https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/${img}.webp`} alt="Expert" />
            ))}
          </div>
          <h1 className="team-name line">
            We are proudly Asia Tour Experts<br /> Specializing in <b>Asia Private Tours</b> & Tailored Travel<br />
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/asia-geo-post-wta.png" style={{width: '886px', paddingTop: '10px'}} alt="Awards" />
          </h1>
        </div>
        <div className="container">
          <div className="col-xlg-3 col-sm-6">
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h1.webp" alt="Personalized Itinerary" />
            <article>
              <h3>100% Personalized Itinerary</h3>
              <p className="paragraph">Hassle-free and uniquely personalized! You&apos;ll get a completely flexible trip plan tailored to your individual interests...</p>
            </article>
          </div>
          <div className="col-xlg-3 col-sm-6">
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/h2.webp" alt="Private Guide" style={{paddingBottom: '8px'}} />
            <article>
               <h3>Private Guide, Car & Driver</h3>
               <p className="paragraph">You always have private driver & private car flexible upon your travel schedules...</p>
            </article>
          </div>
           {/* More Columns... Simplified for brevity */}
        </div>
      </section>

      <section className="mg-top mg-bot-0">
        <article className="wrap-mini-intro special-width-destop">
          <h2 className="title-h2-line">We Design <strong>Asia Tours</strong> Your Way<br /> Best Tailor-made Private Asia Tours For You</h2>
          <p className="paragraph">
            <b><a href="https://www.asiatours.com" title="Asia Tours">AsiaTours.com</a></b> specializes in Asia <b>Private Tours</b>...
             {/* Content truncated */}
          </p>
          {/* Video Iframe */}
        </article>
      </section>
    </>
  )
}
