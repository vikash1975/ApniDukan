import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/CartItem.css';

function CartItem({ item }) {
  const { removeItem, updateQuantity } = useContext(CartContext);

  const handleRemove = async () => {
    try {
      await removeItem(item.productId._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      try {
        await updateQuantity(item.productId._id, newQuantity);
      } catch (err) {
        console.error(err);
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
