import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';
import '../styles/SingleProduct.css';

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        productId: product._id,
        quantity: parseInt(quantity),
      });
      alert('Added to cart!');
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product.stock) {
      setQuantity(val);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="single-product-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="single-product">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        <div className="product-details-section">
          <h1>{product.name}</h1>
          <p className="category-badge">{product.category}</p>

          <div className="price-section">
            <span className="price">₹{product.price}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.stock > 0 && (
            <div className="cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  disabled={addingToCart}
                >
                  {[...Array(product.stock)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="out-of-stock-message">Out of Stock</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
