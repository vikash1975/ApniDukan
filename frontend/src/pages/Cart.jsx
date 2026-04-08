import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCartAsync } from '../redux/cartSlice';
import CartItem from '../components/CartItem';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use Redux state instead of Context
  const cart = useSelector((state) => state.cart.cart);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // Calculate total and item count using Redux state
  const getTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="cart-container">
        <div className="unauthorized-message">
          <h2>Please login to view your bag</h2>
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
        <div className="loading">Loading your bag...</div>
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

  const items = cart?.items || [];
  const isEmpty = items.length === 0;
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="bag-title">YOUR BAG</h1>
        <button className="back-btn" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>

      {isEmpty ? (
        <div className="empty-cart">
          <div className="empty-icon">BAG</div>
          <p>Your bag is empty</p>
          <button onClick={() => navigate('/products')} className="shop-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="items-header">
              <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="cart-items">
              {items.map((item) => (
                <CartItem key={item.productId._id} item={item} />
              ))}
            </div>
          </div>

          <div className="order-summary">
            <h2 className="summary-title">ORDER SUMMARY</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>Rs. {(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {(total + total * 0.1).toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
