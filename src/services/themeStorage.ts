import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types/theme';
import { STORAGE_KEYS } from './storageKeys';

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.theme, mode);
}

export async function getThemeMode(): Promise<ThemeMode | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.theme);
  return raw === 'light' || raw === 'dark' ? raw : null;
}
