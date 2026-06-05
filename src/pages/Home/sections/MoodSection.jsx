const moods = [
  { label: 'Daily Wear', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="2.5" /><path d="M12 6.5V4.5a2 2 0 1 0-2-2" /><path d="M5 20a3.5 3.5 0 0 1 3.5-3.5h7A3.5 3.5 0 0 1 19 20" /></svg> },
  { label: 'Office', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" ry="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M12 12v3" /></svg> },
  { label: 'Date Night', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 16.5l-4-4a3 3 0 0 1 4.24-4.24l.76.76.76-.76a3 3 0 0 1 4.24 4.24l-1.76 1.76" /><path d="M15 13.5l-1.76-1.76a3 3 0 0 1 4.24-4.24l.76.76.76-.76a3 3 0 0 1 4.24 4.24l-4 4" /></svg> },
  { label: 'Luxury Events', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="9" width="12" height="12" rx="2" /><path d="M9 9V7h6v2" /><circle cx="12" cy="4.5" r="1.5" /><path d="M10 6h4" /><path d="M12 12l2 2-2 2-2-2z" /></svg> },
  { label: 'Evening', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg> },
  { label: 'Special Occasions', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 11l9 9 9-9-9-9z" /><path d="M12 7a3 3 0 0 0-3 3c0 3 3 7 3 7s3-4 3-7a3 3 0 0 0-3-3z" /></svg> },
  { label: 'Gym & Active', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" /><path d="M12 18a3 3 0 0 0 3-3" /></svg> },
  { label: 'Summer Fresh', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg> },
  { label: 'Oud & Woody', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V2" /><path d="M12 18c3-1.5 5-4.5 5-8" /><path d="M12 14c-3-1.5-5-4.5-5-8" /><path d="M12 10c3-1 4-3 4-6" /></svg> },
];

const MoodItem = ({ mood }) => (
  <a className="mood-item" href="#">
    <div className="mood-icon-wrap">{mood.icon}</div>
    <span className="mood-label">{mood.label}</span>
  </a>
);

export default function MoodSection() {
  return (
    <section className="mood-section">
      <div className="container">
        <h2 className="mood-title">SHOP BY MOOD</h2>
      </div>
      <div className="mood-marquee-container">
        <div className="mood-marquee-track">
          {moods.map((m, i) => <MoodItem key={`a-${i}`} mood={m} />)}
          {moods.map((m, i) => <MoodItem key={`b-${i}`} mood={m} />)}
        </div>
      </div>
    </section>
  );
}
