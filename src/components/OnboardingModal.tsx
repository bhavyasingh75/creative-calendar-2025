import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeColor } from "../types/theme";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColor;
}

const SLIDES = [
  {
    image: "1.png",
    title: "Welcome to Creative Calendar",
    description: "Your personal space for creative planning",
  },
  {
    image: "2.png",
    title: "Track Your Tasks",
    description: "Organize your creative work with ease",
  },
  {
    image: "3.png",
    title: "Privacy Mode",
    description: "Keep your tasks private when needed",
  },
  {
    image: "4.png",
    title: "Get Started",
    description: "Begin your creative journey",
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  currentTheme,
}: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide === SLIDES.length - 1) {
      onClose();
    } else {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => prev - 1);
  };

  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
        >
          <div className="relative">
            <div className="relative h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={currentSlide}
                  src={SLIDES[currentSlide].image}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full h-full object-cover"
                  alt={SLIDES[currentSlide].title}
                />
              </AnimatePresence>
            </div>

            <div className="p-6 text-center">
              <motion.h2
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-handwritten font-bold mb-2"
                style={{ color: currentTheme.primary }}
              >
                {SLIDES[currentSlide].title}
              </motion.h2>
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-600 mb-6 font-handwritten"
              >
                {SLIDES[currentSlide].description}
              </motion.p>

              <div className="flex justify-between items-center">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={`p-2 rounded-full transition-colors ${
                    currentSlide === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    color: currentTheme.primary,
                    backgroundColor: `${currentTheme.primary}10`,
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {SLIDES.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          index === currentSlide
                            ? currentTheme.primary
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>

                {isLastSlide ? (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full text-white transition-colors font-handwritten"
                    style={{
                      backgroundColor: currentTheme.primary,
                    }}
                  >
                    Get Started
                  </button>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full transition-colors"
                    style={{
                      color: currentTheme.primary,
                      backgroundColor: `${currentTheme.primary}10`,
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
