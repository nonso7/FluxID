"use client";

import { useEffect, useState, CSSProperties } from "react";
import { motion, useSpring } from "framer-motion";

interface AnimatedScoreProps {
  value: number;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedScore({ value, className = "", style }: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 15 });

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplayValue(Math.round(v));
    });
    spring.set(value);
    return unsubscribe;
  }, [value, spring]);

  return (
    <motion.span className={className} style={style}>
      {displayValue}
    </motion.span>
  );
}
