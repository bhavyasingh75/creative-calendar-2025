import React, { useState } from 'react';
import MonthGrid from './MonthGrid';
import TaskModal from './TaskModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sampleTasks } from '../utils/sampleTasks';
import type { Task } from '../types/calendar';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('calendar-tasks-2025', sampleTasks);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const year = 2025;

  const handleAddTask = (taskData: Partial<Task>) => {
    const task: Task = {
      id: crypto.randomUUID(),
      content: '',
      completed: false,
      date: '',
      ...taskData,
    };
    
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-handwritten font-black text-orange-600 mb-8 text-center tracking-[-0.1em] uppercase">
        The 2025 Creative Calendar
      </h1>
      
      <div className="space-y-6">
        {MONTHS.map((month, monthIndex) => (
          <MonthGrid
            key={month}
            month={month}
            monthIndex={monthIndex}
            year={year}
            tasks={tasks}
            onAddTask={setSelectedDate}
          />
        ))}
      </div>

      <TaskModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        onAdd={handleAddTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        selectedDate={selectedDate}
        existingTasks={tasks.filter(task => task.date === selectedDate)}
      />
    </div>
  );
}