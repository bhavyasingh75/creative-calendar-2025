import React, { useState, useEffect } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../types/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeColor } from "../types/theme";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Partial<Task>) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  selectedDate: string | null;
  existingTasks: Task[];
  currentTheme: ThemeColor;
}

const CATEGORIES = [
  { value: "writing", label: "✍️ Writing" },
  { value: "visual", label: "🎨 Visual" },
  { value: "audio", label: "🎵 Audio" },
  { value: "learning", label: "📚 Learning" },
  { value: "reflection", label: "🤔 Reflection" },
] as const;

const CHECKBOX_STYLES = {
  unchecked: {
    border: "2px solid",
    backgroundColor: "transparent",
    opacity: 0.3,
  },
  checked: {
    border: "none",
    opacity: 1,
  },
};

export default function TaskModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  selectedDate,
  existingTasks,
  currentTheme,
}: TaskModalProps) {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Task["category"]>("writing");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<Task["category"]>("writing");

  useEffect(() => {
    if (!isOpen) {
      setNewTask("");
      setEditingTask(null);
      setEditContent("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingTask) {
      setEditContent(editingTask.content);
      setEditCategory(editingTask.category || "writing");
    }
  }, [editingTask]);

  const handleSaveEdit = () => {
    if (editingTask && editContent.trim()) {
      onUpdate(editingTask.id, {
        content: editContent,
        category: editCategory,
      });
      setEditingTask(null);
      setEditContent("");
    }
  };

  if (!isOpen || !selectedDate) return null;

  // Parse the date without timezone conversion
  const [year, month, day] = selectedDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day+1);

  const formattedDate = localDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    onAdd({
      content: newTask,
      category: selectedCategory,
      date: selectedDate,
      completed: false,
    });

    setNewTask("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg p-4 md:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl md:text-2xl font-handwritten font-bold mb-2"
              style={{ color: currentTheme.primary }}
            >
              Creative Tasks
            </h3>
            <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 font-handwritten">
              {formattedDate}
            </p>

            <div className="mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 p-2 border rounded font-handwritten text-base md:text-lg"
                  placeholder="Add a new creative task..."
                />
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value as Task["category"])
                    }
                    className="p-2 border rounded bg-white font-handwritten text-base md:text-lg"
                  >
                    {CATEGORIES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 text-white rounded hover:opacity-90 font-handwritten font-semibold text-base md:text-lg whitespace-nowrap"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {existingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border font-handwritten text-lg"
                    style={{
                      backgroundColor: task.completed
                        ? `${currentTheme.secondary}40`
                        : "white",
                      borderColor: currentTheme.secondary,
                    }}
                  >
                    {editingTask?.id === task.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border rounded font-handwritten text-lg"
                          autoFocus
                        />
                        <div className="flex justify-between items-center">
                          <select
                            value={editCategory}
                            onChange={(e) =>
                              setEditCategory(
                                e.target.value as Task["category"]
                              )
                            }
                            className="p-2 border rounded bg-white font-handwritten"
                          >
                            {CATEGORIES.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingTask(null)}
                              className="px-3 py-1 font-handwritten hover:opacity-80"
                              style={{ color: currentTheme.primary }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 text-white rounded hover:opacity-90 font-handwritten"
                              style={{ backgroundColor: currentTheme.primary }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() =>
                            onUpdate(task.id, { completed: !task.completed })
                          }
                          className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                          style={{
                            ...CHECKBOX_STYLES[
                              task.completed ? "checked" : "unchecked"
                            ],
                            borderColor: currentTheme.primary,
                            backgroundColor: task.completed
                              ? currentTheme.primary
                              : "transparent",
                          }}
                        >
                          <Check
                            size={14}
                            className="transition-opacity"
                            style={{
                              color: task.completed ? "white" : "transparent",
                            }}
                          />
                        </button>
                        <div className="flex-1">
                          <p
                            style={{
                              color: task.completed ? "gray" : "inherit",
                              textDecoration: task.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {task.content}
                          </p>
                          <span
                            className="text-sm"
                            style={{ color: currentTheme.primary }}
                          >
                            {
                              CATEGORIES.find((c) => c.value === task.category)
                                ?.label
                            }
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1 transition-colors"
                            style={{
                              color: currentTheme.primary,
                              opacity: 0.6,
                            }}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(task.id)}
                            className="p-1 transition-colors hover:text-red-600"
                            style={{
                              color: currentTheme.primary,
                              opacity: 0.6,
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 font-handwritten font-semibold text-lg hover:opacity-80"
                style={{ color: currentTheme.primary }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
