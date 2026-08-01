import { useState } from 'react';
import { genres, famous, stories, reviews as baseReviews } from '../data.js';
import { useApp } from '../context/AppContext.jsx';
import StoryCard from '../components/StoryCard.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const REV_COLORS = ['#7C3AED', '#1D4ED8', '#B91C1C', '#065F46', '#9D174D', '#92400E'];
const ALL_TITLES = [...famous, ...stories].map(s => s.title);

function ReviewCard({ r }) {
  const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
  return (
    <div className="rev-card">
      <div className="rv-head">
        <div className="rv-av" style={{ background: r.color + '18', color: r.color, borderColor: r.color + '44' }}>{r.name.slice(0, 2)}</div>
        <div><div className="rv-name">{r.name}</div><div className="rv-story">on "{r.story}"</div></div>
      </div>
      <div className="rv-stars">{stars}</div>
      <div className="rv-text">"{r.text}"</div>
      <div className="rv-date">{r.date}</div>
    </div>
  );
}

export default function HomePage() {
  const { goPage, requireLogin, openStoryModal, goLibrary } = useApp();

  const [userRevs, setUserRevs] = useState([]);
  const [rvName, setRvName] = useState('');
  const [rvStory, setRvStory] = useState('');
  const [rvText, setRvText] = useState('');
  const [rvRating, setRvRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [rvOk, setRvOk] = useState(false);

  const [nlEmail, setNlEmail] = useState('');
  const [nlOk, setNlOk] = useState(false);

  function submitReview() {
    const name = rvName.trim(), story = rvStory, text = rvText.trim();
    if (!name || !story || !text || !rvRating) {
      alert('Please fill in all fields and select a rating!');
      return;
    }
    const color = REV_COLORS[Math.floor(Math.random() * REV_COLORS.length)];
    setUserRevs(prev => [{ name, story, stars: rvRating, text, date: 'Just now', color }, ...prev]);
    setRvName(''); setRvStory(''); setRvText(''); setRvRating(0);
    setRvOk(true);
    setTimeout(() => setRvOk(false), 4000);
  }

  function subscribe() {
    if (!nlEmail.trim() || !nlEmail.includes('@')) { alert('Please enter a valid email.'); return; }
    setNlEmail('');
    setNlOk(true);
  }

  const featured = stories[0];

  return (
    <div id="page-home" className="page active">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-eyebrow fu"><div className="pulse-dot"></div>Your University Library, Online<div className="pulse-dot"></div></div>
          <h1 className="fu d1">Welcome to<br /><span className="gold italic">Library</span><span className="ember">Hub</span></h1>
          <p className="hero-sub fu d2">Your university library's digital home — discover books, borrow physical copies, purchase titles, and connect with a community of readers across campus.</p>
          <div className="hero-actions fu d3">
            <button className="btn btn-flame" onClick={() => goPage('library')}>✦ Browse Collection</button>
            <button className="btn btn-ghost" onClick={() => requireLogin('booking')}>📋 Book a Copy</button>
          </div>
          <div className="hero-divider fu d4"></div>
          <div className="hero-stats fu d4">
            <div className="stat-item"><span className="stat-num">500+</span><span className="stat-lbl">Books</span></div>
            <div className="stat-item"><span className="stat-num">7</span><span className="stat-lbl">Genres</span></div>
            <div className="stat-item"><span className="stat-num">12K+</span><span className="stat-lbl">Members</span></div>
            <div className="stat-item"><span className="stat-num">4.8★</span><span className="stat-lbl">Rating</span></div>
          </div>
        </div>
      </section>

      {/* GENRES */}
      <section id="genres" style={{ background: 'var(--abyss)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Explore by Genre</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Choose Your <em>World</em></h2>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Every genre is a doorway into another universe. Step through and discover.</p>
        </div>
        <div className="genre-grid">
          {genres.map(g => (
            <div className="genre-tile" key={g.key} onClick={() => goLibrary(g.key)}>
              <span className="g-icon">{g.icon}</span>
              <div className="g-name">{g.name}</div>
              <div className="g-count">{g.count} stories</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAMOUS CLASSICS */}
      <section id="famous" style={{ background: 'var(--deep)', borderTop: '1px solid var(--border)' }}>
        <div className="famous-header">
          <div>
            <div className="eyebrow">Timeless Masterpieces</div>
            <h2 className="sec-title">Famous <em>Classics</em></h2>
            <p className="sec-sub">The greatest stories ever told — legends that have moved millions across centuries.</p>
          </div>
          <button className="see-all-btn" onClick={() => goPage('library')}>See All Stories →</button>
        </div>
        <div className="famous-grid">
          {famous.map((s, i) => (
            <div className="famous-card" key={s.title}>
              <div className="fc-img-wrap">
                <img className="fc-img" src={s.img} alt={s.title} loading="lazy" onError={(e) => e.currentTarget.style.display = 'none'} />
                <div className="fc-overlay"></div>
                <span className={`fc-pill pill-${s.genre}`}>{genres.find(g => g.key === s.genre)?.name || s.genre}</span>
                <span className="fc-rating">⭐ {s.rating}</span>
                <span className="fc-classic-badge">Classic</span>
              </div>
              <div className="fc-body">
                <div className="fc-title">{s.title}</div>
                <div className="fc-author">✍️ {s.author} · {s.year}</div>
                <div className="fc-summary">{s.summary.slice(0, 200)}…</div>
                <div className="fc-meta">{s.tags.map(t => <span className="fc-tag" key={t}>{t}</span>)}</div>
                <div className="fc-footer">
                  <div className="fc-chars"><strong>{s.characters.split(',')[0]}</strong> & more</div>
                  <button className="fc-read-btn" onClick={() => openStoryModal(s)}>Read More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOME PREVIEW */}
      <section id="home-preview">
        <div className="preview-header">
          <div>
            <div className="eyebrow">From the Library</div>
            <h2 className="sec-title">Recent <em>Stories</em></h2>
            <p className="sec-sub">A glimpse into our collection. Hundreds more await inside.</p>
          </div>
          <button className="see-all-btn" onClick={() => goPage('library')}>Open Full Library →</button>
        </div>
        <div className="preview-grid">
          {stories.slice(0, 4).map(s => <StoryCard story={s} key={s.title} onOpen={openStoryModal} />)}
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured">
        <div className="feat-wrap">
          <div className="feat-img-box">
            <img className="feat-img" src={featured.img} alt="Featured Story" loading="lazy" />
            <div className="feat-img-frame"></div>
            <div className="feat-badge-wrap"><div className="feat-badge">✦ Editor's Pick</div></div>
          </div>
          <div className="feat-info">
            <div className="eyebrow">Featured Story</div>
            <div className="feat-title">{featured.title}</div>
            <div className="feat-quote">"{featured.summary.slice(0, 180)}…"</div>
            <ul className="feat-meta">
              <li><span className="fk">Author</span><span className="fv">{featured.author}</span></li>
              <li><span className="fk">Characters</span><span className="fv">{featured.characters}</span></li>
              <li><span className="fk">Rating</span><span className="fv">⭐ {featured.rating} · {featured.reviews.toLocaleString()} reviews</span></li>
              <li><span className="fk">Pages</span><span className="fv">{featured.pages}</span></li>
            </ul>
            <div className="feat-btns">
              <button className="btn btn-flame" onClick={() => openStoryModal(featured)}>📖 Read More</button>
              <button className="btn btn-ghost" onClick={() => goPage('library')}>Browse Library</button>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" style={{ background: 'var(--abyss)', borderTop: '1px solid var(--border)' }}>
        <div className="eyebrow">Reader Voices</div>
        <h2 className="sec-title">What Readers <em>Say</em></h2>
        <p className="sec-sub" style={{ marginBottom: '2.5rem' }}>Genuine reviews from passionate readers across the world.</p>
        <div className="rev-grid">
          {[...userRevs, ...baseReviews].map((r, i) => <ReviewCard r={r} key={i} />)}
        </div>
        <div className="rev-form">
          <h3>✍️ Leave Your Review</h3>
          <div className="form-row"><label>Your Name</label>
            <input type="text" value={rvName} onChange={e => setRvName(e.target.value)} placeholder="e.g. Amara K." />
          </div>
          <div className="form-row"><label>Story</label>
            <select value={rvStory} onChange={e => setRvStory(e.target.value)}>
              <option value="">— Select a story —</option>
              {ALL_TITLES.map(t => <option value={t} key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-row"><label>Rating</label>
            <div className="star-row">
              {[1, 2, 3, 4, 5].map(v => (
                <span
                  key={v}
                  className={(hoverRating ? v <= hoverRating : v <= rvRating) ? 'lit' : ''}
                  onMouseOver={() => setHoverRating(v)}
                  onMouseOut={() => setHoverRating(0)}
                  onClick={() => setRvRating(v)}
                >★</span>
              ))}
            </div>
          </div>
          <div className="form-row"><label>Your Review</label>
            <textarea value={rvText} onChange={e => setRvText(e.target.value)} placeholder="What moved you? What lingered after the last page?"></textarea>
          </div>
          <button className="btn btn-flame" onClick={submitReview}>Submit Review ✦</button>
          {rvOk && <div style={{ display: 'block' }} id="rv-ok">✅ Your review has been published.</div>}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: 'var(--deep)', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Why LibraryHub</div>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Built for <em>University</em> Communities</h2>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Everything your university library needs in one digital platform.</p>
        </div>
        <div className="about-grid">
          <div className="about-card"><div className="a-icon">📚</div><h3>Vast Collection</h3><p>Hundreds of curated books across every genre, maintained by your university library and enriched by student contributions.</p></div>
          <div className="about-card"><div className="a-icon">🤖</div><h3>AI Book Guide</h3><p>Not sure what to read? Sage helps you discover books perfectly tailored to your academic interests and personal taste.</p></div>
          <div className="about-card"><div className="a-icon">🏛️</div><h3>Library Profiles</h3><p>Universities and libraries can publish their own profile page — photos, opening hours, description and contact details.</p></div>
          <div className="about-card"><div className="a-icon">🔖</div><h3>Borrow & Purchase</h3><p>Reserve a physical copy to borrow from the library counter, or purchase books on-site with a simple cash payment.</p></div>
          <div className="about-card"><div className="a-icon">📱</div><h3>Read Anywhere</h3><p>Fully responsive — desktop, tablet, or phone. Your library travels with you, always beautiful and fast.</p></div>
          <div className="about-card"><div className="a-icon">✉️</div><h3>Weekly Picks</h3><p>Subscribe and get hand-curated book selections, author spotlights, and genre highlights delivered to your inbox.</p></div>
        </div>
      </section>

      {/* CHATBOT */}
      <section id="chatbot" style={{ background: 'radial-gradient(ellipse 60% 50% at 90% 50%,rgba(192,57,43,0.08) 0%,transparent 55%),var(--abyss)', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="eyebrow">AI Story Guide</div>
          <h2 className="sec-title">Meet <em>Sage</em></h2>
          <p className="sec-sub">Tell Sage your mood, genre, or academic interest — get personalised book recommendations instantly.</p>
        </div>
        <ChatWidget />
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter">
        <div className="nl-inner">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Stay in the Loop</div>
          <h2 className="sec-title">New Stories <em>Every Week</em></h2>
          <p className="sec-sub">Hand-picked selections, author spotlights, and genre highlights to your inbox.</p>
          <div className="nl-form">
            <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)} placeholder="your@email.com" />
            <button onClick={subscribe}>Subscribe 📬</button>
          </div>
          {nlOk && <p style={{ display: 'block' }}>🎉 You're subscribed! Welcome to the LibraryHub family.</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-top">
          <div className="foot-brand">
            <span className="foot-brand-name"><em>Library</em>Hub</span>
            <p>Your university library's digital home. Discover, borrow, purchase, and share books — wherever your studies take you.</p>
          </div>
          <div className="foot-col">
            <h4>Genres</h4>
            <a onClick={() => goLibrary('fantasy')}>Fantasy</a>
            <a onClick={() => goLibrary('sci-fi')}>Science Fiction</a>
            <a onClick={() => goLibrary('mystery')}>Mystery</a>
            <a onClick={() => goLibrary('romance')}>Romance</a>
            <a onClick={() => goLibrary('horror')}>Horror</a>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <a onClick={() => goPage('home')}>Famous Classics</a>
            <a onClick={() => goPage('library')}>Full Library</a>
            <a onClick={() => requireLogin('libprofile')}>Our Library</a>
            <a onClick={() => goPage('home')}>Reviews</a>
            <a onClick={() => goPage('home')}>AI Guide</a>
          </div>
          <div className="foot-col">
            <h4>Account</h4>
            <a onClick={() => goPage('auth')}>Sign In</a>
            <a onClick={() => goPage('auth')}>Create Account</a>
            <a>About Us</a>
            <a>Privacy Policy</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2025 LibraryHub. All rights reserved.</span>
          <span>Made with ❤️ for university readers everywhere</span>
        </div>
      </footer>
    </div>
  );
}
