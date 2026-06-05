import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CartItem from '../../components/cart/CartItem/CartItem';
import { clearCart } from '../../store/slices/cartSlice';

const schema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Enter valid 10-digit number').required('Phone is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().matches(/^[0-9]{6}$/, 'Enter valid 6-digit pincode').required('Pincode is required'),
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(s => s.cart);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const shipping = total > 9900 ? 0 : 299;
  const grandTotal = total + shipping;

  const formik = useFormik({
    initialValues: { fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' },
    validationSchema: schema,
    onSubmit: () => {
      dispatch(clearCart());
      setOrderPlaced(true);
    },
  });

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success">
            <div className="checkout-success__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="checkout-success__title">Order Placed!</h2>
            <p className="checkout-success__sub">Thank you for your purchase. We'll send a confirmation to your email.</p>
            <button className="checkout-success__btn" onClick={() => navigate('/shop')}>CONTINUE SHOPPING</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">CHECKOUT</h1>

        <div className="checkout-layout">
          {/* LEFT — Form */}
          <form className="checkout-form" onSubmit={formik.handleSubmit} noValidate>
            <h3 className="checkout-form__section-title">Contact Information</h3>
            <div className="checkout-form__grid">
              {[
                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', col: 2 },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', col: 1 },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210', col: 1 },
              ].map(f => (
                <div key={f.name} className={`form-group checkout-form__field${f.col === 2 ? ' checkout-form__field--full' : ''}`}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className={`form-input ${formik.touched[f.name] && formik.errors[f.name] ? 'form-input--error' : ''}`}
                    type={f.type}
                    placeholder={f.placeholder}
                    {...formik.getFieldProps(f.name)}
                  />
                  {formik.touched[f.name] && formik.errors[f.name] && (
                    <p className="form-error">{formik.errors[f.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <h3 className="checkout-form__section-title" style={{ marginTop: '28px' }}>Shipping Address</h3>
            <div className="checkout-form__grid">
              {[
                { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Main Street, Apt 4B', col: 2 },
                { name: 'city', label: 'City', type: 'text', placeholder: 'Mumbai', col: 1 },
                { name: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra', col: 1 },
                { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '400001', col: 1 },
              ].map(f => (
                <div key={f.name} className={`form-group checkout-form__field${f.col === 2 ? ' checkout-form__field--full' : ''}`}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className={`form-input ${formik.touched[f.name] && formik.errors[f.name] ? 'form-input--error' : ''}`}
                    type={f.type}
                    placeholder={f.placeholder}
                    {...formik.getFieldProps(f.name)}
                  />
                  {formik.touched[f.name] && formik.errors[f.name] && (
                    <p className="form-error">{formik.errors[f.name]}</p>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="checkout-form__submit" disabled={formik.isSubmitting}>
              PLACE ORDER — {fmt(grandTotal)}
            </button>
          </form>

          {/* RIGHT — Summary */}
          <div className="checkout-summary">
            <h3 className="checkout-summary__title">ORDER SUMMARY</h3>
            <div className="checkout-summary__items">
              {items.map(item => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row">
              <span>Subtotal</span><span>{fmt(total)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--purple)' }}>FREE</span> : fmt(shipping)}</span>
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span><span>{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
