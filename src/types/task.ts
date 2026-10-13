export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  userId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  categoryIcon: string;
  createdAt: string;
  updatedAt: string;
}

/** Campos que o usuário informa no formulário de tarefa. */
export type TaskInput = Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'category'>;

export type TaskFilter = 'todas' | TaskStatus;
