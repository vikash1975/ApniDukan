import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, isAdmin, isUserRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  if (requiredRole === 'user' && !isUserRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default PrivateRoute;
