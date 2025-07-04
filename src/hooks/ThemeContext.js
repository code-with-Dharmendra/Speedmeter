import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDarkMode = colorScheme === 'dark';

  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#121212' : '#f5f5f5',
      cardBackground: isDarkMode ? '#1e1e1e' : 'white',
      text: isDarkMode ? 'white' : 'black',
      secondaryText: isDarkMode ? '#aaaaaa' : '#666666',
      border: isDarkMode ? '#333' : '#ccc',
      primary: '#007AFF',
      statusConnected: 'green',
      statusDisconnected: 'red',
      speedometerBackground: isDarkMode ? '#2d2d2d' : '#f0f0f0',
      speedometerText: isDarkMode ? 'white' : '#333',
      sliderMinimumTrack: '#2762f3',
      sliderMaximumTrack: isDarkMode ? '#444' : '#ccc',
      sliderThumb: '#2762f3',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);