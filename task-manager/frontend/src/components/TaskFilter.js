import './TaskFilter.css';

/**
 * TaskFilter Component
 * Allows filtering tasks by completion status
 */
function TaskFilter({ currentFilter, onFilterChange, taskCounts }) {
  const filters = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✅' }
  ];

  return (
    <div className="task-filter-container">
      <div className="filter-label">Filter:</div>
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.value}
            className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.value)}
            title={`Show ${filter.label.toLowerCase()}`}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-text">{filter.label}</span>
            {taskCounts && (
              <span className="filter-count">
                ({taskCounts[filter.value] || 0})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskFilter;
