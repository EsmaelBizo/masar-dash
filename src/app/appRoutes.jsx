import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { DashboardLayout } from '../layouts/dashboard-layout/dashboard-layout';
import { OverviewPage } from '../pages/overview-page/overview-page';
import { TripsPage } from '../pages/trips-page/trips-page';
import { CompaniesPage } from '../pages/companies-page/companies-page';
import { BookingsPage } from '../pages/bookings-page/bookings-page';
import { UsersPage } from '../pages/users-page/users-page';
import { CitiesPage } from '../pages/cities-page/cities-page';
import { AuthPage } from '../pages/auth-page/auth-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<AuthPage />} />

      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.OVERVIEW} element={<OverviewPage />} />
        <Route path="/overview" element={<Navigate to={ROUTES.OVERVIEW} replace />} />
        <Route path={ROUTES.TRIPS} element={<TripsPage />} />
        <Route path={ROUTES.COMPANIES} element={<CompaniesPage />} />
        <Route path={ROUTES.BOOKINGS} element={<BookingsPage />} />
        <Route path={ROUTES.USERS} element={<UsersPage />} />
        <Route path={ROUTES.CITIES} element={<CitiesPage />} />
        <Route path="*" element={<Navigate to={ROUTES.OVERVIEW} replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
