import { Ionicons } from '@expo/vector-icons';
import { TaskFilter, TaskPriority, TaskStatus } from '../types/task';
import { Treatment, UserRole } from '../types/user';

export type IoniconName = keyof typeof Ionicons.glyphMap;

export interface Option<T extends string> {
  value: T;
  label: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  icon: IoniconName;
}

export const STATUS_OPTIONS: Option<TaskStatus>[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluída' },
];

export const PRIORITY_OPTIONS: Option<TaskPriority>[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];

export const FILTER_OPTIONS: Option<TaskFilter>[] = [
  { value: 'todas', label: 'Todas' },
  ...STATUS_OPTIONS,
];

export const CATEGORIES: CategoryOption[] = [
  { value: 'trabalho', label: 'Trabalho', icon: 'briefcase-outline' },
  { value: 'estudos', label: 'Estudos', icon: 'school-outline' },
  { value: 'pessoal', label: 'Pessoal', icon: 'person-outline' },
  { value: 'saude', label: 'Saúde', icon: 'fitness-outline' },
  { value: 'casa', label: 'Casa', icon: 'home-outline' },
  { value: 'financas', label: 'Finanças', icon: 'wallet-outline' },
];

export const TREATMENT_OPTIONS: Treatment[] = ['Sr.', 'Sra.', 'Srta.'];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  user: 'Usuário',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function findCategory(value: string): CategoryOption | undefined {
  return CATEGORIES.find((category) => category.value === value);
}

export function getCategoryLabel(value: string): string {
  return findCategory(value)?.label ?? value;
}

export function getCategoryIcon(icon: string): IoniconName {
  return icon in Ionicons.glyphMap ? (icon as IoniconName) : 'pricetag-outline';
}
