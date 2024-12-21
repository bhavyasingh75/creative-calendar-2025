import React from 'react';
import { PlusCircle } from 'lucide-react';
import { isWeekend } from '../utils/calendarHelpers';
import type { Task } from '../types/calendar';

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  onAddTask: (date: string) => void;
  dateStr: string;
}

export default function CalendarDay({
  date,
  tasks,
  onAddTask,
  dateStr,
}: CalendarDayProps) {
  const hasCompletedTasks = tasks.some(task => task.completed);
  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
  const isWeekendDay = isWeekend(date);

  const getClassName = () => {
    const baseClass = 'calendar-cell';
    if (allTasksCompleted) return `${baseClass} completed`;
    if (hasCompletedTasks) return `${baseClass} partially-completed`;
    if (isWeekendDay) return `${baseClass} weekend`;
    return baseClass;
  };

  return (
    <div
      className={getClassName()}
      onClick={() => onAddTask(dateStr)}
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-handwritten font-semibold">
          {date.getDate()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(dateStr);
          }}
          className="text-orange-600 hover:text-orange-700"
        >
          <PlusCircle size={16} />
        </button>
      </div>
      
      <div className="mt-1 space-y-1">
        {tasks.slice(0, 2).map(task => (
          <div
            key={task.id}
            className={`text-xs p-1 rounded flex items-center gap-1 font-handwritten font-semibold
              ${task.completed ? 'bg-green-100 line-through' : 'bg-orange-100'}
            `}
          >
            <span className="truncate">{task.content}</span>
          </div>
        ))}
        {tasks.length > 2 && (
          <div className="text-xs text-gray-500 font-handwritten font-semibold">
            +{tasks.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
}