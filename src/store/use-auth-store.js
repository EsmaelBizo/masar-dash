import { create } from 'zustand';
import { getStoredItem, saveStoredItem, removeStoredItem } from '../lib/storage';
import { DASHBOARD_TOKEN_KEY, DASHBOARD_USER_KEY } from '../services/api-client';

export const useAuthStore = create((set) => ({
  token: getStoredItem(DASHBOARD_TOKEN_KEY, null),
  user: getStoredItem(DASHBOARD_USER_KEY, null),
  afterAuthRoute: null,

  login: ({ token, user, name, email, role }) => {
    const resolvedUser = user || {
      name: name || 'SAIRNA Admin',
      email: email || 'admin@gmail.com',
      role: role || 'ADMIN',
    };
    if (token) saveStoredItem(DASHBOARD_TOKEN_KEY, token);
    saveStoredItem(DASHBOARD_USER_KEY, resolvedUser);
    set({ token: token || null, user: resolvedUser });
  },

  updateUser: (user) => {
    if (user) {
      saveStoredItem(DASHBOARD_USER_KEY, user);
      set({ user });
    }
  },

  logout: () => {
    removeStoredItem(DASHBOARD_TOKEN_KEY);
    removeStoredItem(DASHBOARD_USER_KEY);
    set({ token: null, user: null });
  },

  setAfterAuthRoute: (route) => set({ afterAuthRoute: route }),
  clearAfterAuthRoute: () => set({ afterAuthRoute: null }),
}));
