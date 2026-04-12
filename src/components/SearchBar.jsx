import './SearchBar.css'

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        type="text"
        placeholder="Search resources, guides, templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button 
          className="clear-button"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar
