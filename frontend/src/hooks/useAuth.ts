'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@/types';
import api from '@/lib/api';

interface AuthStore {
  token: string | null;
  refreshToken: string | null;
  user: { email: string; nombre: string; rol: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (auth: AuthResponse) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
        set({
          token: response.token,
          refreshToken: response.refreshToken,
          user: { email: response.email, nombre: response.nombre, rol: response.rol },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAuth: (auth: AuthResponse) => {
        set({
          token: auth.token,
          refreshToken: auth.refreshToken,
          user: { email: auth.email, nombre: auth.nombre, rol: auth.rol },
          isAuthenticated: true,
        });
      },
    }),
    { name: 'nanosweb-auth' }
  )
);
