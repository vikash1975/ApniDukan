import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/Navbar.css';

function Navbar() {
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const { getItemCount } = useContext(CartContext);
  const navigate = useNavigate();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="apni">Apni</span>
          <span className="dukan">Dukan</span>
        </Link>

        <div className="navbar-center"></div>

        <div className="navbar-right">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link to="/admin/login" className="nav-link admin-link">
                Admin
              </Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/admin/orders" className="nav-link">
                    Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/products" className="nav-link">
                    Products
                  </Link>
                  <Link to="/cart" className="nav-link cart-link">
                    🛒 Cart ({cartCount})
                  </Link>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </>
              )}

              <span className="nav-user">
                {user?.name || user?.email}
              </span>

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
