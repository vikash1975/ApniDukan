import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllOrders, updateOrderStatus } from '../services/api';
import '../styles/AdminOrders.css';

function AdminOrders() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ));
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      paid: '#2196f3',
      processing: '#9c27b0',
      shipped: '#ff9800',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>All Orders</h1>
        <span className="order-count">{orders.length} total orders</span>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">No orders yet</div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Products</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">{order._id.substring(0, 8).toUpperCase()}</td>
                  <td className="user-email">{order.userId?.email || 'Unknown'}</td>
                  <td className="products-cell">
                    {order.items.map((item, i) => (
                      <div key={i} className="product-name">
                        {item.productId?.name || 'Product'}
                      </div>
                    ))}
                  </td>
                  <td className="qty">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="price">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="address">{order.shippingAddress.substring(0, 25)}...</td>
                  <td className="status-cell">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="action-cell">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="status-select"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
