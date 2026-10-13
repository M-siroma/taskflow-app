import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionUser, Treatment, UserRole } from '../types/user';
import { TREATMENT_OPTIONS } from '../constants/taskOptions';
import { STORAGE_KEYS } from './storageKeys';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'admin' || value === 'user';
}

function isSessionUser(value: unknown): value is SessionUser {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.username === 'string' &&
    typeof value.name === 'string' &&
    isUserRole(value.role)
  );
}

function isTreatment(value: string | null): value is Treatment {
  return TREATMENT_OPTIONS.some((option) => option === value);
}

export async function saveSession(user: SessionUser): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

/** Retorna a sessão salva ou null quando não existe ou está corrompida. */
export async function getSession(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.session);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isSessionUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.session);
}

export async function saveTreatment(userId: number, treatment: Treatment | null): Promise<void> {
  if (treatment) {
    await AsyncStorage.setItem(STORAGE_KEYS.treatment(userId), treatment);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.treatment(userId));
  }
}

export async function getTreatment(userId: number): Promise<Treatment | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.treatment(userId));
  return isTreatment(raw) ? raw : null;
}
