import './TaskControls.css';

/**
 * TaskControls Component
 * Combines search, filter, and sort into one compact control panel
 */
function TaskControls({ 
  searchQuery, 
  onSearchChange, 
  currentFilter, 
  onFilterChange, 
  taskCounts,
  sortBy,
  onSortChange
}) {
  return (
    <div className="task-controls">
      {/* Search Bar */}
      <div className="control-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="control-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All <span className="badge">{taskCounts.all}</span>
          </button>
          <button
            className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange('pending')}
          >
            Pending <span className="badge">{taskCounts.pending}</span>
          </button>
          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Completed <span className="badge">{taskCounts.completed}</span>
          </button>
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="control-section">
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === 'date-desc' ? 'active' : ''}`}
            onClick={() => onSortChange(sortBy === 'date-desc' ? null : 'date-desc')}
            title="Newest First (click again to disable)"
          >
            📅 Newest
          </button>
          <button
            className={`sort-btn ${sortBy === 'date-asc' ? 'active' : ''}`}
            onClick={() => onSortChange(sortBy === 'date-asc' ? null : 'date-asc')}
            title="Oldest First (click again to disable)"
          >
            📅 Oldest
          </button>
          <button
            className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => onSortChange(sortBy === 'priority' ? null : 'priority')}
            title="Priority High to Low (click again to disable)"
          >
            ⚡ Priority
          </button>
          <button
            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => onSortChange(sortBy === 'title' ? null : 'title')}
            title="Alphabetical (click again to disable)"
          >
            🔤 A-Z
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskControls;
