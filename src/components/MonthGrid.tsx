import React from "react";
import CalendarDay from "./CalendarDay";
import { getMonthDays, formatDate } from "../utils/calendarHelpers";
import type { Task } from "../types/calendar";
import { ThemeColor } from "../types/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthGridProps {
  month: string;
  monthIndex: number;
  year: number;
  tasks: Task[];
  onAddTask: (date: string) => void;
  currentTheme: ThemeColor;
  onQuickAdd: (task: Partial<Task>) => void;
  onNavigateMonth: (direction: "prev" | "next") => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthGrid({
  month,
  monthIndex,
  year,
  tasks,
  onAddTask,
  currentTheme,
  onQuickAdd,
  onNavigateMonth,
}: MonthGridProps) {
  const days = getMonthDays(year, monthIndex);

  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((date) => {
    if (currentWeek.length === 0 && date.getDay() !== 1) {
      // Fill in empty days at the start of the month
      const emptyCells = date.getDay() === 0 ? 6 : date.getDay() - 1;
      for (let i = 0; i < emptyCells; i++) {
        currentWeek.push(new Date(0)); // placeholder for empty cells
      }
    }

    currentWeek.push(date);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add the last week if it's not complete
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(0));
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onNavigateMonth("prev")}
          className="p-1 md:p-2 rounded-full hover:bg-opacity-10 transition-colors"
          style={{
            color: currentTheme.primary,
            backgroundColor: `${currentTheme.primary}10`,
          }}
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <h2
          className="text-xl md:text-2xl font-handwritten font-bold"
          style={{ color: currentTheme.primary }}
        >
          {month}
        </h2>
        <button
          onClick={() => onNavigateMonth("next")}
          className="p-1 md:p-2 rounded-full hover:bg-opacity-10 transition-colors"
          style={{
            color: currentTheme.primary,
            backgroundColor: `${currentTheme.primary}10`,
          }}
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-1 md:gap-2">
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-xs md:text-sm font-handwritten font-semibold text-gray-500 text-center"
            >
              {window.innerWidth < 640 ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 md:gap-2">
            {week.map((date, dayIndex) => {
              if (date.getTime() === 0) {
                return <div key={`empty-${dayIndex}`} className="h-24" />;
              }

              const dateStr = formatDate(date);
              const dayTasks = tasks.filter((task) => task.date === dateStr);

              return (
                <CalendarDay
                  key={dateStr}
                  date={date}
                  tasks={dayTasks}
                  onAddTask={onAddTask}
                  dateStr={dateStr}
                  onQuickAdd={onQuickAdd}
                  currentTheme={currentTheme}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
