import { TaskPriority, TaskStatus } from './task';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  danger: string;
  dangerText: string;
  success: string;
  inputBackground: string;
  placeholder: string;
  overlay: string;
  shadow: string;
  status: Record<TaskStatus, string>;
  priority: Record<TaskPriority, string>;
}
