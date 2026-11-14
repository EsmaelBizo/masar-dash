import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCurrentAdmin,
  loginAdmin,
  fetchBackendHealth,
} from '../services/auth-service';
import { useAuthStore } from '../store/use-auth-store';

export const AUTH_QUERY_KEYS = {
  me: ['dashboard', 'auth', 'me'],
  health: ['dashboard', 'health'],
};

export function useCurrentAdminQuery() {
  const token = useAuthStore((state) => state.token);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: async () => {
      const profile = await fetchCurrentAdmin();
      if (profile) updateUser(profile);
      return profile;
    },
    enabled: Boolean(token),
    retry: 1,
  });
}

export function useBackendHealthQuery() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.health,
    queryFn: fetchBackendHealth,
    refetchInterval: 60000,
    retry: 1,
  });
}

export function useAdminLoginMutation() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}
