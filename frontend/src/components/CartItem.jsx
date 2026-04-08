import { useDispatch } from 'react-redux';
import { removeFromCartAsync, updateQuantityAsync } from '../redux/cartSlice';
import '../styles/CartItem.css';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      console.log('=== CART ITEM REMOVE DEBUG ===');
      console.log('Item being removed:', item);
      console.log('Product ID being removed:', item.productId._id);
      console.log('Product name:', item.productId.name);
      
      await dispatch(removeFromCartAsync(item.productId._id)).unwrap();
      
      console.log('Remove operation completed');
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      try {
        await dispatch(updateQuantityAsync({ 
          productId: item.productId._id, 
          quantity: newQuantity 
        })).unwrap();
      } catch (err) {
        console.error('Update quantity error:', err);
      }
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={item.productId.image} alt={item.productId.name} />
      </div>
      
      <div className="item-details">
        <h3>{item.productId.name}</h3>
        <p className="item-category">{item.productId.category}</p>
      </div>
      
      <div className="item-price">
        <span>₹{item.price}</span>
      </div>
      
      <div className="item-quantity">
        <select value={item.quantity} onChange={handleQuantityChange}>
          {[...Array(item.productId.stock)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      
      <div className="item-subtotal">
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="item-actions">
        <button className="remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
