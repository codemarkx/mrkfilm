// ─── src/components/StatsBar.jsx ─────────────────────────────────────────────
// Animated counter stats bar shown between the hero and the main content.
// Numbers count up when the bar scrolls into view.
//
// Usage:
//   import StatsBar from '@/components/StatsBar';
//   <StatsBar darkMode={darkMode} />   ← or use useTheme() inside

import { useEffect, useRef, useState } from 'react';
import useScrollReveal from '@/hooks/useScrollReveal';

// ── Single animated counter ───────────────────────────────────────────────────
const AnimatedStat = ({ value, suffix = '+', label, darkMode, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal();
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      const duration = 1200; // ms
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), value);
        setCount(current);
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timeout);
  }, [visible, value, delay]);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={`text-3xl sm:text-4xl font-black tabular-nums tracking-tight ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {count}{suffix}
      </span>
      <span
        className={`text-[11px] sm:text-xs font-medium uppercase tracking-widest mt-1 ${
          darkMode ? 'text-[#5a6278]' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

// ── Stats bar ─────────────────────────────────────────────────────────────────
const StatsBar = ({ darkMode }) => {
  const stats = [
    { value: 9,  suffix: '+', label: 'Videos Delivered' },
    { value: 3,  suffix: '+', label: 'Years Experience'  },
    { value: 5,  suffix: '+', label: 'Clients Served'    },
    { value: 2,  suffix: '',  label: 'Leadership Roles'  },
  ];

  return (
    <div
      className={`rounded-2xl px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-colors duration-300 ${
        darkMode
          ? 'bg-[#111118] border border-[#1e1e2e] shadow-[0_2px_24px_rgba(0,0,0,0.6)]'
          : 'bg-white border border-gray-200 shadow-lg'
      }`}
    >
      {stats.map((s, i) => (
        <AnimatedStat key={i} {...s} darkMode={darkMode} delay={i * 120} />
      ))}
    </div>
  );
};

export default StatsBar;
