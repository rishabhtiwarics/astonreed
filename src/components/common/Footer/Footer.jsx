import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebookF, faTiktok, faYoutube, faPinterestP } from '@fortawesome/free-brands-svg-icons';
import logoImg from '../../../assets/img/logo/fottrlogo.png';
import lookbook2Img from '../../../assets/img/reed/lookbook2.png';


export default function Footer() {
  return (
    <>
      {/* PROMO BAND */}
      <div className="footer-promo-band">
        <div className="fpb-inner">
          <div className="fpb-logo-block">
            <Link to="/" className="logo footer-logo">
              <img src={logoImg} alt="Aston Reed Logo" onError={e => { e.target.style.display = 'none'; }} />
            </Link>
          </div>
          <div className="fpb-vdivider" />
          <div className="fpb-offer">
            <p className="fpb-eyebrow">EXCLUSIVE OFFER</p>
            <h2 className="fpb-headline">ENJOY <span>10% OFF</span> YOUR FIRST ORDER</h2>
            <p className="fpb-tagline">Join the Aston Reed family and indulge in luxury.</p>
            <Link to="/shop" className="fpb-cta">SHOP NOW &nbsp;<FontAwesomeIcon icon={faArrowRight} /></Link>
          </div>
          <div className="fpb-image-block">
            <img src={lookbook2Img} alt="Aston Reed Perfume" className="fpb-bottle-img" onError={e => { e.target.style.display = 'none'; }} />
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-cols-grid">
            <div className="fc-col">
              <p className="fc-col-heading">SHOP</p>
              <ul className="fc-links">
                <li><Link to="/shop">All Products</Link></li>
                <li><Link to="/shop">Collections</Link></li>
                <li><Link to="/shop">Best Sellers</Link></li>
                <li><Link to="/shop">New Arrivals</Link></li>
                <li><Link to="/shop">Gift Sets</Link></li>
              </ul>
            </div>
            <div className="fc-col">
              <p className="fc-col-heading">CUSTOMER CARE</p>
              <ul className="fc-links">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><a href="#">Shipping &amp; Delivery</a></li>
                <li><a href="#">Returns &amp; Exchanges</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>
            <div className="fc-col">
              <p className="fc-col-heading">COMPANY</p>
              <ul className="fc-links">
                <li><Link to="/about">About Us</Link></li>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="fc-col">
              <p className="fc-col-heading">NEWSLETTER</p>
              <p className="fc-newsletter-desc">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="fc-newsletter-form">
                <input className="fc-newsletter-input" type="email" placeholder="Enter your email" />
                <button className="fc-newsletter-btn" aria-label="Subscribe">
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="fb-socials">
            <a className="fb-social" href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
            <a className="fb-social" href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a className="fb-social" href="#" aria-label="TikTok"><FontAwesomeIcon icon={faTiktok} /></a>
            <a className="fb-social" href="#" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
            <a className="fb-social" href="#" aria-label="Pinterest"><FontAwesomeIcon icon={faPinterestP} /></a>
          </div>
          <p className="fb-copy">&copy; 2025 Aston Reed Perfume. All rights reserved.</p>
          <ul className="fb-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
    </>
  );
}
