import { useState } from 'react';
import '../styles/Filters.css';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Beauty',
  'Food',
];

function CategoryFilter({ value, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const handleCheckboxChange = (cat) => {
    if (value === cat) {
      onChange('');
    } else {
      onChange(cat);
    }
  };

  return (
    <div className="filter-group category-filter">
      <label className="filter-label" onClick={() => setExpanded(!expanded)}>
        <span>Category {expanded ? '▼' : '▶'}</span>
      </label>
      
      <div className={`checkbox-group ${expanded ? 'expanded' : ''}`}>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="cat-all"
            checked={value === ''}
            onChange={() => onChange('')}
            className="filter-checkbox"
          />
          <label htmlFor="cat-all" className="checkbox-label">All Categories</label>
        </div>
        
        {CATEGORIES.map((cat) => (
          <div key={cat} className="checkbox-item">
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={value === cat}
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
