import { useEffect } from 'react';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import { useToastStore } from '../../../store/use-toast-store';
import { useCancelBookingMutation } from '../../../hooks/use-dashboard-queries';
import { formatDateArabic, formatDateTimeArabic, formatMoney } from '../../../lib/formatters';
import { CompanyLogo } from '../company-logo/company-logo';
import { StatusBadge } from '../status-badge/status-badge';
import { SairnaIcon } from '../../ui/sairna-icon';
import { buttonVariants } from '../../ui/button';
import { cn } from '../../../lib/cn';
import { TicketQrCode } from './components/ticket-qr-code/ticket-qr-code';

export function TicketModal() {
  const activeBookingModal = useDashboardStore((state) => state.activeBookingModal);
  const closeBookingModal = useDashboardStore((state) => state.closeBookingModal);
  const openConfirmDialog = useDashboardStore((state) => state.openConfirmDialog);
  const showToast = useToastStore((state) => state.showToast);
  const cancelMutation = useCancelBookingMutation();

  useEffect(() => {
    if (!activeBookingModal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeBookingModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeBookingModal, closeBookingModal]);

  if (!activeBookingModal) return null;

  const booking = activeBookingModal;
  const company = booking.company || {};
  const origin = booking.origin || {};
  const destination = booking.destination || {};
  const isConfirmed = String(booking.status).toUpperCase() === 'CONFIRMED';

  const handleCopyCode = () => {
    const code = booking.code || `#${booking.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => showToast(`تم نسخ رقم الحجز المرجعي (${code}).`))
        .catch(() => showToast(`رقم الحجز: ${code}`));
    } else {
      showToast(`رقم الحجز: ${code}`);
    }
  };

  const handleCancelBooking = () => {
    openConfirmDialog({
      title: `إلغاء الحجز ${booking.code}`,
      description:
        'هل أنت متأكد من إلغاء هذا الحجز وتحرير المقاعد المحجوزة في البولمان؟ سينعكس هذا التحديث مباشرة في حساب المسافر.',
      confirmLabel: 'تأكيد إلغاء الحجز',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await cancelMutation.mutateAsync(booking.id);
          showToast(`تم إلغاء الحجز ${booking.code} بنجاح.`);
          closeBookingModal();
        } catch (error) {
          showToast(
            error.response?.data?.message || 'تعذر إلغاء الحجز حالياً.',
            'error'
          );
        }
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid animate-fade place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBookingModal();
      }}
    >
      <div
        className="reveal relative my-auto flex max-h-[calc(100dvh-32px)] w-[min(600px,100%)] flex-col overflow-hidden rounded-3xl border border-[#C88A32]/40 bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="تفاصيل تذكرة صعود مَسار الرقمية"
      >
        <div className="ablaq-kinetic shrink-0" aria-hidden="true" />

        {/* Ticket Hero Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#163A5F] to-[#0B1929] p-6 text-white">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
                MASAR E-TICKET
              </span>
              <h3 dir="ltr" className="mt-1 font-heading text-xl font-bold text-right">
                {booking.code}
              </h3>
            </div>
            <div className="flex items-center gap-2.5">
              <StatusBadge status={booking.status} />
              <button
                type="button"
                onClick={closeBookingModal}
                className="grid size-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="إغلاق"
              >
                <SairnaIcon name="x" size={16} />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-white/70">الانطلاق</span>
              <p className="m-0 font-heading text-lg font-bold text-white">
                {origin.name || 'دمشق'}
              </p>
              <small className="text-[10px] text-white/60">
                {origin.terminal || 'كراج القابون الدولي'}
              </small>
            </div>
            <div className="mx-4 flex flex-1 justify-center border-b border-dashed border-[#C88A32]/60 relative">
              <span className="-mb-2.5 bg-[#112A46] px-2.5 text-[11px] font-bold text-[#C88A32]">
                {booking.trip?.code || 'بولمان مباشر'}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-white/70">الوصول</span>
              <p className="m-0 font-heading text-lg font-bold text-white">
                {destination.name || 'حلب'}
              </p>
              <small className="text-[10px] text-white/60">
                {destination.terminal || 'كراج الراموسة'}
              </small>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-6 max-[650px]:p-4">
          <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-3 text-xs">
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg/60 p-3">
              <CompanyLogo company={company} size="tiny" />
              <div className="min-w-0">
                <span className="block text-[11px] text-muted">شركة النقل</span>
                <strong className="mt-0.5 block truncate text-sm font-bold text-text">
                  {company.name}
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg/60 p-3">
              <span className="block text-[11px] text-muted">المسافر</span>
              <strong className="mt-0.5 block text-sm font-bold text-text">
                {booking.user?.name}
              </strong>
              <span dir="ltr" className="font-tabular text-[11px] text-muted">
                {booking.user?.email}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-bg/60 p-3">
              <span className="block text-[11px] text-muted">تاريخ الانطلاق</span>
              <strong className="mt-0.5 block font-tabular text-xs font-bold text-text">
                {booking.trip?.departureAt
                  ? formatDateTimeArabic(booking.trip.departureAt)
                  : formatDateArabic(booking.createdAt)}
              </strong>
            </div>

            <div className="rounded-xl border border-border bg-bg/60 p-3">
              <span className="block text-[11px] text-muted">الإجمالي</span>
              <strong className="mt-0.5 block font-num text-sm font-bold text-[#3B8C77]">
                {formatMoney(booking.totalPrice)}
              </strong>
            </div>
          </div>

          {/* Passengers & Seats List */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-heading text-xs font-bold text-text">
              <SairnaIcon name="seat" size={16} className="text-[#C88A32]" />
              المقاعد والمسافرون المسجلون ({booking.seats?.length || 0})
            </h4>
            {booking.seats?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {booking.seats.map((seat, idx) => (
                  <div
                    key={seat.id || idx}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg/50 px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-tabular grid size-7 place-items-center rounded-lg bg-[#163A5F] text-[11px] font-bold text-[#C88A32]">
                        {seat.seatNumber}
                      </span>
                      <div>
                        <b className="block text-text">{seat.passengerName}</b>
                        <span
                          dir="ltr"
                          className="font-tabular text-[11px] text-muted"
                        >
                          {seat.passengerPhone}
                        </span>
                      </div>
                    </div>
                    <span
                      dir="ltr"
                      className="font-tabular rounded-lg border border-[#C88A32]/30 bg-[#C88A32]/15 px-2.5 py-1 text-[11px] font-bold text-[#C88A32]"
                    >
                      Seat #{seat.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-bg/50 p-3 text-xs text-muted">
                لا توجد تفاصيل مقاعد مرفقة بهذا الحجز.
              </p>
            )}
          </div>

          {/* QR Code & Timestamps */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-border-gold bg-bg/60 p-4">
            <div className="text-xs">
              <p className="m-0 font-bold text-text">رمز الصعود الرقمي</p>
              <p className="mt-1 mb-0 text-[11px] text-muted">
                تاريخ الإنشاء: {formatDateTimeArabic(booking.createdAt)}
              </p>
              {booking.cancelledAt && (
                <span className="mt-1 block text-[11px] font-bold text-danger">
                  تاريخ الإلغاء: {formatDateTimeArabic(booking.cancelledAt)}
                </span>
              )}
            </div>
            <TicketQrCode />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'primary' }), 'flex-1')}
              onClick={handleCopyCode}
            >
              <SairnaIcon name="copy" size={16} /> نسخ كود الحجز ({booking.code})
            </button>
            {isConfirmed && (
              <button
                type="button"
                className={cn(buttonVariants({ variant: 'softDanger' }))}
                onClick={handleCancelBooking}
                disabled={cancelMutation.isPending}
              >
                <SairnaIcon name="ban" size={16} /> إلغاء الحجز
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
