import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem/CartItem';
import { clearCart } from '../../store/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total } = useSelector(s => s.cart);
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const shipping = total > 9900 ? 0 : 299;
  const grandTotal = total + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__heading-row">
          <h1 className="cart-page__title">YOUR BAG</h1>
          {items.length > 0 && (
            <button className="cart-page__clear" onClick={() => dispatch(clearCart())}>
              Clear bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart-page__empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="8" width="14" height="12" rx="2" />
              <path d="M9 8V5a3 3 0 0 1 6 0v3" />
            </svg>
            <h2>Your bag is empty</h2>
            <p>Discover our luxury fragrance collection</p>
            <Link to="/shop" className="cart-page__shop-btn">SHOP NOW</Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-page__summary">
              <h3 className="cart-page__summary-title">ORDER SUMMARY</h3>
              <div className="cart-page__summary-row">
                <span>Subtotal ({items.reduce((n, i) => n + i.qty, 0)} items)</span>
                <span>{fmt(total)}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="cart-page__free">FREE</span> : fmt(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="cart-page__shipping-tip">
                  Add {fmt(9900 - total)} more for free shipping
                </p>
              )}
              <div className="cart-page__summary-divider" />
              <div className="cart-page__summary-row cart-page__summary-row--total">
                <span>Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
              <Link to="/checkout" className="cart-page__checkout-btn">
                PROCEED TO CHECKOUT
              </Link>
              <Link to="/shop" className="cart-page__continue-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
