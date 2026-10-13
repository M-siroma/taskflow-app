import { User } from '../types/user';

// Autenticação apenas didática: usuários e senhas ficam no código.
export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'admin',
    name: 'Administrador',
  },
  {
    id: 2,
    username: 'user',
    password: '123',
    role: 'user',
    name: 'Usuário Comum',
  },
];
