import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../../../constants/routes';
import { useCountUp } from '../../../../../../hooks/use-count-up';
import { formatMoney } from '../../../../../../lib/formatters';
import { SairnaIcon } from '../../../../../../components/ui/sairna-icon';
import { cn } from '../../../../../../lib/cn';

function KpiCard({
  title,
  value,
  subtitle,
  iconName,
  accentClass,
  iconBgClass,
  badgeText,
  badgeClass,
  to,
}) {
  const { ref, displayValue } = useCountUp(value);

  return (
    <Link
      to={to}
      ref={ref}
      className={cn(
        'bento-card group rounded-3xl p-5 border-t-2',
        accentClass
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-muted">{title}</span>
        <span
          className={cn(
            'rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110',
            iconBgClass
          )}
        >
          <SairnaIcon name={iconName} size={17} />
        </span>
      </div>
      <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-text">
        {displayValue}
      </strong>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
        <span className="truncate">{subtitle}</span>
        <span className={cn('shrink-0 font-bold', badgeClass)}>
          {badgeText}
        </span>
      </div>
    </Link>
  );
}

export function OverviewKpiGrid({ overview, trips = [], bookings = [] }) {
  const confirmedRevenue = bookings
    .filter((b) => String(b.status).toUpperCase() === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const cards = [
    {
      id: 'confirmedBookings',
      title: 'إيرادات التذاكر المؤكدة',
      value: overview?.confirmedBookings ?? 0,
      subtitle: `${formatMoney(confirmedRevenue)}`,
      badgeText: 'مؤكد',
      badgeClass: 'text-[#3B8C77]',
      iconName: 'wallet',
      accentClass: 'border-t-[#C88A32]',
      iconBgClass: 'bg-[#C88A32]/15 text-[#C88A32]',
      to: ROUTES.BOOKINGS,
    },
    {
      id: 'upcomingTrips',
      title: 'الرحلات المجدولة',
      value: overview?.upcomingTrips ?? trips.length ?? 0,
      subtitle: 'VIP & سياحي على الخطوط',
      badgeText: 'نشط',
      badgeClass: 'text-[#C88A32]',
      iconName: 'bus',
      accentClass: 'border-t-[#2E6F5E]',
      iconBgClass: 'bg-[#2E6F5E]/15 text-[#3B8C77]',
      to: ROUTES.TRIPS,
    },
    {
      id: 'companies',
      title: 'شركات النقل المعتمدة',
      value: overview?.companies ?? 0,
      subtitle: 'شركات نقل بين المحافظات',
      badgeText: 'معتمد',
      badgeClass: 'text-[#3B82F6]',
      iconName: 'building',
      accentClass: 'border-t-[#3B82F6]',
      iconBgClass: 'bg-[#163A5F]/20 text-[#3B82F6]',
      to: ROUTES.COMPANIES,
    },
    {
      id: 'totalBookings',
      title: 'إجمالي التذاكر الصادرة',
      value: overview?.totalBookings ?? bookings.length ?? 0,
      subtitle: 'حجز مسجل عبر المنصة',
      badgeText: 'مباشر',
      badgeClass: 'text-[#E05A5A]',
      iconName: 'ticket',
      accentClass: 'border-t-[#B83B3B]',
      iconBgClass: 'bg-[#B83B3B]/15 text-[#E05A5A]',
      to: ROUTES.BOOKINGS,
    },
    {
      id: 'customers',
      title: 'المسافرون المسجلون',
      value: overview?.customers ?? 0,
      subtitle: 'حساب مسافر في مَسار',
      badgeText: 'استعراض ←',
      badgeClass: 'text-primary dark:text-[#C88A32]',
      iconName: 'users',
      accentClass: 'border-t-[#C88A32]',
      iconBgClass: 'bg-[#C88A32]/15 text-[#C88A32]',
      to: ROUTES.USERS,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 reveal">
      {cards.map((card) => (
        <KpiCard key={card.id} {...card} />
      ))}
    </section>
  );
}

export default OverviewKpiGrid;
