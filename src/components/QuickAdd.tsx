import React, { useState, useEffect, useRef } from "react";
import type { Task } from "../types/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeColor } from "../types/theme";
import { X } from "lucide-react";

interface QuickAddProps {
  date: string;
  onAdd: (task: Partial<Task>) => void;
  onClose: () => void;
  currentTheme: ThemeColor;
  isPrivacyMode?: boolean;
}

const CATEGORIES = [
  { value: "writing", label: "✍️" },
  { value: "visual", label: "🎨" },
  { value: "audio", label: "🎵" },
  { value: "learning", label: "📚" },
  { value: "reflection", label: "🤔" },
] as const;

export default function QuickAdd({
  date,
  onAdd,
  onClose,
  currentTheme,
  isPrivacyMode,
}: QuickAddProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Task["category"]>("writing");
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickAddRef.current &&
        !quickAddRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      content,
      date,
      completed: false,
      category,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={quickAddRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`bg-white rounded-lg shadow-lg p-3 ${
          isPrivacyMode ? 'blur-sm hover:blur-none transition-all duration-200' : ''
        }`}
      >
        <div className="flex justify-between items-center mb-2 md:mb-3">
          <span className="text-xs md:text-sm font-handwritten font-semibold">
            Quick Add Task
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 scale-75 md:scale-100"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded font-handwritten text-base md:text-lg"
            placeholder="Quick add task..."
            autoFocus
          />
          <div className="space-y-2 md:space-y-3">
            <div className="flex gap-1 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-2 rounded transition-colors ${
                    category === cat.value
                      ? "bg-opacity-20"
                      : "hover:bg-opacity-10"
                  }`}
                  style={{
                    backgroundColor:
                      category === cat.value
                        ? currentTheme.primary
                        : "transparent",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-3 py-1 text-white rounded hover:opacity-90 font-handwritten w-full"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
