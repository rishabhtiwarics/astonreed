const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3b3b6b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    label: 'Complimentary Gift',
    desc: 'On all orders over ₹89',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3b3b6b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12z" />
        <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M12 10v5" />
      </svg>
    ),
    label: 'Finest Ingredients',
    desc: 'Sourced from around the world',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3b3b6b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v2.5S17 7 17 10a5 5 0 0 1-10 0c0-3 2-4.5 2-4.5V3z" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="9" y1="21" x2="15" y2="21" />
      </svg>
    ),
    label: 'Long Lasting',
    desc: 'Crafted for all day confidence',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3b3b6b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="#3b3b6b" />
      </svg>
    ),
    label: 'Secure Payment',
    desc: '100% secure checkout',
  },
];

export default function FeatureStrip() {
  return (
    <div className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              {f.icon}
              <div>
                <div className="feature-label">{f.label}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
