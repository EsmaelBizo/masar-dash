import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchDashboardOverview,
  fetchDashboardCities,
  fetchDashboardCompanies,
  createDashboardCompany,
  updateDashboardCompany,
  deleteDashboardCompany,
  fetchDashboardTrips,
  fetchDashboardTripById,
  createDashboardTrip,
  updateDashboardTrip,
  deleteDashboardTrip,
  fetchDashboardBookings,
  fetchDashboardBookingById,
  cancelDashboardBooking,
  fetchDashboardUsers,
  fetchDashboardUserById,
} from '../services/dashboard-service';
import { useAuthStore } from '../store/use-auth-store';

export const DASHBOARD_QUERY_KEYS = {
  overview: ['dashboard', 'overview'],
  cities: ['dashboard', 'cities'],
  companies: ['dashboard', 'companies'],
  trips: ['dashboard', 'trips'],
  tripDetail: (id) => ['dashboard', 'trips', 'detail', id],
  bookings: ['dashboard', 'bookings'],
  bookingDetail: (id) => ['dashboard', 'bookings', 'detail', id],
  users: ['dashboard', 'users'],
  userDetail: (id) => ['dashboard', 'users', 'detail', id],
};

// Overview
export function useOverviewQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview,
    queryFn: fetchDashboardOverview,
    enabled: Boolean(token),
  });
}

// Cities
export function useCitiesQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.cities,
    queryFn: fetchDashboardCities,
    enabled: Boolean(token),
  });
}

// Companies
export function useCompaniesQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.companies,
    queryFn: fetchDashboardCompanies,
    enabled: Boolean(token),
  });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDashboardCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDashboardCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.trips });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDashboardCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.companies });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

// Trips
export function useTripsQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.trips,
    queryFn: fetchDashboardTrips,
    enabled: Boolean(token),
  });
}

export function useTripDetailQuery(id) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.tripDetail(id),
    queryFn: () => fetchDashboardTripById(id),
    enabled: Boolean(token && id),
  });
}

export function useCreateTripMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDashboardTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.trips });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

export function useUpdateTripMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDashboardTrip,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.trips });
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.tripDetail(variables.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

export function useDeleteTripMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDashboardTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.trips });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

// Bookings
export function useBookingsQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.bookings,
    queryFn: fetchDashboardBookings,
    enabled: Boolean(token),
  });
}

export function useBookingDetailQuery(id) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.bookingDetail(id),
    queryFn: () => fetchDashboardBookingById(id),
    enabled: Boolean(token && id),
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelDashboardBooking,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.bookings });
      if (id) {
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.bookingDetail(id),
        });
      }
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.trips });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.overview });
    },
  });
}

// Users
export function useUsersQuery() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.users,
    queryFn: fetchDashboardUsers,
    enabled: Boolean(token),
  });
}

export function useUserDetailQuery(id) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.userDetail(id),
    queryFn: () => fetchDashboardUserById(id),
    enabled: Boolean(token && id),
  });
}
