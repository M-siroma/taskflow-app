import { useContext } from 'react';
import { TaskContext, TaskContextData } from '../context/TaskContext';

export function useTasks(): TaskContextData {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de um TaskProvider.');
  }
  return context;
}
