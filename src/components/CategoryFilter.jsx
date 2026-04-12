import './CategoryFilter.css'

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-filter">
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
