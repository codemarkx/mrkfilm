// ─── src/context/ThemeContext.jsx ────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react';

// Must match Profile.jsx mk() bgStyle values exactly
const DARK_BG  = '#000000';
const LIGHT_BG = '#f4f4f4';

const ThemeContext = createContext(null);

const applyBg = (dark) => {
  const bg = dark ? DARK_BG : LIGHT_BG;
  // Cover every ancestor the browser might paint
  document.documentElement.style.backgroundColor = bg;
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', dark);
  document.body.style.backgroundColor = bg;
  document.body.style.margin = '0';
  const root = document.getElementById('root');
  if (root) root.style.backgroundColor = bg;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Default to dark if no preference saved
    return saved ? saved === 'dark' : true;
  });

  // Apply on mount and every toggle
  useEffect(() => {
    applyBg(darkMode);
  }, [darkMode]);

  const toggleDark = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
