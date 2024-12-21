import { Variants } from "framer-motion";

export const useAnimation = () => {
  const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const slideIn: Variants = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  const popIn: Variants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.9, opacity: 0, y: 20 },
  };

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return {
    fadeIn,
    slideIn,
    popIn,
    springTransition,
  };
};
