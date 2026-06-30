import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { clearCart } from '../../store/slices/cartSlice';
import innrbnner from '../../assets/img/reed/innrbnner.png';
import api from '../../utils/api';

const schema = Yup.object({
  fullName: Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone is required'),
  address: Yup.string().required('Street address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits').required('Pincode is required'),
});

export default function Checkout() {
  const dispatch = useDispatch();
  const { items, total } = useSelector(s => s.cart);
  const { isAuthenticated, user, token } = useSelector(s => s.auth);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const shipping = total > 9900 ? 0 : 299;
  const tax = Math.round(total * 0.18); // 18% GST
  const insurance = total > 0 ? 99 : 0; // Transit insurance
  const grandTotal = total + shipping + tax + insurance;

  // Dynamically load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const formik = useFormik({
    initialValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.shippingAddress?.addressLine1 || '',
      city: user?.shippingAddress?.city || '',
      state: user?.shippingAddress?.state || '',
      pincode: user?.shippingAddress?.pinCode || '',
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!isAuthenticated) {
        alert('Please sign in to place an order.');
        return;
      }

      const orderItems = items.map(item => ({
        product: item._id || item.id,
        quantity: item.qty
      }));

      const orderPayload = {
        items: orderItems,
        shippingAddress: {
          addressLine1: values.address,
          addressLine2: '',
          city: values.city,
          state: values.state,
          pinCode: values.pincode,
          country: 'India'
        },
        paymentMethod: paymentMethod
      };

      if (paymentMethod === 'cod') {
        try {
          await api.post('/v1/order', orderPayload);
          setPaymentId('Cash on Delivery');
          dispatch(clearCart());
          setOrderPlaced(true);
        } catch (error) {
          alert(error.message);
        }
      } else {
        // Razorpay Checkout flow
        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
          alert('Razorpay Payment Gateway failed to load. Please check your internet connection.');
          return;
        }

        try {
          // 1. Create order on backend to get Razorpay order_id
          const rzOrder = await api.post('/v1/payment/create-order', { amount: grandTotal });
          if (!rzOrder.id) {
            throw new Error('Failed to initiate Razorpay order');
          }

          // 2. Open Razorpay checkout modal
          const options = {
            key: 'rzp_test_Sk1dkDx87k6FxW',
            amount: grandTotal * 100,
            currency: 'INR',
            name: 'Aston Reed',
            description: 'Luxury Fragrance Order Checkout',
            image: 'https://placehold.co/150x150/1a1a3e/c9a84c?text=AR',
            order_id: rzOrder.id,
            handler: async function (response) {
              try {
                // 3. Verify payment signature on backend
                const verifyData = await api.post('/v1/payment/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                if (!verifyData.success) {
                  throw new Error('Payment verification failed');
                }

                // 4. Save order to backend
                await api.post('/v1/order', orderPayload);

                setPaymentId(response.razorpay_payment_id);
                dispatch(clearCart());
                setOrderPlaced(true);
              } catch (err) {
                alert(err.message);
              }
            },
            prefill: {
              name: values.fullName,
              email: values.email,
              contact: values.phone,
            },
            notes: {
              address: `${values.address}, ${values.city}, ${values.state} - ${values.pincode}`,
            },
            theme: {
              color: '#5b3d8f',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          alert(error.message);
        }
      }
    },
  });

  const handleNextStep1 = async () => {
    formik.setFieldTouched('fullName', true);
    formik.setFieldTouched('email', true);
    formik.setFieldTouched('phone', true);

    const errors = await formik.validateForm();
    if (!errors.fullName && !errors.email && !errors.phone) {
      setActiveStep(2);
    }
  };

  const handleNextStep2 = async () => {
    formik.setFieldTouched('address', true);
    formik.setFieldTouched('city', true);
    formik.setFieldTouched('state', true);
    formik.setFieldTouched('pincode', true);

    const errors = await formik.validateForm();
    if (!errors.address && !errors.city && !errors.state && !errors.pincode) {
      setActiveStep(3);
    }
  };

  // Redirect to cart if empty
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', color: 'var(--navy)', marginBottom: '16px' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: '24px' }}>Please add products to your cart before checking out.</p>
        <Link to="/shop" className="figma-checkout-btn" style={{ maxWidth: '240px', margin: '0 auto' }}>GO TO SHOP</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <>
        {/* Page hero */}
        <div className="shop-hero" style={{ backgroundImage: `url(${innrbnner})` }}>
          <div className="shop-hero-overlay" />
          <div className="container">
            <div className="shop-hero-content">
              <p className="shop-hero-subtitle">Order Process</p>
              <h1 className="shop-hero-title">Checkout</h1>
            </div>
          </div>
        </div>

        {/* Progress Steps Header */}
        <div className="container">
          <div className="figma-checkout-steps">
            <div className="steps-container">
              <div className="step-item completed">
                <div className="step-completed-icon">✓</div>
                <span>Identify</span>
              </div>
              <div className="step-item completed">
                <div className="step-completed-icon">✓</div>
                <span>Address</span>
              </div>
              <div className="step-item completed">
                <div className="step-completed-icon">✓</div>
                <span>Payment</span>
              </div>
            </div>
            <Link to="/" className="prev-step">
              Home
            </Link>
          </div>
        </div>

        <div className="container" style={{ margin: '40px auto 80px auto', maxWidth: '600px', textAlign: 'center' }}>
          <div className="order-items-card" style={{ padding: '40px' }}>
            <div style={{ color: 'var(--purple)', marginBottom: '24px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--gold)' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', color: 'var(--navy)', marginBottom: '12px' }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-mid)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
              Thank you for choosing Aston Reed. Your luxury order has been placed. We have sent a confirmation email to you.
            </p>
            <div style={{ background: '#f6f4f9', padding: '16px', margin: '20px 0', border: '1px solid #e5e2ef', fontSize: '13px', textAlign: 'left', color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Payment Gateway:</strong> Razorpay</p>
              <p style={{ margin: '0' }}><strong>Transaction ID:</strong> {paymentId}</p>
            </div>
            <Link to="/shop" className="figma-checkout-btn" style={{ marginTop: '24px' }}>CONTINUE SHOPPING</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Page styles overrides for input boxes */}
      <style>{`
        .checkout-form-card .form-group {
          margin-bottom: 20px;
        }
        .checkout-form-card .form-input {
          border-radius: 0;
          border-color: #e5e2ef;
          padding: 12px 16px;
        }
        .checkout-form-card .form-input:focus {
          border-color: var(--purple);
        }
        .checkout-form-card .form-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .checkout-section-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 30px;
          margin-bottom: 20px;
          border-bottom: 1px dashed #e5e2ef;
          padding-bottom: 10px;
        }
        .checkout-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .checkout-form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }
        .checkout-actions-row {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }
        .figma-checkout-btn {
          white-space: nowrap !important;
        }
        @media (max-width: 576px) {
          .checkout-form-grid-2,
          .checkout-form-grid-3 {
            grid-template-columns: 1fr !important;
          }
          .checkout-form-grid-2 > .form-group,
          .checkout-form-grid-3 > .form-group {
            grid-column: span 1 !important;
          }
          .checkout-actions-row {
            flex-direction: column-reverse;
            gap: 10px;
          }
          .checkout-actions-row button,
          .checkout-actions-row a {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Page hero */}
      <div className="shop-hero" style={{ backgroundImage: `url(${innrbnner})` }}>
        <div className="shop-hero-overlay" />
        <div className="container">
          <div className="shop-hero-content">
            <p className="shop-hero-subtitle">Order Process</p>
            <h1 className="shop-hero-title">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="container">
        <div className="figma-checkout-steps">
          <div className="steps-container">
            {/* Step 1: Identify */}
            <div className={`step-item ${activeStep > 1 ? 'completed' : activeStep === 1 ? 'active' : ''}`}>
              {activeStep > 1 ? (
                <div className="step-completed-icon">✓</div>
              ) : (
                <div className="step-badge">1</div>
              )}
              <span>Identify</span>
            </div>

            {/* Step 2: Address */}
            <div className={`step-item ${activeStep > 2 ? 'completed' : activeStep === 2 ? 'active' : ''}`}>
              {activeStep > 2 ? (
                <div className="step-completed-icon">✓</div>
              ) : (
                <div className="step-badge">2</div>
              )}
              <span>Address</span>
            </div>

            {/* Step 3: Payment */}
            <div className={`step-item ${activeStep === 3 ? 'active' : ''}`}>
              <div className="step-badge">3</div>
              <span>Payment</span>
            </div>
          </div>

          {activeStep === 1 ? (
            <Link to="/cart" className="prev-step">
              ← Back to Bag
            </Link>
          ) : activeStep === 2 ? (
            <button type="button" onClick={() => setActiveStep(1)} className="prev-step" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              ← Back to Identify
            </button>
          ) : (
            <button type="button" onClick={() => setActiveStep(2)} className="prev-step" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              ← Back to Address
            </button>
          )}
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="container">
        <form onSubmit={formik.handleSubmit}>
          <div className="cart-figma-layout">
            
            {/* Left Column: Form Card */}
            <div className="order-items-card checkout-form-card">              {activeStep === 1 && (
                <>
                  <div className="order-items-header">
                    <h2 className="order-items-title">1. Identify</h2>
                  </div>
                  {!isAuthenticated && (
                    <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>
                      You must be signed in to check out. <Link to="/login" style={{ color: 'var(--purple)', fontWeight: 700, textDecoration: 'underline' }}>Sign In Here</Link>
                    </div>
                  )}
                  <div className="checkout-form-grid-2">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Enter your full name"
                        disabled={!isAuthenticated}
                        {...formik.getFieldProps('fullName')}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="form-error">{formik.errors.fullName}</p>
                      )}
                    </div>
 
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="Enter your email"
                        disabled={!isAuthenticated}
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="form-error">{formik.errors.email}</p>
                      )}
                    </div>
 
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-input"
                        type="tel"
                        placeholder="10-digit mobile number"
                        disabled={!isAuthenticated}
                        {...formik.getFieldProps('phone')}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="form-error">{formik.errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={handleNextStep1} disabled={!isAuthenticated} className="figma-checkout-btn" style={{ minWidth: '240px', width: 'auto', maxWidth: '100%', opacity: isAuthenticated ? 1 : 0.5 }}>
                      CONTINUE TO SHIPPING
                    </button>
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className="order-items-header">
                    <h2 className="order-items-title">2. Shipping Address</h2>
                  </div>
                  <div className="checkout-form-grid-3">
                    <div className="form-group" style={{ gridColumn: 'span 3' }}>
                      <label className="form-label">Street Address</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="House No, Building, Street name"
                        {...formik.getFieldProps('address')}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <p className="form-error">{formik.errors.address}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Mumbai"
                        {...formik.getFieldProps('city')}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <p className="form-error">{formik.errors.city}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Maharashtra"
                        {...formik.getFieldProps('state')}
                      />
                      {formik.touched.state && formik.errors.state && (
                        <p className="form-error">{formik.errors.state}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="400001"
                        {...formik.getFieldProps('pincode')}
                      />
                      {formik.touched.pincode && formik.errors.pincode && (
                        <p className="form-error">{formik.errors.pincode}</p>
                      )}
                    </div>
                  </div>
                  <div className="checkout-actions-row">
                    <button type="button" onClick={() => setActiveStep(1)} className="figma-qty-btn" style={{ height: '48px', width: '120px', border: '1px solid #e5e2ef', background: '#fff', letterSpacing: '1.5px', fontWeight: '700' }}>
                      BACK
                    </button>
                    <button type="button" onClick={handleNextStep2} className="figma-checkout-btn" style={{ flex: 1 }}>
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </>
              )}

              {activeStep === 3 && (
                <>
                  <div className="order-items-header">
                    <h2 className="order-items-title">3. Payment & Review</h2>
                  </div>
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', margin: 0 }}>Personal Details</h4>
                        <button type="button" onClick={() => setActiveStep(1)} className="edit-cart-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
                      </div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', margin: '4px 0', color: 'var(--navy)' }}><strong>Name:</strong> {formik.values.fullName}</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', margin: '4px 0', color: 'var(--navy)' }}><strong>Email:</strong> {formik.values.email}</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', margin: '4px 0', color: 'var(--navy)' }}><strong>Phone:</strong> {formik.values.phone}</p>
                    </div>

                    <div style={{ height: '1px', background: '#e5e2ef', margin: '20px 0' }} />

                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', margin: 0 }}>Shipping Address</h4>
                        <button type="button" onClick={() => setActiveStep(2)} className="edit-cart-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit</button>
                      </div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', margin: '4px 0', color: 'var(--navy)', lineHeight: '1.6' }}>
                        {formik.values.address},<br />
                        {formik.values.city}, {formik.values.state} - {formik.values.pincode}
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#e5e2ef', margin: '20px 0' }} />

                    <div style={{ background: '#f6f4f9', padding: '20px', border: '1px solid #e5e2ef', marginBottom: '24px' }}>
                      <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)', margin: '0 0 10px 0' }}>Payment Method</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', color: 'var(--navy)', fontWeight: '600' }}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={paymentMethod === 'cod'} 
                            onChange={() => setPaymentMethod('cod')} 
                          />
                          Cash on Delivery (COD)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', color: 'var(--navy)', fontWeight: '600' }}>
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="razorpay" 
                            checked={paymentMethod === 'razorpay'} 
                            onChange={() => setPaymentMethod('razorpay')} 
                          />
                          Razorpay Secure Payment
                        </label>
                      </div>

                      {paymentMethod === 'cod' ? (
                        <p style={{ fontSize: '11px', color: 'var(--text-mid)', margin: '0', lineHeight: '1.5', fontFamily: 'Montserrat, sans-serif' }}>
                          Pay with cash upon delivery. Click "Place Order" to finalize your purchase.
                        </p>
                      ) : (
                        <p style={{ fontSize: '11px', color: 'var(--text-mid)', margin: '0', lineHeight: '1.5', fontFamily: 'Montserrat, sans-serif' }}>
                          Please review your details. Click "Proceed to Pay" to launch the secure payment portal.
                        </p>
                      )}
                    </div>
 
                    <div className="checkout-actions-row" style={{ marginTop: 0 }}>
                      <button type="button" onClick={() => setActiveStep(2)} className="figma-qty-btn" style={{ height: '48px', width: '120px', border: '1px solid #e5e2ef', background: '#fff', letterSpacing: '1.5px', fontWeight: '700' }}>
                        BACK
                      </button>
                      <button type="submit" className="figma-checkout-btn" style={{ flex: 1, height: '48px' }}>
                        {paymentMethod === 'cod' ? 'PLACE ORDER — ' + fmt(grandTotal) : 'PROCEED TO PAY — ' + fmt(grandTotal)}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Order Summary (White style) */}
            <div className="figma-sidebar-cards">
              
              {/* Summary Card (White Background, gradient header) */}
              <div className="order-summary-sidebar-card">
                <div className="order-summary-sidebar-card__header">
                  <h2 className="summary-card-title">Summary</h2>
                </div>
                <div className="order-summary-sidebar-card__content">
                  <p className="summary-card-desc">
                    The total cost consist of the tax, insurance and the delivery charge.
                  </p>

                  {/* Compact items preview inside summary card */}
                  <div style={{ marginBottom: '20px' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ width: '45px', height: '45px', background: '#eeeaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                          <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        </div>
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--navy)', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: 'var(--text-mid)', margin: '0' }}>Qty: {item.qty}</p>
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '13px', color: 'var(--navy)' }}>
                          {fmt(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="summary-info-divider" />
                  
                  <div className="summary-info-row">
                    <span>Subtotal</span>
                    <span>{fmt(total)}</span>
                  </div>
                  
                  <div className="summary-info-row">
                    <span>Delivery</span>
                    <span>{shipping === 0 ? <span className="free-shipping-text">FREE</span> : fmt(shipping)}</span>
                  </div>
                  
                  <div className="summary-info-row">
                    <span>Tax (18% GST)</span>
                    <span>{fmt(tax)}</span>
                  </div>
                  
                  <div className="summary-info-row">
                    <span>Insurance</span>
                    <span>{fmt(insurance)}</span>
                  </div>
                  
                  <div className="summary-info-divider" />
                  
                  <div className="summary-info-row grand-total-row">
                    <span>TOTAL:</span>
                    <span>{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Razorpay Integration Payment Trigger CTA */}
              {activeStep === 3 && (
                <button type="submit" className="figma-checkout-btn">
                  {paymentMethod === 'cod' ? 'PLACE ORDER — ' + fmt(grandTotal) : 'PROCEED TO PAY — ' + fmt(grandTotal)}
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
