import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { cn } from '../../../lib/cn';
import iconDarkSvg from '../../../assets/images/masar-icon-dark.svg';
import logoBrandSvg from '../../../assets/images/masar-logo-brand.svg';
import logoLockupSvg from '../../../assets/images/masar-logo-lockup.svg';
import { useThemeStore } from '../../../store/use-theme-store';

export function BrandLogo({ variant = 'default', collapsed = false, className }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  return (
    <Link
      to={ROUTES.OVERVIEW}
      className={cn(
        'inline-flex shrink-0 items-center gap-3.5',
        !collapsed && 'min-w-[125px]',
        className
      )}
      aria-label="مَسار | MASAR Dashboard - الرئيسية"
    >
      <img
        src={
          isDark
            ? iconDarkSvg
            : collapsed
              ? logoBrandSvg
              : logoLockupSvg
        }
        alt="مَسار | MASAR"
        className={cn(
          'object-contain',
          isDark
            ? 'size-11 max-[650px]:size-[38px] rounded-xl'
            : collapsed
              ? 'size-11 max-[650px]:size-[38px]'
              : 'h-12 w-[158px] max-[650px]:h-10 max-[650px]:w-[132px]'
        )}
      />
    </Link>
  );
}

export default BrandLogo;
