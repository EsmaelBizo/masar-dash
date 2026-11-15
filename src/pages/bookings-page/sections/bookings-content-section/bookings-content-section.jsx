import { useDashboardStore } from '../../../../store/use-dashboard-store';
import { useToastStore } from '../../../../store/use-toast-store';
import {
  useBookingsQuery,
  useTripsQuery,
  useCompaniesQuery,
  useCancelBookingMutation,
} from '../../../../hooks/use-dashboard-queries';
import { formatDateTimeArabic, formatMoney } from '../../../../lib/formatters';
import { CompanyLogo } from '../../../../components/shared/company-logo/company-logo';
import { StatusBadge } from '../../../../components/shared/status-badge/status-badge';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { EmptyStateCard } from '../../../../components/shared/empty-state-card/empty-state-card';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../components/ui/button';
import { cn } from '../../../../lib/cn';

export function BookingsContentSection() {
  const filters = useDashboardStore((state) => state.bookingsFilters);
  const setFilters = useDashboardStore((state) => state.setBookingsFilters);
  const resetFilters = useDashboardStore((state) => state.resetBookingsFilters);
  const openBookingModal = useDashboardStore((state) => state.openBookingModal);
  const openUserModal = useDashboardStore((state) => state.openUserModal);
  const openConfirmDialog = useDashboardStore(
    (state) => state.openConfirmDialog
  );
  const showToast = useToastStore((state) => state.showToast);

  const { data: bookings = [], isLoading, isError } = useBookingsQuery();
  const { data: trips = [] } = useTripsQuery();
  const { data: companies = [] } = useCompaniesQuery();
  const cancelMutation = useCancelBookingMutation();

  const now = Date.now();
  const getBookingDepartureAt = (booking) =>
    booking?.trip?.departureAt ||
    booking?.departureAt ||
    trips.find((t) => String(t.id) === String(booking?.tripId))?.departureAt ||
    null;

  const isBookingUpcoming = (booking) => {
    const departureAt = getBookingDepartureAt(booking);
    if (!departureAt) return false;
    const depTime = new Date(departureAt).getTime();
    return !Number.isNaN(depTime) && depTime >= now;
  };

  const upcomingBookingsCount = bookings.filter(isBookingUpcoming).length;

  const filteredBookings = bookings.filter((booking) => {
    const q = filters.search.trim().toLowerCase();
    const passengerNames = (booking.seats || [])
      .map((s) => s.passengerName)
      .join(' ')
      .toLowerCase();
    const passengerPhones = (booking.seats || [])
      .map((s) => s.passengerPhone)
      .join(' ');

    const matchesSearch =
      !q ||
      String(booking.code || '').toLowerCase().includes(q) ||
      String(booking.id).includes(q) ||
      String(booking.user?.name || '').toLowerCase().includes(q) ||
      String(booking.user?.email || '').toLowerCase().includes(q) ||
      passengerNames.includes(q) ||
      passengerPhones.includes(q) ||
      String(booking.origin?.name || '').toLowerCase().includes(q) ||
      String(booking.destination?.name || '').toLowerCase().includes(q);

    const matchesStatus =
      filters.status === 'all' ||
      String(booking.status).toUpperCase() === filters.status;

    const matchesCompany =
      filters.companyId === 'all' ||
      String(booking.company?.id) === String(filters.companyId);

    const matchesUpcoming =
      !filters.upcomingOnly || isBookingUpcoming(booking);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCompany &&
      matchesUpcoming
    );
  });

  const confirmedBookings = bookings.filter(
    (b) => String(b.status).toUpperCase() === 'CONFIRMED'
  );
  const cancelledBookings = bookings.filter(
    (b) => String(b.status).toUpperCase() === 'CANCELLED'
  );
  const totalConfirmedRevenue = confirmedBookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  const handleCancelBooking = (booking) => {
    openConfirmDialog({
      title: `إلغاء تذكرة الحجز (${booking.code})`,
      description: `هل أنت متأكد من إلغاء حجز المسافر «${booking.user?.name}» على رحلة ${booking.origin?.name} ⟵ ${booking.destination?.name} وتحرير المقاعد المحجوزة؟`,
      confirmLabel: 'تأكيد الإلغاء',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await cancelMutation.mutateAsync(booking.id);
          showToast(`تم إلغاء الحجز (${booking.code}) بنجاح.`);
        } catch (error) {
          showToast(
            error.response?.data?.message || 'تعذر إلغاء الحجز.',
            'error'
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 reveal">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#3B82F6]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              إجمالي الحجوزات المسجلة
            </span>
            <span className="rounded-xl bg-[#163A5F]/20 p-2.5 text-[#3B82F6]">
              <SairnaIcon name="ticket" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-text">
            {bookings.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#2E6F5E]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              التذاكر المؤكدة الصالحة
            </span>
            <span className="rounded-xl bg-[#2E6F5E]/15 p-2.5 text-[#3B8C77]">
              <SairnaIcon name="check-circle" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#3B8C77]">
            {confirmedBookings.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#B83B3B]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              الحجوزات الملغاة
            </span>
            <span className="rounded-xl bg-[#B83B3B]/15 p-2.5 text-[#E05A5A]">
              <SairnaIcon name="x-circle" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#E05A5A]">
            {cancelledBookings.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#C88A32]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              إجمالي الإيرادات المؤكدة
            </span>
            <span className="rounded-xl bg-[#C88A32]/15 p-2.5 text-[#C88A32]">
              <SairnaIcon name="wallet" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-xl sm:text-2xl font-extrabold text-[#C88A32]">
            {formatMoney(totalConfirmedRevenue)}
          </strong>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bento-card rounded-3xl p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              E-TICKET REGISTRY
            </span>
            <h2 className="m-0 font-heading text-lg font-bold text-text">
              سجل الحجوزات والتذاكر الإلكترونية ({filteredBookings.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            إعادة ضبط البحث
          </button>
        </div>

        <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 max-[650px]:grid-cols-1 gap-3">
          <div className="flex h-[44px] items-center gap-2 rounded-xl border border-border bg-bg/60 px-3.5 focus-within:border-[#C88A32]">
            <SairnaIcon name="search" size={16} className="text-[#C88A32]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="ابحث بكود الحجز (SR-...) أو اسم المسافر أو الهاتف..."
              className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3.5 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">جميع حالات الحجز ({bookings.length})</option>
            <option value="CONFIRMED">
              مؤكدة ({confirmedBookings.length})
            </option>
            <option value="CANCELLED">
              ملغاة ({cancelledBookings.length})
            </option>
          </select>

          <select
            value={filters.companyId}
            onChange={(e) => setFilters({ companyId: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3.5 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">جميع شركات النقل</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFilters({ upcomingOnly: !filters.upcomingOnly })}
            aria-pressed={Boolean(filters.upcomingOnly)}
            className={cn(
              'flex h-[44px] items-center justify-between gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all duration-200 cursor-pointer',
              filters.upcomingOnly
                ? 'border-[#C88A32] bg-[#C88A32]/15 text-[#C88A32] shadow-sm shadow-[#C88A32]/15'
                : 'border-border bg-bg/60 text-text hover:border-[#C88A32]/60'
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <SairnaIcon
                name="clock"
                size={15}
                className={
                  filters.upcomingOnly ? 'text-[#C88A32]' : 'text-muted'
                }
              />
              <span className="truncate">الحجوزات القادمة فقط</span>
            </span>
            <span
              className={cn(
                'font-num inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors',
                filters.upcomingOnly
                  ? 'bg-[#C88A32] text-white'
                  : 'bg-surface text-muted border border-border'
              )}
            >
              {upcomingBookingsCount}
            </span>
          </button>
        </div>
      </div>

      {/* Bookings Data View */}
      {isLoading ? (
        <LoadingState label="جارٍ تحميل سجل الحجوزات والتذاكر..." />
      ) : isError ? (
        <EmptyStateCard
          iconName="alert"
          title="تعذر تحميل الحجوزات"
          description="تحقق من الاتصال وصلاحية الدخول."
        />
      ) : filteredBookings.length === 0 ? (
        <EmptyStateCard
          iconName="ticket"
          title="لا توجد حجوزات مطابقة للفلتر"
          description="جرّب تغيير كلمات البحث أو حالة الحجز لاستعراض التذاكر."
          action={
            <button
              type="button"
              onClick={resetFilters}
              className={buttonVariants({ variant: 'primary' })}
            >
              عرض كافة الحجوزات
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop & Tablet Architectural Table */}
          <div className="hidden md:block bento-card overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right text-xs">
                <thead>
                  <tr className="border-b border-border bg-bg/80 text-[11px] font-bold text-muted">
                    <th className="px-5 py-4 whitespace-nowrap">رقم التذكرة</th>
                    <th className="px-4 py-4 whitespace-nowrap">المسافر</th>
                    <th className="px-4 py-4 whitespace-nowrap">المسار</th>
                    <th className="px-4 py-4 whitespace-nowrap">الشركة</th>
                    <th className="px-4 py-4 whitespace-nowrap">المقاعد</th>
                    <th className="px-4 py-4 whitespace-nowrap">الإجمالي</th>
                    <th className="px-4 py-4 whitespace-nowrap">الحالة</th>
                    <th className="px-5 py-4 whitespace-nowrap text-left">التذكرة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => {
                    const isConfirmed =
                      String(booking.status).toUpperCase() === 'CONFIRMED';
                    const departureAt = getBookingDepartureAt(booking);

                    return (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-[#C88A32]/[0.04]"
                      >
                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <strong
                            dir="ltr"
                            className="font-num block text-xs font-bold text-[#C88A32]"
                          >
                            {booking.code}
                          </strong>
                          <small className="font-tabular text-[10px] text-muted">
                            #{booking.id} · {formatDateTimeArabic(booking.createdAt)}
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <button
                            type="button"
                            onClick={() => openUserModal(booking.user)}
                            className="text-right hover:text-[#C88A32]"
                          >
                            <b className="block whitespace-nowrap text-text">
                              {booking.user?.name}
                            </b>
                            <small
                              dir="ltr"
                              className="block truncate max-w-[160px] font-tabular text-[11px] text-muted"
                            >
                              {booking.user?.email}
                            </small>
                          </button>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-1.5 whitespace-nowrap font-heading text-xs font-bold text-text">
                            <span>{booking.origin?.name}</span>
                            <SairnaIcon
                              name="arrow-left"
                              size={14}
                              className="text-[#C88A32]"
                            />
                            <span>{booking.destination?.name}</span>
                          </div>
                          <small className="block whitespace-nowrap font-tabular text-[10px] text-muted">
                            {booking.trip?.code || `رحلة #${booking.tripId}`} ·{' '}
                            {formatDateTimeArabic(departureAt)}
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <CompanyLogo company={booking.company} size="tiny" />
                            <b className="truncate text-text">
                              {booking.company?.name}
                            </b>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {booking.seats?.map((s, idx) => (
                              <span
                                key={s.id || idx}
                                dir="ltr"
                                title={`${s.passengerName} (${s.passengerPhone})`}
                                className="font-num rounded-md border border-[#C88A32]/30 bg-[#C88A32]/15 px-2 py-0.5 text-[11px] font-bold text-[#C88A32]"
                              >
                                #{s.seatNumber}
                              </span>
                            ))}
                          </div>
                          {booking.seats?.[0] && (
                            <small className="mt-0.5 block truncate max-w-[140px] text-[10px] text-muted">
                              {booking.seats[0].passengerName}
                            </small>
                          )}
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <b className="font-num text-xs font-bold text-[#3B8C77]">
                            {formatMoney(booking.totalPrice)}
                          </b>
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <StatusBadge status={booking.status} />
                        </td>

                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openBookingModal(booking)}
                              className="rounded-lg border border-border-gold px-3 py-1.5 text-[11px] font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
                            >
                              عرض التذكرة
                            </button>

                            {isConfirmed && (
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(booking)}
                                className={buttonVariants({
                                  variant: 'softDanger',
                                  size: 'xs',
                                })}
                                title="إلغاء الحجز وتحرير المقاعد"
                              >
                                <SairnaIcon name="ban" size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Bento Cards */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredBookings.map((booking) => {
              const isConfirmed =
                String(booking.status).toUpperCase() === 'CONFIRMED';
              const departureAt = getBookingDepartureAt(booking);
              return (
                <div
                  key={booking.id}
                  className="bento-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <strong
                        dir="ltr"
                        className="font-num block text-xs font-bold text-[#C88A32]"
                      >
                        {booking.code}
                      </strong>
                      <span className="text-xs font-bold text-text">
                        {booking.user?.name}
                      </span>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="rounded-xl border border-border bg-bg/60 p-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-text">
                      <span>{booking.origin?.name}</span>
                      <SairnaIcon
                        name="arrow-left"
                        size={14}
                        className="text-[#C88A32]"
                      />
                      <span>{booking.destination?.name}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
                      <span>{booking.company?.name}</span>
                      <span className="font-tabular">
                        {formatDateTimeArabic(departureAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {booking.seats?.map((s, idx) => (
                        <span
                          key={s.id || idx}
                          dir="ltr"
                          className="font-num rounded-md border border-[#C88A32]/30 bg-[#C88A32]/15 px-2 py-0.5 text-[11px] font-bold text-[#C88A32]"
                        >
                          #{s.seatNumber}
                        </span>
                      ))}
                    </div>
                    <b className="font-num text-sm font-bold text-[#3B8C77]">
                      {formatMoney(booking.totalPrice)}
                    </b>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => openBookingModal(booking)}
                      className="flex-1 rounded-xl border border-border-gold px-3 py-2 text-xs font-bold text-text hover:bg-[#C88A32] hover:text-white"
                    >
                      عرض التذكرة الرقمية
                    </button>
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking)}
                        className={buttonVariants({
                          variant: 'softDanger',
                          size: 'xs',
                        })}
                      >
                        <SairnaIcon name="ban" size={14} /> إلغاء
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default BookingsContentSection;
