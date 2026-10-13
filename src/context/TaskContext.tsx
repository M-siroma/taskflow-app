import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { findCategory } from '../constants/taskOptions';
import { useAuth } from '../hooks/useAuth';
import { loadTasks, saveTasks } from '../services/taskStorage';
import { Task, TaskInput, TaskStatus } from '../types/task';
import { generateId } from '../utils/generateId';
import { hasErrors, validateTaskForm } from '../utils/validation';

export interface TaskContextData {
  /** Tarefas do usuário autenticado, das mais recentes para as mais antigas. */
  tasks: Task[];
  isLoading: boolean;
  loadError: string | null;
  reloadTasks: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  addTask: (input: TaskInput) => Promise<Task>;
  updateTask: (id: string, input: TaskInput) => Promise<Task>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextData | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

const SAVE_ERROR = 'Não foi possível salvar as alterações no dispositivo. Tente novamente.';

function normalizeInput(input: TaskInput): TaskInput {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
  };
}

export function TaskProvider({ children }: TaskProviderProps) {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reloadTasks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setAllTasks(await loadTasks());
    } catch {
      setLoadError('Não foi possível carregar suas tarefas salvas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // As tarefas são carregadas assim que o aplicativo inicia.
  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  const tasks = useMemo<Task[]>(
    () =>
      user
        ? allTasks
            .filter((task) => task.userId === user.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [allTasks, user],
  );

  const persist = useCallback(async (next: Task[]): Promise<void> => {
    try {
      await saveTasks(next);
    } catch {
      throw new Error(SAVE_ERROR);
    }
    setAllTasks(next);
  }, []);

  const findOwnTask = useCallback(
    (id: string): Task => {
      const task = allTasks.find((item) => item.id === id);
      if (!task || !user || task.userId !== user.id) {
        throw new Error('Tarefa não encontrada.');
      }
      return task;
    },
    [allTasks, user],
  );

  const getTaskById = useCallback(
    (id: string): Task | undefined => tasks.find((task) => task.id === id),
    [tasks],
  );

  const addTask = useCallback(
    async (input: TaskInput): Promise<Task> => {
      if (!user) {
        throw new Error('Sessão expirada. Entre novamente.');
      }
      const data = normalizeInput(input);
      if (hasErrors(validateTaskForm(data))) {
        throw new Error('Os dados da tarefa são inválidos.');
      }
      const now = new Date().toISOString();
      const task: Task = {
        ...data,
        id: generateId(),
        userId: user.id,
        categoryIcon: findCategory(data.category)?.icon ?? 'pricetag-outline',
        createdAt: now,
        updatedAt: now,
      };
      await persist([...allTasks, task]);
      return task;
    },
    [allTasks, persist, user],
  );

  const updateTask = useCallback(
    async (id: string, input: TaskInput): Promise<Task> => {
      const current = findOwnTask(id);
      const data = normalizeInput(input);
      if (hasErrors(validateTaskForm(data))) {
        throw new Error('Os dados da tarefa são inválidos.');
      }
      const updated: Task = {
        ...current,
        ...data,
        categoryIcon: findCategory(data.category)?.icon ?? current.categoryIcon,
        updatedAt: new Date().toISOString(),
      };
      await persist(allTasks.map((task) => (task.id === id ? updated : task)));
      return updated;
    },
    [allTasks, findOwnTask, persist],
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus): Promise<Task> => {
      const current = findOwnTask(id);
      const updated: Task = { ...current, status, updatedAt: new Date().toISOString() };
      await persist(allTasks.map((task) => (task.id === id ? updated : task)));
      return updated;
    },
    [allTasks, findOwnTask, persist],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      findOwnTask(id);
      await persist(allTasks.filter((task) => task.id !== id));
    },
    [allTasks, findOwnTask, persist],
  );

  const value = useMemo<TaskContextData>(
    () => ({
      tasks,
      isLoading,
      loadError,
      reloadTasks,
      getTaskById,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
    }),
    [tasks, isLoading, loadError, reloadTasks, getTaskById, addTask, updateTask, updateTaskStatus, deleteTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
