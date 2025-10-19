/**
 * Task Manager API Server
 * Simple RESTful API for task management
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Store tasks in memory
let tasks = [];
let nextId = 1;

// Seed initial tasks with realistic daily tasks
tasks = [
  {
    id: nextId++,
    title: 'Morning routine',
    description: 'coffee → glance at calendar, pick today\'s "big 3"',
    completed: true,
    createdAt: new Date('2025-10-19T08:00:00'),
    priority: 'high'
  },
  {
    id: nextId++,
    title: 'Call mom',
    description: 'ping mom about Friday dinner (don\'t forget the wine she likes)',
    completed: false,
    createdAt: new Date('2025-10-19T08:30:00'),
    priority: 'medium'
  },
  {
    id: nextId++,
    title: 'Email catch-up',
    description: 'reply to 3 emails I\'ve been dodging — quick answers only',
    completed: false,
    createdAt: new Date('2025-10-19T09:00:00'),
    priority: 'medium'
  },
  {
    id: nextId++,
    title: 'Team stand-up',
    description: 'stand-up at 10:15 — yesterday/today/blockers, keep it short',
    completed: true,
    createdAt: new Date('2025-10-19T10:00:00'),
    priority: 'high'
  },
  {
    id: nextId++,
    title: 'Focus time - bug fix',
    description: 'deep work: finish the bug fix before lunch, no Slack!!',
    completed: false,
    createdAt: new Date('2025-10-19T10:30:00'),
    priority: 'high'
  },
  {
    id: nextId++,
    title: 'Pay bills',
    description: 'pay electricity bill + snap photo of the receipt for records',
    completed: true,
    createdAt: new Date('2025-10-19T13:00:00'),
    priority: 'medium'
  },
  {
    id: nextId++,
    title: 'Movement break',
    description: '20-min walk or quick stretch — back\'s been tight',
    completed: false,
    createdAt: new Date('2025-10-19T14:00:00'),
    priority: 'low'
  },
  {
    id: nextId++,
    title: 'Grocery shopping',
    description: 'groceries: eggs, salad stuff, pita, hummus, cereal (get the blue box)',
    completed: false,
    createdAt: new Date('2025-10-19T15:00:00'),
    priority: 'medium'
  },
  {
    id: nextId++,
    title: 'Weekend plans',
    description: 'text Tahel about weekend plans, book tickets',
    completed: false,
    createdAt: new Date('2025-10-19T16:00:00'),
    priority: 'medium'
  },
  {
    id: nextId++,
    title: 'Daily reflection',
    description: 'daily wrap: jot 2 wins, push leftovers to tomorrow, set first task',
    completed: true,
    createdAt: new Date('2025-10-19T20:00:00'),
    priority: 'low'
  }
];

// Helper functions
const findTaskById = (id) => {
  return tasks.find(task => task.id === parseInt(id));
};

const validateTaskData = (data) => {
  const { title, description, priority } = data;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required');
  }

  // Description is optional
  if (description !== undefined && description !== null && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (!priority || !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  return errors;
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const errors = validateTaskData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Create new task
    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      priority
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/tasks/:id - Update an existing task
 * @param {number} id - Task ID
 * @body {string} [title] - Updated task title
 * @body {string} [description] - Updated task description
 * @body {string} [priority] - Updated task priority
 * @body {boolean} [completed] - Updated completion status
 * @returns {Object} The updated task
 */
app.put('/api/tasks/:id', (req, res) => {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, priority, completed } = req.body;

    // Validate if fields are provided
    if (title !== undefined || description !== undefined || priority !== undefined) {
      const dataToValidate = {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        priority: priority !== undefined ? priority : task.priority
      };

      const errors = validateTaskData(dataToValidate);
      if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
    }

    // Update task fields
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = Boolean(completed);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/tasks/:id - Delete a task
 * @param {number} id - Task ID to delete
 * @returns {void} 204 No Content on success
 */
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/tasks/:id/toggle - Toggle task completion status
 * @param {number} id - Task ID to toggle
 * @returns {Object} The updated task with toggled completion status
 */
app.patch('/api/tasks/:id/toggle', (req, res) => {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle completion status
    task.completed = !task.completed;

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
