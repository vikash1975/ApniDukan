import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, loading, error, getTotal, getItemCount } = useContext(CartContext);

  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="cart-container">
        <div className="unauthorized-message">
          <h2>Please login to view your cart</h2>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="back-btn" onClick={() => navigate('/products')}>
          ← Continue Shopping
        </button>
      </div>

      {isEmpty ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="shop-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="items-header">
              <span>{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</span>
            </div>
            <div className="cart-items">
              {cart.items.map((item) => (
                <CartItem key={item.productId._id} item={item} />
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(total + total * 0.1).toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
