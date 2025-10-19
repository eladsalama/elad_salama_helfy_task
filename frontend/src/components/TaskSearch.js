import './TaskSearch.css';

/**
 * TaskSearch Component
 * Provides search functionality to filter tasks by title or description
 */
function TaskSearch({ searchQuery, onSearchChange }) {
  /**
   * Handle search input change
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  /**
   * Clear search query
   */
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="task-search">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={handleChange}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {searchQuery && (
        <div className="search-info">
          Searching for: <strong>{searchQuery}</strong>
        </div>
      )}
    </div>
  );
}

export default TaskSearch;
