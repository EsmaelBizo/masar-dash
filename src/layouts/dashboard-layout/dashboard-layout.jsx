import { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/use-auth-store';
import { useCurrentAdminQuery } from '../../hooks/use-auth-mutation';
import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';
import { DashboardHeader } from '../dashboard-header/dashboard-header';
import { ToastNotification } from '../../components/ui/toast-notification';
import { TicketModal } from '../../components/shared/ticket-modal/ticket-modal';
import { ConfirmDialog } from '../../components/shared/confirm-dialog/confirm-dialog';
import { TripFormModal } from '../../components/shared/trip-form-modal/trip-form-modal';
import { CompanyFormModal } from '../../components/shared/company-form-modal/company-form-modal';
import { UserDetailModal } from '../../components/shared/user-detail-modal/user-detail-modal';
import { CommandPalette } from '../../components/shared/command-palette/command-palette';

export function DashboardLayout() {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Sync admin profile when authenticated
  useCurrentAdminQuery();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="arch-grid-bg min-h-dvh flex flex-col bg-bg text-text">
      {/* Kinetic Ablaq Top Ribbon */}
      <div className="ablaq-kinetic fixed top-0 left-0 right-0 z-50" aria-hidden="true" />

      <div className="flex flex-1 pt-[5px] min-h-dvh">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onOpenCommand={() => setCmdOpen(true)} />

          <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto space-y-6">
            <Outlet />
          </main>

          <footer className="mt-auto border-t border-border px-4 sm:px-8 py-4 text-xs text-muted flex flex-wrap items-center justify-between gap-2">
            <span>
              © 2026 مَسار | MASAR (masar.sy) — نظام النقل الذكي بين المحافظات السورية
            </span>
            <span className="font-heading font-bold text-[#C88A32]">
              «دربك سالك ومقعدك محفوظ»
            </span>
          </footer>
        </div>
      </div>

      {/* Global Dashboard Modals & Notifications */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <TripFormModal />
      <CompanyFormModal />
      <UserDetailModal />
      <TicketModal />
      <ConfirmDialog />
      <ToastNotification />
    </div>
  );
}

export default DashboardLayout;
