import React from "react";

const BookAppointmentPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.full_name.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const date = form.date.value;
    const time = form.time.value;
    const service = form.service.value;
    const message = form.message.value;
    const body = `Appointment Request%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ADate: ${encodeURIComponent(date)}%0ATime: ${encodeURIComponent(time)}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message)}`;
    window.open(`https://wa.me/255678110376?text=${body}`, "_blank");
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge">BOOK APPOINTMENT</span>
          <h1>Appointment Request</h1>
          <p className="lead">Send your appointment request to the clinic call center via email.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h2 style={{ margin: "0 0 10px" }}>Booking Form</h2>
              <form className="form" id="bookingForm" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="full_name">Full name</label>
                  <input id="full_name" name="full_name" required />
                </div>
                <div className="grid grid-2">
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" placeholder="+255 ..." required />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" />
                  </div>
                </div>
                <div className="grid grid-2">
                  <div className="field">
                    <label htmlFor="date">Preferred date</label>
                    <input id="date" name="date" type="date" />
                  </div>
                  <div className="field">
                    <label htmlFor="time">Preferred time</label>
                    <input id="time" name="time" type="time" />
                  </div>
                </div>
                <div className="field">
                  <label data-i18n="book.service" htmlFor="service">Service</label>
                  <select id="service" name="service">
                    <option>Comprehensive Eye Examination</option>
                    <option>Pediatric and Low Vision Assessment</option>
                    <option>Diagnose, Manage and Treat Disorders of the Eye</option>
                    <option>Clinical Refraction</option>
                    <option>Eyeglasses, Ophthalmic Medications and Contact Lenses</option>
                    <option>Outreach Programs</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="message">Additional notes</label>
                  <textarea id="message" name="message" placeholder="Symptoms, prescription details, or special needs"></textarea>
                </div>
                <button className="btn btn-primary" type="submit">Send Booking Request</button>
                <div className="notice">Staff will confirm by call/WhatsApp.</div>
              </form>
            </div>
            <div className="card">
              <h2 style={{ margin: "0 0 10px" }}>What happens next</h2>
              <ol className="list">
                <li>Submit the booking request.</li>
                <li>Clinic team reviews your service and preferred time.</li>
                <li>Confirmation is sent via call or WhatsApp.</li>
              </ol>
              <hr className="sep" />
              <p className="small"><strong>Tip:</strong> For faster response, use WhatsApp and include your preferred date/time.</p>
              <a className="btn btn-outline" href="https://wa.me/255678110376" rel="noopener noreferrer" target="_blank">Open WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookAppointmentPage;