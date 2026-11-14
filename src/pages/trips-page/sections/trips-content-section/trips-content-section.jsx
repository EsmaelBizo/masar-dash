import { useState } from 'react';
import { useDashboardStore } from '../../../../store/use-dashboard-store';
import { useToastStore } from '../../../../store/use-toast-store';
import {
  useTripsQuery,
  useCitiesQuery,
  useCompaniesQuery,
  useUpdateTripMutation,
  useDeleteTripMutation,
} from '../../../../hooks/use-dashboard-queries';
import {
  formatDateTimeArabic,
  formatDuration,
  formatMoney,
} from '../../../../lib/formatters';
import { CompanyLogo } from '../../../../components/shared/company-logo/company-logo';
import { StatusBadge } from '../../../../components/shared/status-badge/status-badge';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { EmptyStateCard } from '../../../../components/shared/empty-state-card/empty-state-card';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../components/ui/button';
import { cn } from '../../../../lib/cn';
import { TripSeatsPreviewModal } from './components/trip-seats-preview-modal/trip-seats-preview-modal';

export function TripsContentSection() {
  const filters = useDashboardStore((state) => state.tripsFilters);
  const setFilters = useDashboardStore((state) => state.setTripsFilters);
  const resetFilters = useDashboardStore((state) => state.resetTripsFilters);
  const openTripModal = useDashboardStore((state) => state.openTripModal);
  const openConfirmDialog = useDashboardStore((state) => state.openConfirmDialog);
  const showToast = useToastStore((state) => state.showToast);

  const { data: trips = [], isLoading, isError } = useTripsQuery();
  const { data: cities = [] } = useCitiesQuery();
  const { data: companies = [] } = useCompaniesQuery();

  const updateTripMutation = useUpdateTripMutation();
  const deleteTripMutation = useDeleteTripMutation();

  const [previewTrip, setPreviewTrip] = useState(null);

  const filteredTrips = trips.filter((trip) => {
    const q = filters.search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(trip.code || '').toLowerCase().includes(q) ||
      String(trip.id).includes(q) ||
      String(trip.company?.name || '').toLowerCase().includes(q) ||
      String(trip.origin?.name || '').toLowerCase().includes(q) ||
      String(trip.destination?.name || '').toLowerCase().includes(q);

    const matchesCompany =
      filters.companyId === 'all' ||
      String(trip.companyId) === String(filters.companyId);

    const matchesOrigin =
      filters.originId === 'all' ||
      String(trip.originId) === String(filters.originId);

    const matchesDest =
      filters.destinationId === 'all' ||
      String(trip.destinationId) === String(filters.destinationId);

    const matchesStatus =
      filters.status === 'all' ||
      String(trip.status).toUpperCase() === filters.status;

    return (
      matchesSearch &&
      matchesCompany &&
      matchesOrigin &&
      matchesDest &&
      matchesStatus
    );
  });

  const availableCount = trips.filter(
    (t) => String(t.status).toUpperCase() === 'AVAILABLE'
  ).length;
  const cancelledCount = trips.filter(
    (t) => String(t.status).toUpperCase() === 'CANCELLED'
  ).length;
  const vipCount = trips.filter((t) => t.busClass === 'vip').length;

  const handleToggleTripStatus = async (trip) => {
    const nextStatus =
      String(trip.status).toUpperCase() === 'AVAILABLE'
        ? 'CANCELLED'
        : 'AVAILABLE';
    try {
      await updateTripMutation.mutateAsync({
        id: trip.id,
        status: nextStatus,
      });
      showToast(
        `تم تغيير حالة الرحلة (${trip.code}) إلى ${
          nextStatus === 'AVAILABLE' ? 'متاحة للحجز' : 'ملغاة'
        }.`
      );
    } catch (error) {
      showToast(
        error.response?.data?.message || 'تعذر تغيير حالة الرحلة.',
        'error'
      );
    }
  };

  const handleDeleteTrip = (trip) => {
    openConfirmDialog({
      title: `حذف رحلة البولمان (${trip.code})`,
      description: `هل أنت متأكد من حذف رحلة ${trip.origin?.name} ⟵ ${trip.destination?.name} التابعة لشركة «${trip.company?.name}» نهائياً؟`,
      confirmLabel: 'حذف الرحلة',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteTripMutation.mutateAsync(trip.id);
          showToast(`تم حذف الرحلة (${trip.code}) بنجاح.`);
        } catch (error) {
          showToast(
            error.response?.data?.message ||
              'تعذر حذف الرحلة لوجود حجوزات مرتبطة بها.',
            'error'
          );
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 reveal">
      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#3B82F6]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              إجمالي الرحلات المجدولة
            </span>
            <span className="rounded-xl bg-[#163A5F]/20 p-2.5 text-[#3B82F6]">
              <SairnaIcon name="bus" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-text">
            {trips.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#2E6F5E]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              الرحلات المتاحة للحجز
            </span>
            <span className="rounded-xl bg-[#2E6F5E]/15 p-2.5 text-[#3B8C77]">
              <SairnaIcon name="check-circle" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#3B8C77]">
            {availableCount}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#C88A32]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              بولمانات رجال الأعمال (VIP 2+1)
            </span>
            <span className="rounded-xl bg-[#C88A32]/15 p-2.5 text-[#C88A32]">
              <SairnaIcon name="seat" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#C88A32]">
            {vipCount}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#B83B3B]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              الرحلات الملغاة
            </span>
            <span className="rounded-xl bg-[#B83B3B]/15 p-2.5 text-[#E05A5A]">
              <SairnaIcon name="x-circle" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#E05A5A]">
            {cancelledCount}
          </strong>
        </div>
      </div>

      {/* Filters & Actions Toolbar */}
      <div className="bento-card rounded-3xl p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              FLEET SCHEDULE
            </span>
            <h2 className="m-0 font-heading text-lg font-bold text-text">
              جدول رحلات البولمان بين المحافظات ({filteredTrips.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={resetFilters}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              إعادة ضبط الفلاتر
            </button>
            <button
              type="button"
              onClick={() => openTripModal('create')}
              className={buttonVariants({ variant: 'primary', size: 'sm' })}
            >
              <SairnaIcon name="plus" size={16} /> إضافة رحلة بولمان جديدة
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 max-[1150px]:grid-cols-3 max-[650px]:grid-cols-1 gap-3">
          <div className="flex h-[44px] items-center gap-2 rounded-xl border border-border bg-bg/60 px-3 focus-within:border-[#C88A32]">
            <SairnaIcon name="search" size={16} className="text-[#C88A32]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="ابحث بكود الرحلة أو المدينة..."
              className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
            />
          </div>

          <select
            value={filters.companyId}
            onChange={(e) => setFilters({ companyId: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">جميع شركات النقل</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.originId}
            onChange={(e) => setFilters({ originId: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">من: كل المحافظات</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                من: {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.destinationId}
            onChange={(e) => setFilters({ destinationId: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">إلى: كل المحافظات</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                إلى: {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="h-[44px] rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
          >
            <option value="all">كل الحالات التشغيلية</option>
            <option value="AVAILABLE">AVAILABLE — متاحة</option>
            <option value="CANCELLED">CANCELLED — ملغاة</option>
          </select>
        </div>
      </div>

      {/* Trips Data View */}
      {isLoading ? (
        <LoadingState label="جارٍ تحميل جدول رحلات البولمان من الخادم..." />
      ) : isError ? (
        <EmptyStateCard
          iconName="alert"
          title="تعذر تحميل رحلات البولمان"
          description="تحقق من اتصال الخادم وصلاحيات المشرف ثم أعد المحاولة."
        />
      ) : filteredTrips.length === 0 ? (
        <EmptyStateCard
          iconName="bus"
          title="لا توجد رحلات مطابقة للبحث"
          description="جرّب إعادة ضبط الفلاتر أو أضف رحلة بولمان جديدة بين المحافظات."
          action={
            <button
              type="button"
              onClick={() => openTripModal('create')}
              className={buttonVariants({ variant: 'primary' })}
            >
              <SairnaIcon name="plus" size={17} /> جدولة رحلة جديدة
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
                    <th className="px-5 py-4 whitespace-nowrap">الرمز</th>
                    <th className="px-4 py-4 whitespace-nowrap">شركة النقل</th>
                    <th className="px-4 py-4 whitespace-nowrap">خط السير والكراجات</th>
                    <th className="px-4 py-4 whitespace-nowrap">موعد الانطلاق والوصول</th>
                    <th className="px-4 py-4 whitespace-nowrap">السعة والفئة</th>
                    <th className="px-4 py-4 whitespace-nowrap">السعر</th>
                    <th className="px-4 py-4 whitespace-nowrap">الحالة</th>
                    <th className="px-5 py-4 whitespace-nowrap text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTrips.map((trip) => {
                    const isVip = trip.busClass === 'vip';
                    return (
                      <tr
                        key={trip.id}
                        className="transition-colors hover:bg-[#C88A32]/[0.04]"
                      >
                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <strong
                            dir="ltr"
                            className="font-num block text-xs font-bold text-[#C88A32]"
                          >
                            {trip.code}
                          </strong>
                          <small className="font-tabular text-[10px] text-muted">
                            #{trip.id}
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-2.5 min-w-[150px]">
                            <CompanyLogo company={trip.company} size="tiny" />
                            <div className="min-w-0">
                              <b className="block truncate text-text">
                                {trip.company?.name}
                              </b>
                              <small className="text-[10px] text-muted">
                                شركة #{trip.companyId}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-1.5 whitespace-nowrap font-heading text-xs font-bold text-text">
                            <span>{trip.origin?.name}</span>
                            <SairnaIcon
                              name="arrow-left"
                              size={14}
                              className="text-[#C88A32]"
                            />
                            <span>{trip.destination?.name}</span>
                          </div>
                          <small className="block truncate max-w-[210px] text-[10px] text-muted">
                            {trip.origin?.terminal} ⟵ {trip.destination?.terminal}
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <b className="block font-tabular text-text">
                            {formatDateTimeArabic(trip.departureAt)}
                          </b>
                          <small className="font-tabular text-[10px] text-muted">
                            الوصول: {trip.arrivalTime} ({formatDuration(trip.duration)})
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                              isVip
                                ? 'bg-[#C88A32]/15 text-[#C88A32]'
                                : 'bg-[#2E6F5E]/15 text-[#3B8C77]'
                            )}
                          >
                            {isVip ? 'VIP 2+1' : 'سياحي 2+2'}
                          </span>
                          <small className="mt-1 block font-tabular font-bold text-text">
                            {trip.totalSeats} مقعداً
                          </small>
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <b className="font-num text-xs font-bold text-[#C88A32]">
                            {formatMoney(trip.price)}
                          </b>
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <StatusBadge status={trip.status} />
                        </td>

                        <td className="px-5 py-4 align-middle whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewTrip(trip)}
                              className="inline-flex items-center gap-1 rounded-lg border border-border-gold px-2.5 py-1.5 text-[11px] font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
                              title="معاينة مخطط مقاعد البولمان"
                            >
                              <SairnaIcon name="seat" size={13} />
                              <span>المقاعد</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openTripModal('edit', trip)}
                              className={buttonVariants({
                                variant: 'outline',
                                size: 'xs',
                              })}
                              title="تعديل بيانات الرحلة"
                            >
                              <SairnaIcon name="edit" size={13} /> تعديل
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleTripStatus(trip)}
                              className={buttonVariants({
                                variant: 'subtle',
                                size: 'xs',
                              })}
                              title="تبديل حالة الإتاحة / الإلغاء"
                            >
                              <SairnaIcon name="refresh" size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTrip(trip)}
                              className={buttonVariants({
                                variant: 'softDanger',
                                size: 'xs',
                              })}
                              title="حذف الرحلة"
                            >
                              <SairnaIcon name="trash" size={13} />
                            </button>
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
            {filteredTrips.map((trip) => {
              const isVip = trip.busClass === 'vip';
              return (
                <div
                  key={trip.id}
                  className="bento-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CompanyLogo company={trip.company} size="tiny" />
                      <div className="min-w-0">
                        <strong
                          dir="ltr"
                          className="font-num block text-xs font-bold text-[#C88A32]"
                        >
                          {trip.code}
                        </strong>
                        <span className="block truncate text-xs font-bold text-text">
                          {trip.company?.name}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={trip.status} />
                  </div>

                  <div className="rounded-xl border border-border bg-bg/60 p-3">
                    <div className="flex items-center justify-between text-xs font-bold text-text">
                      <span>{trip.origin?.name}</span>
                      <SairnaIcon
                        name="arrow-left"
                        size={14}
                        className="text-[#C88A32]"
                      />
                      <span>{trip.destination?.name}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
                      <span>{formatDateTimeArabic(trip.departureAt)}</span>
                      <span className="font-num">
                        {formatDuration(trip.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[10px] font-bold',
                          isVip
                            ? 'bg-[#C88A32]/15 text-[#C88A32]'
                            : 'bg-[#2E6F5E]/15 text-[#3B8C77]'
                        )}
                      >
                        {isVip ? 'VIP 2+1' : 'سياحي 2+2'}
                      </span>
                      <span className="font-tabular text-[11px] text-muted">
                        {trip.totalSeats} مقعداً
                      </span>
                    </div>
                    <b className="font-num text-sm font-bold text-[#C88A32]">
                      {formatMoney(trip.price)}
                    </b>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => setPreviewTrip(trip)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-gold px-3 py-2 text-xs font-bold text-text hover:bg-[#C88A32] hover:text-white"
                    >
                      <SairnaIcon name="seat" size={14} /> المقاعد
                    </button>
                    <button
                      type="button"
                      onClick={() => openTripModal('edit', trip)}
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'xs',
                      })}
                    >
                      <SairnaIcon name="edit" size={13} /> تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleTripStatus(trip)}
                      className={buttonVariants({
                        variant: 'subtle',
                        size: 'xs',
                      })}
                    >
                      <SairnaIcon name="refresh" size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTrip(trip)}
                      className={buttonVariants({
                        variant: 'softDanger',
                        size: 'xs',
                      })}
                    >
                      <SairnaIcon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TripSeatsPreviewModal
        trip={previewTrip}
        onClose={() => setPreviewTrip(null)}
        onEditTrip={(t) => openTripModal('edit', t)}
      />
    </div>
  );
}

export default TripsContentSection;
