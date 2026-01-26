
import type { Tour } from '@/payload-types'

interface TourPriceOptionsProps {
  tour: Tour
}

export function TourPriceOptions({ tour }: TourPriceOptionsProps) {
  // @ts-ignore - priceOptions field
  const priceOptions = tour.priceOptions || [
    { 
      name: 'Economy', 
      price: 2282, 
      description: '3* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners'
    },
    { 
      name: 'Deluxe', 
      price: 2966, 
      description: '4* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners'
    },
    { 
      name: 'Luxury', 
      price: 4107, 
      description: '5* Hotel (12 nights), Cruise (1 night)\nCar, Walking, Cruise, Flight\nPrivate Guide, Driver\n13 Breakfasts, 6 Lunches, 2 Dinners'
    }
  ];

  return (
    <section className="section-current-box" id="price-options">
      <div className="container">
        <div className="wrap-mini-intro">
          <h2 className="title-h2-line">It's Time to Make a Journey</h2>
          <p className="paragraph">Choose Your Best Choice</p>
        </div>
        <div className="row" style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {priceOptions.map((option: any, idx: number) => (
            <div key={idx} className="col-xlg-4 col-lg-4 col-md-6" style={{ flex: '1 1 300px', maxWidth: '350px' }}>
              <div className={`current-box ${idx === 1 ? 'current-box-2' : ''}`}>
                <h3>{option.name}</h3>
                <div className="body-current-box">
                  <p>{option.description}</p>
                  <div className="price-box">
                    from <strong>US${option.price}</strong> / Person
                  </div>
                  <a href="javascript:;" className="btn-st2">Enquire Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
