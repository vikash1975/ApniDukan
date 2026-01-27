

import { useState } from 'react';
import '../styles/Filters.css';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home',
  'Sports',
  'Books',
  'Toys',
  'Beauty',
  'Food',
];

function CategoryFilter({ value = [], onChange }) {
  const [expanded, setExpanded] = useState(false);

  const handleCheckboxChange = (cat) => {
    if (value.includes(cat)) {
      onChange(value.filter((c) => c !== cat)); // remove
    } else {
      onChange([...value, cat]); // add
    }
  };

  const handleSelectAll = () => {
    if (value.length === CATEGORIES.length) {
      onChange([]); // unselect all
    } else {
      onChange(CATEGORIES); // select all
    }
  };

  return (
    <div className="filter-group category-filter">
      <label className="filter-label" onClick={() => setExpanded(!expanded)}>
        <span>Category {expanded ? '▼' : '▶'}</span>
      </label>

      <div className={`checkbox-group ${expanded ? 'expanded' : ''}`}>

        {/* SELECT ALL */}
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="cat-all"
            checked={value.length === CATEGORIES.length}
            onChange={handleSelectAll}
            className="filter-checkbox"
          />
          <label htmlFor="cat-all" className="checkbox-label">
            All Categories
          </label>
        </div>

        {/* INDIVIDUAL */}
        {CATEGORIES.map((cat) => (
          <div key={cat} className="checkbox-item">
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={value.includes(cat)}
              onChange={() => handleCheckboxChange(cat)}
              className="filter-checkbox"
            />
            <label htmlFor={`cat-${cat}`} className="checkbox-label">
              {cat}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
