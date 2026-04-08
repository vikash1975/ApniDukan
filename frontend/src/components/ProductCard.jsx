import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

function ProductCard({ product, featured }) {
  return (
    <Link to={`/products/${product._id}`} className={`product-card ${featured ? 'featured' : ''}`}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {featured && <div className="new-arrival-badge">NEW ARRIVAL</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description?.substring(0, 60)}...</p>
        <div className="product-footer">
          <span className="product-price">Rs. {product.price}</span>
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
