import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_NAV_GROUPS, API_DOCS_LINKS, ROUTES } from '../../constants/routes';
import { useDashboardStore } from '../../store/use-dashboard-store';
import { useAuthStore } from '../../store/use-auth-store';
import { useToastStore } from '../../store/use-toast-store';
import {
  useOverviewQuery,
  useTripsQuery,
  useBookingsQuery,
  useCompaniesQuery,
  useUsersQuery,
  useCitiesQuery,
} from '../../hooks/use-dashboard-queries';
import { BrandLogo } from '../../components/shared/brand-logo/brand-logo';
import { SairnaIcon } from '../../components/ui/sairna-icon';
import { cn } from '../../lib/cn';

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const mobileOpen = useDashboardStore((state) => state.mobileSidebarOpen);
  const setMobileOpen = useDashboardStore((state) => state.setMobileSidebarOpen);

  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);

  const { data: overview } = useOverviewQuery();
  const { data: trips = [] } = useTripsQuery();
  const { data: bookings = [] } = useBookingsQuery();
  const { data: companies = [] } = useCompaniesQuery();
  const { data: users = [] } = useUsersQuery();
  const { data: cities = [] } = useCitiesQuery();

  const countsMap = {
    trips: trips.length || overview?.upcomingTrips || 0,
    bookings: bookings.length || overview?.totalBookings || 0,
    companies: companies.length || overview?.companies || 0,
    users: users.length || overview?.customers || 0,
    cities: cities.length || 14,
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    showToast('تم تسجيل الخروج من لوحة تحكم مَسار.');
    navigate(ROUTES.LOGIN);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-surface-elevated backdrop-blur-xl text-text">
      {/* Brand Header */}
      <div
        className={cn(
          'flex shrink-0 items-center justify-between border-b border-border p-5',
          collapsed && 'justify-center px-2 py-5'
        )}
      >
        <BrandLogo variant="sidebar" collapsed={collapsed} />

        <button
          type="button"
          onClick={toggleSidebar}
          className="max-[960px]:hidden grid size-8 place-items-center rounded-lg border border-border bg-bg/50 text-muted transition-colors hover:border-[#C88A32] hover:text-[#C88A32]"
          title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          aria-label="تبديل حجم القائمة الجانبية"
        >
          <SairnaIcon
            name={collapsed ? 'chevron-left' : 'chevron-right'}
            size={16}
          />
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="hidden max-[960px]:grid size-9 place-items-center rounded-xl border border-border bg-bg/60 text-text"
          aria-label="إغلاق القائمة"
        >
          <SairnaIcon name="x" size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {SIDEBAR_NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="mb-2.5 px-3 font-num text-[10px] font-bold tracking-[0.18em] uppercase text-muted">
                {group.title}
              </p>
            )}
            <nav className="space-y-1" aria-label={group.title}>
              {group.items.map((item) => {
                const isActive =
                  item.path === ROUTES.OVERVIEW
                    ? location.pathname === ROUTES.OVERVIEW
                    : location.pathname.startsWith(item.path);
                const count = countsMap[item.id];

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all duration-200',
                      collapsed && 'justify-center px-2',
                      isActive
                        ? 'bg-gradient-to-l from-[#C88A32]/20 to-transparent border-r-2 border-[#C88A32] text-text font-bold'
                        : 'text-muted hover:text-text hover:bg-bg/60'
                    )}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <SairnaIcon
                        name={item.icon}
                        size={17}
                        className={cn(
                          'shrink-0 transition-transform duration-200 group-hover:scale-110',
                          isActive ? 'text-[#C88A32]' : 'text-muted group-hover:text-[#C88A32]'
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </span>

                    {!collapsed && (
                      <>
                        {typeof count === 'number' && count > 0 ? (
                          <span
                            className={cn(
                              'font-tabular rounded-full px-2 py-0.5 text-[10px] font-bold',
                              isActive
                                ? 'bg-[#C88A32]/20 text-[#C88A32]'
                                : 'bg-bg/70 text-muted border border-border'
                            )}
                          >
                            {count}
                          </span>
                        ) : item.badge ? (
                          <span className="rounded-full bg-[#2E6F5E]/20 px-2 py-0.5 text-[10px] font-bold text-[#3B8C77]">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Live Corridor Telemetry Card */}
        {!collapsed && (
          <div className="rounded-2xl border border-[#C88A32]/25 bg-gradient-to-br from-[#163A5F]/20 to-transparent p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#C88A32]">
                محور M5 الدولي
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#3B8C77]">
                <span className="size-2 rounded-full bg-[#3B8C77] animate-pulse" />
                متصل
              </span>
            </div>
            <p className="m-0 text-xs leading-relaxed text-muted">
              دمشق — حمص — حماة — حلب تعمل بكامل الطاقة التشغيلية.
            </p>
            <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-2.5 text-[10px]">
              <a
                href={API_DOCS_LINKS.DASHBOARD_SWAGGER}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg bg-bg/50 px-2.5 py-1.5 font-semibold text-muted transition-colors hover:text-[#C88A32]"
              >
                <span>Dashboard Swagger</span>
                <SairnaIcon name="external-link" size={12} />
              </a>
              <a
                href={API_DOCS_LINKS.WEBSITE_SWAGGER}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg bg-bg/50 px-2.5 py-1.5 font-semibold text-muted transition-colors hover:text-[#C88A32]"
              >
                <span>Website Swagger</span>
                <SairnaIcon name="external-link" size={12} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer Logout */}
      <div className="shrink-0 border-t border-border p-3.5">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'تسجيل الخروج' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl border border-border bg-bg/50 px-3.5 py-2.5 text-xs font-bold text-danger transition-colors hover:border-danger hover:bg-danger hover:text-white',
            collapsed && 'justify-center px-2'
          )}
        >
          <SairnaIcon name="logout" size={16} />
          {!collapsed && <span>تسجيل الخروج الآمن</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          'max-[960px]:hidden sticky top-[5px] z-30 h-[calc(100vh-5px)] shrink-0 border-l border-border transition-[width] duration-300 ease-[var(--ease-masar-out)]',
          collapsed ? 'w-[84px]' : 'w-72'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Scrim & Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[180] hidden max-[960px]:block animate-fade bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <aside className="h-full w-[min(288px,85vw)] border-l border-border bg-surface shadow-2xl animate-slide-in-rtl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;
