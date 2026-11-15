export const ROUTES = {
  OVERVIEW: '/',
  TRIPS: '/trips',
  COMPANIES: '/companies',
  BOOKINGS: '/bookings',
  USERS: '/users',
  CITIES: '/cities',
  LOGIN: '/login',
};

export const SIDEBAR_NAV_GROUPS = [
  {
    title: '01 / الإدارة والتشغيل',
    items: [
      {
        id: 'overview',
        path: ROUTES.OVERVIEW,
        label: 'نظرة عامة والإحصائيات',
        eyebrow: 'SYS // OVERVIEW',
        icon: 'dashboard',
        badge: 'مباشر',
      },
      {
        id: 'trips',
        path: ROUTES.TRIPS,
        label: 'إدارة رحلات البولمان',
        eyebrow: 'OPS // TRIPS',
        icon: 'bus',
      },
      {
        id: 'bookings',
        path: ROUTES.BOOKINGS,
        label: 'الحجوزات والتذاكر',
        eyebrow: 'OPS // TICKETS',
        icon: 'ticket',
      },
      {
        id: 'companies',
        path: ROUTES.COMPANIES,
        label: 'شركات النقل المعتمدة',
        eyebrow: 'NET // CARRIERS',
        icon: 'building',
      },
    ],
  },
  {
    title: '02 / الشبكة والبيانات',
    items: [
      {
        id: 'cities',
        path: ROUTES.CITIES,
        label: 'المحافظات والكراجات',
        eyebrow: 'GEO // TERMINALS',
        icon: 'pin',
      },
      {
        id: 'users',
        path: ROUTES.USERS,
        label: 'المسافرون والحسابات',
        eyebrow: 'CRM // TRAVELERS',
        icon: 'users',
      },
    ],
  },
];
