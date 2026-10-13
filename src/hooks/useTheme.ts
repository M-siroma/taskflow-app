import { useContext } from 'react';
import { ThemeContext, ThemeContextData } from '../context/ThemeContext';

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider.');
  }
  return context;
}
