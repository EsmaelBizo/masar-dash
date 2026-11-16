import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useThemeStore } from '../../store/use-theme-store';
import { useAuthStore } from '../../store/use-auth-store';
import { useDashboardStore } from '../../store/use-dashboard-store';
import { useToastStore } from '../../store/use-toast-store';
import { useBackendHealthQuery } from '../../hooks/use-auth-mutation';
import { SairnaIcon } from '../../components/ui/sairna-icon';
import { buttonVariants } from '../../components/ui/button';
import { cn } from '../../lib/cn';

const PAGE_TITLES = {
  [ROUTES.OVERVIEW]: {
    eyebrow: 'SYS // OVERVIEW',
    title: 'نظرة عامة والإحصائيات',
  },
  [ROUTES.TRIPS]: {
    eyebrow: 'OPS // TRIPS',
    title: 'إدارة رحلات البولمان',
  },
  [ROUTES.BOOKINGS]: {
    eyebrow: 'OPS // TICKETS',
    title: 'الحجوزات والتذاكر',
  },
  [ROUTES.COMPANIES]: {
    eyebrow: 'NET // CARRIERS',
    title: 'شركات النقل المعتمدة',
  },
  [ROUTES.CITIES]: {
    eyebrow: 'GEO // TERMINALS',
    title: 'المحافظات والكراجات',
  },
  [ROUTES.USERS]: {
    eyebrow: 'CRM // TRAVELERS',
    title: 'المسافرون والحسابات',
  },
};

export function DashboardHeader({ onOpenCommand }) {
  const location = useLocation();
  const queryClient = useQueryClient();

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const setMobileSidebarOpen = useDashboardStore(
    (state) => state.setMobileSidebarOpen
  );
  const openTripModal = useDashboardStore((state) => state.openTripModal);
  const showToast = useToastStore((state) => state.showToast);

  const { data: healthData, isError: healthError } = useBackendHealthQuery();
  const isHealthy = !healthError && Boolean(healthData);

  const currentMeta =
    PAGE_TITLES[location.pathname] || PAGE_TITLES[ROUTES.OVERVIEW];

  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    showToast('تم تحديث كافة بيانات لوحة التحكم بنجاح.');
  };

  const userInitial = (user?.name || 'م').trim()[0];

  return (
    <header className="sticky top-[5px] z-20 border-b border-border bg-surface-elevated backdrop-blur-xl px-4 sm:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="hidden max-[960px]:inline-grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-bg/60 text-text transition-colors hover:border-[#C88A32]"
            aria-label="فتح القائمة الجانبية"
          >
            <SairnaIcon name="menu" size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
                {currentMeta.eyebrow}
              </span>
              <span
                className={cn(
                  'max-[750px]:hidden inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold',
                  isHealthy
                    ? 'border-[#2E6F5E]/30 bg-[#2E6F5E]/15 text-[#3B8C77]'
                    : 'border-[#C88A32]/30 bg-[#C88A32]/15 text-[#C88A32]'
                )}
                title="حالة اتصال منظومة مَسار"
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    isHealthy ? 'bg-[#3B8C77] animate-pulse' : 'bg-[#C88A32]'
                  )}
                />
                {isHealthy ? 'النظام متصل' : 'فحص الاتصال...'}
              </span>
            </div>
            <h1 className="m-0 truncate font-heading text-base sm:text-xl font-bold text-text">
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Actions & Command Palette */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {onOpenCommand && (
            <button
              type="button"
              onClick={onOpenCommand}
              className="hidden md:flex items-center gap-3 rounded-xl border border-border bg-bg/60 px-3.5 py-2 text-xs text-muted transition-all hover:border-[#C88A32]/60 hover:text-text"
            >
              <SairnaIcon name="search" size={14} className="text-[#C88A32]" />
              <span>بحث سريع في الرحلات والمدن...</span>
              <kbd className="font-num rounded border border-border bg-surface px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </button>
          )}

          <button
            type="button"
            onClick={handleRefreshAll}
            className={buttonVariants({ variant: 'icon' })}
            title="تحديث البيانات"
            aria-label="تحديث البيانات"
          >
            <SairnaIcon name="refresh" size={16} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={buttonVariants({ variant: 'icon' })}
            title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
            aria-label="تبديل المظهر"
          >
            <SairnaIcon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
          </button>

          <button
            type="button"
            onClick={() => openTripModal('create')}
            className={cn(
              buttonVariants({ variant: 'primary', size: 'sm' }),
              'px-3.5 sm:px-4'
            )}
          >
            <SairnaIcon name="plus" size={16} />
            <span className="hidden sm:inline">إضافة رحلة</span>
          </button>

          <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-border bg-bg/60 px-2.5 py-1.5">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#163A5F] to-[#0B1929] border border-[#C88A32]/40 font-heading text-xs font-bold text-[#C88A32]">
              {userInitial}
            </span>
            <div className="hidden xl:flex flex-col leading-tight">
              <strong className="text-[11px] font-bold text-text">
                {'masar admin'}
              </strong>
              <span
                dir="ltr"
                className="font-tabular text-[10px] font-bold text-[#C88A32]"
              >
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
