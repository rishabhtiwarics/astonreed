import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../../../assets/img/logo/logo.png';
import { toggleMobileMenu, openCartDrawer } from '../../../store/slices/uiSlice';
import { logout } from '../../../store/slices/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(s => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const products = useSelector(s => s.products.items);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

  // Filter products based on query (shows all if empty for a beautiful layout)
  const filteredProducts = searchQuery.trim() === ""
    ? products
    : products.filter(p => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof p.category === 'string' ? p.category : '').toLowerCase().includes(searchQuery.toLowerCase())
      );

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
            <button
              aria-label="Search"
              className="header-icon-btn header-icon-desktop"
              onClick={() => setSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Account Icon and Dropdown */}
            <div className="header-user-menu-container header-icon-desktop">
              {isAuthenticated ? (
                <div className="header-avatar-trigger">
                  <img
                    src={defaultAvatarUrl}
                    alt={user?.name || 'User'}
                    className="header-user-avatar"
                  />
                </div>
              ) : (
                <Link to="/login" aria-label="Account" className="header-avatar-trigger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Link>
              )}

              <div className="user-dropdown-menu">
                {isAuthenticated ? (
                  <div className="user-dropdown-content logged-in">
                    <div className="user-dropdown-header">
                      <div className="user-avatar-large-container">
                        <img
                          src={defaultAvatarUrl}
                          alt={user?.name || 'User'}
                          className="user-avatar-large"
                        />
                      </div>
                      <div className="user-details">
                        <h4 className="user-dropdown-name">{user?.name || 'User'}</h4>
                        <p className="user-dropdown-email">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <ul className="user-dropdown-links">
                      <li>
                        <Link to="/checkout" className="user-dropdown-link">Checkout</Link>
                      </li>
                      <li>
                        <Link to="/cart" className="user-dropdown-link">Shopping Bag</Link>
                      </li>
                      {user?.role === 'admin' && (
                        <li>
                          <Link to="/admin" className="user-dropdown-link" style={{ color: 'var(--gold)', fontWeight: 600 }}>Admin Panel</Link>
                        </li>
                      )}
                    </ul>
                    <div className="user-dropdown-divider"></div>
                    <button onClick={() => dispatch(logout())} className="btn-logout">
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="user-dropdown-content logged-out">
                    <h4 className="dropdown-title">Welcome Guest</h4>
                    <p className="dropdown-text">
                      Discover curated luxury fragrances. Sign in to place orders, check out faster, and view your cart details.
                    </p>
                    <Link to="/login" className="btn-login-dropdown">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
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

      {/* Bottom-to-Top Search Drawer Overlay */}
      <div className={`search-drawer-backdrop ${searchOpen ? 'active' : ''}`} onClick={() => setSearchOpen(false)} />
      <div className={`search-drawer-bottom ${searchOpen ? 'active' : ''}`}>
        <div className="search-drawer-inner">
          <div className="search-drawer-header">
            <h3 className="search-drawer-title">Search Products</h3>
            <button className="search-drawer-close-btn" onClick={() => setSearchOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-input-wrapper">
            <svg className="search-input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-drawer-input"
              placeholder="Search by name, type, collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
                Clear
              </button>
            )}
          </div>
          
          <div className="search-results-container">
            <h4 className="search-section-title">
              {searchQuery.trim() === "" ? "Explore Our Collection" : `Search Results (${filteredProducts.length})`}
            </h4>
            
            {filteredProducts.length > 0 ? (
              <div className="search-products-list">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    className="search-product-item"
                    onClick={() => {
                      navigate(`/product/${p.id}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <img src={p.image} alt={p.name} className="search-product-img" />
                    <div className="search-product-info">
                      <h5 className="search-product-name">{p.name}</h5>
                      <p className="search-product-type">{p.type}</p>
                    </div>
                    <div className="search-product-price">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-empty-state">
                <p className="search-empty-text">No products found matching "{searchQuery}".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
