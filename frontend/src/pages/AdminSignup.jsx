import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signupAdmin, selectLoading, selectError, clearError } from '../redux/authSlice';
import '../styles/Auth.css';

function AdminSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const authError = useSelector(selectError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    dispatch(clearError());

    if (!name || !email || !password || !adminSecret) {
      setErrorMsg('All fields are required');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(signupAdmin({ name, email, password, adminSecret })).unwrap();
      navigate('/admin/login');
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card admin-card">
        <h1>Admin Sign Up</h1>
        <p className="admin-subtitle">Administrator Registration</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

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
              placeholder="Enter password (min 6 chars)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminSecret">Admin Secret Key</label>
            <input
              id="adminSecret"
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Enter admin secret key"
              disabled={loading}
            />
          </div>

          {(errorMsg || authError) && <div className="error-message">{errorMsg || authError}</div>}

          <button type="submit" className="auth-btn admin-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Admin Sign Up'}
          </button>
        </form>

        <p className="auth-link">
          Already admin? <Link to="/admin/login">Login here</Link>
        </p>

        <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />

        <p className="auth-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          👤 User account? <Link to="/signup" style={{ color: '#4CAF50' }}>User Sign Up</Link>
        </p>

        <p className="auth-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          🏠 Back to <Link to="/" style={{ color: '#4CAF50' }}>Home</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignup;
