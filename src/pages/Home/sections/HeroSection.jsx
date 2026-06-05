import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import heroImg from '../../../assets/img/reed/hero.png';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-heading">
            Scent{' '}<br /><span>Begins</span><br />{' '}With{' '}<br />Presence
          </h1>
          <p className="hero-sub">Luxury fragrances that speak quietly but leave a lasting impression.</p>
          <Link to="/shop" className="btn-discover">
            Discover Collections &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
      <div className="hero-img-wrap">
        <img
          className="bottle-img"
          src={heroImg}
          alt="Aston Reed Perfume Bottle"
          onError={e => { e.target.src = 'https://placehold.co/400x600/f6f4f9/5b3d8f?text=Aston+Reed'; }}
        />
      </div>
    </section>
  );
}
