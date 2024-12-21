import type { Task } from '../types/calendar';

const currentYear = new Date().getFullYear();

export const sampleTasks: Task[] = [
  {
    id: '1',
    content: 'Write a short story inspired by your morning routine',
    date: `${currentYear}-01-06`,
    completed: false,
    category: 'writing'
  },
  {
    id: '2',
    content: 'Create a mood board for your next project',
    date: `${currentYear}-01-07`,
    completed: false,
    category: 'visual'
  },
  {
    id: '3',
    content: 'Record a 1-minute creative sound story',
    date: `${currentYear}-01-13`,
    completed: false,
    category: 'audio'
  },
  {
    id: '4',
    content: 'Learn a new design principle',
    date: `${currentYear}-01-14`,
    completed: false,
    category: 'learning'
  },
  // Add more sample tasks throughout the year...
];