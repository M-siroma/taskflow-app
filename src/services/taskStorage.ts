import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';
import { isValidPriority, isValidStatus } from '../utils/validation';
import { STORAGE_KEYS } from './storageKeys';

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.userId === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.status === 'string' &&
    isValidStatus(task.status) &&
    typeof task.priority === 'string' &&
    isValidPriority(task.priority) &&
    typeof task.category === 'string' &&
    typeof task.categoryIcon === 'string' &&
    typeof task.createdAt === 'string' &&
    typeof task.updatedAt === 'string'
  );
}

/** Lê todas as tarefas salvas (de todos os usuários). Itens inválidos são descartados. */
export async function loadTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.tasks);
  if (!raw) {
    return [];
  }
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter(isTask) : [];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}
