import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../../../components/shop/ProductCard';

export default function BestSellersSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const products = useSelector(s => s.products.items).slice(0, 5);

  return (
    <section className="bestsellers-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <Link to="/shop" className="view-all-link view-all-desktop">
            View All Products &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
        <div className="bs-outer">
          <button ref={prevRef} className="bs-arrow bs-prev"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={swiper => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              992: { slidesPerView: 4, spaceBetween: 20 },
            }}
          >
            {products.map(p => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button ref={nextRef} className="bs-arrow bs-next"><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className="view-all-mobile-wrapper">
          <Link to="/shop" className="view-all-link view-all-mobile">
            View All Products &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </section>
  );
}
