import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectLoading } from '../redux/authSlice';

function PrivateRoute({ children, requiredRole }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectLoading);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Allow access to login/signup pages even when authenticated
  if (!isAuthenticated && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
}

export default PrivateRoute;