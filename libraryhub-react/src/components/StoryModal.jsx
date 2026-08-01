import { useEffect, useRef, useState } from 'react';
import { genres } from '../data.js';
import { useApp } from '../context/AppContext.jsx';

function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function StoryModal() {
  const { storyModal: book, closeStoryModal, user, awardReadingPoints, goPage } = useApp();

  const [voices, setVoices] = useState([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [estDuration, setEstDuration] = useState(0);
  const [statusText, setStatusText] = useState('Narrated summary · ready to play');

  const utterRef = useRef(null);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    function loadVoices() {
      let v = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      if (!v.length) v = window.speechSynthesis.getVoices();
      setVoices(v);
    }
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  function resetNarrationUI() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
    clearInterval(timerRef.current);
    setShowPlayer(false);
    setElapsed(0);
    setRate(1);
    setStatusText('Narrated summary · ready to play');
  }

  // Reset narration whenever the open book changes / modal closes
  useEffect(() => {
    resetNarrationUI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  if (!book) return null;

  const genreName = genres.find(g => g.key === book.genre)?.name || book.genre;

  function startPlayback(utter, dur) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlaying(true);
    setStatusText('Now playing…');
    startTimeRef.current = Date.now();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const el = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(Math.min(el, dur));
      if (el >= dur) clearInterval(timerRef.current);
    }, 200);
  }

  function openNarration() {
    if (!('speechSynthesis' in window)) {
      alert("Your browser doesn't support audio narration. Try Chrome, Edge, or Safari.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = `${book.title}, by ${book.author}. ${book.summary}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    if (voices.length) utter.voice = voices[voiceIdx] || voices[0];

    const wordCount = text.split(/\s+/).length;
    const dur = (wordCount / 150) * 60 / rate;
    setEstDuration(dur);

    utter.onend = () => {
      setPlaying(false);
      clearInterval(timerRef.current);
      setElapsed(dur);
      setStatusText('Finished · play again anytime');
    };
    utter.onerror = () => {
      setPlaying(false);
      clearInterval(timerRef.current);
    };

    utterRef.current = utter;
    setShowPlayer(true);
    setStatusText('Narrated summary · ready to play');
    setElapsed(0);
    startPlayback(utter, dur);
  }

  function toggleNarration() {
    if (!utterRef.current) return;
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
      clearInterval(timerRef.current);
      setStatusText('Paused');
    } else if (window.speechSynthesis.paused) {
      setPlaying(true);
      startTimeRef.current = Date.now() - elapsed * 1000;
      setStatusText('Now playing…');
      window.speechSynthesis.resume();
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const el = (Date.now() - startTimeRef.current) / 1000;
        setElapsed(Math.min(el, estDuration));
        if (el >= estDuration) clearInterval(timerRef.current);
      }, 200);
    } else {
      startPlayback(utterRef.current, estDuration);
    }
  }

  function changeVoice(idx) {
    setVoiceIdx(idx);
    if (!utterRef.current) return;
    const wasPlaying = playing;
    utterRef.current.voice = voices[idx] || voices[0];
    if (wasPlaying) startPlayback(utterRef.current, estDuration);
  }

  function cycleSpeed() {
    const speeds = [1, 1.25, 1.5, 0.75];
    const idx = speeds.indexOf(rate);
    const next = speeds[(idx + 1) % speeds.length];
    setRate(next);
    if (utterRef.current) {
      utterRef.current.rate = next;
      const wordCount = utterRef.current.text.split(/\s+/).length;
      const dur = (wordCount / 150) * 60 / next;
      setEstDuration(dur);
      if (playing) startPlayback(utterRef.current, dur);
    }
  }

  function seek(e) {
    if (!utterRef.current) return;
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (pct < 0.05) startPlayback(utterRef.current, estDuration);
  }

  function handleClose() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    closeStoryModal();
  }

  function startReading() {
    if (!user) {
      alert('Please sign in to start reading and earn points.');
      goPage('auth');
      return;
    }
    awardReadingPoints(book.title);
    handleClose();
  }

  const progressPct = estDuration ? Math.min(100, (elapsed / estDuration) * 100) : 0;

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-box">
        <div className="modal-img-col">
          <img src={book.img} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="m-title">{book.title}</div>
          <div className="m-author">✍️ {book.author}</div>
          <div style={{ marginBottom: '1rem' }}>
            <span className={`fc-pill pill-${book.genre}`} style={{ position: 'static', display: 'inline-block' }}>{genreName}</span>
            {book.classic && <span className="fc-classic-badge" style={{ marginLeft: 8, position: 'static' }}>Classic</span>}
          </div>
          <div className="m-desc">{book.summary}</div>

          <div className={`audio-player${showPlayer ? ' show' : ''}`}>
            <div className="audio-player-top">
              <button className="audio-play-btn" onClick={toggleNarration}>{playing ? '⏸' : '▶'}</button>
              <div className="audio-player-label">
                <strong>🎧 Listen to this story</strong>
                <span>{statusText}</span>
              </div>
              <div className={`audio-wave${playing ? ' playing' : ''}`}><span></span><span></span><span></span><span></span><span></span></div>
            </div>
            <div className="audio-player-controls">
              <span className="audio-time">{fmtTime(elapsed)}</span>
              <div className="audio-progress-track" onClick={seek}>
                <div className="audio-progress-fill" style={{ width: progressPct + '%' }}></div>
              </div>
              <span className="audio-time">{fmtTime(estDuration)}</span>
              <select className="audio-voice-select" value={voiceIdx} onChange={(e) => changeVoice(+e.target.value)}>
                {voices.length
                  ? voices.map((v, i) => <option key={i} value={i}>{v.name.replace('Microsoft', '').replace('Google', '').trim()}</option>)
                  : <option value={0}>Default voice</option>}
              </select>
              <button className="audio-speed-btn" onClick={cycleSpeed}>{rate}×</button>
            </div>
          </div>

          <div className="m-meta">
            <div className="m-mi"><div className="ml">Author</div><div className="mv">{book.author}</div></div>
            <div className="m-mi"><div className="ml">Year</div><div className="mv">{book.year}</div></div>
            <div className="m-mi"><div className="ml">Cast</div><div className="mv">{book.characters}</div></div>
            <div className="m-mi"><div className="ml">Pages</div><div className="mv">{book.pages}</div></div>
            <div className="m-mi"><div className="ml">Rating</div><div className="mv">⭐ {book.rating} / 5</div></div>
            <div className="m-mi"><div className="ml">Reviews</div><div className="mv">{book.reviews.toLocaleString()}</div></div>
          </div>

          <div className="m-acts">
            <button className="btn btn-flame" onClick={startReading}>📖 Start Reading</button>
            <button className="btn btn-listen" onClick={openNarration}>🎧 Listen to Summary</button>
            <button className="btn btn-ghost" onClick={handleClose}>✕ Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
