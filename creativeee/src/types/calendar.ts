export interface Task {
  id: string;
  content: string;
  date: string;
  completed: boolean;
  category?: 'writing' | 'visual' | 'audio' | 'learning' | 'reflection';
}

export interface CalendarDay {
  date: Date;
  isWeekend: boolean;
  tasks: Task[];
}