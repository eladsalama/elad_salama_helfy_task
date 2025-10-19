import { useState, useEffect } from 'react';
import './App.css';
import * as api from './services/api';
import TaskControls from './components/TaskControls';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [targetTaskId, setTargetTaskId] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await api.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowForm(false);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  /**
   * Update an existing task
   * @param {Object} taskData - Updated task data
   */
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    try {
      setError(null);
      const updatedTask = await api.updateTask(editingTask.id, taskData);
      setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
      setEditingTask(null);
      setShowForm(false); // Close the modal after updating
      return updatedTask;
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  /**
   * Delete a task
   * @param {number} id - Task ID to delete
   */
  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      await api.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  /**
   * Toggle task completion status
   * @param {number} id - Task ID to toggle
   */
  const handleToggleTask = async (id) => {
    try {
      setError(null);
      const updatedTask = await api.toggleTask(id);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
      // Navigate to the toggled task in its new carousel
      setTargetTaskId(id);
      // Clear target after a brief delay to allow re-triggering
      setTimeout(() => setTargetTaskId(null), 100);
    } catch (err) {
      setError('Failed to toggle task. Please try again.');
      console.error('Error toggling task:', err);
      throw err;
    }
  };

  /**
   * Start editing a task
   * @param {Object} task - Task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  /**
   * Filter tasks based on completion status
   * @returns {Array} Filtered tasks array
   */
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply status filter
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'all':
      default:
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        break;
      default:
        break;
    }

    return sorted;
  };

  /**
   * Get task counts for filter badges
   * @returns {Object} Object with all, completed, and pending counts
   */
  const getTaskCounts = () => {
    return {
      all: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length
    };
  };

  const filteredTasks = getFilteredTasks();
  const taskCounts = getTaskCounts();

  return (
    <div className="App">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <header className="app-header">
        <h1>📝 Task Manager</h1>
        <p>Organize your tasks with an endless carousel</p>
      </header>

      <main className="app-main">
        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={() => setError(null)} className="error-dismiss">×</button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <div className="app-content">
            {/* Task Controls - Combined Search, Filter, Sort */}
            <TaskControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Task List Carousel */}
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
              onCreateNew={() => setShowForm(true)}
              filter={filter}
              sortBy={sortBy}
              targetTaskId={targetTaskId}
            />

            {/* Task Form Modal */}
            {showForm && (
              <div className="modal-overlay" onClick={handleCancelEdit}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close" onClick={handleCancelEdit}>×</button>
                  <TaskForm
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={handleCancelEdit}
                    editTask={editingTask}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Fullstack Home Assignment - Elad Salama</p>
      </footer>
    </div>
  );
}

export default App;

