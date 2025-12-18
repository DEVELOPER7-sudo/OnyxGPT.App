import { useState, useEffect, useCallback } from 'react';
import {
  detectIslandType,
  hasDynamicIsland,
  hasOppoAlwaysOn,
  createIslandTask,
  addIslandTask,
  updateIslandTask,
  removeIslandTask,
  getActiveTasks,
  clearIslandTasks,
  getIslandTask,
  showIslandNotification,
  DynamicIslandTask,
  IslandConfig,
} from '@/lib/dynamic-island';

interface UseDynamicIslandReturn {
  islandType: ReturnType<typeof detectIslandType>;
  hasDynamicIsland: boolean;
  hasOppoAlwaysOn: boolean;
  isAvailable: boolean;
  activeTasks: DynamicIslandTask[];
  createTask: (
    title: string,
    type: DynamicIslandTask['type'],
    description?: string,
    icon?: string
  ) => string;
  updateProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
}

/**
 * Hook for managing Dynamic Island and Oppo Always-On Display tasks
 * Automatically detects device capabilities
 */
export const useDynamicIsland = (): UseDynamicIslandReturn => {
  const [islandType, setIslandType] = useState<ReturnType<typeof detectIslandType>>('none');
  const [hasDI, setHasDI] = useState(false);
  const [hasOppo, setHasOppo] = useState(false);
  const [tasks, setTasks] = useState<DynamicIslandTask[]>([]);

  // Detect island on mount
  useEffect(() => {
    const detected = detectIslandType();
    setIslandType(detected);
    setHasDI(hasDynamicIsland());
    setHasOppo(hasOppoAlwaysOn());
  }, []);

  // Sync active tasks
  useEffect(() => {
    setTasks(getActiveTasks());
  }, []);

  // Create new task
  const createTask = useCallback(
    (
      title: string,
      type: DynamicIslandTask['type'],
      description?: string,
      icon?: string
    ): string => {
      const task = createIslandTask(title, type, description, icon);
      addIslandTask(task);
      setTasks(getActiveTasks());

      // Show notification if available
      if (islandType !== 'none') {
        showIslandNotification(task, islandType);
      }

      return task.id;
    },
    [islandType]
  );

  // Update task progress
  const updateProgress = useCallback((taskId: string, progress: number) => {
    updateIslandTask(taskId, progress);
    setTasks(getActiveTasks());
  }, []);

  // Complete task (100%)
  const completeTask = useCallback((taskId: string) => {
    updateProgress(taskId, 100);
    
    // Show completion notification
    const task = getIslandTask(taskId);
    if (task) {
      console.log(`✅ Task completed: ${task.title}`);
    }
  }, [updateProgress]);

  // Remove task
  const removeTask = useCallback((taskId: string) => {
    removeIslandTask(taskId);
    setTasks(getActiveTasks());
  }, []);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    clearIslandTasks();
    setTasks([]);
  }, []);

  return {
    islandType,
    hasDynamicIsland: hasDI,
    hasOppoAlwaysOn: hasOppo,
    isAvailable: islandType !== 'none',
    activeTasks: tasks,
    createTask,
    updateProgress,
    completeTask,
    removeTask,
    clearTasks,
  };
};

/**
 * Hook to track a specific operation in Dynamic Island
 * Automatically manages lifecycle (create -> progress -> complete -> remove)
 */
export const useIslandTask = (
  title: string,
  type: DynamicIslandTask['type'],
  description?: string
) => {
  const { createTask, updateProgress, completeTask, removeTask } = useDynamicIsland();
  const [taskId, setTaskId] = useState<string | null>(null);

  // Create task on mount
  useEffect(() => {
    const id = createTask(title, type, description);
    setTaskId(id);

    return () => {
      if (id) removeTask(id);
    };
  }, [createTask, removeTask, title, type, description]);

  return {
    taskId,
    updateProgress: (progress: number) => {
      if (taskId) updateProgress(taskId, progress);
    },
    complete: () => {
      if (taskId) completeTask(taskId);
    },
  };
};
