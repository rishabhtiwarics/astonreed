import { Link } from 'react-router-dom';
import LoginForm from '../../components/authform/LoginForm';

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 700, color: 'var(--navy)', letterSpacing: '4px', textTransform: 'uppercase' }}>
              Aston Reed
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--purple-mid)', marginTop: '2px' }}>
              — Perfume —
            </div>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
