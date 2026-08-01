import { useMemo, useState } from 'react';
import { genres } from '../data.js';
import { useApp } from '../context/AppContext.jsx';

function BookingCard({ book, onOpenBk }) {
  const availClass = book.stock === 0 ? 'none' : book.stock <= 2 ? 'low' : 'avail';
  const availLabel = book.stock === 0 ? 'Unavailable' : book.stock <= 2 ? `${book.stock} left` : `${book.stock} available`;
  const genreName = genres.find(g => g.key === book.genre)?.name || book.genre;

  return (
    <div className="booking-card">
      <div className="bk-img">
        <img src={book.img} alt={book.title} loading="lazy" onError={e => e.currentTarget.style.display = 'none'} />
        <div className="bk-overlay"></div>
        <span className={`bk-avail ${availClass}`}>{availLabel}</span>
        <span className="bk-price-badge">LKR {book.price}</span>
      </div>
      <div className="bk-body">
        <div className="bk-genre">{genreName}{book.uploadedBy && <>&nbsp;· <span style={{ color: 'var(--ice)', fontSize: '0.65rem' }}>Student Upload</span></>}</div>
        <div className="bk-title">{book.title}</div>
        <div className="bk-author">✍️ {book.author}</div>
        <div className="bk-info">
          <span className="bk-tag">⭐ {book.rating}</span>
          <span className="bk-tag">{book.pages} pages</span>
          <span className="bk-tag">{book.year}</span>
        </div>
        <div className="bk-stock-row">
          <span className="bk-stock-lbl">Physical copies:</span>
          <span className={`bk-stock-num ${book.stock === 0 ? 'red' : book.stock <= 2 ? 'orange' : 'green'}`}>{book.stock} / {book.copies}</span>
        </div>
        <div className="bk-price-row">
          <span className="bk-price-lbl">Purchase price</span>
          <span className="bk-price-val">LKR {book.price} <span style={{ color: 'var(--ice)', fontSize: '0.78rem' }}>· ✦ {book.pointsPrice} pts</span></span>
        </div>
        <div className="bk-actions-col">
          <button className="bk-btn bk-btn-borrow" disabled={book.stock === 0} onClick={() => onOpenBk(book, 'borrow')}>
            🔖 {book.stock === 0 ? 'Unavailable to Borrow' : 'Reserve to Borrow'}
          </button>
          <button className="bk-btn bk-btn-buy" onClick={() => onOpenBk(book, 'buy')}>
            💰 Purchase (Cash)
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { bookingCatalogue, openBkModal } = useApp();
  const [mode, setMode] = useState('all'); // all | borrow | buy | upload
  const [genreFilter, setGenreFilter] = useState('all');
  const [sort, setSort] = useState('default');

  // Upload form state
  const [uTitle, setUTitle] = useState('');
  const [uAuthor, setUAuthor] = useState('');
  const [uGenre, setUGenre] = useState('');
  const [uPrice, setUPrice] = useState('');
  const [uDesc, setUDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadOk, setUploadOk] = useState(false);

  const filtered = useMemo(() => {
    let list = [...bookingCatalogue];
    if (genreFilter !== 'all') list = list.filter(b => b.genre === genreFilter);
    if (mode === 'borrow') list = list.filter(b => b.stock > 0);
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [bookingCatalogue, genreFilter, mode, sort]);

  function submitUpload() {
    if (!uTitle.trim() || !uAuthor.trim() || !uGenre || !uDesc.trim()) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    setUploadOk(true);
    setUTitle(''); setUAuthor(''); setUGenre(''); setUPrice(''); setUDesc(''); setFileName('');
    setTimeout(() => setUploadOk(false), 5000);
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  }

  return (
    <div id="page-booking" className="page active">
      <div className="booking-hero">
        <div className="booking-hero-top">
          <div className="booking-title-wrap">
            <div className="eyebrow">University Library</div>
            <h1>Book &amp; <em>Borrow</em></h1>
            <p>Reserve a physical copy to borrow, or purchase a book outright — all in one place.</p>
          </div>
          <div className="booking-mode-toggle">
            <button className={`bmt-btn${mode === 'all' ? ' active' : ''}`} onClick={() => setMode('all')}>📚 All</button>
            <button className={`bmt-btn${mode === 'borrow' ? ' active' : ''}`} onClick={() => setMode('borrow')}>🔖 Borrow</button>
            <button className={`bmt-btn${mode === 'buy' ? ' active' : ''}`} onClick={() => setMode('buy')}>💰 Purchase</button>
            <button className={`bmt-btn${mode === 'upload' ? ' active' : ''}`} onClick={() => setMode('upload')}>⬆ Upload</button>
          </div>
        </div>
        {mode !== 'upload' && (
          <div className="booking-filters">
            <button className={`lf-btn${genreFilter === 'all' ? ' active' : ''}`} onClick={() => setGenreFilter('all')}>All Genres</button>
            {genres.map(g => (
              <button key={g.key} className={`lf-btn${genreFilter === g.key ? ' active' : ''}`} onClick={() => setGenreFilter(g.key)}>
                {g.icon} {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode !== 'upload' && (
        <>
          <div className="booking-toolbar">
            <div className="booking-count-label">Showing <strong>{filtered.length}</strong> book{filtered.length !== 1 ? 's' : ''}</div>
            <div className="sort-wrap">
              <label>Sort by</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="default">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>

          <div className="booking-body">
            {filtered.length ? (
              <div className="booking-grid">
                {filtered.map(b => <BookingCard book={b} key={b.title} onOpenBk={openBkModal} />)}
              </div>
            ) : (
              <div className="no-results" style={{ gridColumn: '1/-1' }}>
                <span className="nr-icon">📭</span>No books match the current filter.
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'upload' && (
        <div className="upload-section" style={{ display: 'block' }}>
          <div className="eyebrow">Community</div>
          <h2 className="sec-title" style={{ marginBottom: '0.5rem' }}>Share Your <em>Story</em></h2>
          <p className="sec-sub" style={{ marginBottom: '2.5rem' }}>Upload your own book or storybook and make it available for others to borrow or purchase.</p>
          <div className="upload-card">
            <h2>📤 Upload a Book</h2>
            <p>Share your manuscript, storybook, or any written work with the LibraryHub university community.</p>
            <div className="upload-dropzone" onClick={() => document.getElementById('fileInput').click()}>
              <input type="file" id="fileInput" accept=".pdf,.epub,.docx" style={{ display: 'none' }} onChange={handleFile} />
              <div className="ud-icon">📂</div>
              <p><strong>Click to browse</strong> or drag &amp; drop your file here</p>
              <p style={{ marginTop: 6, fontSize: '0.78rem', opacity: 0.6 }}>Supported: PDF, EPUB, DOCX · Max 50 MB</p>
            </div>
            {fileName && <div style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.82rem', color: 'var(--gold)', marginBottom: '1rem' }}>📎 {fileName}</div>}
            <div className="upload-form-grid">
              <div className="bk-form-row"><label>Book Title</label><input type="text" value={uTitle} onChange={e => setUTitle(e.target.value)} placeholder="e.g. The Lost Realm" /></div>
              <div className="bk-form-row"><label>Author Name</label><input type="text" value={uAuthor} onChange={e => setUAuthor(e.target.value)} placeholder="e.g. Jane Doe" /></div>
              <div className="bk-form-row"><label>Genre</label>
                <select value={uGenre} onChange={e => setUGenre(e.target.value)}>
                  <option value="">— Select Genre —</option>
                  <option>Fantasy</option><option>Sci-Fi</option><option>Mystery</option>
                  <option>Horror</option><option>Romance</option><option>Adventure</option><option>Children's</option>
                </select>
              </div>
              <div className="bk-form-row"><label>Price (LKR)</label><input type="number" value={uPrice} onChange={e => setUPrice(e.target.value)} placeholder="e.g. 350" min="0" /></div>
            </div>
            <div className="bk-form-row"><label>Short Description</label>
              <textarea
                rows="3" value={uDesc} onChange={e => setUDesc(e.target.value)}
                placeholder="A brief summary of your book…"
                style={{ width: '100%', padding: '11px 16px', background: 'var(--abyss)', border: '1px solid var(--border2)', borderRadius: 10, color: '#fff', fontFamily: 'var(--ff-ui)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
              ></textarea>
            </div>
            <button className="upload-submit-btn" onClick={submitUpload}>🚀 Submit for Review</button>
            {uploadOk && <div style={{ display: 'block' }}>✅ Your book has been submitted for review. You'll be notified once it's approved!</div>}
          </div>
        </div>
      )}
    </div>
  );
}
