import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  useTripDetailQuery,
  useBookingsQuery,
} from '../../../../../../hooks/use-dashboard-queries';
import { formatDateTimeArabic, formatMoney } from '../../../../../../lib/formatters';
import { CompanyLogo } from '../../../../../../components/shared/company-logo/company-logo';
import { StatusBadge } from '../../../../../../components/shared/status-badge/status-badge';
import { SairnaIcon } from '../../../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../../../components/ui/button';
import { cn } from '../../../../../../lib/cn';

export function TripSeatsPreviewModal({ trip, onClose, onEditTrip }) {
  const { data: detailedTrip } = useTripDetailQuery(trip?.id);
  const { data: allBookings = [] } = useBookingsQuery();

  useEffect(() => {
    if (!trip) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [trip, onClose]);

  if (!trip) return null;

  const activeTrip = detailedTrip || trip;
  const totalSeats = Number(activeTrip.totalSeats || 40);
  const isVip = totalSeats <= 32;
  const colsPerRow = isVip ? 3 : 4;
  const rowCount = Math.ceil(totalSeats / colsPerRow);

  const tripBookings = allBookings.filter(
    (b) =>
      String(b.tripId) === String(activeTrip.id) &&
      String(b.status).toUpperCase() === 'CONFIRMED'
  );
  const seatPassengerMap = new Map();
  tripBookings.forEach((b) => {
    (b.seats || []).forEach((s) => {
      seatPassengerMap.set(Number(s.seatNumber), {
        passengerName: s.passengerName,
        passengerPhone: s.passengerPhone,
        bookingCode: b.code,
      });
    });
  });

  const bookedCount =
    seatPassengerMap.size || activeTrip.bookedSeatsCount || 0;
  const availableCount = Math.max(0, totalSeats - bookedCount);

  return createPortal(
    (
    <div
      className="fixed inset-0 z-[210] grid animate-fade place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="reveal relative my-auto flex max-h-[calc(100dvh-32px)] w-[min(780px,100%)] flex-col overflow-hidden rounded-3xl border border-border-gold bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="مخطط مقاعد البولمان وتفاصيل الرحلة"
      >
        <div className="ablaq-kinetic shrink-0" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              INTERACTIVE CABIN TELEMETRY
            </span>
            <h3 className="m-0 mt-0.5 font-heading text-lg font-bold text-text">
              مخطط مقاعد البولمان — رحلة {activeTrip.code}
            </h3>
            <p className="m-0 mt-1 text-xs text-muted">
              {activeTrip.origin?.name} ⟵ {activeTrip.destination?.name} ·{' '}
              {isVip ? 'فئة رجال الأعمال VIP (2+1)' : 'بولمان سياحي (2+2)'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-text transition-colors hover:border-[#C88A32]"
            aria-label="إغلاق"
          >
            <SairnaIcon name="x" size={17} />
          </button>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] max-[750px]:grid-cols-1 gap-5 overflow-y-auto p-6 max-[650px]:p-4">
          {/* Interactive Pullman Seat Cabin */}
          <div className="rounded-2xl border border-border bg-bg/70 p-4">
            <div className="mb-3 flex items-center justify-between border-b border-dashed border-border pb-3">
              <span className="flex items-center gap-1.5 rounded-xl bg-[#163A5F] px-3 py-1.5 text-[11px] font-bold text-white">
                <SairnaIcon name="steering" size={15} className="text-[#C88A32]" />
                السائق (DRIVER)
              </span>
              <span className="rounded-xl border border-[#2E6F5E]/35 bg-[#2E6F5E]/15 px-3 py-1 text-[11px] font-bold text-[#3B8C77]">
                باب الصعود (DOOR)
              </span>
            </div>

            <div className="mb-3 flex items-center justify-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-text">
                <i className="size-3.5 rounded border-2 border-[#2E6F5E] bg-[#2E6F5E]/10" />
                متاح ({availableCount})
              </span>
              <span className="flex items-center gap-1.5 text-text">
                <i className="size-3.5 rounded border border-slate-500/40 bg-slate-500/30" />
                محجوز ({bookedCount})
              </span>
            </div>

            <div className="flex max-h-[340px] flex-col gap-2 overflow-y-auto px-1">
              {Array.from({ length: rowCount }, (_, rowIdx) => {
                const baseSeat = rowIdx * colsPerRow;
                return (
                  <div
                    key={rowIdx}
                    className={cn(
                      'grid items-center gap-2',
                      isVip
                        ? 'grid-cols-[24px_1fr_28px_1fr_1fr]'
                        : 'grid-cols-[24px_1fr_1fr_24px_1fr_1fr]'
                    )}
                  >
                    <span className="font-tabular text-center text-[10px] font-bold text-muted">
                      {String(rowIdx + 1).padStart(2, '0')}
                    </span>

                    {baseSeat + 1 <= totalSeats ? (
                      <SeatCell
                        seatNum={baseSeat + 1}
                        bookingInfo={seatPassengerMap.get(baseSeat + 1)}
                      />
                    ) : (
                      <span />
                    )}

                    {!isVip &&
                      (baseSeat + 2 <= totalSeats ? (
                        <SeatCell
                          seatNum={baseSeat + 2}
                          bookingInfo={seatPassengerMap.get(baseSeat + 2)}
                        />
                      ) : (
                        <span />
                      ))}

                    <span className="text-center font-tabular text-[10px] text-muted/60">
                      ممر
                    </span>

                    {isVip ? (
                      <>
                        {baseSeat + 2 <= totalSeats ? (
                          <SeatCell
                            seatNum={baseSeat + 2}
                            bookingInfo={seatPassengerMap.get(baseSeat + 2)}
                          />
                        ) : (
                          <span />
                        )}
                        {baseSeat + 3 <= totalSeats ? (
                          <SeatCell
                            seatNum={baseSeat + 3}
                            bookingInfo={seatPassengerMap.get(baseSeat + 3)}
                          />
                        ) : (
                          <span />
                        )}
                      </>
                    ) : (
                      <>
                        {baseSeat + 3 <= totalSeats ? (
                          <SeatCell
                            seatNum={baseSeat + 3}
                            bookingInfo={seatPassengerMap.get(baseSeat + 3)}
                          />
                        ) : (
                          <span />
                        )}
                        {baseSeat + 4 <= totalSeats ? (
                          <SeatCell
                            seatNum={baseSeat + 4}
                            bookingInfo={seatPassengerMap.get(baseSeat + 4)}
                          />
                        ) : (
                          <span />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trip Details & Booked Passengers */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-bg/60 p-3.5">
                <div className="flex items-center gap-2.5">
                  <CompanyLogo company={activeTrip.company} size="pick" />
                  <div>
                    <b className="block font-heading text-sm text-text">
                      {activeTrip.company?.name}
                    </b>
                    <small dir="ltr" className="font-tabular text-[11px] text-muted">
                      ID #{activeTrip.id} · {activeTrip.code}
                    </small>
                  </div>
                </div>
                <StatusBadge status={activeTrip.status} />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-border bg-bg/50 p-3">
                  <small className="block text-[10px] text-muted">وقت الانطلاق</small>
                  <b className="font-tabular text-text">
                    {formatDateTimeArabic(activeTrip.departureAt)}
                  </b>
                </div>
                <div className="rounded-xl border border-border bg-bg/50 p-3">
                  <small className="block text-[10px] text-muted">وقت الوصول</small>
                  <b className="font-tabular text-text">
                    {formatDateTimeArabic(activeTrip.arrivalAt)}
                  </b>
                </div>
                <div className="rounded-xl border border-border bg-bg/50 p-3">
                  <small className="block text-[10px] text-muted">سعر المقعد</small>
                  <b className="font-tabular text-sm text-[#C88A32]">
                    {formatMoney(activeTrip.price)}
                  </b>
                </div>
                <div className="rounded-xl border border-border bg-bg/50 p-3">
                  <small className="block text-[10px] text-muted">الإشغال الحالي</small>
                  <b className="font-tabular text-sm text-[#3B8C77]">
                    {bookedCount} / {totalSeats} مقعداً
                  </b>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-heading text-xs font-bold text-text">
                  قائمة المسافرين على هذه الرحلة ({seatPassengerMap.size})
                </h4>
                {seatPassengerMap.size > 0 ? (
                  <div className="flex max-h-[150px] flex-col gap-1.5 overflow-y-auto">
                    {Array.from(seatPassengerMap.entries()).map(
                      ([seatNum, info]) => (
                        <div
                          key={seatNum}
                          className="flex items-center justify-between rounded-lg border border-border bg-bg/50 px-3 py-1.5 text-[11px]"
                        >
                          <span className="font-bold text-text">
                            مقعد #{seatNum} — {info.passengerName}
                          </span>
                          <span
                            dir="ltr"
                            className="font-tabular font-bold text-[#C88A32]"
                          >
                            {info.bookingCode}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="rounded-xl border border-border bg-bg/50 p-3 text-[11px] text-muted">
                    جميع مقاعد هذه الرحلة شاغرة ومتاحة للحجز حالياً.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditTrip(activeTrip);
                }}
                className={buttonVariants({ variant: 'primary', size: 'sm' })}
              >
                <SairnaIcon name="edit" size={15} /> تعديل الرحلة
              </button>
              <button
                type="button"
                onClick={onClose}
                className={buttonVariants({ variant: 'navy', size: 'sm' })}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ),
    document.body
  );
}

function SeatCell({ seatNum, bookingInfo }) {
  const isBooked = Boolean(bookingInfo);
  return (
    <div
      title={
        isBooked
          ? `مقعد #${seatNum} محجوز: ${bookingInfo.passengerName} (${bookingInfo.bookingCode})`
          : `مقعد #${seatNum} شاغر`
      }
      className={cn(
        'flex h-9 items-center justify-center rounded-lg border font-num text-xs font-bold transition-all',
        isBooked
          ? 'border-slate-500/30 bg-slate-500/20 text-muted cursor-not-allowed'
          : 'border-[#2E6F5E] bg-[#2E6F5E]/10 text-text hover:bg-[#C88A32] hover:text-white hover:border-[#C88A32]'
      )}
    >
      {seatNum}
    </div>
  );
}

export default TripSeatsPreviewModal;
