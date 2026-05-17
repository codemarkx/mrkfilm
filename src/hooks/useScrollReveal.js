// ─── src/hooks/useScrollReveal.js ────────────────────────────────────────────
// Attaches an IntersectionObserver to a ref and returns whether it is visible.
// Once visible it stays visible (one-shot reveal).
//
// Usage:
//   const [ref, visible] = useScrollReveal();
//   <div ref={ref} className={visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}>

import { useEffect, useRef, useState } from 'react';

/**
 * @param {IntersectionObserverInit} options
 * @returns {[React.RefObject, boolean]}
 */
const useScrollReveal = (options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect(); // fire once
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

export default useScrollReveal;
