
// import { useState, useEffect } from 'react';
// import { getFilteredProducts } from '../services/api';
// import ProductCard from '../components/ProductCard';
// import CategoryFilter from '../components/CategoryFilter';
// import PriceFilter from '../components/PriceFilter';
// import SearchFilter from '../components/SearchFilter';
// import '../styles/ProductList.css';

// function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // RAW filter states (user input)
//   const [category, setCategory] = useState([]);
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   const [search, setSearch] = useState('');

//   // DEBOUNCED states (API call ke liye)
//   const [debouncedCategory, setDebouncedCategory] = useState([]);
//   const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
//   const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   // 🔥 DEBOUNCE EFFECT (search + price + category)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedCategory(category);
//       setDebouncedMinPrice(minPrice);
//       setDebouncedMaxPrice(maxPrice);
//       setDebouncedSearch(search);
//     }, 500); // 500ms debounce

//     return () => clearTimeout(timer);
//   }, [category, minPrice, maxPrice, search]);

//   // FETCH PRODUCTS (sirf debounced values se)
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const params = {};

//       if (debouncedCategory.length > 0) {
//         params.category = debouncedCategory;
//       }
//       if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
//       if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
//       if (debouncedSearch) params.search = debouncedSearch;

//       const response = await getFilteredProducts(params);
//       setProducts(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // API call jab debounced filters change ho
//   useEffect(() => {
//     fetchProducts();
//   }, [
//     debouncedCategory,
//     debouncedMinPrice,
//     debouncedMaxPrice,
//     debouncedSearch,
//   ]);

//   // Handlers
//   const handleCategoryChange = (cat) => setCategory(cat);

//   const handlePriceChange = (min, max) => {
//     setMinPrice(min);
//     setMaxPrice(max);
//   };

//   const handleSearchChange = (q) => setSearch(q);

//   const handleReset = () => {
//     setCategory([]);
//     setMinPrice('');
//     setMaxPrice('');
//     setSearch('');
//   };

//   const hasActiveFilters =
//     category.length > 0 || minPrice || maxPrice || search;

//   return (
//     <div className="product-list-container">
//       <h1>Products</h1>

//       <div className="filters-section">
//         <div className="filters-grid">
//           <SearchFilter value={search} onChange={handleSearchChange} />
//           <CategoryFilter value={category} onChange={handleCategoryChange} />
//           <PriceFilter
//             minPrice={minPrice}
//             maxPrice={maxPrice}
//             onChange={handlePriceChange}
//           />
//           <button className="reset-btn" onClick={handleReset}>
//             🔄 Reset Filters
//           </button>
//         </div>

//         {hasActiveFilters && (
//           <div className="active-filters">
//             <span className="filter-label-text">Active Filters:</span>

//             <div className="filter-chips">
//               {search && (
//                 <div className="filter-chip">
//                   🔍 "{search}"
//                   <button onClick={() => setSearch('')}>×</button>
//                 </div>
//               )}

//               {category.length > 0 && (
//                 <div className="filter-chip">
//                   📁 {category.join(', ')}
//                   <button onClick={() => setCategory([])}>×</button>
//                 </div>
//               )}

//               {(minPrice || maxPrice) && (
//                 <div className="filter-chip">
//                   💰 ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
//                   <button
//                     onClick={() => {
//                       setMinPrice('');
//                       setMaxPrice('');
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {loading ? (
//         <div className="loading">Loading products...</div>
//       ) : products.length === 0 ? (
//         <div className="no-products">No products found</div>
//       ) : (
//         <div className="products-grid">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductList;





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

      if (category.length > 0) params.category = category;
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


