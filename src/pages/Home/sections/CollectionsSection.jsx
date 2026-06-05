import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import col1 from '../../../assets/img/reed/col1.png';
import col2 from '../../../assets/img/reed/col2.png';
import col3 from '../../../assets/img/reed/col3.png';
import col4 from '../../../assets/img/reed/col4.png';

const collections = [
  { name: 'Signature\nCollection', sub: 'Timeless & Refined', img: col1, align: 'right', overlay: 'overlay-right' },
  { name: 'Oud\nCollection', sub: 'Rich & Intense', img: col2, align: 'right', overlay: 'overlay-right' },
  { name: 'Royal\nCollection', sub: 'Royalty in Every Drop', img: col3, align: 'left', overlay: 'overlay-left' },
  { name: 'Limited\nEdition', sub: 'Exclusive & Rare', img: col4, align: 'left', overlay: 'overlay-left' },
];

export default function CollectionsSection() {
  return (
    <section className="collections-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explore Our Collections</h2>
          <Link to="/shop" className="view-all-link view-all-desktop">
            View All Collections &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
        <div className="collections-grid">
          {collections.map((c, i) => (
            <div
              key={i}
              className="coll-card"
              style={{ backgroundImage: `url(${c.img})`, backgroundPosition: c.align === 'right' ? 'left center' : 'right center' }}
            >
              <div className={`coll-overlay ${c.overlay}`} />
              <div className={`coll-body align-${c.align}`}>
                <h3 className="coll-name">{c.name.split('\n').map((t, j) => <span key={j}>{t}<br /></span>)}</h3>
                <p className="coll-sub">{c.sub}</p>
                <Link to="/shop" className="coll-btn">
                  Shop Now &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-mobile-wrapper">
          <Link to="/shop" className="view-all-link view-all-mobile">
            View All Collections &nbsp;<FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </section>
  );
}
