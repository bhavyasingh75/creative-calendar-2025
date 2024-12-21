import React, { useState, useEffect, useMemo } from "react";
import MonthGrid from "./MonthGrid";
import TaskModal from "./TaskModal";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { sampleTasks } from "../utils/sampleTasks";
import type { Task } from "../types/calendar";
import SettingsButton from "./Settings";
import { motion, AnimatePresence } from "framer-motion";
import SettingsModal from "./SettingsModal";
import { ThemeColor, themes } from "../types/theme";
import ThemeProvider from "./ThemeProvider";
import { useGoogleCalendar } from "../hooks/useGoogleCalendar";
import InstallPrompt from "./InstallPrompt";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    "calendar-tasks-2025",
    sampleTasks
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const year = 2025;
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const now = new Date();
    if (now.getFullYear() === 2025) {
      return now.getMonth();
    }
    return 0;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useLocalStorage<ThemeColor>(
    "calendar-theme",
    themes[0]
  );

  const {
    events: googleEvents,
    config: googleCalendarConfig,
    connectCalendar,
    disconnectCalendar,
    fetchEvents,
    setConfig,
    error,
  } = useGoogleCalendar();

  useEffect(() => {
    if (googleCalendarConfig.enabled && googleCalendarConfig.syncEnabled) {
      const startDate = new Date(year, currentMonthIndex, 1);
      const endDate = new Date(year, currentMonthIndex + 1, 0);
      fetchEvents(startDate, endDate);
    }
  }, [
    currentMonthIndex,
    googleCalendarConfig.enabled,
    googleCalendarConfig.syncEnabled,
    fetchEvents,
  ]);

  const handleAddTask = (taskData: Partial<Task>) => {
    const task: Task = {
      id: crypto.randomUUID(),
      content: "",
      completed: false,
      date: "",
      ...taskData,
    };

    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonthIndex((prev) => {
      const newIndex = direction === "next" ? prev + 1 : prev - 1;
      if (newIndex < 0) return 11;
      if (newIndex > 11) return 0;
      return newIndex;
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    if (now.getFullYear() === 2025) {
      return new Date(now).toISOString().split("T")[0];
    }
    return new Date(2025, 0, 1).toISOString().split("T")[0];
  };

  const currentDate = useMemo(() => getCurrentDate(), []);

  return (
    <ThemeProvider theme={currentTheme}>
      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        <h1
          className="text-5xl font-handwritten font-black mb-8 text-center tracking-[-0.1em] uppercase "
          style={{ color: currentTheme.primary }}
        >
          The 2025 Creative Calendar
        </h1>

        <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
          <div className="space-y-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonthIndex}
                initial={{ x: 300, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: -300, opacity: 0, filter: "blur(10px)" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  filter: { duration: 0.4 },
                }}
              >
                <MonthGrid
                  month={MONTHS[currentMonthIndex]}
                  monthIndex={currentMonthIndex}
                  year={year}
                  tasks={tasks}
                  onAddTask={setSelectedDate}
                  onQuickAdd={handleAddTask}
                  currentTheme={currentTheme}
                  onNavigateMonth={navigateMonth}
                  currentDate={currentDate}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <TaskModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          onAdd={handleAddTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          selectedDate={selectedDate}
          existingTasks={tasks.filter((task) => task.date === selectedDate)}
          currentTheme={currentTheme}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          googleCalendarConfig={googleCalendarConfig}
          onGoogleCalendarConnect={connectCalendar}
          onGoogleCalendarDisconnect={disconnectCalendar}
          onGoogleCalendarConfigChange={setConfig}
          error={error}
        />
        <SettingsButton
          onOpenSettings={() => setShowSettings(true)}
          currentTheme={currentTheme}
        />
        <InstallPrompt />
      </div>
    </ThemeProvider>
  );
}
