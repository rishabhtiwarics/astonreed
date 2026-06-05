import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../../../assets/img/logo/logo.png';
import { toggleMobileMenu } from '../../../store/slices/uiSlice';
import { openCartDrawer } from '../../../store/slices/uiSlice';

export default function Header() {
  const dispatch = useDispatch();
  const cartCount = useSelector(s => s.cart.items.reduce((n, i) => n + i.qty, 0));

  return (
    <>
      <div className="topbar">
        <div className="inner">
          <FontAwesomeIcon icon={faTruck} />
          FREE SHIPPING ON ALL ORDERS OVER $99
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">
              <img src={logoImg} alt="Aston Reed Logo" onError={e => { e.target.style.display = 'none'; }} />
              <div className="logo-text">
                <div className="brand">Aston Reed</div>
                <div className="sub">— Perfume —</div>
              </div>
            </Link>
          </div>

          <nav className="site-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/shop?filter=collections" className={({ isActive }) => isActive ? 'active' : ''}>Collections</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          </nav>

          <div className="header-icons">
            <button aria-label="Search" className="header-icon-btn header-icon-desktop">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <Link to="/login" aria-label="Account" className="header-icon-btn header-icon-desktop">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            {/* Cart — visible on all screen sizes */}
            <button
              aria-label="Cart"
              className="header-icon-btn"
              onClick={() => dispatch(openCartDrawer())}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="8" width="14" height="12" rx="2" ry="2"></rect>
                <path d="M9 8V5a3 3 0 0 1 6 0v3"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {/* Hamburger — mobile only, after cart */}
            <button
              className="header-hamburger"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
