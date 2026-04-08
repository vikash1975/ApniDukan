import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFilteredProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFilteredProducts({ limit: 6 });
      setFeaturedProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleCategoryClick = (selectedCategory) => {
    // Navigate to products page with category filter
    navigate('/products', { state: { category: [selectedCategory] } });
  };

  const handleProductClick = (productId) => {
    // Navigate to product detail page
    navigate(`/products/${productId}`);
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title"><span className="apni-hero">APNI</span> <span className="dukan-hero">DUKAN</span></h1>
          <p className="hero-subtitle">Premium Shopping Experience for the Modern Consumer</p>
          <div className="hero-actions">
            <button onClick={handleShopNow} className="hero-cta">Shop Now</button>
            <a href="#categories" className="hero-cta secondary" onClick={(e) => { e.preventDefault(); document.getElementById('categories').scrollIntoView({ behavior: 'smooth' }); }}>Browse Categories</a>
          </div>
        </div>
        
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section" id="featured">
          <div className="section-header">
            <h2 className="section-title">SHOP THE NEW ARRIVAL</h2>
            <p className="section-subtitle">Latest collection just for you</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} onClick={() => handleProductClick(product._id)} style={{ cursor: 'pointer' }}>
                <ProductCard product={product} featured={true} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="categories-section" id="categories">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          <div className="category-card" onClick={() => handleCategoryClick('Electronics')}>
            <div className="category-icon">electronics</div>
            <h3>Electronics</h3>
            <p>Gadgets & Devices</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Fashion')}>
            <div className="category-icon">clothing</div>
            <h3>Fashion</h3>
            <p>Fashion & Style</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Books')}>
            <div className="category-icon">books</div>
            <h3>Books</h3>
            <p>Read & Learn</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Home & Garden')}>
            <div className="category-icon">home</div>
            <h3>Home & Garden</h3>
            <p>Decor & Essentials</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Sports')}>
            <div className="category-icon">sports</div>
            <h3>Sports</h3>
            <p>Active & Fitness</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Toys')}>
            <div className="category-icon">toys</div>
            <h3>Toys</h3>
            <p>Kids & Fun</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Beauty')}>
            <div className="category-icon">beauty</div>
            <h3>Beauty</h3>
            <p>Cosmetics & Care</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Food')}>
            <div className="category-icon">food</div>
            <h3>Food</h3>
            <p>Groceries & More</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">
              <span className="footer-apni">APNI</span>
              <span className="footer-dukan">DUKAN</span>
            </h3>
            <p className="footer-tagline">Premium Shopping Experience for Modern Consumer</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/products">Electronics</Link></li>
                <li><Link to="/products">Fashion</Link></li>
                <li><Link to="/products">Books</Link></li>
                <li><Link to="/products">Home & Garden</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 APNI DUKAN. All rights reserved.</p>
          <div className="footer-social">
            <span>Follow us: </span>
            <span className="social-links">
              <span>📘</span>
              <span>🐦</span>
              <span>📷</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
