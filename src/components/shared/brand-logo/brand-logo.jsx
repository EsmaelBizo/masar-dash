import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { cn } from '../../../lib/cn';

export function BrandLogo({ variant = 'default', collapsed = false, className }) {
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
      <span className="grid size-11 max-[650px]:size-[38px] shrink-0 place-items-center rounded-xl border border-[#C88A32]/40 bg-gradient-to-br from-[#163A5F] to-[#0B1929] shadow-lg">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M6 27V14C6 8.5 10.5 4 16 4C21.5 4 26 8.5 26 14V27"
            stroke="#C88A32"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M10 27V15C10 11.7 12.7 9 16 9C19.3 9 22 11.7 22 15V27"
            stroke="#F7F4EE"
            strokeWidth="1.6"
          />
          <path d="M12 27L15 19H17L20 27" stroke="#2E6F5E" strokeWidth="2" />
        </svg>
      </span>

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
