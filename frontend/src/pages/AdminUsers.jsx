import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data - replace with actual API call
      const mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          totalOrders: 5,
          totalSpent: 2500,
          lastOrder: '2024-01-15'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          totalOrders: 3,
          totalSpent: 1800,
          lastOrder: '2024-01-10'
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'user',
          totalOrders: 8,
          totalSpent: 3200,
          lastOrder: '2024-01-20'
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          role: 'user',
          totalOrders: 2,
          totalSpent: 900,
          lastOrder: '2024-01-05'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleViewOrders = (userId) => {
    // Navigate to user's orders page
    navigate(`/admin/user-orders/${userId}`);
  };

  const handleBlockUser = (userId) => {
    // Block user functionality
    console.log('Blocking user:', userId);
    // Add API call to block user
  };

  const handleUnblockUser = (userId) => {
    // Unblock user functionality
    console.log('Unblocking user:', userId);
    // Add API call to unblock user
  };

  return (
    <div className="admin-users-container">
      <div className="admin-header">
        <h1>Shopping Users</h1>
        <p>Users who have made purchases and their shopping activity</p>
      </div>

      {loading && (
        <div className="loading">Loading users...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!loading && !error && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.totalOrders}</td>
                  <td>₹{user.totalSpent}</td>
                  <td>{user.lastOrder}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-orders-btn"
                        onClick={() => handleViewOrders(user._id)}
                      >
                        View Orders
                      </button>
                      <button 
                        className="block-btn"
                        onClick={() => handleBlockUser(user._id)}
                      >
                        Block
                      </button>
                      <button 
                        className="unblock-btn"
                        onClick={() => handleUnblockUser(user._id)}
                      >
                        Unblock
                      </button>
                    </div>
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

export default AdminUsers;
