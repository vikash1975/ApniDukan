import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, selectLoading, selectError, clearError } from '../redux/authSlice';
import '../styles/Auth.css';

function Login() {
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
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/products');
    } catch (err) {
      setErrorMsg(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>User Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {(errorMsg || authError) && (
            <div className="error-message">
              {errorMsg || authError}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
