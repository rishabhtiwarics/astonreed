import look1 from '../../../assets/img/reed/lookbook1.png';
import look2 from '../../../assets/img/reed/lookbook2.png';
import look3 from '../../../assets/img/reed/lookbook3.png';
import look4 from '../../../assets/img/reed/lookbook4.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const slides = [
  look1,
  look2,
  look3,
  look4,
  look1,
  look2,
  look3,
  look4,
];

export default function LookbookSection() {
  return (
    <section className="lookbook-section">
      <div className="container-fluid" style={{ padding: 0 }}>
        <div className="container">
          <div className="lookbook-header">
            <h2 className="lookbook-title">THE ASTON REED LOOKBOOK</h2>
            <a href="#" className="view-all-link view-all-desktop">
              VIEW LOOKBOOK &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        </div>
        <div className="lookbook-marquee">
          <div className="lookbook-marquee-track">
            <div className="lookbook-marquee-group">
              {slides.slice(0, 5).map((src, i) => (
                <div key={i} className="lookbook-slide">
                  <img src={src} alt={`Lookbook ${i + 1}`} onError={e => { e.target.src = `https://placehold.co/320x200/e8e4f0/5b3d8f?text=Lookbook+${i + 1}`; }} />
                </div>
              ))}
            </div>
            <div className="lookbook-marquee-group">
              {slides.slice(0, 5).map((src, i) => (
                <div key={i} className="lookbook-slide">
                  <img src={src} alt={`Lookbook ${i + 6}`} onError={e => { e.target.src = `https://placehold.co/320x200/e8e4f0/5b3d8f?text=Lookbook+${i + 6}`; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="view-all-mobile-wrapper">
            <a href="#" className="view-all-link view-all-mobile">
              VIEW LOOKBOOK &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
