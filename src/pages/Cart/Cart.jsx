import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateQty, removeFromCart } from '../../store/slices/cartSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faTruck, faHandHoldingHeart, faHeadset } from '@fortawesome/free-solid-svg-icons';
import innrbnner from '../../assets/img/reed/innrbnner.png';

const TRUST = [
  { icon: faLeaf,             title: 'Sustainable Choice',   desc: 'Crafted with care for you and the environment.' },
  { icon: faTruck,            title: 'Responsible Delivery', desc: 'We pack and ship sustainably, every time.' },
  { icon: faHandHoldingHeart, title: 'Supporting Good',      desc: 'Every purchase supports small communities.' },
  { icon: faHeadset,          title: 'Always Here for You',  desc: 'Our team is ready to help whenever you need.' },
];

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total } = useSelector(s => s.cart);
  
  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const shipping = total > 9900 ? 0 : 299;
  const tax = Math.round(total * 0.18); // 18% GST
  const insurance = total > 0 ? 99 : 0; // Transit insurance
  const grandTotal = total + shipping + tax + insurance;

  return (
    <>
      {/* Page hero */}
      <div className="shop-hero" style={{ backgroundImage: `url(${innrbnner})` }}>
        <div className="shop-hero-overlay" />
        <div className="container">
          <div className="shop-hero-content">
            <p className="shop-hero-subtitle">Your Bag</p>
            <h1 className="shop-hero-title">Shopping Cart</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="container">
        <div className="figma-checkout-steps">
          <div className="steps-container">
            <div className="step-item completed">
              <div className="step-completed-icon">✓</div>
              <span>Shopping Bag</span>
            </div>
          </div>
          <Link to="/shop" className="prev-step">
            ← Previous step
          </Link>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="container">
        <div className="cart-figma-layout">
          
          {/* Left: Order Items Card */}
          <div className="order-items-card">
            <div className="order-items-header">
              <h2 className="order-items-title">Order items</h2>
              <Link to="/shop" className="edit-cart-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                </svg>
                Edit shopping cart
              </Link>
            </div>

            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ccc', marginBottom: '16px' }}>
                  <rect x="5" y="8" width="14" height="12" rx="2" />
                  <path d="M9 8V5a3 3 0 0 1 6 0v3" />
                </svg>
                <h3 style={{ fontSize: '18px', color: 'var(--navy)', marginBottom: '8px' }}>Your bag is empty</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '14px', marginBottom: '24px' }}>Discover our luxury fragrance collection</p>
                <Link to="/shop" className="figma-checkout-btn" style={{ maxWidth: '200px', margin: '0 auto', padding: '12px' }}>SHOP NOW</Link>
              </div>
            ) : (
              <div className="figma-items-list">
                {items.map(item => (
                  <div key={item.id} className="figma-item-row">
                    <div className="figma-item-img-container">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="figma-item-info">
                      <h3 className="figma-item-name">{item.name}</h3>
                      <p className="figma-item-meta">Product color/size: {item.type || 'Standard Edition'}</p>
                      <p className="figma-item-qty">Quantity: {item.qty} {item.qty === 1 ? 'item' : 'items'}</p>
                      
                      <div className="figma-item-actions">
                        <div className="figma-qty-ctrl">
                          <button 
                            className="figma-qty-btn"
                            onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                            disabled={item.qty <= 1}
                          >−</button>
                          <span className="figma-qty-val">{item.qty}</span>
                          <button 
                            className="figma-qty-btn"
                            onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                          >+</button>
                        </div>
                        <button 
                          className="figma-remove-item"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="figma-item-price-col">
                      <p className="figma-item-total-price">{fmt(item.price * item.qty)}</p>
                      <p className="figma-item-unit-price">{fmt(item.price)} per item</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="figma-discount-row">
              <button className="figma-discount-link">
                Have discount code? Click to enter it.
              </button>
            </div>
          </div>

          {/* Right: Sidebar Cards */}
          <div className="figma-sidebar-cards">
            
            {/* Summary Card with same background as mobile menu sidebar */}
            <div className="order-summary-sidebar-card">
              <div className="order-summary-sidebar-card__header">
                <h2 className="summary-card-title">Summary</h2>
              </div>
              <div className="order-summary-sidebar-card__content">
                <p className="summary-card-desc">
                  The total cost consist of the tax, insurance and the delivery charge.
                </p>
                
                <div className="summary-info-row">
                  <span>Subtotal</span>
                  <span>{fmt(total)}</span>
                </div>
                
                <div className="summary-info-row">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? <span className="free-shipping-text">FREE</span> : fmt(shipping)}</span>
                </div>
                
                <div className="summary-info-row">
                  <span>Tax (18% GST)</span>
                  <span>{fmt(tax)}</span>
                </div>
                
                <div className="summary-info-row">
                  <span>Insurance</span>
                  <span>{fmt(insurance)}</span>
                </div>
                
                <div className="summary-info-divider" />
                
                <div className="summary-info-row grand-total-row">
                  <span>TOTAL:</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Widget Card */}
            <div className="figma-delivery-widget">
              <span className="delivery-widget-title">Delivery</span>
              <button className="delivery-widget-add" aria-label="Add delivery details">+</button>
            </div>

            {/* Checkout / Next Step CTA */}
            {items.length > 0 && (
              <Link to="/checkout" className="figma-checkout-btn">
                Next step
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* ── TRUST STRIP ── */}
      <section className="pd-trust-strip" style={{ marginTop: '60px' }}>
        <div className="container">
          <div className="pd-trust-grid">
            {TRUST.map((t, i) => (
              <div key={i} className="pd-trust-item">
                <div className="pd-trust-icon">
                  <FontAwesomeIcon icon={t.icon} />
                </div>
                <div>
                  <p className="pd-trust-title">{t.title}</p>
                  <p className="pd-trust-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
