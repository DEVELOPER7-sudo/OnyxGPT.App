// Dynamic Island and Oppo Always-On Display Support
// Shows active tasks and notifications in notch/island areas

interface DynamicIslandTask {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: 'chat' | 'image' | 'generation' | 'search' | 'upload';
  progress?: number;
  timestamp: number;
}

interface IslandConfig {
  enabled: boolean;
  showProgress: boolean;
  showDescription: boolean;
  maxTasks: number;
  refreshInterval: number;
}

const DEFAULT_CONFIG: IslandConfig = {
  enabled: true,
  showProgress: true,
  showDescription: true,
  maxTasks: 3,
  refreshInterval: 500, // ms
};

/**
 * Check if device has Dynamic Island
 * Apple: iPhone 14 Pro and later
 */
export const hasDynamicIsland = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for notch/island via CSS environment variables
  const hasNotch = CSS.supports('padding-top', 'env(safe-area-inset-top)');
  
  // Check if it's an Apple device with Dynamic Island support
  const userAgent = navigator.userAgent.toLowerCase();
  const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
  const isDynamicIslandDevice = /iphone 1[4-9]|iphone [2-9][0-9]/.test(userAgent);

  return isAppleDevice && isDynamicIslandDevice && hasNotch;
};

/**
 * Check if device has Oppo Always-On Display
 * Oppo devices with Color OS 12.0+
 */
export const hasOppoAlwaysOn = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isOppoDevice = /oppo|coloros/.test(userAgent);
  
  // Check if device supports Always-On Display
  const supportsAlwaysOn = 'wakeLock' in navigator || 'WakeLock' in window;

  return isOppoDevice && supportsAlwaysOn;
};

/**
 * Detect which island/always-on display is available
 */
export const detectIslandType = (): 'dynamic-island' | 'oppo-aod' | 'notch' | 'none' => {
  if (hasDynamicIsland()) return 'dynamic-island';
  if (hasOppoAlwaysOn()) return 'oppo-aod';
  
  // Fallback to notch detection
  const userAgent = navigator.userAgent.toLowerCase();
  const hasNotch = /notch|iphone|oppo|xiaomi|huawei/.test(userAgent);
  
  return hasNotch ? 'notch' : 'none';
};

/**
 * Create task for Dynamic Island/Always-On display
 */
export const createIslandTask = (
  title: string,
  type: DynamicIslandTask['type'],
  description?: string,
  icon?: string,
  progress?: number
): DynamicIslandTask => {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    icon: icon || getIconForType(type),
    type,
    progress: progress || 0,
    timestamp: Date.now(),
  };
};

/**
 * Get icon emoji for task type
 */
const getIconForType = (type: DynamicIslandTask['type']): string => {
  const icons: Record<DynamicIslandTask['type'], string> = {
    chat: '💬',
    image: '🖼️',
    generation: '✨',
    search: '🔍',
    upload: '📤',
  };
  return icons[type];
};

/**
 * Format task for Dynamic Island display
 * Dynamic Island has limited space, so we compress the text
 */
export const formatForDynamicIsland = (task: DynamicIslandTask): string => {
  const parts: string[] = [task.icon];
  
  // Add title (max 20 chars)
  if (task.title.length > 20) {
    parts.push(task.title.substring(0, 17) + '...');
  } else {
    parts.push(task.title);
  }

  // Add progress if available
  if (task.progress !== undefined && task.progress > 0) {
    const progressBar = Math.round(task.progress / 10);
    parts.push(`${progressBar}%`);
  }

  return parts.join(' ');
};

/**
 * Format task for Oppo Always-On Display
 * Oppo AOD has more space than Dynamic Island
 */
export const formatForOppoAOD = (task: DynamicIslandTask): string => {
  const parts: string[] = [task.icon];

  // Add full title
  parts.push(task.title);

  // Add description if available
  if (task.description && task.description.length > 0) {
    const desc = task.description.length > 30 
      ? task.description.substring(0, 27) + '...'
      : task.description;
    parts.push(`(${desc})`);
  }

  // Add progress
  if (task.progress !== undefined && task.progress > 0) {
    parts.push(`${Math.round(task.progress)}%`);
  }

  return parts.join('\n');
};

/**
 * Format task for regular notch display
 */
export const formatForNotch = (task: DynamicIslandTask): string => {
  const parts: string[] = [task.icon];
  
  // Add shortened title
  if (task.title.length > 15) {
    parts.push(task.title.substring(0, 12) + '...');
  } else {
    parts.push(task.title);
  }

  return parts.join(' ');
};

