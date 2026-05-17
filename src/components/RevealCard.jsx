// ─── src/components/RevealCard.jsx ───────────────────────────────────────────
// Drop-in replacement for any card <div> that should animate in on scroll.
// Wraps children with a fade + slide-up effect using IntersectionObserver.
//
// Usage:
//   import RevealCard from '@/components/RevealCard';
//
//   <RevealCard delay={100}>
//     <YourContent />
//   </RevealCard>
//
// Props:
//   delay   – ms delay before the transition starts (stagger siblings)
//   className – extra classes forwarded to the wrapper div

import useScrollReveal from '@/hooks/useScrollReveal';

const RevealCard = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealCard;
