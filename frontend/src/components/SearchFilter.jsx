import '../styles/Filters.css';

function SearchFilter({ value, onChange }) {
  return (
    <div className="filter-group">
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchFilter;
