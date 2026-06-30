import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { addToCart } from '../../store/slices/cartSlice';
import { openCartDrawer } from '../../store/slices/uiSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faStar, faStarHalfAlt, faMinus, faPlus,
  faLeaf, faTruck, faHandHoldingHeart, faHeadset,
  faBolt, faChevronLeft, faChevronRight, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faXTwitter, faPinterestP, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import innrbnner from '../../assets/img/reed/innrbnner.png';
import arrivalImg from '../../assets/img/reed/arrival.png';
import ProductCard from '../../components/shop/ProductCard';

const SIZES = ['30 ml', '60 ml', '80 ml', '100 ml'];

const TRUST = [
  { icon: faLeaf,             title: 'Sustainable Choice',   desc: 'Crafted with care for you and the environment.' },
  { icon: faTruck,            title: 'Responsible Delivery', desc: 'We pack and ship sustainably, every time.' },
  { icon: faHandHoldingHeart, title: 'Supporting Good',      desc: 'Every purchase supports small communities.' },
  { icon: faHeadset,          title: 'Always Here for You',  desc: 'Our team is ready to help whenever you need.' },
];

function StarRating({ rating = 4.8 }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="pd-stars">
      {[...Array(full)].map((_, i)  => <FontAwesomeIcon key={`f${i}`} icon={faStar} />)}
      {half                          && <FontAwesomeIcon key="h"       icon={faStarHalfAlt} />}
      {[...Array(empty)].map((_, i) => <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} />)}
    </span>
  );
}

