import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: schema,
    onSubmit: async () => {
      await new Promise(r => setTimeout(r, 800));
      setSent(true);
    },
  });

  if (sent) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--off-white)', border: '2px solid var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '24px' }}>
          ✓
        </div>
        <h1 className="auth-title">Check Your Email</h1>
        <p className="auth-sub" style={{ marginBottom: 0 }}>
          We've sent a password reset link to <strong>{formik.values.email}</strong>
        </p>
        <p className="auth-footer-text" style={{ marginTop: '24px' }}>
          <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="auth-title">Forgot Password</h1>
      <p className="auth-sub">Enter your email and we'll send you a reset link</p>

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
          {formik.touched.email && formik.errors.email && <p className="form-error">{formik.errors.email}</p>}
        </div>

        <button type="submit" className="btn-primary-full" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="auth-footer-text">
        Remembered your password? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}
