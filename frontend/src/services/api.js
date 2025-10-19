/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */

const BASE_URL = 'http://localhost:4000/api';

/**
 * Get all tasks from the backend
 * @returns {Promise<Array>} Array of task objects
 */
export const getTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - The task data (title, description, priority)
 * @returns {Promise<Object>} The created task object
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {number} id - The task ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated task object
 */
export const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {number} id - The task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    // 204 No Content - success with no response body
    return;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Toggle task completion status
 * @param {number} id - The task ID
 * @returns {Promise<Object>} The updated task object
 */
export const toggleTask = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling task:', error);
    throw error;
  }
};
