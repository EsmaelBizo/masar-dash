import { useEffect } from 'react';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import {
  useUserDetailQuery,
  useBookingsQuery,
} from '../../../hooks/use-dashboard-queries';
import { formatDateTimeArabic, formatMoney } from '../../../lib/formatters';
import { StatusBadge } from '../status-badge/status-badge';
import { SairnaIcon } from '../../ui/sairna-icon';
import { buttonVariants } from '../../ui/button';

export function UserDetailModal() {
  const activeUserModal = useDashboardStore((state) => state.activeUserModal);
  const closeUserModal = useDashboardStore((state) => state.closeUserModal);
  const openBookingModal = useDashboardStore((state) => state.openBookingModal);

  const { data: fetchedUser } = useUserDetailQuery(activeUserModal?.id);
  const { data: allBookings = [] } = useBookingsQuery();

  useEffect(() => {
    if (!activeUserModal) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeUserModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeUserModal, closeUserModal]);

  if (!activeUserModal) return null;

  const user = fetchedUser || activeUserModal;
  const userBookings = allBookings.filter(
    (b) =>
      String(b.userId) === String(user.id) ||
      (user.email && b.user?.email === user.email)
  );
  const totalSpent = userBookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div
      className="fixed inset-0 z-[210] grid animate-fade place-items-center overflow-y-auto bg-[rgba(22,58,95,0.68)] p-4 backdrop-blur-[5px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeUserModal();
      }}
    >
      <div
        className="animate-pop relative my-auto flex max-h-[calc(100dvh-32px)] w-[min(560px,100%)] flex-col overflow-hidden rounded-[22px] border border-border bg-surface shadow-card-md"
        role="dialog"
        aria-modal="true"
        aria-label="ملف المستخدم وتفاصيل الحجوزات"
      >
        <div className="ablaq-ribbon ablaq-ribbon-animated" aria-hidden="true" />

        <div className="flex items-center justify-between bg-navy px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl border border-accent/40 bg-white/10 font-heading text-[18px] font-bold text-accent">
              {(user.name || 'م')[0]}
            </span>
            <div>
              <h3 className="m-0 font-heading text-[17px] font-bold">
                {user.name}
              </h3>
              <small dir="ltr" className="font-tabular text-[11px] text-[#DCE6F0]">
                {user.email} · ID #{user.id}
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={closeUserModal}
            className="grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-accent"
            aria-label="إغلاق"
          >
            <SairnaIcon name="x" size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 max-[650px]:p-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 max-[650px]:grid-cols-1 gap-3">
            <div className="rounded-xl border border-border bg-surface-alt/60 p-3.5">
              <small className="block text-[10px] text-muted">صلاحية الحساب</small>
              <div className="mt-1.5">
                <StatusBadge status={user.role} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface-alt/60 p-3.5">
              <small className="block text-[10px] text-muted">إجمالي الحجوزات</small>
              <strong className="mt-1 block font-tabular text-[18px] text-primary dark:text-accent">
                {userBookings.length} تذكرة
              </strong>
            </div>
            <div className="rounded-xl border border-border bg-surface-alt/60 p-3.5">
              <small className="block text-[10px] text-muted">إجمالي المدفوعات المؤكدة</small>
              <strong className="mt-1 block font-tabular text-[15px] text-secondary">
                {formatMoney(totalSpent)}
              </strong>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">تاريخ انضمام المسافر</span>
              <b className="font-tabular text-text">
                {formatDateTimeArabic(user.createdAt)}
              </b>
            </div>
          </div>

          <div>
            <h4 className="mb-2.5 font-heading text-[14px] font-bold text-text">
              سجل حجوزات المسافر ({userBookings.length})
            </h4>
            {userBookings.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {userBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-alt/50 px-3.5 py-2.5 text-[12px]"
                  >
                    <div>
                      <b
                        dir="ltr"
                        className="font-tabular text-[13px] text-primary dark:text-accent"
                      >
                        {booking.code}
                      </b>
                      <span className="mx-2 text-muted">·</span>
                      <span className="font-bold text-text">
                        {booking.origin?.name} ⟵ {booking.destination?.name}
                      </span>
                      <small className="block text-[11px] text-muted">
                        {booking.company?.name} · {formatMoney(booking.totalPrice)}
                      </small>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={booking.status} />
                      <button
                        type="button"
                        onClick={() => {
                          closeUserModal();
                          openBookingModal(booking);
                        }}
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'xs',
                        })}
                      >
                        التذكرة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-surface-alt p-4 text-center text-[12px] text-muted">
                لا توجد حجوزات مسجلة لهذا الحساب حتى الآن.
              </p>
            )}
          </div>

          <div className="flex justify-end border-t border-border pt-3">
            <button
              type="button"
              onClick={closeUserModal}
              className={buttonVariants({ variant: 'primary', size: 'sm' })}
            >
              إغلاق البطاقة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
