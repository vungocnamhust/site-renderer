
export function TourNavbar() {
  return (
    <nav className="navbar-cruise navbar-tour">
      <div className="container">
        <ul>
          <li>
            <a id="btn-dt-highlight" href="#dt-highlight" className="to-offset-desti">
              <i className="icon-font contract"></i>Highlights
            </a>
          </li>
          <li>
            <a id="btn-dt-map" href="#dt-map" className="to-offset-iti">
              <i className="icon-font map-itine"></i>Tour Map & Itinerary
            </a>
          </li>
          <li>
            <a id="btn-dt-exp" href="#dt-exp" className="to-offset-overview">
              <i className="icon-font icon-overview"></i>Tour Experiences
            </a>
          </li>
          <li>
            <a id="btn-dt-inclu" href="#dt-inclu" className="to-offset-high">
              <i className="icon-font icon-highlight"></i>Inclusions
            </a>
          </li>
          <li>
            <a id="btn-dt-choose-book-tour" href="#price-options" className="to-offset-offer">
              <i className="icon-font discount"></i>Choose Your Budget
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
