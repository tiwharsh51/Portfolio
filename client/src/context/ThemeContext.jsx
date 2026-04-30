import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-midnight');
  const [previewTheme, setPreviewTheme] = useState(null);
  const [siteMeta, setSiteMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data } = await api.get('/sitemeta');
      if (data.data) {
        setSiteMeta(data.data);
        if (data.data.theme) {
          setTheme(data.data.theme);
        }
      }
    } catch (error) {
      console.error('Failed to load site settings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply theme class to body
    const body = document.body;
    const activeTheme = previewTheme || theme;
    
    const themes = [
      'theme-midnight', 'theme-minimal', 'theme-sunset', 'theme-glass', 'theme-royal',
      'theme-ocean', 'theme-frost', 'theme-mono', 'theme-pastel', 'theme-neon',
      'theme-earthy', 'theme-steel', 'theme-candy', 'theme-indigo', 'theme-green'
    ];
    
    themes.forEach(t => body.classList.remove(t));
    body.classList.add(activeTheme);
    
    // For Light themes, set color scheme
    const lightThemes = ['theme-minimal', 'theme-frost', 'theme-pastel'];
    if (lightThemes.includes(activeTheme)) {
      body.style.colorScheme = 'light';
    } else {
      body.style.colorScheme = 'dark';
    }
  }, [theme, previewTheme]);

  const updateTheme = async (newTheme) => {
    try {
      setTheme(newTheme);
      setPreviewTheme(null); // Clear preview when saving
      await api.put('/sitemeta', { theme: newTheme });
    } catch (error) {
      console.error('Failed to update theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      previewTheme,
      isPreviewing: !!previewTheme,
      setTheme: updateTheme, 
      setPreviewTheme,
      cancelPreview: () => setPreviewTheme(null),
      siteMeta, 
      refreshSettings: fetchSiteSettings, 
      loading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
