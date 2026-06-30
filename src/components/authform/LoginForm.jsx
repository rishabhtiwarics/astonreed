import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../store/slices/authSlice';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(loginUser({ email: values.email, password: values.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/');
      }
    },
  });

  return (
    <div>
      <h1 className="auth-title">Welcome Back</h1>
      <p className="auth-sub">Sign in to your Aston Reed account</p>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="form-error">{formik.errors.password}</p>
          )}
        </div>

        <div style={{ textAlign: 'right', marginBottom: '8px' }}>
          <Link to="/forgot-password" style={{ fontSize: '11px', color: 'var(--purple)', fontWeight: 600 }}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="btn-primary-full" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-footer-text">
        Don't have an account? <Link to="/register">Create Account</Link>
      </p>
    </div>
  );
}
