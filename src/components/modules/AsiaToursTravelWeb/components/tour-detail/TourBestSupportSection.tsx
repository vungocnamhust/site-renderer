
export function TourBestSupportSection() {
  const features = [
    {
      icon: 'icon-font icon-star',
      title: '100% Tailor-Made Holidays',
      description: 'Fully customized trip, designed just for you'
    },
    {
      icon: 'icon-font icon-users',
      title: 'No Hidden Costs or Booking Fees',
      description: 'Clear pricing from the start — no surprises'
    },
    {
      icon: 'icon-font icon-clock',
      title: 'Hand-Picked Hotels & Experiences',
      description: 'Premium-quality accommodations and activities'
    },
    {
      icon: 'icon-font icon-support',
      title: '24/7 On-Trip Support',
      description: 'We are always here to help during your trip'
    }
  ];
  
  return (
    <section className="section-best-support">
      <div className="container">
        <h2 className="title-h2-line">Why Choose Asia Tours?</h2>
        <div className="row">
          {features.map((f, idx) => (
            <div key={idx} className="col">
              <i className={f.icon} style={{ fontSize: '40px', color: '#d0b316', display: 'block', marginBottom: '15px' }}></i>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
