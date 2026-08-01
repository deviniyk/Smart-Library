import { useMemo, useState, useEffect } from 'react';
import { genres, famous, stories } from '../data.js';
import { useApp } from '../context/AppContext.jsx';
import StoryCard from '../components/StoryCard.jsx';

const ALL_BOOKS = [...famous, ...stories];
const FILTERS = [{ key: 'all', name: 'All' }, ...genres.map(g => ({ key: g.key, name: g.name }))];

export default function LibraryPage() {
  const { openStoryModal, libGenreFilter } = useApp();
  const [genre, setGenre] = useState(libGenreFilter || 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');

  useEffect(() => { setGenre(libGenreFilter || 'all'); }, [libGenreFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ALL_BOOKS.filter(b => {
      const matchesGenre = genre === 'all' || b.genre === genre;
      const matchesQuery = !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.characters && b.characters.toLowerCase().includes(q));
      return matchesGenre && matchesQuery;
    });
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'reviews') list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (sort === 'year') list = [...list].sort((a, b) => b.year - a.year);
    else if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [genre, query, sort]);

  return (
    <div id="page-library" className="page active">
      <div className="lib-hero">
        <div className="lib-hero-top">
          <div className="lib-title-wrap">
            <div className="eyebrow">Story Library</div>
            <h1>All <em>Stories</em></h1>
            <div className="lib-count">
              {query || genre !== 'all' ? `Showing ${filtered.length} of ${ALL_BOOKS.length} stories` : `Showing all ${ALL_BOOKS.length} stories`}
            </div>
          </div>
          <div className="lib-search-wrap">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by title, author, or character…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
              />
              <button className={`search-clear${query ? ' show' : ''}`} onClick={() => setQuery('')}>✕</button>
            </div>
            <div className="search-stats">{query && `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}</div>
          </div>
        </div>
        <div className="lib-filters">
          {FILTERS.map(f => (
            <button key={f.key} className={`lf-btn${genre === f.key ? ' active' : ''}`} onClick={() => setGenre(f.key)}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="lib-toolbar">
        <div style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.82rem', color: 'var(--smoke)' }}>
          {genre === 'all' ? '' : `Filtered by: ${FILTERS.find(f => f.key === genre)?.name}`}
        </div>
        <div className="sort-wrap">
          <label>Sort by</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="year">Newest First</option>
            <option value="az">A → Z</option>
          </select>
        </div>
      </div>

      <div className="lib-body">
        {filtered.length ? (
          <div className="lib-grid">
            {filtered.map(s => <StoryCard story={s} key={s.title} onOpen={openStoryModal} query={query} />)}
          </div>
        ) : (
          <div className="no-results">
            <span className="nr-icon">📭</span>
            No stories found matching <strong>"{query}"</strong>. Try a different search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
