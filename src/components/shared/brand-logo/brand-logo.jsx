import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { cn } from '../../../lib/cn';
import iconDarkSvg from '../../../assets/images/masar-icon-dark.svg';
import iconWhiteSvg from '../../../assets/images/masar-icon-white.svg';
import { useThemeStore } from '../../../store/use-theme-store';

export function BrandLogo({ variant = 'default', collapsed = false, className }) {
  const theme = useThemeStore((state) => state.theme);
  const isLightText = variant === 'footer' || variant === 'header';

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
          src={theme === 'light' ? iconWhiteSvg : iconDarkSvg}
          alt=""
          className="size-10 rounded-lg object-contain"
        />

      {!collapsed && (
        <span className="flex flex-col leading-tight">
          <span className="flex items-center gap-2">
            <strong
              className={cn(
                'font-heading text-lg font-bold tracking-tight',
                isLightText ? 'text-white' : 'text-text'
              )}
            >
              مَسار
            </strong>
            <span className="font-num rounded-full border border-[#C88A32]/30 bg-[#C88A32]/15 px-2 py-0.5 text-[10px] font-bold text-[#C88A32]">
              MASAR
            </span>
          </span>
          <small
            className={cn(
              'mt-0.5 whitespace-nowrap text-[11px] font-medium',
              isLightText ? 'text-[#DCE6F0]' : 'text-muted'
            )}
          >
            القيادة المركزية • سوريا
          </small>
        </span>
      )}
    </Link>
  );
}

export default BrandLogo;
