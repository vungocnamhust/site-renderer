import { CountryMapCarousel } from './CountryMapCarousel'

interface AboutSectionProps {
  title?: string
  content?: string
  videoUrl?: string
  videoTitle?: string
}

export function AboutSection({ 
  title,
  content,
  videoUrl,
  videoTitle 
}: AboutSectionProps) {
  const defaultTitle = 'We Design'
  const defaultSubtitle = 'Best Tailor-made Private Asia Tours For You'
  
  const defaultContent = `
    <b><a href="https://www.asiatours.com" title="Asia Tours">AsiaTours.com</a></b> specializes in Asia <b>Private Tours</b> &amp; <b>Tailor-Made Holiday</b> Packages.<br />
    We are proudly recommended by <b>National Geographic</b>, <b>The Washington Post</b>, <b>CNN Travel</b> &amp; <b>World Travel Awards winner</b>... To be the <b>Best Tour Operators</b> in each destination where you travel to, our local <b>professional team</b> is always by your side & <b>take care of your trip</b> from start to end to make your tour <b>incredible & unforgettable</b> experiences...<br /><br />
    <img src="https://d2lwt6tidfiof0.cloudfront.net/images/asia-h1.webp" style="width: 686px" alt="Asia Tours" /><br />
    <br />At asiatours.com, we <b>don&apos;t sell mass tour</b> packages, every tour is <b>privately customized</b> & designed to <b>suit your personal desire</b>: budget, travel schedules, destinations, special requirements... Our Asia Tour Experts are <b>always ready and happy to work</b> with each customer individually to give you a dream trip.<br /><br />
  `
  
  const defaultVideoUrl = 'https://player.vimeo.com/video/568383717?badge=0&autopause=0&player_id=0&app_id=58479'
  const defaultVideoTitle = 'Asia Tours Official Video 4K | We will show you Asia, better than anyone else!'
  
  const defaultMapContent = `
    We offer a wide range of Asia tour itineraries covering most popular countries such as 
    <b><a href="/vietnam/tours" title="Vietnam Tours">Vietnam</a></b>, 
    <b><a href="/cambodia/tours" title="Cambodia Tours">Cambodia</a></b>, 
    <b><a href="/laos/tours" title="Laos Tours">Laos</a></b>, 
    <b><a href="/myanmar/tours" title="Myanmar Tours">Myanmar</a></b>, 
    <b><a href="/thailand/tours" title="Thailand Tours">Thailand</a></b>, 
    <b><a href="/indonesia/tours" title="Indonesia Tours">Indonesia</a></b>, 
    <b><a href="/malaysia/tours" title="Malaysia Tours">Malaysia</a></b>, 
    <b><a href="/singapore/tours" title="Singapore Tours">Singapore</a></b>, 
    <b><a href="/philippines/tours" title="Philippines Tours">Philippines</a></b>, 
    <b><a href="/china/tours" title="China Tours">China</a></b>, 
    <b><a href="/hong-kong/tours" title="Hong Kong Tours">Hong Kong</a></b>, 
    <b><a href="/japan/tours" title="Japan Tours">Japan</a></b>, 
    <b><a href="/south-korea/tours" title="South Korea Tours">South Korea</a></b>, 
    <b><a href="/bhutan/tours" title="Bhutan Tours">Bhutan</a></b>, 
    <b><a href="/nepal/tours" title="Nepal Tours">Nepal</a></b>, 
    <b><a href="/india/tours" title="India Tours">India</a></b>, 
    <b><a href="/sri-lanka/tours" title="Sri Lanka Tours">Sri Lanka</a></b>... 
    All <b>Asia Tours</b> can be <b>customized easily</b> & start on <b>any date</b> you want.
  `

  return (
    <section className="mg-top mg-bot-0">
      <article className="wrap-mini-intro special-width-destop">
        <h2 className="title-h2-line">
          {title || defaultTitle} <strong>Asia Tours</strong> Your Way
          <br /> 
          {defaultSubtitle}
        </h2>
        
        <p 
          className="paragraph"
          dangerouslySetInnerHTML={{ __html: content || defaultContent }}
        />
        
        {/* Video Embed */}
        <div style={{ padding: '56.25% 0 0 0', position: 'relative', width: '100%' }}>
          <iframe 
            src={videoUrl || defaultVideoUrl}
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            title={videoTitle || defaultVideoTitle}
          />
        </div>
        
        <p 
          className="paragraph"
          dangerouslySetInnerHTML={{ __html: defaultMapContent }}
        />
      </article>
      
      {/* Country Map Carousel - inside same section */}
      <CountryMapCarousel />
    </section>
  )
}
