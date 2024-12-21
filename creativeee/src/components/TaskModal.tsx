import React, { useState, useEffect } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../types/calendar';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Partial<Task>) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  selectedDate: string | null;
  existingTasks: Task[];
}

const CATEGORIES = [
  { value: 'writing', label: '✍️ Writing' },
  { value: 'visual', label: '🎨 Visual' },
  { value: 'audio', label: '🎵 Audio' },
  { value: 'learning', label: '📚 Learning' },
  { value: 'reflection', label: '🤔 Reflection' },
] as const;

export default function TaskModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  selectedDate,
  existingTasks,
}: TaskModalProps) {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Task['category']>('writing');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setNewTask('');
      setEditingTask(null);
    }
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  // Ensuring the selected date is treated as a local date
  const localDate = new Date(selectedDate);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); // Adjust to local time

  const formattedDate = localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    onAdd({
      content: newTask,
      category: selectedCategory,
      date: selectedDate,
      completed: false,
    });
    
    setNewTask('');
  };

 
  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full">
        <h3 className="text-2xl font-handwritten font-bold text-orange-600 mb-2">Creative Tasks</h3>
        <p className="text-gray-600 mb-6 font-handwritten text-lg">{formattedDate}</p>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 p-2 border rounded font-handwritten text-lg"
              placeholder="Add a new creative task..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Task['category'])}
              className="p-2 border rounded bg-white font-handwritten text-lg"
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-handwritten font-semibold text-lg"
            >
              Add
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {existingTasks.map(task => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border font-handwritten text-lg ${
                  task.completed ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => onUpdate(task.id, { completed: !task.completed })}
                    className={`p-1 rounded ${
                      task.completed ? 'text-green-600' : 'text-gray-400'
                    } hover:text-green-700`}
                  >
                    <Check size={18} />
                  </button>
                  <div className="flex-1">
                    <p className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.content}
                    </p>
                    <span className="text-sm text-gray-500">
                      {CATEGORIES.find(c => c.value === task.category)?.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700 font-handwritten font-semibold text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}