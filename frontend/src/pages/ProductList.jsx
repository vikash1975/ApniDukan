



import { useState, useEffect } from 'react';
import { getFilteredProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import PriceFilter from '../components/PriceFilter';
import SearchFilter from '../components/SearchFilter';
import '../styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  // Debounce
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedMin, setDebouncedMin] = useState(minPrice);
  const [debouncedMax, setDebouncedMax] = useState(maxPrice);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMin(minPrice), 500);
    return () => clearTimeout(timer);
  }, [minPrice]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMax(maxPrice), 500);
    return () => clearTimeout(timer);
  }, [maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      //  Convert category to lowercase before sending
      if (category.length > 0) {
        params.category = category.map((c) => c.toLowerCase());
      }

      if (debouncedMin) params.minPrice = debouncedMin;
      if (debouncedMax) params.maxPrice = debouncedMax;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await getFilteredProducts(params);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, debouncedMin, debouncedMax, debouncedSearch]);

  const handleReset = () => {
    setCategory([]);
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
  };

  return (
    <div className="product-list-container">
      <h1>Products</h1>

      <div className="filters-section">
        <div className="filters-grid">
          <SearchFilter value={search} onChange={setSearch} />
          <CategoryFilter value={category} onChange={setCategory} />
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
          <button className="reset-btn" onClick={handleReset}>
            🔄 Reset Filters
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;

