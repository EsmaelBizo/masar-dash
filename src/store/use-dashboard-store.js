import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,

  // Global search & filter states across modules
  tripsFilters: {
    search: '',
    companyId: 'all',
    originId: 'all',
    destinationId: 'all',
    status: 'all',
  },
  companiesFilters: {
    search: '',
    status: 'all',
  },
  bookingsFilters: {
    search: '',
    status: 'all',
    companyId: 'all',
  },
  usersFilters: {
    search: '',
    role: 'all',
  },
  citiesSearch: '',

  // Active modals / drawers
  activeTripModal: null, // { mode: 'create' | 'edit' | 'view', trip: null | object }
  activeCompanyModal: null, // { mode: 'create' | 'edit', company: null | object }
  activeBookingModal: null, // booking object
  activeUserModal: null, // user object
  confirmDialog: null, // { title, description, confirmLabel, variant, onConfirm }

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setTripsFilters: (next) =>
    set((state) => ({ tripsFilters: { ...state.tripsFilters, ...next } })),
  resetTripsFilters: () =>
    set({
      tripsFilters: {
        search: '',
        companyId: 'all',
        originId: 'all',
        destinationId: 'all',
        status: 'all',
      },
    }),

  setCompaniesFilters: (next) =>
    set((state) => ({
      companiesFilters: { ...state.companiesFilters, ...next },
    })),
  resetCompaniesFilters: () =>
    set({ companiesFilters: { search: '', status: 'all' } }),

  setBookingsFilters: (next) =>
    set((state) => ({
      bookingsFilters: { ...state.bookingsFilters, ...next },
    })),
  resetBookingsFilters: () =>
    set({ bookingsFilters: { search: '', status: 'all', companyId: 'all' } }),

  setUsersFilters: (next) =>
    set((state) => ({ usersFilters: { ...state.usersFilters, ...next } })),
  resetUsersFilters: () =>
    set({ usersFilters: { search: '', role: 'all' } }),

  setCitiesSearch: (citiesSearch) => set({ citiesSearch }),

  openTripModal: (mode = 'create', trip = null) =>
    set({ activeTripModal: { mode, trip } }),
  closeTripModal: () => set({ activeTripModal: null }),

  openCompanyModal: (mode = 'create', company = null) =>
    set({ activeCompanyModal: { mode, company } }),
  closeCompanyModal: () => set({ activeCompanyModal: null }),

  openBookingModal: (booking) => set({ activeBookingModal: booking }),
  closeBookingModal: () => set({ activeBookingModal: null }),

  openUserModal: (user) => set({ activeUserModal: user }),
  closeUserModal: () => set({ activeUserModal: null }),

  openConfirmDialog: (config) => set({ confirmDialog: config }),
  closeConfirmDialog: () => set({ confirmDialog: null }),
}));
