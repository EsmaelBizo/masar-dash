import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../../../constants/routes';
import { useDashboardStore } from '../../../../../../store/use-dashboard-store';
import { formatDateTimeArabic, formatMoney } from '../../../../../../lib/formatters';
import { CompanyLogo } from '../../../../../../components/shared/company-logo/company-logo';
import { StatusBadge } from '../../../../../../components/shared/status-badge/status-badge';
import { SairnaIcon } from '../../../../../../components/ui/sairna-icon';

export function OverviewRecentTables({ trips = [], bookings = [] }) {
  const openBookingModal = useDashboardStore((state) => state.openBookingModal);
  const openTripModal = useDashboardStore((state) => state.openTripModal);

  const recentBookings = bookings.slice(0, 5);
  const recentTrips = trips.slice(0, 5);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 reveal">
      {/* Recent Bookings */}
      <div className="bento-card rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-bg/40 px-6 py-4">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              RECENT TICKETS
            </span>
            <h3 className="m-0 font-heading text-lg font-bold text-text">
              أحدث الحجوزات الصادرة
            </h3>
          </div>
          <Link
            to={ROUTES.BOOKINGS}
            className="shrink-0 text-xs font-bold text-[#C88A32] hover:underline"
          >
            عرض الكل ←
          </Link>
        </div>

        <div className="divide-y divide-border">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-[#C88A32]/[0.04]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#163A5F] to-[#0B1929] border border-[#C88A32]/30 text-[#C88A32]">
                  <SairnaIcon name="ticket" size={17} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <b dir="ltr" className="font-num text-xs font-bold text-[#C88A32]">
                      {booking.code}
                    </b>
                    <span className="truncate text-xs font-bold text-text">
                      {booking.origin?.name} ⟵ {booking.destination?.name}
                    </span>
                  </div>
                  <small className="block truncate text-[11px] text-muted">
                    {booking.user?.name} · مقعد: {booking.seatNumbers?.join(', ') || '—'}
                  </small>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                  <b className="font-tabular whitespace-nowrap text-xs font-bold text-[#3B8C77]">
                    {formatMoney(booking.totalPrice)}
                  </b>
                  <StatusBadge status={booking.status} />
                </div>
                <button
                  type="button"
                  onClick={() => openBookingModal(booking)}
                  className="shrink-0 whitespace-nowrap rounded-lg border border-border-gold px-3 py-1.5 text-[11px] font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
                >
                  معاينة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bento-card rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-bg/40 px-6 py-4">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              ACTIVE SCHEDULE
            </span>
            <h3 className="m-0 font-heading text-lg font-bold text-text">
              أحدث رحلات البولمان المجدولة
            </h3>
          </div>
          <Link
            to={ROUTES.TRIPS}
            className="shrink-0 text-xs font-bold text-[#C88A32] hover:underline"
          >
            عرض الكل ←
          </Link>
        </div>

        <div className="divide-y divide-border">
          {recentTrips.map((trip) => (
            <div
              key={trip.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-[#C88A32]/[0.04]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CompanyLogo company={trip.company} size="pick" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-heading text-xs font-bold text-text">
                      {trip.origin?.name} ⟵ {trip.destination?.name}
                    </span>
                    <small
                      dir="ltr"
                      className="font-num rounded bg-[#C88A32]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#C88A32]"
                    >
                      {trip.code}
                    </small>
                  </div>
                  <small className="block truncate text-[11px] text-muted">
                    {trip.company?.name} · {formatDateTimeArabic(trip.departureAt)}
                  </small>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5">
                  <b className="font-tabular whitespace-nowrap text-xs font-bold text-[#C88A32]">
                    {formatMoney(trip.price)}
                  </b>
                  <small className="font-tabular whitespace-nowrap text-[10px] font-bold text-[#3B8C77]">
                    {trip.totalSeats} مقعداً
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => openTripModal('edit', trip)}
                  className="shrink-0 whitespace-nowrap rounded-lg border border-border-gold px-3 py-1.5 text-[11px] font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
                >
                  تعديل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OverviewRecentTables;
