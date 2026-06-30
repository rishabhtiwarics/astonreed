import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../store/slices/authSlice';

const schema = Yup.object({
  name: Yup.string().min(2, 'Minimum 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(s => s.auth);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      }));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/');
      }
    },
  });

  return (
    <div>
      <h1 className="auth-title">Create Account</h1>
      <p className="auth-sub">Join the Aston Reed family today</p>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            name="name"
            placeholder="Your Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && <p className="form-error">{formik.errors.name}</p>}
        </div>

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
          {formik.touched.email && formik.errors.email && <p className="form-error">{formik.errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Min. 6 characters"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && <p className="form-error">{formik.errors.password}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="form-error">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="btn-primary-full" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
