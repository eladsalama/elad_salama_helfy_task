import './TaskSort.css';

function TaskSort({ sortBy, onSortChange }) {
  const sortOptions = [
    { value: 'date-desc', label: '📅 Newest First', icon: '↓' },
    { value: 'date-asc', label: '📅 Oldest First', icon: '↑' },
    { value: 'priority', label: '⭐ Priority', icon: '' },
    { value: 'title', label: '🔤 Title A-Z', icon: '' }
  ];

  return (
    <div className="task-sort-container">
      <label className="sort-label">Sort by:</label>
      <div className="sort-buttons">
        {sortOptions.map(option => (
          <button
            key={option.value}
            className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
            onClick={() => onSortChange(option.value)}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskSort;
