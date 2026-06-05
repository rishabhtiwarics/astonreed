import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { filterByCategory } from '../../store/slices/productsSlice';
import ProductCard from '../../components/shop/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faInstagram as faInstagramBrands } from '@fortawesome/free-brands-svg-icons';
import 'swiper/css';
import 'swiper/css/pagination';
import innrbnner from '../../assets/img/reed/innrbnner.png';
import col1 from '../../assets/img/reed/col1.png';
import col2 from '../../assets/img/reed/col2.png';
import col3 from '../../assets/img/reed/col3.png';
import col4 from '../../assets/img/reed/col4.png';
import lb1  from '../../assets/img/reed/lookbook1.png';
import lb2  from '../../assets/img/reed/lookbook2.png';
import lb3  from '../../assets/img/reed/lookbook3.png';
import lb4  from '../../assets/img/reed/lookbook4.png';

const filters = [
  { label: 'All',             value: 'all' },
  { label: 'Signature',       value: 'signature' },
  { label: 'Oud',             value: 'oud' },
  { label: 'Royal',           value: 'royal' },
  { label: 'Limited Edition', value: 'limited' },
];

const GRAM_IMGS = [col1, lb1, col2, lb2, col3, lb3, col4, lb4];

export default function Shop() {
  const dispatch = useDispatch();
  const { filtered, activeFilter } = useSelector(s => s.products);
  const swiperRef = useRef(null);

  return (
    <>
      {/* Page hero */}
      <div className="shop-hero" style={{ backgroundImage: `url(${innrbnner})` }}>
        <div className="shop-hero-overlay" />
        <div className="container">
          <div className="shop-hero-content">
            <p className="shop-hero-subtitle">Browse</p>
            <h1 className="shop-hero-title">Our Collection</h1>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className="shop-page">
        <div className="container">
          <div className="shop-filters">
            {filters.map(f => (
              <button
                key={f.value}
                className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
                onClick={() => dispatch(filterByCategory(f.value))}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-mid)', letterSpacing: '1px', marginBottom: '24px' }}>
            {filtered.length} Products
          </p>

          <div className="shop-grid">
            {filtered.map(p => (
              <div key={p.id} className="shop-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM SHOWCASE ── */}
      <section className="ig-section">
        {/* Header */}
        <div className="ig-header">
          <p className="ig-eyebrow">
            <FontAwesomeIcon icon={faInstagramBrands} />
            &nbsp; Shop Our Collection
          </p>
          <h2 className="ig-heading">Timeless Pieces,&nbsp;Thoughtfully Curated</h2>
          <p className="ig-sub">
            Discover our handpicked collection designed to bring beauty,<br />
            balance, and purpose into your everyday.
          </p>
          <Link to="/shop" className="ig-cta">
            Explore All Products &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="ig-carousel-wrap"
          onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay?.start()}
        >
          <Swiper
            onSwiper={s => { swiperRef.current = s; }}
            modules={[Autoplay, Pagination]}
            centeredSlides={true}
            loop={true}
            speed={700}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            slidesPerView={6}
            spaceBetween={16}
            grabCursor={true}
            pagination={{ clickable: true, el: '.ig-pagination' }}
            breakpoints={{
              0:   { slidesPerView: 1.4, spaceBetween: 10 },
              480: { slidesPerView: 2.2, spaceBetween: 12 },
              768: { slidesPerView: 3.4, spaceBetween: 14 },
              992: { slidesPerView: 4.4, spaceBetween: 16 },
              1200:{ slidesPerView: 6, spaceBetween: 18 },
            }}
            className="ig-swiper"
          >
            {GRAM_IMGS.map((img, i) => (
              <SwiperSlide key={i} className="ig-slide">
                <div className="ig-card">
                  <img src={img} alt={`Collection ${i + 1}`} loading="lazy" />
                  <div className="ig-card-overlay">
                    <FontAwesomeIcon icon={faInstagramBrands} className="ig-card-icon" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Dots */}
          <div className="ig-pagination" />
        </div>
      </section>
    </>
  );
}
