import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { closeMobileMenu } from '../../../store/slices/uiSlice';
import { logout } from '../../../store/slices/authSlice';
import logoImg from '../../../assets/img/logo/logo.png';
import fottrlogoImg from '../../../assets/img/logo/fottrlogo.png';

export default function MobileMenu() {
  const dispatch = useDispatch();
  const isOpen = useSelector(s => s.ui.mobileMenuOpen);
  const { isAuthenticated, user } = useSelector(s => s.auth);

  const close = () => dispatch(closeMobileMenu());

  const handleLogout = () => {
    dispatch(logout());
    close();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'drawer-overlay--visible' : ''}`}
        onClick={close}
      />

      {/* Sidebar */}
      <div className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}>
        {/* Header — logo + close button */}
        <div className="mobile-menu__header">
          <Link to="/" className="mobile-menu__brand" onClick={close}>
            <img src={logoImg} alt="Aston Reed" onError={e => { e.target.style.display = 'none'; }} />
          </Link>
          <button className="mobile-menu__close" onClick={close} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="mobile-menu__close-label">Close</span>
          </button>
        </div>

        <nav className="mobile-menu__nav">
          <NavLink to="/" end onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/shop?filter=collections" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Collections</NavLink>
          <NavLink to="/about" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          <NavLink to="/contact" onClick={close} className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin" onClick={close} className={({ isActive }) => isActive ? 'active' : ''} style={{ color: 'var(--gold-light)' }}>
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Footer — logo + auth links */}
        <div className="mobile-menu__footer">
          <Link to="/" className="mobile-menu__footer-logo" onClick={close}>
            <img src={fottrlogoImg} alt="Aston Reed" onError={e => { e.target.style.display = 'none'; }} />
          </Link>
          <div className="mobile-menu__auth-row">
            {isAuthenticated ? (
              <>
                <span className="mobile-menu__auth-user">Hi, {user?.name || user?.email || 'User'}</span>
                <span className="mobile-menu__auth-sep">·</span>
                <button className="mobile-menu__auth-btn" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu__auth-link" onClick={close}>Sign In</Link>
                <span className="mobile-menu__auth-sep">·</span>
                <Link to="/register" className="mobile-menu__auth-link" onClick={close}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

