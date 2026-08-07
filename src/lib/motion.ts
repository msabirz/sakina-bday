import type { Variants, Transition } from "framer-motion";

export const luxuryEase: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxuryEase } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.4, ease: luxuryEase } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: luxuryEase } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: luxuryEase } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: luxuryEase } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: luxuryEase } },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: luxuryEase } },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: luxuryEase } },
  exit: { opacity: 0, y: -24, filter: "blur(6px)", transition: { duration: 0.45, ease: luxuryEase } },
};
