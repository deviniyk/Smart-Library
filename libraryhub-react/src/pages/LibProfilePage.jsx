import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const heroImgs = [
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80',
];

const galleryImgs = [
  ['https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80', 'Reading hall'],
  ['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80', 'Book stacks'],
  ['https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&q=80', 'Study area'],
  ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', 'Books collection'],
  ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80', 'Library entrance'],
  ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80', 'Library interior'],
];

const HOURS = [
  ['Monday', '8:00 AM – 8:00 PM'], ['Tuesday', '8:00 AM – 8:00 PM'], ['Wednesday', '8:00 AM – 8:00 PM'],
  ['Thursday', '8:00 AM – 8:00 PM'], ['Friday', '8:00 AM – 8:00 PM'], ['Saturday', '9:00 AM – 5:00 PM'],
  ['Sunday', 'Closed'],
];

const SERVICES = [
  ['📖', 'Book Borrowing', 'Borrow physical copies for up to 30 days with student ID'],
  ['💻', 'Digital Resources', 'Access 50,000+ e-books and online journals 24/7'],
  ['🖨️', 'Print & Scan', 'Printing, scanning and photocopying at the service counter'],
  ['🔬', 'Research Support', 'One-on-one sessions with our specialist librarians'],
  ['🏠', 'Study Rooms', 'Book private study rooms for group or individual study'],
];

export default function LibProfilePage() {
  const { setLightboxSrc } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 Sun
    const hour = now.getHours();
    let open;
    if (day === 0) open = false;
    else if (day === 6) open = hour >= 9 && hour < 17;
    else open = hour >= 8 && hour < 20;
    setIsOpen(open);
  }, []);

  return (
    <div id="page-libprofile" className="page active">
      <div className="lp-hero">
        <div className="lp-hero-bg">
          {heroImgs.map((src, i) => (
            <img key={i} src={src} alt="Library" onClick={() => setLightboxSrc(src)} />
          ))}
        </div>
        <div className="lp-hero-gradient"></div>
        <div className="lp-hero-content">
          <div className="lp-hero-badge">🏛️ University Library</div>
          <div className="lp-lib-name">University of <em>Excellence</em> Library</div>
          <div className="lp-lib-tagline">"Inspiring minds through the power of knowledge and discovery."</div>
          <div className="lp-hero-meta">
            <div className="lp-hero-stat">📍 <strong>Colombo, Sri Lanka</strong></div>
            <div className="lp-hero-stat">📚 <strong>500+</strong> books</div>
            <div className="lp-hero-stat">👥 <strong>12,000+</strong> members</div>
            <div className="lp-hero-stat">⭐ <strong>4.8</strong> rating</div>
          </div>
        </div>
      </div>

      <div className="lp-info-strip">
        <div className="lp-info-item"><span className="lp-info-icon">📞</span><span>+94 11 234 5678</span></div>
        <div className="lp-info-item"><span className="lp-info-icon">✉️</span><span>library@university.edu.lk</span></div>
        <div className="lp-info-item"><span className="lp-info-icon">🌐</span><span>www.university.edu.lk/library</span></div>
        <div className="lp-info-item"><span className="lp-info-icon">📍</span><span>123 University Ave, Colombo 07</span></div>
        <div className="lp-social-row">
          <a className="lp-social-btn" title="Facebook" onClick={e => e.preventDefault()}>📘</a>
          <a className="lp-social-btn" title="Instagram" onClick={e => e.preventDefault()}>📷</a>
          <a className="lp-social-btn" title="Twitter / X" onClick={e => e.preventDefault()}>🐦</a>
          <a className="lp-social-btn" title="YouTube" onClick={e => e.preventDefault()}>▶️</a>
          <a className="lp-social-btn" title="LinkedIn" onClick={e => e.preventDefault()}>💼</a>
        </div>
      </div>

      <div className="lp-body">
        <div>
          <div className="lp-desc-card">
            <h2><span>🏛️</span> About Our Library</h2>
            <div className="lp-desc-text">
              <p>Welcome to the University of Excellence Library — the academic heart of our campus. Established in 1952, our library has grown to become one of the most comprehensive research and learning institutions in Sri Lanka, serving over 12,000 students, faculty, and researchers every year.</p>
              <p>Our collection spans more than 500,000 print volumes, digital journals, e-books, and rare manuscripts across every field of study. From undergraduate course materials to cutting-edge research publications, we are committed to supporting the academic journey of every member of our university community.</p>
              <p>Beyond books, we offer quiet study spaces, collaborative zones, computer labs, printing services, and dedicated research support from our team of professional librarians. We believe that access to knowledge is the foundation of every great achievement.</p>
            </div>
          </div>

          <div className="lp-gallery-card">
            <h2>📸 Library Gallery</h2>
            <div className="lp-gallery-grid">
              {galleryImgs.map(([src, alt], i) => (
                <img className="lp-gallery-img" key={i} src={src} alt={alt} onClick={() => setLightboxSrc(src)} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="lp-hours-card">
            <h2>🕐 Opening Hours</h2>
            <div className="lp-now-open"><div className="lp-now-dot"></div>{isOpen ? 'Currently Open' : 'Currently Closed'}</div>
            <div>
              {HOURS.map(([day, time]) => (
                <div className="lp-hours-row" key={day}>
                  <span className="lp-hours-day">{day}</span>
                  <span className={`lp-hours-time${time === 'Closed' ? ' closed' : ''}`}>{time}</span>
                </div>
              ))}
            </div>
            <div className="lp-hours-note">📌 Extended hours during exam periods: 7:00 AM – 10:00 PM</div>
          </div>

          <div className="lp-venue-card">
            <h2>📍 Venue</h2>
            <div className="lp-venue-map">
              <iframe
                title="Library location map"
                src="https://www.google.com/maps?q=Colombo+07+Sri+Lanka&output=embed"
                loading="lazy"
                style={{ border: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
            <div className="lp-venue-row">
              <div className="lp-venue-icon">📍</div>
              <div className="lp-venue-info"><strong>Address</strong><span>123 University Ave, Colombo 07, Sri Lanka</span></div>
            </div>
            <div className="lp-venue-row">
              <div className="lp-venue-icon">🏢</div>
              <div className="lp-venue-info"><strong>Building</strong><span>Main Library Block, 2nd – 4th Floor</span></div>
            </div>
            <div className="lp-venue-row">
              <div className="lp-venue-icon">🅿️</div>
              <div className="lp-venue-info"><strong>Parking</strong><span>Free parking available at the North Campus lot</span></div>
            </div>
          </div>

          <div className="lp-services-card">
            <h2>🎓 Library Services</h2>
            <div>
              {SERVICES.map(([icon, title, desc]) => (
                <div className="lp-service-item" key={title}>
                  <div className="lp-service-icon">{icon}</div>
                  <div className="lp-service-info"><strong>{title}</strong><span>{desc}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
