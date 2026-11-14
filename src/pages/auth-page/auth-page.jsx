import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/use-auth-store';
import { useThemeStore } from '../../store/use-theme-store';
import { BrandLogo } from '../../components/shared/brand-logo/brand-logo';
import { SairnaIcon } from '../../components/ui/sairna-icon';
import { buttonVariants } from '../../components/ui/button';
import { ToastNotification } from '../../components/ui/toast-notification';
import { AuthContentSection } from './sections/auth-content-section/auth-content-section';

export function AuthPage() {
  const token = useAuthStore((state) => state.token);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  if (token) {
    return <Navigate to={ROUTES.OVERVIEW} replace />;
  }

  return (
    <div className="arch-grid-bg min-h-dvh bg-bg flex flex-col pt-[5px]">
      <div className="ablaq-kinetic fixed top-0 left-0 right-0 z-50" aria-hidden="true" />

      <header className="border-b border-border bg-surface-elevated backdrop-blur-xl py-4 px-6">
        <div className="site-container flex items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex rounded-full border border-[#C88A32]/30 bg-[#C88A32]/15 px-3.5 py-1 text-[11px] font-bold text-[#C88A32]">
              SAIRNA Dashboard Portal
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className={buttonVariants({ variant: 'icon' })}
              title={theme === 'light' ? 'الوضع الليلي' : 'الوضع النهاري'}
              aria-label="تبديل المظهر"
            >
              <SairnaIcon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center py-10 max-[650px]:py-5">
        <AuthContentSection />
      </main>

      <ToastNotification />
    </div>
  );
}

export default AuthPage;
