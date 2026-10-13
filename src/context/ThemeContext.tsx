import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { getThemeMode, saveThemeMode } from '../services/themeStorage';
import { ThemeColors, ThemeMode } from '../types/theme';

// Todas as cores da aplicação ficam centralizadas aqui.
const lightColors: ThemeColors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F8',
  border: '#D9DEEA',
  text: '#1B2033',
  textMuted: '#5B6278',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  danger: '#C62828',
  dangerText: '#FFFFFF',
  success: '#2E7D32',
  inputBackground: '#FFFFFF',
  placeholder: '#8A90A6',
  overlay: 'rgba(79, 70, 229, 0.10)',
  shadow: '#1B2033',
  status: {
    pendente: '#B45309',
    em_andamento: '#1D4ED8',
    concluida: '#15803D',
  },
  priority: {
    baixa: '#0F766E',
    media: '#A16207',
    alta: '#B91C1C',
  },
};

const darkColors: ThemeColors = {
  background: '#0F121C',
  surface: '#1A1F2E',
  surfaceAlt: '#232A3D',
  border: '#2F374D',
  text: '#ECEFF7',
  textMuted: '#A5ACC2',
  primary: '#8B85FF',
  primaryText: '#0F121C',
  danger: '#EF5350',
  dangerText: '#0F121C',
  success: '#66BB6A',
  inputBackground: '#151A27',
  placeholder: '#6E7690',
  overlay: 'rgba(139, 133, 255, 0.16)',
  shadow: '#000000',
  status: {
    pendente: '#FBBF24',
    em_andamento: '#60A5FA',
    concluida: '#4ADE80',
  },
  priority: {
    baixa: '#2DD4BF',
    media: '#FACC15',
    alta: '#F87171',
  },
};

export interface ThemeContextData {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextData | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTheme(): Promise<void> {
      try {
        const stored = await getThemeMode();
        if (stored) {
          setMode(stored);
        }
      } catch (error) {
        console.warn('Não foi possível carregar o tema salvo.', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async (): Promise<void> => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try {
      await saveThemeMode(next);
    } catch {
      throw new Error('O tema foi alterado, mas não pôde ser salvo no dispositivo.');
    }
  }, [mode]);

  const value = useMemo<ThemeContextData>(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      isLoading,
      toggleTheme,
    }),
    [mode, isLoading, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
