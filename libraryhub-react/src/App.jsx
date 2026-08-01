import { AppProvider, useApp } from './context/AppContext.jsx';
import BgCanvas from './components/BgCanvas.jsx';
import Navbar from './components/Navbar.jsx';
import PointsToast from './components/PointsToast.jsx';
import StoryModal from './components/StoryModal.jsx';
import BookingModal from './components/BookingModal.jsx';
import LpLightbox from './components/LpLightbox.jsx';
import HomePage from './pages/HomePage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import LibProfilePage from './pages/LibProfilePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BookingPage from './pages/BookingPage.jsx';

function Pages() {
  const { page, user } = useApp();

  if (!user && page !== 'auth') {
    // Fallback: any attempt to view a protected page while logged out shows Auth.
    return <AuthPage />;
  }

  switch (page) {
    case 'home': return <HomePage />;
    case 'library': return <LibraryPage />;
    case 'auth': return <AuthPage />;
    case 'libprofile': return <LibProfilePage />;
    case 'profile': return <ProfilePage />;
    case 'booking': return <BookingPage />;
    default: return <HomePage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <BgCanvas />
      <Navbar />
      <Pages />
      <StoryModal />
      <BookingModal />
      <LpLightbox />
      <PointsToast />
    </AppProvider>
  );
}
