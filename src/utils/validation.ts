import { CATEGORIES, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/taskOptions';
import { TaskInput, TaskPriority, TaskStatus } from '../types/task';

export type TaskFormErrors = Partial<Record<keyof TaskInput, string>>;

export interface LoginErrors {
  username?: string;
  password?: string;
}

export const TITLE_MIN_LENGTH = 3;
export const DESCRIPTION_MIN_LENGTH = 5;
export const TITLE_MAX_LENGTH = 60;
export const DESCRIPTION_MAX_LENGTH = 300;

export function isValidStatus(value: string): value is TaskStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

export function isValidPriority(value: string): value is TaskPriority {
  return PRIORITY_OPTIONS.some((option) => option.value === value);
}

export function isValidCategory(value: string): boolean {
  return CATEGORIES.some((category) => category.value === value);
}

export function validateTaskForm(values: TaskInput): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!title) {
    errors.title = 'O título é obrigatório.';
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `O título deve ter pelo menos ${TITLE_MIN_LENGTH} caracteres.`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `O título deve ter no máximo ${TITLE_MAX_LENGTH} caracteres.`;
  }

  if (!description) {
    errors.description = 'A descrição é obrigatória.';
  } else if (description.length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `A descrição deve ter pelo menos ${DESCRIPTION_MIN_LENGTH} caracteres.`;
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `A descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  if (!isValidStatus(values.status)) {
    errors.status = 'Selecione um status válido.';
  }
  if (!isValidPriority(values.priority)) {
    errors.priority = 'Selecione uma prioridade válida.';
  }
  if (!isValidCategory(values.category)) {
    errors.category = 'Selecione uma categoria válida.';
  }

  return errors;
}

export function validateLogin(username: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!username.trim()) {
    errors.username = 'Informe o usuário.';
  }
  if (!password) {
    errors.password = 'Informe a senha.';
  }
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
