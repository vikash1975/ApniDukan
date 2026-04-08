import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginAdmin, selectLoading, selectError, clearError } from '../redux/authSlice';
import '../styles/Auth.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const authError = useSelector(selectError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    dispatch(clearError());

    if (!email || !password) {
      setErrorMsg('Email and password are required');
      return;
    }

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card admin-card">
        <h1>Admin Login</h1>
        <p className="admin-subtitle">Administrator Access Only</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={loading}
            />
          </div>

          {(errorMsg || authError) && <div className="error-message">{errorMsg || authError}</div>}

          <button type="submit" className="auth-btn admin-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have admin account? <Link to="/admin/signup">Admin Sign Up</Link>
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />

        <p className="auth-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          👤 User Login? <Link to="/login" style={{ color: '#2196F3' }}>Click here</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
