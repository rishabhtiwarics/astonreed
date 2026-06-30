import { Outlet, Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/img/logo/logo.png';

export default function AuthLayout() {
  const location = useLocation();

  // Determine dynamic quotes and icons based on route
  let quoteTitle = "Exploring new frontiers, one step at a time.";
  let quoteSub = "Beyond Earth's grasp";
  let formIcon;

  if (location.pathname === "/register") {
    quoteTitle = "Join us to discover curated luxury fragrances.";
    quoteSub = "Your journey begins here";
    formIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="auth-form-icon">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    );
  } else if (location.pathname === "/forgot-password") {
    quoteTitle = "Don't worry, we will help you recover your access.";
    quoteSub = "Securing your essence";
    formIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="auth-form-icon">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    );
  } else {
    // Default is Login
    formIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="auth-form-icon">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

  return (
    <div className="new-auth-page">
      {/* Page Background Overlay */}
      <div className="auth-image-overlay"></div>

      {/* Floating Glassmorphic Shapes */}
      <div className="glass-shape glass-shape-top-right"></div>
      <div className="glass-shape glass-shape-bottom-left"></div>

      {/* Center container card */}
      <div className="auth-container">
        
        {/* Left Side: 50% Image Column with overlay */}
        <div className="auth-image-side">
          <div className="auth-card-image-overlay"></div>
          
          <div className="auth-image-content">
            {/* Top Logo - Same style as home page header */}
            <div className="auth-brand">
              <Link to="/" className="logo">
                <img src={logoImg} alt="Aston Reed Logo" onError={e => { e.target.style.display = 'none'; }} />
                <div className="logo-text">
                  <div className="brand">Aston Reed</div>
                  <div className="sub">— Perfume —</div>
                </div>
              </Link>
            </div>
            
            {/* Bottom Quote & Caption */}
            <div className="auth-quote-container">
              <h2 className="auth-quote-title">{quoteTitle}</h2>
              <p className="auth-quote-subtitle">{quoteSub}</p>
            </div>
          </div>
        </div>

        {/* Right Side: 50% Form Column */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            {formIcon && (
              <div className="glass-shape auth-form-icon-wrapper">
                {formIcon}
              </div>
            )}
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}
