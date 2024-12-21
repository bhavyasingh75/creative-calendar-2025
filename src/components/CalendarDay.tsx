import React, { useState, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { isWeekend } from "../utils/calendarHelpers";
import type { Task } from "../types/calendar";
import QuickAdd from "./QuickAdd";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeColor } from "../types/theme";

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  onAddTask: (date: string) => void;
  dateStr: string;
  onQuickAdd: (task: Partial<Task>) => void;
  currentTheme: ThemeColor;
}

export default function CalendarDay({
  date,
  tasks,
  onAddTask,
  dateStr,
  onQuickAdd,
  currentTheme,
}: CalendarDayProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasCompletedTasks = tasks.some((task) => task.completed);
  const allTasksCompleted =
    tasks.length > 0 && tasks.every((task) => task.completed);
  const isWeekendDay = isWeekend(date);

  const getClassName = () => {
    const baseClass = "calendar-cell";
    if (allTasksCompleted) return `${baseClass} completed`;
    if (hasCompletedTasks) return `${baseClass} partially-completed`;
    if (isWeekendDay) return `${baseClass} weekend`;
    return baseClass;
  };

  return (
    <div className={getClassName()} onClick={() => onAddTask(dateStr)}>
      <div className="flex justify-between items-start">
        <span className="text-xs md:text-sm font-handwritten font-semibold">
          {date.getDate()}
        </span>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickAdd(true);
            }}
            className="rounded-full hover:bg-opacity-10 transition-colors scale-75 md:scale-100"
            style={{
              color: currentTheme.primary,
              backgroundColor: `${currentTheme.primary}10`,
            }}
          >
            <PlusCircle size={16} />
          </button>
          {showQuickAdd && (
            <div
              ref={quickAddRef}
              className="absolute z-50 right-0 top-6"
              onClick={(e) => e.stopPropagation()}
            >
              <QuickAdd
                date={dateStr}
                onAdd={onQuickAdd}
                onClose={() => setShowQuickAdd(false)}
                currentTheme={currentTheme}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-1 space-y-1">
        <AnimatePresence>
          {tasks.slice(0, isMobile ? 1 : 2).map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-xs p-1 rounded flex items-center gap-1 font-handwritten font-semibold`}
              style={{
                backgroundColor: task.completed
                  ? `${currentTheme.secondary}80` // 80 is for opacity
                  : `${currentTheme.secondary}40`,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "inherit",
              }}
            >
              <span className="truncate">
                {task.category && (
                  <span className="mr-1">
                    {task.category === "writing" && "✍️"}
                    {task.category === "visual" && "🎨"}
                    {task.category === "audio" && "🎵"}
                    {task.category === "learning" && "📚"}
                    {task.category === "reflection" && "🤔"}
                  </span>
                )}
                {task.content}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length > (isMobile ? 1 : 2) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] md:text-xs font-handwritten font-semibold"
            style={{ color: currentTheme.primary }}
          >
            +{tasks.length - (isMobile ? 1 : 2)} more
          </motion.div>
        )}
      </div>
    </div>
  );
}
