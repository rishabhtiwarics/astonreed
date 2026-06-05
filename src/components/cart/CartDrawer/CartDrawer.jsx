import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../../cart/CartItem/CartItem';
import { closeCartDrawer } from '../../../store/slices/uiSlice';
import { clearCart } from '../../../store/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const isOpen = useSelector(s => s.ui.cartDrawerOpen);
  const { items, total } = useSelector(s => s.cart);
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'drawer-overlay--visible' : ''}`}
        onClick={() => dispatch(closeCartDrawer())}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">YOUR BAG
            {items.length > 0 && <span className="cart-drawer__count">{items.length}</span>}
          </h3>
          <button className="cart-drawer__close" onClick={() => dispatch(closeCartDrawer())} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 8V5a3 3 0 0 1 6 0v3" />
              </svg>
              <p>Your bag is empty</p>
              <Link to="/shop" className="cart-drawer__shop-link" onClick={() => dispatch(closeCartDrawer())}>
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map(item => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span>{fmt(total)}</span>
            </div>
            <p className="cart-drawer__shipping-note">Shipping & taxes calculated at checkout</p>
            <Link
              to="/cart"
              className="cart-drawer__btn cart-drawer__btn--outline"
              onClick={() => dispatch(closeCartDrawer())}
            >
              VIEW BAG
            </Link>
            <Link
              to="/checkout"
              className="cart-drawer__btn cart-drawer__btn--fill"
              onClick={() => dispatch(closeCartDrawer())}
            >
              CHECKOUT
            </Link>
            <button className="cart-drawer__clear" onClick={() => dispatch(clearCart())}>
              Clear bag
            </button>
          </div>
        )}
      </div>
    </>
  );
}
