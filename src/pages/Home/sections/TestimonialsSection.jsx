import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const testimonials = [
  { text: 'The quality and lasting power of Aston Reed perfumes are simply unmatched.', author: '— James L.' },
  { text: 'Every scent tells a story. Aston Reed is now my signature.', author: '— Sophia M.' },
  { text: 'Elegant, luxurious and absolutely worth every penny.', author: '— Daniel K.' },
  { text: 'I get compliments every single time I wear Midnight Elixir. Absolutely divine!', author: '— Isabella R.' },
  { text: 'The packaging is as luxurious as the fragrance itself. A masterpiece.', author: '— Lucas P.' },
];

export default function TestimonialsSection() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-title">WHAT OUR CLIENTS SAY</h2>
        <div className="testimonials-outer">
          <button ref={prevRef} className="testimonials-arrow testimonials-prev">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={swiper => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            style={{ width: '100%' }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <span className="testimonial-quote">"</span>
                    <p className="testimonial-text">{t.text}</p>
                  </div>
                  <div className="testimonial-footer">
                    <span className="testimonial-author">{t.author}</span>
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, j) => <FontAwesomeIcon key={j} icon={faStar} />)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button ref={nextRef} className="testimonials-arrow testimonials-next">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </section>
  );
}
