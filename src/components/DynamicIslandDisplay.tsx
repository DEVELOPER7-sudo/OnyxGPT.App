import { useEffect, useState } from 'react';
import { useDynamicIsland } from '@/hooks/useDynamicIsland';
import { formatForDynamicIsland, formatForOppoAOD, DynamicIslandTask } from '@/lib/dynamic-island';
import { X } from 'lucide-react';

/**
 * Component to display active tasks in Dynamic Island or Always-On Display
 * Automatically adapts to device capabilities
 */
const DynamicIslandDisplay = () => {
  const { islandType, activeTasks, removeTask } = useDynamicIsland();
  const [displayTasks, setDisplayTasks] = useState<DynamicIslandTask[]>([]);

  useEffect(() => {
    setDisplayTasks(activeTasks.slice(0, 3)); // Show max 3 tasks
  }, [activeTasks]);

  if (islandType === 'none' || displayTasks.length === 0) {
    return null;
  }

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'slideDown 0.3s ease-out',
    };

    if (islandType === 'dynamic-island') {
      return {
        ...baseStyles,
        top: '8px',
        borderRadius: '40px',
        padding: '8px 16px',
        fontSize: '12px',
        maxWidth: '90%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      };
    } else if (islandType === 'oppo-aod') {
      return {
        ...baseStyles,
        top: '16px',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        maxWidth: '85%',
        minHeight: '60px',
      };
    } else {
      // Regular notch
      return {
        ...baseStyles,
        top: '4px',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '11px',
        maxWidth: '95%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      };
    }
  };

  const getProgressBarColor = (task: DynamicIslandTask): string => {
    if (task.progress === undefined) return 'transparent';
    if (task.progress >= 75) return 'rgb(34, 197, 94)'; // Green
    if (task.progress >= 50) return 'rgb(59, 130, 246)'; // Blue
    if (task.progress >= 25) return 'rgb(249, 115, 22)'; // Orange
    return 'rgb(239, 68, 68)'; // Red
  };

  const renderTask = (task: DynamicIslandTask) => {
    const formattedText =
      islandType === 'oppo-aod'
        ? formatForOppoAOD(task)
        : formatForDynamicIsland(task);

    return (
      <div
        key={task.id}
        style={getContainerStyles()}
        className="flex items-center justify-between gap-2 group"
      >
        <div
          style={{
            flex: 1,
            whiteSpace: islandType === 'oppo-aod' ? 'pre-wrap' : 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formattedText}
        </div>

        {/* Progress indicator */}
        {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
          <div
            style={{
              width: islandType === 'dynamic-island' ? '20px' : '30px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginLeft: '8px',
            }}
          >
            <div
              style={{
                width: `${task.progress}%`,
                height: '100%',
                backgroundColor: getProgressBarColor(task),
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}

        {/* Close button (only for Oppo or desktop) */}
        {islandType !== 'dynamic-island' && (
          <button
            onClick={() => removeTask(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .island-active {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {displayTasks.map((task) => renderTask(task))}
    </>
  );
};

export default DynamicIslandDisplay;
