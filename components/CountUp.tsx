'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface CountUpProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
  amount?: 'some' | 'all' | number;
}

export default function CountUp({
  from,
  to,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  onComplete,
  amount = 'some',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) {
      setValue(from);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration at the end
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(to);
        onComplete?.();
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration, onComplete]);

  const displayValue =
    decimals > 0
      ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(value).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
