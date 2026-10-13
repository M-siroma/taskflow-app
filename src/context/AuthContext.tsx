import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { users } from '../data/users';
import {
  clearSession,
  getSession,
  getTreatment,
  saveSession,
  saveTreatment,
} from '../services/authStorage';
import { SessionUser, Treatment } from '../types/user';

export interface AuthContextData {
  user: SessionUser | null;
  treatment: Treatment | null;
  /** true enquanto a sessão salva está sendo restaurada na abertura do app. */
  isRestoring: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTreatment: (treatment: Treatment | null) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        const session = await getSession();
        if (session) {
          setTreatment(await getTreatment(session.id));
          setUser(session);
        }
      } catch (error) {
        console.warn('Não foi possível restaurar a sessão.', error);
      } finally {
        setIsRestoring(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    // Pequeno atraso para simular uma requisição de autenticação.
    await wait(600);
    const found = users.find(
      (candidate) => candidate.username === username.trim().toLowerCase() && candidate.password === password,
    );
    if (!found) {
      throw new Error('Usuário ou senha inválidos. Verifique os dados e tente novamente.');
    }
    const session: SessionUser = {
      id: found.id,
      username: found.username,
      role: found.role,
      name: found.name,
    };
    try {
      await saveSession(session);
      setTreatment(await getTreatment(session.id));
    } catch {
      throw new Error('Não foi possível salvar a sessão no dispositivo. Tente novamente.');
    }
    setUser(session);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await clearSession();
    } finally {
      setUser(null);
      setTreatment(null);
    }
  }, []);

  const updateTreatment = useCallback(
    async (next: Treatment | null): Promise<void> => {
      if (!user) {
        return;
      }
      try {
        await saveTreatment(user.id, next);
        setTreatment(next);
      } catch {
        throw new Error('Não foi possível salvar a preferência de tratamento.');
      }
    },
    [user],
  );

  const value = useMemo<AuthContextData>(
    () => ({ user, treatment, isRestoring, login, logout, updateTreatment }),
    [user, treatment, isRestoring, login, logout, updateTreatment],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
