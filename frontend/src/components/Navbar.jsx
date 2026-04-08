import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectUser, logout } from '../redux/authSlice';
import { clearCart, fetchCartAsync } from '../redux/cartSlice';
import { useState, useEffect } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Test Redux store connection
  const authState = useSelector((state) => state.auth);
  const cartState = useSelector((state) => state.cart);
  
  // Directly access Redux cart state with consistent structure
  const cart = useSelector((state) => state.cart.cart);
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Test: Log Redux state on every render
  console.log('=== REDUX STORE TEST ===');
  console.log('Auth state:', authState);
  console.log('Cart state:', cartState);
  console.log('Cart items:', cart?.items);
  console.log('Cart count:', cartCount);
  console.log('Store working:', !!authState && !!cartState);

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('=== NAVBAR: User logged in, fetching cart ===');
      dispatch(fetchCartAsync());
    }
  }, [isAuthenticated, dispatch]);

  // Debug: Track cart count changes
  console.log('=== NAVBAR CART DEBUG ===');
  console.log('Direct Redux cart state:', cart);
  console.log('Cart items:', cart?.items);
  console.log('Cart count in Navbar:', cartCount);
  console.log('Navbar re-rendered');

  // Show Admin button only on Home page
  const isAdminVisible = location.pathname === '/';

  // Debug: Check admin state
  console.log('User:', user);
  console.log('Is Admin:', isAdmin);
  console.log('Role:', user?.role);

  const handleLogout = () => {
    console.log('=== LOGOUT DEBUG ===');
    console.log('Clearing cart on logout');
    dispatch(clearCart());
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="hamburger-icon"></span>
          </button>
          <Link to="/" className="navbar-logo">
            <span className="brand-text">
              <span className="apni-text">APNI</span>
              <span className="dukan-text">DUKAN</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/products" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link to="/cart" className="nav-link cart-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-icon">🛍️</span>
              <span>Cart ({cartCount})</span>
            </Link>
          )}
      
        </div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link auth-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link auth-link">
                Sign Up
              </Link>
              {isAdminVisible && (
              <Link to="/admin/login" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                <span className="admin-text">Admin</span>
              </Link>
            )}
            </>
          ) : (
            <>
              <span className="nav-user">
                {user?.name || user?.email}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
              {isAdminVisible && (
              <Link to="/admin/login" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                <span className="admin-text">Admin</span>
              </Link>
            )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
