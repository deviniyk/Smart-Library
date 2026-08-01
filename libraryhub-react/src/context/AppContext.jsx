import { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react';
import { famous, stories } from '../data.js';

const AppCtx = createContext(null);

const POINTS_PER_BOOK = 25;

// Booking catalogue — all stories + classics, enriched with price & stock
const priceTable = [350,480,420,550,390,460,520,400,370,490,430,410,560,380,500,440,360,510,395,475];
const stockTable = [3,0,5,2,1,4,6,2,0,3,1,5,2,4,1,3,2,0,6,4];
const copiesTable = [8,3,10,5,4,8,9,5,3,7,4,8,5,7,3,6,5,3,9,7];

function dateStamp() {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function AppProvider({ children }) {
  const [page, setPageState] = useState('auth');
  const [user, setUser] = useState(null);
  const [readBooksAwarded, setReadBooksAwarded] = useState(new Set());
  const [pointsHistory, setPointsHistory] = useState([]);
  const [toast, setToast] = useState(null);

  // booking catalogue built once, stock is mutable (kept in state for stock decrements)
  const [bookingCatalogue, setBookingCatalogue] = useState(() =>
    [...famous, ...stories].map((b, i) => {
      const price = priceTable[i % 20];
      return {
        ...b,
        price,
        stock: stockTable[i % 20],
        copies: copiesTable[i % 20],
        uploadedBy: i > 15 ? 'Student Upload' : null,
        pointsPrice: Math.round(price * 2),
      };
    })
  );
  const [myBookings, setMyBookings] = useState([]);

  // Story modal (famous classic or story)
  const [storyModal, setStoryModal] = useState(null); // the book object, or null
  const openStoryModal = useCallback((book) => setStoryModal(book), []);
  const closeStoryModal = useCallback(() => setStoryModal(null), []);

  // Booking modal
  const [bkModal, setBkModal] = useState(null); // { book, type } or null
  const closeBkModal = useCallback(() => setBkModal(null), []);

  // Library profile lightbox
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Library page genre filter (set via goLibrary from home/footer links)
  const [libGenreFilter, setLibGenreFilter] = useState('all');

  const goPage = useCallback((p) => {
    setPageState(p);
    window.scrollTo(0, 0);
  }, []);

  const goLibrary = useCallback((genreKey) => {
    setLibGenreFilter(genreKey || 'all');
    goPage('library');
  }, [goPage]);

  const requireLogin = useCallback((p) => {
    if (!user) {
      alert('Please sign in to access the Booking system.');
      setPageState('auth');
      return;
    }
    goPage(p);
  }, [user, goPage]);

  const openBkModal = useCallback((book, type) => {
    if (!user) { alert('Please sign in to make a booking.'); goPage('auth'); return; }
    setBkModal({ book, type });
  }, [user, goPage]);

  const showPointsToast = useCallback((amount, title) => {
    setToast({ amount, title, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const loginUser = useCallback((name, email) => {
    setUser({ name, email, points: 120 });
    setReadBooksAwarded(new Set());
    setPointsHistory([{
      type: 'earned', amount: 120, title: null, reason: 'Welcome bonus', ...dateStamp(),
    }]);
  }, []);

  const logoutUser = useCallback(() => {
    if (!confirm('Sign out of LibraryHub?')) return;
    setUser(null);
    setReadBooksAwarded(new Set());
    setPointsHistory([]);
    setMyBookings([]);
    goPage('home');
  }, [goPage]);

  const awardReadingPoints = useCallback((title) => {
    if (!user) return;
    if (readBooksAwarded.has(title)) return;
    setReadBooksAwarded(prev => new Set(prev).add(title));
    setUser(prev => ({ ...prev, points: prev.points + POINTS_PER_BOOK }));
    setPointsHistory(prev => [{
      type: 'earned', amount: POINTS_PER_BOOK, title, reason: 'Finished reading', ...dateStamp(),
    }, ...prev]);
    showPointsToast(POINTS_PER_BOOK, title);
  }, [user, readBooksAwarded, showPointsToast]);

  const spendPoints = useCallback((amount, title, reason) => {
    setUser(prev => ({ ...prev, points: prev.points - amount }));
    setPointsHistory(prev => [{ type: 'spent', amount, title, reason, ...dateStamp() }, ...prev]);
  }, []);

  const decrementStock = useCallback((title) => {
    setBookingCatalogue(prev => prev.map(b => b.title === title ? { ...b, stock: Math.max(0, b.stock - 1) } : b));
  }, []);

  const addBooking = useCallback((booking) => {
    setMyBookings(prev => [booking, ...prev]);
  }, []);

  const value = useMemo(() => ({
    page, goPage, requireLogin,
    user, loginUser, logoutUser, setUser,
    readBooksAwarded, awardReadingPoints,
    pointsHistory, spendPoints,
    toast,
    bookingCatalogue, decrementStock,
    myBookings, addBooking,
    storyModal, openStoryModal, closeStoryModal,
    bkModal, openBkModal, closeBkModal,
    lightboxSrc, setLightboxSrc,
    libGenreFilter, goLibrary,
  }), [page, goPage, requireLogin, user, loginUser, logoutUser, readBooksAwarded,
      awardReadingPoints, pointsHistory, spendPoints, toast, bookingCatalogue,
      decrementStock, myBookings, addBooking, storyModal, openStoryModal, closeStoryModal,
      bkModal, openBkModal, closeBkModal, lightboxSrc, libGenreFilter, goLibrary]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
