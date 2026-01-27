"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(1); 
  const prevPathname = useRef(pathname);

  useEffect(() => {

    if (pathname.length < prevPathname.current.length) {
      setDirection(-1);
    } else {
      setDirection(1);
    }
    prevPathname.current = pathname;
  }, [pathname]);

  const variants = {
    initial: (dir) => ({
      x: dir > 0 ? "30%" : "-30%", 
      opacity: 0,
    }),
    enter: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? "-10%" : "10%", 
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="popLayout" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{
          duration: 0.2, 
          ease: [0.33, 1, 0.68, 1],
        }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}