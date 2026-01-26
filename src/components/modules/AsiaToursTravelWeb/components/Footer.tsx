import Link from 'next/link'
import type { Footer as FooterType } from '../types'

interface FooterProps {
  data: FooterType
}

export function Footer({ data }: FooterProps) {
  const copyright = data.copyright || 'Copyright © 2026. All information, logos, designs, text, photos, graphics... on this website are owned by Asia Tours Co., Ltd'
  const aboutText = data.aboutText || 'We are proudly recommended by National Geographic, The Washington Post, CNN Travel... To be the Best Tour Operators in each Asia destination.'

  return (
    <footer>
      <div className="padding-top-0 padding-bot-0">
        <div className="brand-section">
          <h3>A Company You Can Trust...</h3>
          <ul className="brand-magazine">
            {data.footerPartners ? (
                data.footerPartners.map((partner, idx) => {
                    const logoUrl = typeof partner.logo === 'string' ? partner.logo : partner.logo?.url || ''
                    return (
                        <li key={idx} className="tooltip-itine">
                            <a rel="nofollow" href={partner.link || '#'} className="tooltip" title={partner.name}>
                                <img src={logoUrl} alt={partner.name} style={{ height: '58px', objectFit: 'contain' }} />
                                <span>{partner.name}</span>
                            </a>
                        </li>
                    )
                })
            ) : (
                <>
                    <li className="tooltip-itine"><a rel="nofollow" href="#" className="asta-bg tooltip" title="Official Member ASTA"><span>Official Member ASTA</span></a></li>
                    <li className="tooltip-itine"><a rel="nofollow" href="#" className="tripadvisor-bg tooltip" title="Travelers Choice Award"><span>Travelers Choice Award</span></a></li>
                </>
            )}
          </ul>
        </div>
        <div className="container">
          <div className="col-xlg-4 col-md-6 col-xsm-12">
            <article>
              <h3>Official Website of Asia Tours</h3>
              <p dangerouslySetInnerHTML={{ __html: aboutText }} />
            </article>
            <article>
              <h3>Contact Us</h3>
              <p><span>Email:</span>experts@asiatours.com</p>
              <p><span>Hotline:</span>(+84) 916 952 668</p>
            </article>
            <article>
              <h3>Follow Us</h3>
              <div className="flex space-x-2">
                {data.socialLinks ? (
                  data.socialLinks.map((social, idx) => (
                    <a key={idx} rel="nofollow" href={social.url} target="_blank" className="mr-2">
                      <i className={`icon-font ${social.platform}-square-brands`}></i> 
                      {/* Note: Icon class mapping might need adjustment based on fontawesome version */}
                    </a>
                  ))
                ) : (
                  <>
                    <a rel="nofollow" href="https://www.facebook.com/AsiaToursOfficial" target="_blank"><i className="icon-font facebook-square-brands"></i></a>
                    <a rel="nofollow" href="#"><i className="icon-font twitter-brands"></i></a>
                    <a rel="nofollow" href="#"><i className="icon-font instagram-brands"></i></a>
                  </>
                )}
              </div>
            </article>
          </div>
          
          <div className="col-xlg-4 col-md-6 col-xsm-12">
            <article className="col-xlg-6">
              <h3>About us</h3>
              <ul>
                <li><Link href="/about-us" rel="nofollow">Our story</Link></li>
                <li><Link href="/contact" rel="nofollow">Contact Us</Link></li>
              </ul>
              <h3>Useful Info</h3>
              <ul>
                <li><Link href="/blog" title="Asia Travel Guide">Travel Inspirations</Link></li>
              </ul>
            </article>
            <article className="col-xlg-6">
              <h3>our destinations</h3>
              <ul>
                <li><Link href="/vietnam/tours" title="Vietnam Tours">Vietnam Tours</Link></li>
                <li><Link href="/cambodia/tours" title="Cambodia Tours">Cambodia Tours</Link></li>
                <li><Link href="/laos/tours" title="Laos Tours">Laos Tours</Link></li>
                <li><Link href="/thailand/tours" title="Thailand Tours">Thailand Tours</Link></li>
              </ul>
            </article>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="brand-section">
          <p className="copy-right">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
