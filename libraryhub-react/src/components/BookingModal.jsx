import { useEffect, useState } from 'react';
import { genres } from '../data.js';
import { useApp } from '../context/AppContext.jsx';

function tomorrowISO() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split('T')[0];
}

export default function BookingModal() {
  const { bkModal, closeBkModal, user, spendPoints, decrementStock, addBooking } = useApp();

  const [type, setType] = useState('borrow');
  const [payMethod, setPayMethod] = useState('cash');
  const [success, setSuccess] = useState(null); // { ref, title } or null

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(tomorrowISO());
  const [duration, setDuration] = useState('14');

  const [buyName, setBuyName] = useState('');
  const [buyStudentId, setBuyStudentId] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (bkModal) {
      setType(bkModal.type || 'borrow');
      setPayMethod('cash');
      setSuccess(null);
      setName(user?.name || '');
      setBuyName(user?.name || '');
      setStudentId('');
      setBuyStudentId('');
      setPhone('');
      setDate(tomorrowISO());
      setDuration('14');
    }
  }, [bkModal, user]);

  if (!bkModal) return null;
  const book = bkModal.book;
  const genreName = genres.find(g => g.key === book.genre)?.name || book.genre;
  const userPoints = user?.points || 0;
  const canAfford = userPoints >= book.pointsPrice;

  function confirmBooking() {
    if (type === 'borrow') {
      if (!name.trim() || !studentId.trim() || !date) { alert('Please fill in all fields.'); return; }
    } else {
      if (!buyName.trim() || !buyStudentId.trim()) { alert('Please fill in all fields.'); return; }
      if (payMethod === 'cash' && !phone.trim()) { alert('Please fill in all fields.'); return; }
      if (payMethod === 'points' && !canAfford) { alert("You don't have enough points for this book yet."); return; }
    }

    if (type === 'buy' && payMethod === 'points') {
      spendPoints(book.pointsPrice, book.title, 'Purchased book');
    }

    const ref = 'SH-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const booking = {
      ref, type,
      payMethod: type === 'buy' ? payMethod : null,
      book,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'confirmed',
    };
    addBooking(booking);

    if (type === 'borrow' && book.stock > 0) decrementStock(book.title);

    let msg;
    if (type === 'borrow') {
      msg = <>Your copy of <strong>{book.title}</strong> has been reserved. Please bring your Student ID to the library counter on your chosen pickup date.</>;
    } else if (payMethod === 'points') {
      msg = <>Your purchase of <strong>{book.title}</strong> is complete — <strong>✦ {book.pointsPrice.toLocaleString()} points</strong> were deducted from your balance. Visit the library counter with your Student ID to collect your copy.</>;
    } else {
      msg = <>Your purchase request for <strong>{book.title}</strong> has been registered. Please visit the library counter with your Student ID and <strong>LKR {book.price} cash</strong> to complete the purchase.</>;
    }

    setSuccess({
      icon: type === 'borrow' ? '📚' : '🎉',
      title: type === 'borrow' ? 'Reservation Confirmed!' : 'Purchase Confirmed!',
      msg, ref,
    });
  }

  return (
    <div className="bk-modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) closeBkModal(); }}>
      <div className="bk-modal">
        {!success ? (
          <div id="bkFormState">
            <div className="bk-modal-head">
              <h3>{type === 'borrow' ? '🔖 Reserve to Borrow' : '💰 Purchase Book'}</h3>
              <button className="bk-modal-close" onClick={closeBkModal}>✕</button>
            </div>
            <div className="bk-modal-body">
              <div className="bk-modal-book-row">
                <img src={book.img} alt={book.title} className="bk-modal-book-img" />
                <div className="bk-modal-book-info">
                  <strong>{book.title}</strong>
                  <span>✍️ {book.author}</span><br />
                  <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{genreName}</span>
                </div>
              </div>

              <div className="bk-modal-type">
                <button className={`bk-type-btn${type === 'borrow' ? ' sel-borrow' : ''}`} onClick={() => setType('borrow')}>🔖 Borrow (Physical)</button>
                <button className={`bk-type-btn${type === 'buy' ? ' sel-buy' : ''}`} onClick={() => { setType('buy'); setPayMethod('cash'); }}>💰 Purchase (Cash)</button>
              </div>

              {type === 'borrow' && (
                <div>
                  <div className="bk-form-row"><label>Your Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ayasha Fernando" />
                  </div>
                  <div className="bk-form-row"><label>Student ID</label>
                    <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 2021/CS/001" />
                  </div>
                  <div className="bk-form-row"><label>Pickup Date</label>
                    <input type="date" value={date} min={tomorrowISO()} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div className="bk-form-row"><label>Borrow Duration</label>
                    <select value={duration} onChange={e => setDuration(e.target.value)}>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="21">21 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                </div>
              )}

              {type === 'buy' && (
                <div>
                  <div className="bk-pay-method-row">
                    <button className={`bk-pay-btn${payMethod === 'cash' ? ' sel-cash' : ''}`} onClick={() => setPayMethod('cash')}>💵 Pay with Cash</button>
                    <button className={`bk-pay-btn${payMethod === 'points' ? ' sel-points' : ''}`} onClick={() => setPayMethod('points')}>✦ Pay with Points</button>
                  </div>
                  <div className="bk-form-row"><label>Your Full Name</label>
                    <input type="text" value={buyName} onChange={e => setBuyName(e.target.value)} placeholder="e.g. Ayasha Fernando" />
                  </div>
                  <div className="bk-form-row"><label>Student ID</label>
                    <input type="text" value={buyStudentId} onChange={e => setBuyStudentId(e.target.value)} placeholder="e.g. 2021/CS/001" />
                  </div>
                  {payMethod === 'cash' && (
                    <div className="bk-form-row"><label>Contact Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 077 123 4567" />
                    </div>
                  )}
                  {payMethod === 'cash' && (
                    <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border-g)', borderRadius: 10, padding: '0.9rem 1rem', marginBottom: '1.1rem', fontFamily: 'var(--ff-ui)', fontSize: '0.8rem', color: 'var(--smoke)', lineHeight: 1.7 }}>
                      💡 <strong style={{ color: 'var(--gold)' }}>Cash Payment</strong> — Payment is made in person at the library counter. Please bring your Student ID and this booking reference when you arrive.
                    </div>
                  )}
                  {payMethod === 'points' && (
                    <div style={{ background: 'rgba(79,195,247,0.07)', border: '1px solid rgba(79,195,247,0.25)', borderRadius: 10, padding: '0.9rem 1rem', marginBottom: '1.1rem', fontFamily: 'var(--ff-ui)', fontSize: '0.8rem', color: 'var(--smoke)', lineHeight: 1.7 }}>
                      ✦ <strong style={{ color: 'var(--ice)' }}>Points Payment</strong> — This book costs <strong style={{ color: 'var(--ice)' }}>{book.pointsPrice.toLocaleString()}</strong> points. Earn points by reading books in the library. Your balance: <strong style={{ color: 'var(--ice)' }}>{userPoints.toLocaleString()}</strong> points.
                    </div>
                  )}
                  {payMethod === 'points' && !canAfford && (
                    <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 10, padding: '0.9rem 1rem', marginBottom: '1.1rem', fontFamily: 'var(--ff-ui)', fontSize: '0.8rem', color: 'var(--ember2)', lineHeight: 1.7 }}>
                      ⚠️ You don't have enough points for this book yet. Read more books in the library to earn points (each book read = +25 points).
                    </div>
                  )}
                </div>
              )}

              <div className="bk-summary-box">
                <div className="bk-summary-row"><span className="sk">Book</span><span className="sv">{book.title}</span></div>
                {type === 'borrow' && <div className="bk-summary-row"><span className="sk">Type</span><span className="sv">Borrow (Physical)</span></div>}
                {type === 'buy' && <div className="bk-summary-row"><span className="sk">Type</span><span className="sv">Purchase</span></div>}
                {type === 'borrow' && <div className="bk-summary-row"><span className="sk">Duration</span><span className="sv">{duration} days</span></div>}
                {type === 'buy' && (
                  <div className="bk-summary-row total">
                    <span className="sk">{payMethod === 'points' ? 'Total (Points)' : 'Total (Cash)'}</span>
                    <span className="sv">{payMethod === 'points' ? `✦ ${book.pointsPrice.toLocaleString()} pts` : `LKR ${book.price}`}</span>
                  </div>
                )}
              </div>

              <button className="bk-confirm-btn" disabled={type === 'buy' && payMethod === 'points' && !canAfford} onClick={confirmBooking}>
                ✦ Confirm Reservation
              </button>
            </div>
          </div>
        ) : (
          <div className="bk-success" style={{ display: 'block' }}>
            <span className="bk-success-icon">{success.icon}</span>
            <h3>{success.title}</h3>
            <p>{success.msg}</p>
            <div className="bk-ref">📋 Ref: {success.ref}</div>
            <br /><br />
            <button className="btn btn-ghost btn-sm" onClick={closeBkModal} style={{ marginTop: '0.5rem' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
