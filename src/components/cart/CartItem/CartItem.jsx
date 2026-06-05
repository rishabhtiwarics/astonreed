import { useDispatch } from 'react-redux';
import { removeFromCart, updateQty } from '../../../store/slices/cartSlice';

export default function CartItem({ item, compact = false }) {
  const dispatch = useDispatch();

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className={`cart-item ${compact ? 'cart-item--compact' : ''}`}>
      <div className="cart-item__img-wrap">
        <img src={item.image} alt={item.name} className="cart-item__img" />
      </div>
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        <p className="cart-item__type">{item.type}</p>
        <div className="cart-item__row">
          <div className="cart-item__qty-ctrl">
            <button
              className="cart-item__qty-btn"
              onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
              disabled={item.qty <= 1}
            >−</button>
            <span className="cart-item__qty-val">{item.qty}</span>
            <button
              className="cart-item__qty-btn"
              onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
            >+</button>
          </div>
          <p className="cart-item__price">{fmt(item.price * item.qty)}</p>
        </div>
      </div>
      <button
        className="cart-item__remove"
        onClick={() => dispatch(removeFromCart(item.id))}
        aria-label="Remove item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
