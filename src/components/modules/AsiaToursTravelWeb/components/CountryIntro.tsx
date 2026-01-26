interface CountryIntroProps {
  title: string
  slogan?: string
  description?: string
  fullDescription?: string
  stats?: { label: string; value: string }[]
  links?: { label: string; href: string; icon?: string }[]
}

export function CountryIntro({ title, slogan, description, fullDescription, stats, links }: CountryIntroProps) {
  return (
    <section className="pull-up">
      <div className="foreground">
        <article>
          <h2 className="title-h2">{title}</h2>
          {slogan && <p className="team-name">{slogan}</p>}
          {description && <h3>{description}</h3>}
          
          <div className="paragraph-hide">
            {fullDescription && <p dangerouslySetInnerHTML={{ __html: fullDescription }} />}
            
            {stats && stats.length > 0 && (
              <div className="mt-4">
                {stats.map((stat, idx) => (
                  <span key={idx} className="block">
                    <strong>{stat.label}:</strong> {stat.value}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="read-more-st1"><a href="#" className="link-st3">Read More ...</a></div>
          
          {links && links.length > 0 && (
            <div className="box-link">
              {links.map((link, idx) => (
                <a key={idx} href={link.href} className="link-st3" title={link.label}>
                  {link.label}&nbsp;{link.icon && <i className={`icon-font ${link.icon}`}></i>}
                </a>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
