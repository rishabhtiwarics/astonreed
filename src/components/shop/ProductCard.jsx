import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(s => s.wishlist.items);
  const cartItems = useSelector(s => s.cart.items);
  
  const isWishlisted = wishlist.some(i => i.id === product.id);
  const isInCart = cartItems.some(i => i.id === product.id);

  const handleAddToCart = () => dispatch(addToCart(product));
  const handleWishlist = () => dispatch(toggleWishlist(product));

  const handleCardClick = (e) => {
    // Prevent navigation if a button (like wishlist or add to cart) was clicked
    if (e.target.closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bs-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="bs-img-wrap">
        <button className="bs-wish" onClick={handleWishlist} aria-label="Wishlist">
          <FontAwesomeIcon
            icon={isWishlisted ? faHeartSolid : faHeartRegular}
            style={{ color: isWishlisted ? '#e53e3e' : undefined }}
          />
        </button>
        <img src={product.image} alt={product.name} onError={e => { e.target.src = 'https://placehold.co/300x330/eeeaf6/5b3d8f?text=' + encodeURIComponent(product.name); }} />
      </div>

      <div className="bs-info">
        <h4 className="bs-name">{product.name}</h4>
        <p className="bs-type">{product.type}</p>
        <div className="bs-bottom">
          <span className="bs-price">
            <span style={{ fontSize: '12px', marginRight: '2px' }}>₹</span>
            {product.price.toLocaleString('en-IN')}
          </span>
          <button 
            className="bs-cart-btn" 
            onClick={handleAddToCart}
            disabled={isInCart}
            style={{ 
              opacity: isInCart ? 0.6 : 1, 
              cursor: isInCart ? 'not-allowed' : 'pointer' 
            }}
          >
            {isInCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
