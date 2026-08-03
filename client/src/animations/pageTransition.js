export const pageTransition = {
  hidden: {
    opacity: 0,
    x: 25,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    x: -25,
    transition: {
      duration: 0.3,
    },
  },
};