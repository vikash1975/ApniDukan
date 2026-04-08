import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductById, getFilteredProducts } from '../services/api';
import { addToCartAsync } from '../redux/cartSlice';
import ProductCard from '../components/ProductCard';
import '../styles/SingleProduct.css';

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
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

  const fetchRelatedProducts = async () => {
    try {
      const response = await getFilteredProducts({ limit: 4 });
      setRelatedProducts(response.data.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to fetch related products:', err);
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
      console.log('=== SINGLE PRODUCT: ADD TO CART START ===');
      console.log('Product ID:', product._id);
      console.log('Quantity:', parseInt(quantity));
      console.log('Dispatching addToCartAsync...');
      
      const result = await dispatch(addToCartAsync({
        productId: product._id,
        quantity: parseInt(quantity),
      })).unwrap();
      
      console.log('=== SINGLE PRODUCT: ADD TO CART SUCCESS ===');
      console.log('Dispatch result:', result);
      alert('Product added to cart!');
    } catch (error) {
      console.error('=== SINGLE PRODUCT: ADD TO CART ERROR ===');
      console.error('Error:', error);
      alert('Failed to add to cart');
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
      <div className="single-product">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        <div className="product-details-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="category-badge">{product.category}</p>

          <div className="price-section">
            <span className="price">Rs. {product.price}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="options-section">
            <div className="size-selector">
              <h3>SIZE</h3>
              <div className="size-options">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-selector">
              <h3>COLOR</h3>
              <div className="color-options">
                {['Black', 'White', 'Green', 'Blue', 'Red'].map(color => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="description">
            <h3>DESCRIPTION</h3>
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
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
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
                {addingToCart ? 'Adding...' : 'ADD TO CART'}
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="out-of-stock-message">Out of Stock</div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2 className="related-title">You might like these</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default SingleProduct;
