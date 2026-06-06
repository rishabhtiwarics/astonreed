import { useDispatch, useSelector } from 'react-redux';
import { filterByCategory } from '../../store/slices/productsSlice';
import ProductCard from '../../components/shop/ProductCard';
import innrbnner from '../../assets/img/reed/innrbnner.png';

const filters = [
  { label: 'All',             value: 'all' },
  { label: 'Signature',       value: 'signature' },
  { label: 'Oud',             value: 'oud' },
  { label: 'Royal',           value: 'royal' },
  { label: 'Limited Edition', value: 'limited' },
];

export default function Shop() {
  const dispatch = useDispatch();
  const { filtered, activeFilter } = useSelector(s => s.products);

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
    </>
  );
}
