import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function ProfilePage() {
  const { user, pointsHistory, myBookings, logoutUser, readBooksAwarded } = useApp();
  const [tab, setTab] = useState('points');

  if (!user) return null;

  const earned = pointsHistory.filter(h => h.type === 'earned').reduce((s, h) => s + h.amount, 0);
  const spent = pointsHistory.filter(h => h.type === 'spent').reduce((s, h) => s + h.amount, 0);

  return (
    <div id="page-profile" className="page active">
      <div className="prof-hero">
        <div className="prof-avatar-lg">{user.name[0].toUpperCase()}</div>
        <div className="prof-name-block">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="prof-points-pill">
          <span className="ppp-icon">✦</span>
          <div>
            <div className="ppp-num">{user.points.toLocaleString()}</div>
            <div className="ppp-lbl">Points Balance</div>
          </div>
        </div>
      </div>

      <div className="prof-stats-row">
        <div className="prof-stat-card"><div className="prof-stat-num">{readBooksAwarded.size}</div><div className="prof-stat-lbl">Books Read</div></div>
        <div className="prof-stat-card"><div className="prof-stat-num">{earned.toLocaleString()}</div><div className="prof-stat-lbl">Points Earned</div></div>
        <div className="prof-stat-card"><div className="prof-stat-num">{spent.toLocaleString()}</div><div className="prof-stat-lbl">Points Spent</div></div>
        <div className="prof-stat-card"><div className="prof-stat-num">{myBookings.length}</div><div className="prof-stat-lbl">Total Bookings</div></div>
      </div>

      <div className="prof-tabs">
        <button className={`prof-tab-btn${tab === 'points' ? ' active' : ''}`} onClick={() => setTab('points')}>✦ Points History</button>
        <button className={`prof-tab-btn${tab === 'bookings' ? ' active' : ''}`} onClick={() => setTab('bookings')}>📋 My Bookings</button>
      </div>

      <div className={`prof-tab-panel${tab === 'points' ? ' active' : ''}`}>
        {pointsHistory.length === 0 ? (
          <div className="prof-empty"><span>✦</span>No points activity yet. Read a book to start earning!</div>
        ) : (
          pointsHistory.map((h, i) => (
            <div className={`ph-row ${h.type === 'earned' ? 'earn' : 'spend'}`} key={i}>
              <div className="ph-icon">{h.type === 'earned' ? '📖' : '🛍️'}</div>
              <div className="ph-info">
                <div className="ph-reason">{h.reason}</div>
                {h.title && <div className="ph-title">"{h.title}"</div>}
              </div>
              <div className="ph-meta">{h.date}<br />{h.time}</div>
              <div className="ph-amount">{h.type === 'earned' ? '+' : '−'}{h.amount.toLocaleString()} pts</div>
            </div>
          ))
        )}
      </div>

      <div className={`prof-tab-panel${tab === 'bookings' ? ' active' : ''}`}>
        {myBookings.length === 0 ? (
          <div className="prof-empty"><span>📋</span>No bookings yet. Visit the Booking page to borrow or purchase a book!</div>
        ) : (
          myBookings.map((bk, i) => (
            <div className="booking-item" key={i}>
              <img className="bi-img" src={bk.book.img} alt={bk.book.title} onError={e => e.currentTarget.style.display = 'none'} />
              <div className="bi-info">
                <div className="bi-title">{bk.book.title}</div>
                <div className="bi-author">{bk.book.author}</div>
              </div>
              <span className={`bi-type ${bk.type}`}>
                {bk.type === 'borrow' ? '🔖 Borrow' : (bk.payMethod === 'points' ? '✦ Purchase (Points)' : '💰 Purchase (Cash)')}
              </span>
              <span className="bi-date">📅 {bk.date}</span>
              <span className="bi-status confirmed">✓ Confirmed</span>
              <span className="bk-ref" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>{bk.ref}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '0 5% 60px' }}>
        <button className="btn btn-ghost btn-sm" onClick={logoutUser}>🚪 Sign Out</button>
      </div>
    </div>
  );
}
