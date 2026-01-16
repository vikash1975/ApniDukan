import '../styles/Filters.css';

function PriceFilter({ minPrice, maxPrice, onChange }) {
  const handleMinChange = (e) => {
    onChange(e.target.value, maxPrice);
  };

  const handleMaxChange = (e) => {
    onChange(minPrice, e.target.value);
  };

  return (
    <div className="filter-group price-filter">
      <label>Price Range</label>
      <div className="price-inputs">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={handleMinChange}
          className="price-input"
        />
        <span className="dash">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={handleMaxChange}
          className="price-input"
        />
      </div>
    </div>
  );
}

export default PriceFilter;