/**
 * Format multiple tasks for island display
 * Shows up to maxTasks at once
 */
export const formatIslandTasks = (
  tasks: DynamicIslandTask[],
  islandType: ReturnType<typeof detectIslandType> = 'dynamic-island',
  config: Partial<IslandConfig> = {}
): string[] => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Limit tasks
  const displayTasks = tasks.slice(0, finalConfig.maxTasks);

  return displayTasks.map(task => {
    switch (islandType) {
      case 'dynamic-island':
        return formatForDynamicIsland(task);
      case 'oppo-aod':
        return formatForOppoAOD(task);
      case 'notch':
        return formatForNotch(task);
      default:
        return formatForNotch(task);
    }
  });
};

/**
 * HTML notification for browsers that support it
 * Shows in system notification if available
 */
export const showIslandNotification = async (
  task: DynamicIslandTask,
  islandType: ReturnType<typeof detectIslandType>
): Promise<void> => {
  if (typeof window === 'undefined') return;

  const formattedText = islandType === 'oppo-aod' 
    ? formatForOppoAOD(task)
    : formatForDynamicIsland(task);

  // Try to show in system notification (works on some devices)
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(task.title, {
        body: task.description || '',
        icon: '/onyx-logo.png',
        badge: '/onyx-logo.png',
        tag: `island-${task.id}`,
      });
    } catch (error) {
      console.error('Failed to show island notification:', error);
    }
  }

  // Log to console for debugging
  console.log(`[${islandType.toUpperCase()}] ${formattedText}`);
};

/**
 * Update task progress
 */
export const updateTaskProgress = (
  task: DynamicIslandTask,
  progress: number
): DynamicIslandTask => {
  return {
    ...task,
    progress: Math.min(progress, 100),
  };
};

/**
 * Check if task is complete
 */
export const isTaskComplete = (task: DynamicIslandTask): boolean => {
  return task.progress === 100;
};

/**
 * Get CSS for Dynamic Island safe area
 * Used for adapting layout to island
 */
export const getDynamicIslandCSS = (): string => {
  return `
    padding-top: max(12px, env(safe-area-inset-top));
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  `;
};

/**
 * Get viewport height adjusted for island
 * Helps with layout calculations
 */
export const getIslandAdjustedViewport = (): number => {
  if (typeof window === 'undefined') return window?.innerHeight || 0;

  // Get safe area inset from CSS
  const safeAreaTop = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'
  );

  return window.innerHeight - safeAreaTop;
};

/**
 * Simulate island display (for testing/demo)
 * Shows formatted task in console and as visual indicator
 */
export const simulateIslandDisplay = (
  task: DynamicIslandTask,
  islandType: 'dynamic-island' | 'oppo-aod' | 'notch' = 'dynamic-island'
): HTMLElement | null => {
  if (typeof document === 'undefined') return null;

  const container = document.createElement('div');
  container.id = `island-sim-${task.id}`;
  container.style.cssText = `
    position: fixed;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: ${islandType === 'oppo-aod' ? '12px 16px' : '8px 12px'};
    border-radius: ${islandType === 'dynamic-island' ? '40px' : '8px'};
    font-size: ${islandType === 'oppo-aod' ? '14px' : '11px'};
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 90vw;
  `;

  const formattedText = islandType === 'oppo-aod'
    ? formatForOppoAOD(task)
    : formatForDynamicIsland(task);

  container.textContent = formattedText;

  return container;
};

/**
 * Storage for active island tasks
 */
let activeTasks: Map<string, DynamicIslandTask> = new Map();

/**
 * Add task to active display
 */
export const addIslandTask = (task: DynamicIslandTask): void => {
  activeTasks.set(task.id, task);
};

/**
 * Update existing task
 */
export const updateIslandTask = (taskId: string, progress: number): void => {
  const task = activeTasks.get(taskId);
  if (task) {
    activeTasks.set(taskId, updateTaskProgress(task, progress));
  }
};

/**
 * Remove task from active display
 */
export const removeIslandTask = (taskId: string): void => {
  activeTasks.delete(taskId);
};

/**
 * Get all active tasks
 */
export const getActiveTasks = (): DynamicIslandTask[] => {
  return Array.from(activeTasks.values());
};

/**
 * Clear all tasks
 */
export const clearIslandTasks = (): void => {
  activeTasks.clear();
};

/**
 * Get task by ID
 */
export const getIslandTask = (taskId: string): DynamicIslandTask | undefined => {
  return activeTasks.get(taskId);
};
