import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const { page, goPage, requireLogin, user } = useApp();

  const navA = (target, label, id) => (
    <li>
      <a
        className={page === target ? 'nav-active' : ''}
        onClick={() => user && goPage(target)}
        id={id}
      >
        {label}
      </a>
    </li>
  );

  return (
    <nav id="main-nav">
      <div className="logo" onClick={() => user && goPage('home')} style={{ cursor: user ? 'pointer' : 'default' }}>
        <div className="logo-gem">📖</div>
        <em>Library</em>Hub
      </div>
      <ul className="nav-links" id="navLinks">
        {navA('home', 'Home', 'nl-home')}
        <li><a onClick={() => user && goPage('home')}>Genres</a></li>
        <li><a onClick={() => user && goPage('home')}>Classics</a></li>
        <li>
          <button className={page === 'library' ? 'nav-active' : ''} onClick={() => user && goPage('library')} id="nl-lib">
            Library
          </button>
        </li>
        <li>
          <button className={page === 'booking' ? 'nav-active' : ''} onClick={() => requireLogin('booking')} id="nl-booking">
            Booking
          </button>
        </li>
        <li><a onClick={() => user && goPage('home')}>Reviews</a></li>
        <li><a onClick={() => user && goPage('home')}>AI Guide</a></li>
        <li>
          <button className={page === 'libprofile' ? 'nav-active' : ''} onClick={() => requireLogin('libprofile')} id="nl-libprofile">
            Our Library
          </button>
        </li>
        {!user && (
          <li id="nav-auth-btn">
            <button className="nav-pill" onClick={() => goPage('auth')}>Sign In</button>
          </li>
        )}
        {user && (
          <li id="nav-points-info" style={{ display: 'flex' }}>
            <div className="nav-points" id="navPointsBadge">
              <span className="pts-icon">✦</span>
              <span id="navPointsNum">{user.points.toLocaleString()}</span> pts
            </div>
          </li>
        )}
        {user && (
          <li id="nav-user-info" style={{ display: 'flex' }}>
            <div className="nav-user" onClick={() => requireLogin('profile')}>
              <div className="nav-avatar" id="navAvatar">{user.name[0].toUpperCase()}</div>
              <span id="navUserName">{user.name.split(' ')[0]}</span>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}
