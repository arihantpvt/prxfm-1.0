import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('prxfm-theme');
    return savedTheme || 'romantic';
  });

  useEffect(() => {
    localStorage.setItem('prxfm-theme', theme);
    document.body.className = theme === 'pookie' ? 'pookie-mode' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'romantic' ? 'pookie' : 'romantic');
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};