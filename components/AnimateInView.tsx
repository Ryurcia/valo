'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimateInViewProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}

export default function AnimateInView({
  children,
  id,
  className = '',
  delay = 0,
  y = 20,
  duration = 0.5,
  amount = 0.2,
  once = false,
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount, once });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : y,
      }}
      transition={{
        duration,
        delay: isInView ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
