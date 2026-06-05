import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ArrivalSection() {
  return (
    <section className="arrival-section">
      <div className="container">
        <div className="arrival-banner">
          <div className="arrival-bg" />
          <div className="arrival-overlay" />
          <div className="arrival-content">
            <p className="arrival-eyebrow">New Arrival</p>
            <h2 className="arrival-title">Midnight Elixir</h2>
            <p className="arrival-desc">A rich blend of oud, amber<br />and velvet musk.</p>
            <Link to="/shop" className="arrival-btn">Explore Now &nbsp;<FontAwesomeIcon icon={faArrowRight} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
