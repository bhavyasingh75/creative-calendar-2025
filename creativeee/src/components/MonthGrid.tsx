import React from 'react';
import CalendarDay from './CalendarDay';
import { getMonthDays, formatDate } from '../utils/calendarHelpers';
import type { Task } from '../types/calendar';

interface MonthGridProps {
  month: string;
  monthIndex: number;
  year: number;
  tasks: Task[];
  onAddTask: (date: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MonthGrid({
  month,
  monthIndex,
  year,
  tasks,
  onAddTask,
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
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-handwritten font-bold text-orange-600 mb-4">{month}</h2>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-sm font-handwritten font-semibold text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>
        
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((date, dayIndex) => {
              if (date.getTime() === 0) {
                return <div key={`empty-${dayIndex}`} className="h-24" />;
              }
              
              const dateStr = formatDate(date);
              const dayTasks = tasks.filter(task => task.date === dateStr);
              
              return (
                <CalendarDay
                  key={dateStr}
                  date={date}
                  tasks={dayTasks}
                  onAddTask={onAddTask}
                  dateStr={dateStr}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}