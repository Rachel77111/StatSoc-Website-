import { useRef } from 'react';
import { motion } from 'motion/react';

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface ScatterDotsProps {
  count?: number;
  className?: string;
  color?: string;
}

export default function ScatterDots({ count = 24, className = '', color = 'hsl(var(--primary))' }: ScatterDotsProps) {
  const dotsRef = useRef<Dot[]>([]);

  if (dotsRef.current.length === 0) {
    dotsRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 4,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {dotsRef.current.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: color,
            opacity: dot.opacity,
          }}
          animate={{
            y: [0, -18, 0, 12, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [dot.opacity, dot.opacity * 1.5, dot.opacity, dot.opacity * 0.7, dot.opacity],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
