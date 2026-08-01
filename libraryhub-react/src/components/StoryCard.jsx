import { genres } from '../data.js';

function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(re);
  return parts.map((p, i) => (re.test(p) && p.toLowerCase() === query.toLowerCase()
    ? <span className="hl" key={i}>{p}</span> : p));
}

export default function StoryCard({ story, onOpen, query = '' }) {
  const genreName = genres.find(g => g.key === story.genre)?.name || story.genre;
  const stars = '★'.repeat(Math.round(story.rating)) + '☆'.repeat(5 - Math.round(story.rating));

  return (
    <div className="story-card slide-in">
      <div className="sc-img">
        <img src={story.img} alt={story.title} loading="lazy"
          onError={(e) => { e.currentTarget.parentElement.style.background = 'var(--surface3)'; e.currentTarget.style.display = 'none'; }} />
        <div className="sc-img-overlay"></div>
        <span className={`fc-pill pill-${story.genre}`} style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>{genreName}</span>
      </div>
      <div className="sc-body">
        <div className="sc-title">{highlight(story.title, query)}</div>
        <div className="sc-author">✍️ {highlight(story.author, query)}</div>
        <div className="sc-summary">{story.summary.slice(0, 200)}…</div>
        <div className="sc-meta">
          <div className="sc-meta-row"><span className="sc-mk">Cast</span><span className="sc-mv">{story.characters}</span></div>
          <div className="sc-meta-row"><span className="sc-mk">Year</span><span className="sc-mv">{story.year} · {story.pages}pp</span></div>
        </div>
        <div className="sc-foot">
          <div><span className="sc-stars">{stars}</span><span className="sc-rv">{story.rating} ({story.reviews.toLocaleString()})</span></div>
          <button className="sc-btn" onClick={() => onOpen(story)}>Read More</button>
        </div>
      </div>
    </div>
  );
}
