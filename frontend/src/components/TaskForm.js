import { useState, useEffect } from 'react';
import './TaskForm.css';

/**
 * TaskForm Component
 * Handles creating and editing tasks
 */
function TaskForm({ onSubmit, onCancel, editTask = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium'
      });
    }
  }, [editTask]);

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Description is optional - no validation needed

    if (!['low', 'medium', 'high'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority
      });

      // Reset form on success (only for create mode)
      if (!editTask) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel/reset
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium'
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="task-form-container">
      <h2>{editTask ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
            placeholder="Enter task title..."
            disabled={isSubmitting}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description">
            Description <span className="optional">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
            placeholder="Enter task description..."
            rows="4"
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        {/* Priority Select */}
        <div className="form-group">
          <label htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={errors.priority ? 'input-error' : ''}
            disabled={isSubmitting}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          {errors.priority && (
            <span className="error-message">{errors.priority}</span>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (editTask ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
