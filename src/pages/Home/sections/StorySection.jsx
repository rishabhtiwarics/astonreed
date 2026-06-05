import { Link } from 'react-router-dom';
import ourstore from '../../../assets/img/reed/ourstore.png';

export default function StorySection() {
  return (
    <section className="story-section">
      <div className="container">
        <div className="story-row">
          <div className="story-img-wrap">
            <img
              src={ourstore}
              alt="Aston Reed Perfume Composition"
              onError={e => { e.target.src = 'https://placehold.co/600x380/e8e4f0/5b3d8f?text=Our+Story'; }}
            />
          </div>
          <div className="story-content">
            <p className="story-eyebrow">OUR STORY</p>
            <h2 className="story-title">CRAFTED WITH PASSION,<br />MADE TO BE REMEMBERED.</h2>
            <p className="story-desc">
              At Aston Reed, every fragrance is a masterpiece crafted from the finest ingredients,
              inspired by elegance and made for those who leave a mark.
            </p>
            <Link to="/about" className="story-btn">DISCOVER OUR JOURNEY &nbsp;&rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
