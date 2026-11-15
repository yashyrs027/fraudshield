import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fraudshield_theme') || 'dark';
  });

  const [seniorMode, setSeniorMode] = useState(() => {
    return localStorage.getItem('fraudshield_senior_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('fraudshield_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fraudshield_senior_mode', seniorMode);
    document.documentElement.setAttribute('data-senior', seniorMode);
  }, [seniorMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSeniorMode = () => {
    setSeniorMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        seniorMode,
        setSeniorMode,
        toggleSeniorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
