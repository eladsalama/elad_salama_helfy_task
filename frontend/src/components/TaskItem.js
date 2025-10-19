import './TaskItem.css';

/**
 * TaskItem Component
 * Displays individual task with actions
 */
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  /**
   * Truncate text to specified length and add ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated text with ellipsis if needed
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  /**
   * Format date to readable string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * Get priority badge icon and color
   * @param {string} priority - Task priority (low, medium, high)
   * @returns {Object} Badge object with icon, color, and label
   */
  const getPriorityBadge = (priority) => {
    const badges = {
      low: { icon: '🟢', color: '#27ae60', label: 'Low' },
      medium: { icon: '🟡', color: '#f39c12', label: 'Medium' },
      high: { icon: '🔴', color: '#e74c3c', label: 'High' }
    };
    return badges[priority] || badges.medium;
  };

  /**
   * Handle delete with confirmation
   * Shows confirmation dialog before deleting
   */
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {/* Task Header */}
      <div className="task-header">
        <div className="task-title-section">
          <h3 className="task-title">{truncateText(task.title, 50)}</h3>
          <span 
            className="priority-badge" 
            style={{ backgroundColor: priorityBadge.color }}
            title={`Priority: ${priorityBadge.label}`}
          >
            {priorityBadge.icon} {priorityBadge.label}
          </span>
        </div>
        
        {task.completed && (
          <span className="completed-badge" title="Task Completed">
            ✓
          </span>
        )}
      </div>

      {/* Task Description */}
      <p className="task-description">{truncateText(task.description, 100)}</p>

      {/* Task Metadata */}
      <div className="task-meta">
        <span className="task-date" title="Created at">
          📅 {formatDate(task.createdAt)}
        </span>
        <span className="task-status">
          {task.completed ? '✅ Completed' : '⏳ Pending'}
        </span>
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        <button
          className="btn-action btn-toggle"
          onClick={() => onToggle(task.id)}
          title={task.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.completed ? '↩️ Undo' : '✓ Complete'}
        </button>

        <button
          className="btn-action btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          ✏️ Edit
        </button>

        <button
          className="btn-action btn-delete"
          onClick={handleDelete}
          title="Delete task"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
