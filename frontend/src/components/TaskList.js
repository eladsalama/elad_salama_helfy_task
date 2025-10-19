import { useState, useEffect, useRef } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

/**
 * TaskList Component with Dual Endless Carousels
 * CRITICAL: This implements separate carousels for pending and completed tasks
 */
function TaskList({ tasks, onEdit, onDelete, onToggle, onCreateNew, filter, sortBy, targetTaskId }) {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="dual-carousel-container">
      {/* Pending Tasks Carousel */}
      <TaskCarousel
        tasks={pendingTasks}
        title="⏳ Pending Tasks"
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        onCreateNew={onCreateNew}
        emptyMessage="No pending tasks"
        filter={filter}
        sortBy={sortBy}
        targetTaskId={targetTaskId}
      />

      {/* Completed Tasks Carousel */}
      <TaskCarousel
        tasks={completedTasks}
        title="✅ Completed Tasks"
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        onCreateNew={null} // No create button for completed
        emptyMessage="No completed tasks"
        filter={filter}
        sortBy={sortBy}
        targetTaskId={targetTaskId}
      />
    </div>
  );
}

/**
 * Individual Carousel Component - Simplified and Robust
 */
function TaskCarousel({ tasks, title, onEdit, onDelete, onToggle, onCreateNew, emptyMessage, filter, sortBy, targetTaskId }) {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real item after clone)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const hasMultipleTasks = tasks.length > 1;

  /**
   * Create extended task list for infinite loop effect
   */
  const getExtendedTasks = () => {
    if (tasks.length === 0) return [];
    if (tasks.length === 1) return [tasks[0]];
    if (tasks.length === 2) return [...tasks, ...tasks, ...tasks];
    return [...tasks.slice(-1), ...tasks, ...tasks.slice(0, 1)];
  };

  const extendedTasks = getExtendedTasks();

  /**
   * Navigate to next slide
   */
  const goToNext = () => {
    if (isTransitioning || tasks.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  /**
   * Navigate to previous slide
   */
  const goToPrevious = () => {
    if (isTransitioning || tasks.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  /**
   * Handle infinite loop - jump to real position after transition
   */
  useEffect(() => {
    if (!hasMultipleTasks || !isTransitioning) return;

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Wait for CSS transition to complete (500ms)
    transitionTimeoutRef.current = setTimeout(() => {
      // Check if we're at a clone and need to jump
      if (currentIndex >= tasks.length + 1) {
        // At end clone, jump to start
        setCurrentIndex(1);
      } else if (currentIndex <= 0) {
        // At start clone, jump to end
        setCurrentIndex(tasks.length);
      }
      // Clear transition flag
      setIsTransitioning(false);
    }, 500);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentIndex, isTransitioning, tasks.length, hasMultipleTasks]);

  /**
   * Auto-play: Move to next slide every 10 seconds
   */
  useEffect(() => {
    if (tasks.length <= 1) return;

    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    // Create new interval
    autoplayTimerRef.current = setInterval(() => {
      goToNext();
    }, 10000);

    // Cleanup
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [tasks.length]); // Only recreate when task count changes

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTransitioning, tasks.length]);

  /**
   * Pause autoplay on hover
   */
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  /**
   * Resume autoplay on mouse leave
   */
  const handleMouseLeave = () => {
    if (tasks.length <= 1 || autoplayTimerRef.current) return;
    
    autoplayTimerRef.current = setInterval(() => {
      goToNext();
    }, 10000);
  };

  /**
   * Reset when tasks change
   */
  useEffect(() => {
    setCurrentIndex(tasks.length === 1 ? 0 : 1);
    setIsTransitioning(false);
  }, [tasks.length]);

  /**
   * Reset to start when filter or sort changes
   */
  useEffect(() => {
    if (tasks.length > 0) {
      setCurrentIndex(tasks.length === 1 ? 0 : 1);
      setIsTransitioning(false);
    }
  }, [filter, sortBy, tasks.length]);

  /**
   * Navigate to target task when specified
   */
  useEffect(() => {
    if (!targetTaskId || tasks.length === 0) return;
    
    const targetIndex = tasks.findIndex(task => task.id === targetTaskId);
    if (targetIndex !== -1) {
      // Found the task, navigate to it
      const realIndex = tasks.length === 1 ? 0 : targetIndex + 1;
      setCurrentIndex(realIndex);
      setIsTransitioning(false);
    }
  }, [targetTaskId, tasks]);

  // Empty state - but still show title
  if (tasks.length === 0) {
    return (
      <div className="task-carousel">
        {/* Carousel Header */}
        <div className="carousel-header">
          <h3>{title}</h3>
          {onCreateNew && (
            <button className="add-task-btn" onClick={onCreateNew} title="Add new task">
              ➕
            </button>
          )}
        </div>
        
        <div className="task-carousel-empty">
          <div className="empty-icon">📭</div>
          <p>{emptyMessage}</p>
          {onCreateNew && (
            <button className="create-task-btn" onClick={onCreateNew}>
              + Create Task
            </button>
          )}
        </div>
      </div>
    );
  }

  // Calculate transform for carousel
  const getTransform = () => {
    if (tasks.length === 1) {
      return 'translateX(0%)';
    }
    const offset = -currentIndex * 100;
    return `translateX(${offset}%)`;
  };

  // Get actual task index for counter
  const getActualIndex = () => {
    if (tasks.length === 1) return 1;
    if (currentIndex === 0) return tasks.length;
    if (currentIndex === tasks.length + 1) return 1;
    return currentIndex;
  };

  return (
    <div 
      className="task-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Header */}
      <div className="carousel-header">
        <h3>{title}</h3>
        {onCreateNew && (
          <button className="add-task-btn" onClick={onCreateNew} title="Add new task">
            +
          </button>
        )}
      </div>

      {/* Carousel Container */}
      <div className="carousel-viewport">
        {/* Previous Button - Show even for single item */}
        {tasks.length > 1 && (
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={goToPrevious}
            disabled={isTransitioning}
            aria-label="Previous task"
          >
            ‹
          </button>
        )}

        {/* Carousel Track */}
        <div
          ref={carouselRef}
          className="carousel-track"
          style={{
            transform: getTransform(),
            transition: isTransitioning && tasks.length > 1 ? 'transform 0.5s ease-in-out' : 'none'
          }}
        >
          {extendedTasks.map((task, index) => (
            <div key={`${task.id}-${index}`} className="carousel-slide">
              <TaskItem
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>

        {/* Next Button - Show even for single item */}
        {tasks.length > 1 && (
          <button
            className="carousel-nav carousel-nav-next"
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="Next task"
          >
            ›
          </button>
        )}

        {/* Task Counter - Bottom Right */}
        <div className="carousel-counter">
          {getActualIndex()} / {tasks.length}
        </div>
      </div>

      {/* Carousel Indicators */}
      {tasks.length > 1 && (
        <div className="carousel-indicators">
          {tasks.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                (currentIndex === index + 1 || 
                 (currentIndex === 0 && index === tasks.length - 1) ||
                 (currentIndex === tasks.length + 1 && index === 0))
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index + 1);
                }
              }}
              aria-label={`Go to task ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Keyboard Hint */}
      {tasks.length > 1 && (
        <div className="carousel-hint">
          ← → Use arrow keys to navigate
        </div>
      )}
    </div>
  );
}

export default TaskList;