export default function ProductDetail() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(s => s.products.items);
  const wishlist = useSelector(s => s.wishlist.items);
  const product  = products.find(p => String(p.id) === String(id));

  const [qty,        setQty]        = useState(1);
  const [activeSize, setActiveSize] = useState(0);
  const [activeImg,  setActiveImg]  = useState(0);
  const [added,      setAdded]      = useState(false);
  const [isDesktop,  setIsDesktop]  = useState(
    typeof window !== 'undefined' && window.innerWidth >= 992
  );

  const prevRef       = useRef(null);
  const nextRef       = useRef(null);
  const mainSwiperRef = useRef(null);

  // keep isDesktop in sync with window resize
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')} className="pd-back-btn">← Back to Shop</button>
      </div>
    );
  }

  const isWishlisted  = wishlist.some(i => String(i.id) === String(product.id));
  const related       = products.filter(p => String(p.id) !== String(product.id));
  const originalPrice = Math.round(product.price * 1.25);
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  const galleryImgs   = [product.image, ...products.filter(p => String(p.id) !== String(product.id)).map(p => p.image)].slice(0, 5);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    dispatch(openCartDrawer());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate('/checkout');
  };

  return (
    <>
      {/* ── HERO BANNER ── */}
      <div className="shop-hero" style={{ backgroundImage: `url(${innrbnner})` }}>
        <div className="shop-hero-overlay" />
        <div className="container">
          <div className="shop-hero-content">
            <p className="shop-hero-subtitle">
              <Link to="/shop" className="pd-breadcrumb-link">Shop</Link>
              {' / '}
              {product.name}
            </p>
            <h1 className="shop-hero-title">{product.name}</h1>
          </div>
        </div>
      </div>

      {/* ── PRODUCT DETAIL MAIN ── */}
      <section className="pd-section">
        <div className="container">
          <div className="pd-layout">

            {/* LEFT — Gallery */}
            <div className="pd-gallery">

              {/* Thumbnail strip */}
              <Swiper
                direction={isDesktop ? 'vertical' : 'horizontal'}
                slidesPerView={isDesktop ? 5 : 4}
                spaceBetween={8}
                modules={[]}
                className="pd-thumbs-swiper"
                watchOverflow
              >
                {galleryImgs.map((img, i) => (
                  <SwiperSlide key={i}>
                    <button
                      className={`pd-thumb${activeImg === i ? ' active' : ''}`}
                      onClick={() => {
                        setActiveImg(i);
                        mainSwiperRef.current?.slideToLoop(i);
                      }}
                    >
                      <img src={img} alt={`view ${i + 1}`} />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Main image */}
              <div className="pd-main-img">
                <Swiper
                  onSwiper={swiper => { mainSwiperRef.current = swiper; }}
                  modules={[Autoplay]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={true}
                  speed={600}
                  onSlideChange={swiper => setActiveImg(swiper.realIndex)}
                  className="pd-main-swiper"
                >
                  {galleryImgs.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={img} alt={`${product.name} ${i + 1}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {product.badge && <span className="pd-img-badge">{product.badge}</span>}
                <div className="pd-img-dots">
                  {galleryImgs.map((_, i) => (
                    <button
                      key={i}
                      className={`pd-dot${activeImg === i ? ' active' : ''}`}
                      onClick={() => {
                        setActiveImg(i);
                        mainSwiperRef.current?.slideToLoop(i);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Info */}
            <div className="pd-info">
              <p className="pd-category">{product.type}</p>

              <div className="pd-title-row">
                <h1 className="pd-product-name">{product.name}</h1>
                <span className="pd-stock-badge">In Stock</span>
              </div>

              <div className="pd-rating-row">
                <StarRating rating={4.8} />
                <span className="pd-rating-num">4.8</span>
                <span className="pd-review-count">(245 Reviews)</span>
              </div>

              <div className="pd-price-row">
                <span className="pd-price-sale">{fmt(product.price)}</span>
                <span className="pd-price-original">{fmt(originalPrice)}</span>
                <span className="pd-discount-tag">20% OFF</span>
              </div>

              <p className="pd-desc">
                A timeless, luxurious fragrance crafted from the finest raw materials.
                Its warm, complex character blends floral heart notes with a rich
                woody base — perfect for those who appreciate refined elegance.
              </p>

              <hr className="pd-divider" />

              <div className="pd-option-group">
                <p className="pd-option-label">Size / Volume</p>
                <div className="pd-size-list">
                  {SIZES.map((s, i) => (
                    <button
                      key={i}
                      className={`pd-size-btn${activeSize === i ? ' active' : ''}`}
                      onClick={() => setActiveSize(i)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="pd-divider" />

              <div className="pd-actions-row">
                <div className="pd-qty-control">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="pd-qty-btn">
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="pd-qty-num">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="pd-qty-btn">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <button className={`pd-add-btn${added ? ' added' : ''}`} onClick={handleAddToCart}>
                  {added ? '✓ Added!' : 'Add To Cart'}
                </button>
                <button className="pd-buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
                <button
                  className={`pd-wish-btn${isWishlisted ? ' active' : ''}`}
                  onClick={() => dispatch(toggleWishlist(product))}
                  aria-label="Wishlist"
                >
                  <FontAwesomeIcon icon={isWishlisted ? faHeartSolid : faHeartRegular} />
                </button>
              </div>

              <hr className="pd-divider" />

              <div className="pd-meta">
                <p><span>SKU :</span> AR-{String(product.id).padStart(8, '0').toUpperCase()}</p>
                <p><span>Tags :</span> Perfume, {product.type}, {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <div className="pd-share-row">
                  <span>Share :</span>
                  <a href="#" className="pd-social" aria-label="Facebook"><FontAwesomeIcon icon={faFacebookF} /></a>
                  <a href="#" className="pd-social" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a>
                  <a href="#" className="pd-social" aria-label="Pinterest"><FontAwesomeIcon icon={faPinterestP} /></a>
                  <a href="#" className="pd-social" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="pd-trust-strip">
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

      {/* ── HURRY UP BANNER ── */}
      <section className="pd-banner-section" style={{ backgroundImage: `url(${arrivalImg})` }}>
        <div className="pd-banner-overlay" />
        <div className="container">
          <div className="pd-banner-content">
            <span className="pd-banner-tag">
              <FontAwesomeIcon icon={faBolt} /> Limited Time Offer
            </span>
            <h2 className="pd-banner-heading">Hurry Up!</h2>
            <p className="pd-banner-sub">
              Exclusive luxury scents — available while stocks last.<br />
              Order now and receive free premium gift wrapping.
            </p>
            <div className="pd-countdown">
              {[['08', 'HRS'], ['24', 'MIN'], ['37', 'SEC']].map(([n, l]) => (
                <div key={l} className="pd-countdown-block">
                  <span className="pd-countdown-num">{n}</span>
                  <span className="pd-countdown-label">{l}</span>
                </div>
              ))}
            </div>
            <button className="pd-banner-btn" onClick={handleBuyNow}>
              Shop Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── YOU MAY ALSO LIKE ── */}
      <section className="bestsellers-section pd-related-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">You May Also Like</h2>
            <Link to="/shop" className="view-all-link view-all-desktop">
              View All Products &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <div className="bs-outer">
            <button ref={prevRef} className="bs-arrow bs-prev">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onBeforeInit={swiper => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                0:   { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                992: { slidesPerView: 4, spaceBetween: 20 },
              }}
            >
              {related.map(p => (
                <SwiperSlide key={p.id}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button ref={nextRef} className="bs-arrow bs-next">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          <div className="view-all-mobile-wrapper">
            <Link to="/shop" className="view-all-link view-all-mobile">
              View All Products &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
