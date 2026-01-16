import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { checkout, createRazorpayOrder, verifyRazorpayPayment, handleRazorpayFailure, getRazorpayKey } from '../services/api';
import '../styles/Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotal } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('address'); // 'address' or 'payment'
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (!token) {
    return (
      <div className="checkout-container">
        <div className="unauthorized-message">
          <h2>Please login to checkout</h2>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="shop-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const tax = total * 0.1;
  const finalTotal = total + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError('Please enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      const response = await checkout({ shippingAddress: address });
      setCurrentOrder(response.data.order);
      setStep('payment');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Get Razorpay Key
      const keyResponse = await getRazorpayKey();
      const razorpayKey = keyResponse.data.keyId;

      // Step 2: Create Razorpay Order
      const orderResponse = await createRazorpayOrder(finalTotal);
      const razorpayOrderId = orderResponse.data.razorpayOrderId;

      // Step 3: Open Razorpay Popup
      const options = {
        key: razorpayKey,
        amount: finalTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'ApniDukan',
        description: `Order for ${cart.items.length} items`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Step 4: Verify Payment & Create Order
            const verifyResponse = await verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: address,
            });

            if (verifyResponse.data.success) {
              const orderId = verifyResponse.data.order._id;
              navigate(`/order-success/${orderId}`, {
                state: {
                  order: verifyResponse.data.order,
                  transactionId: response.razorpay_payment_id,
                },
              });
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed');
            setStep('address');
            setCurrentOrder(null);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#27ae60',
        },
        modal: {
          ondismiss: async () => {
            // Step 5: Handle Payment Failure (user closes popup)
            try {
              await handleRazorpayFailure({
                razorpayOrderId: razorpayOrderId,
                reason: 'User closed payment popup',
              });
            } catch (err) {
              console.error('Error handling payment dismissal:', err);
            }
            setLoading(false);
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <button className="back-btn" onClick={() => navigate(step === 'payment' ? '/cart' : '/cart')}>
        ← Back
      </button>

      <h1>Checkout</h1>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${step === 'address' ? 'active' : 'completed'}`}>
          <span>1</span> Address
        </div>
        <div className={`step ${step === 'payment' ? 'active' : ''}`}>
          <span>2</span> Payment
        </div>
      </div>

      <div className="checkout-content">
        {step === 'address' ? (
          <div className="checkout-form-section">
            <h2>Shipping Address</h2>
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address (street, city, state, zip code)"
                  rows="4"
                  disabled={loading}
                  required
                ></textarea>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="continue-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        ) : (
          <div className="checkout-form-section">
            <h2>Payment Details</h2>
            <form onSubmit={handlePayment} className="checkout-form">
              <div className="form-group">
                <label>Select Payment Method *</label>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                    />
                    <span>💳 Razorpay (Credit/Debit Card)</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      value="razorpay-upi"
                      checked={paymentMethod === 'razorpay-upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                    />
                    <span>📱 Razorpay (UPI)</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      value="razorpay-wallet"
                      checked={paymentMethod === 'razorpay-wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={loading}
                    />
                    <span>👛 Razorpay (Wallet)</span>
                  </label>
                </div>
              </div>

              <div className="info-box">
                <p>✓ Secure payment powered by Razorpay</p>
                <p>✓ Use test card: 4111 1111 1111 1111 | Any future date | Any CVV</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="button-group">
                <button 
                  type="button" 
                  className="back-payment-btn"
                  onClick={() => {
                    setStep('address');
                    setCurrentOrder(null);
                  }}
                  disabled={loading}
                >
                  Back to Address
                </button>
                <button 
                  type="submit" 
                  className="pay-now-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay Now ₹${finalTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            <h3>Items in Cart ({cart.items.length})</h3>
            {cart.items.map((item) => (
              <div key={item.productId._id} className="summary-item">
                <div className="item-info">
                  <span>{item.productId.name}</span>
                  <span>x{item.quantity}</span>
                </div>
                <div className="item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>

          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
