'use client'
import { useState } from 'react'
import { AccommodationModal } from './modals/AccommodationModal'
import { ExperienceModal } from './modals/ExperienceModal'
import { GenericContentModal } from './modals/GenericContentModal'

// Define types for the detailed specs
interface DetailedSpecs {
    specs_accommodation?: any
    specs_experiences?: any
    specs_transport?: any
    specs_team?: any
    specs_meals?: any
    specs_services?: any
}

interface TourInclusionsSectionProps {
  includes?: { item: string }[]
  excludes?: { item: string }[]
  specs?: DetailedSpecs
}

export function TourInclusionsSection({ includes, excludes, specs }: TourInclusionsSectionProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <section className="detail-location" id="dt-inclu">
      <div className="container">
        <h2 className="title-h2-line">Inclusions of this tour</h2>
        <div className="include-box">
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-1 btn-accommodation">
              <div>
                <i className="icon-font bed"></i><br />
                <h3>Accommodation</h3>
              </div>
              <div>
                <p>Hotel (12 nights), Cruise (1 night)</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('accommodation')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-2 btn-transport">
              <div>
                <i className="icon-font exchange"></i>
                <i className="icon-font icon-plane"></i><br />
                <h3>Transport</h3>
              </div>
              <div>
                <p>Car, Walking, Cruise, Flight ...</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('transport')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-2 btn-team">
              <div>
                <i className="icon-font icon-users"></i><br />
                <h3>Team</h3>
              </div>
              <div>
                <p>Private Guide, Driver, Trip Managing Expert</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('team')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-2 btn-meal">
              <div>
                <i className="icon-font spoon-knife"></i><br />
                <h3>Meals</h3>
              </div>
              <div>
                <p>13 Breakfasts, 6 Lunches, 2 Dinners</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('meals')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-1 btn-experience">
              <div>
                <i className="icon-font image"></i><br />
                <h3>Experiences</h3>
              </div>
              <div>
                <p>16 Unique experiences...</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('experiences')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xlg-4 col-md-6">
            <div className="btn-include-2 btn-service">
              <div>
                <i className="icon-font checkmark"></i><br />
                <h3>Services</h3>
              </div>
              <div>
                <p>Entrance fees, excursions, visa, water...</p>
                <div className="read-more-st1">
                    <button 
                        className="link-st3" 
                        onClick={() => setActiveModal('services')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                    >
                        Read More
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AccommodationModal 
        isOpen={activeModal === 'accommodation'} 
        onClose={closeModal} 
        data={specs?.specs_accommodation} 
      />
      <ExperienceModal 
        isOpen={activeModal === 'experiences'} 
        onClose={closeModal} 
        data={specs?.specs_experiences} 
      />
      <GenericContentModal 
        isOpen={activeModal === 'transport'} 
        onClose={closeModal} 
        title="Transport Details"
        data={specs?.specs_transport} 
      />
      <GenericContentModal 
        isOpen={activeModal === 'team'} 
        onClose={closeModal} 
        title="Team Details"
        data={specs?.specs_team} 
      />
       <GenericContentModal 
        isOpen={activeModal === 'meals'} 
        onClose={closeModal} 
        title="Meals Details"
        data={specs?.specs_meals} 
      />
       <GenericContentModal 
        isOpen={activeModal === 'services'} 
        onClose={closeModal} 
        title="Services Details"
        data={specs?.specs_services} 
      />
    </section>
  )
}
