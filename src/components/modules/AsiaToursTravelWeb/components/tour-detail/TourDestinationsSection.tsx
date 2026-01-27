
import type { Tour } from '@/payload-types'

interface TourDestinationsSectionProps {
  tour: Tour
}

export function TourDestinationsSection({ tour }: TourDestinationsSectionProps) {
  // @ts-ignore - destinations field added to schema
  const destinations = tour.destinations || [
    { name: 'Hanoi', duration_days: 2 },
    { name: 'Halong Bay', duration_days: 1 },
    { name: 'Hoi An', duration_days: 3 },
    { name: 'Danang', duration_days: 1 },
    { name: 'Ho Chi Minh', duration_days: 2 },
    { name: 'Mekong', duration_days: 1 },
    { name: 'Nha Trang', duration_days: 4 }
  ];

  // @ts-ignore - countries is a relationship field
  const countries = tour.countries as any[] || [];
  const firstCountry = countries.length > 0 && typeof countries[0] === 'object' ? countries[0]?.name : null;
  const countryName = firstCountry || 'Vietnam';
  const countrySlug = firstCountry ? firstCountry.toLowerCase() : 'vietnam';

  // Generate image URL for destination
  const getDestinationImage = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `https://d2lwt6tidfiof0.cloudfront.net/uploads/googlemap/${slug}-550-559-300.jpg`;
  };

  return (
    <section className="detail-location mg-top-0">
      <div className="container">
        <div className="wrap-mini-intro-st2">
          <h2 className="team-name">{countryName} - The Land of Timeless Charm!</h2>
          <div className="box-img-st2">
            <img 
              className="lag-img" 
              src={`https://d2lwt6tidfiof0.cloudfront.net/images/destination/${countrySlug}.jpg`} 
              alt={countryName} 
            />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="location-list">
          <div><i className="icon-font icon-destination"></i></div>
          {destinations.map((dest: any, idx: number) => (
            <a 
              key={idx} 
              href={`https://www.asiatours.com/${dest.name.replace(/\s+/g, '-')}/`} 
              target="_blank"
              title={dest.name}
            >
              {dest.name}
            </a>
          ))}
        </div>
        <div className="wrap-slide-st4">
          <div className="synch-carousels">
            <div className="gallery">
              {destinations.map((dest: any, idx: number) => (
                <div className="item" key={idx}>
                  <a href="javascript:" className="btn-modal-tour">
                    <img src={getDestinationImage(dest.name)} alt={dest.name} />
                    <div className="box-text">
                      <h3 className="line" data-content={dest.name}>{dest.name}</h3>
                      <p>{dest.duration_days} Day{dest.duration_days > 1 ? 's' : ''}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="nav-arrows">
              <button className="arrow-left">
                <i className="icon-font select-arrow-thin"></i>
              </button>
              <button className="arrow-right">
                <i className="icon-font select-arrow-thin"></i>
              </button>
            </div>
          </div>
        </div>
        {/* Experience Icons */}
        <div className="wrap-tooltip">
          <a href="javascript:;" title="Swimming" className="tooltip">
            <i className="icon-font icon-swimming"></i><span>swimming<i></i></span>
          </a>
          <a href="javascript:;" title="Cruising" className="tooltip">
            <i className="icon-font icon-cruising"></i><span>cruising<i></i></span>
          </a>
          <a href="javascript:;" title="Boating" className="tooltip">
            <i className="icon-font icon-boating"></i><span>boating<i></i></span>
          </a>
          <a href="javascript:;" title="Cultural" className="tooltip">
            <i className="icon-font icon-cultural"></i><span>cultural<i></i></span>
          </a>
          <a href="javascript:;" title="Heritage" className="tooltip">
            <i className="icon-font icon-heritage"></i><span>heritage<i></i></span>
          </a>
          <a href="javascript:;" title="Nature" className="tooltip">
            <i className="icon-font icon-nature"></i><span>nature<i></i></span>
          </a>
          <a href="javascript:;" title="Cuisine" className="tooltip">
            <i className="icon-font icon-cuisine"></i><span>cuisine<i></i></span>
          </a>
          <a href="javascript:;" title="Kayaking" className="tooltip">
            <i className="icon-font icon-kayaking"></i><span>kayaking<i></i></span>
          </a>
        </div>
        {/* Description */}
        <p className="paragraph">
          {tour.shortDescription || 'Create unforgettable memories with your loved ones on this cheerful 14-day Vietnam family vacation.'}
        </p>
      </div>
    </section>
  )
}
