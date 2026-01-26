
'use client'

export function InquiryFormSection() {
  return (
    <section className="section-bg">
      <div className="bacground-box">
        <div className="bg-left">
          <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/form_l.jpg" alt="" />
        </div>
        <div className="bg-right">
          <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/form_r.jpg" alt="" />
        </div>
      </div>
      <div className="container">
        <div className="wrap-mini-intro-st2">
          <div className="team-quote">
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/a2.webp" alt="" />
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/a3.webp" alt="" />
            <img src="https://d2lwt6tidfiof0.cloudfront.net/images/otm_home/a5.webp" alt="" />
            <div className="team-name" style={{ fontFamily: "'Reenie Beanie', cursive", fontSize: '36px' }}>
              Being the locals, We know our homeland the best!
            </div>
          </div>
        </div>
        <div className="team-mess mobile-hidden">
          <p>
            We are here to take the stress out of the tour & holiday planning process.<br />
            Let us help you plan an unforgettable journey of lifetime with High Quality & Affordable Price.<br />
            Surely, you will feel satisfied!
          </p>
        </div>
        <div className="team-contact">
          <form id="form-contact-home" style={{ position: 'relative' }}>
            <div className="form-field col-xlg-12">
              <div>Your trip ideas, questions...<span>*</span></div>
              <textarea id="f_question" name="question" required></textarea>
            </div>
            <div className="half">
              <div className="form-field col-xlg-6 col-xsm-12">
                <div>Name:<span>*</span></div>
                <input id="f_name" name="name" type="text" required />
              </div>
              <div className="form-field col-xlg-6 col-xsm-12">
                <div>Email:<span>*</span></div>
                <input id="f_mail" name="email" type="text" required />
              </div>
            </div>
            <div className="form-field col-xlg-12">
              <div className="booking-step-budget select-st2 select-st2-new">
                <select id="f_budget" name="f_budget">
                  <option value="">Select Budget per Person</option>
                  <option value="> $10,000">&gt; $10,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$2,000 - $3,000">$2,000 - $3,000</option>
                  <option value="$1,000 - $2,000">$1,000 - $2,000</option>
                  <option value="< $1,000">&lt; $1,000</option>
                </select>
                <div className="text">
                  <b>Your budget (USD)/person (without in/out flights)</b>
                  <i className="icon-font select-arrow-thin"></i>
                </div>
              </div>
              <div className="check-field">
                <div>
                  <label>
                    <div style={{ fontStyle: 'italic' }}>* Above is just budget reference to match you up with the perfect product, not fixed price.</div>
                  </label>
                </div>
              </div>
            </div>
            <button id="btn-contact-home" className="btn-st3" type="button">Send</button>
          </form>
        </div>
      </div>
    </section>
  )
}
