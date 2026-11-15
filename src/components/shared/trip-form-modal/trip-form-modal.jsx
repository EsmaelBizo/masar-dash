import { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import { useToastStore } from '../../../store/use-toast-store';
import {
  useCitiesQuery,
  useCompaniesQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
} from '../../../hooks/use-dashboard-queries';
import { toDatetimeLocalValue, formatMoney } from '../../../lib/formatters';
import { FormInputField } from '../form-input-field/form-input-field';
import { SairnaIcon } from '../../ui/sairna-icon';
import { buttonVariants } from '../../ui/button';
import { cn } from '../../../lib/cn';

function getDefaultDepartureIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(8, 30, 0, 0);
  return toDatetimeLocalValue(d.toISOString());
}

function getDefaultArrivalIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(13, 0, 0, 0);
  return toDatetimeLocalValue(d.toISOString());
}

export function TripFormModal() {
  const activeTripModal = useDashboardStore((state) => state.activeTripModal);
  const closeTripModal = useDashboardStore((state) => state.closeTripModal);
  const showToast = useToastStore((state) => state.showToast);

  const { data: cities = [] } = useCitiesQuery();
  const { data: companies = [] } = useCompaniesQuery();

  const createMutation = useCreateTripMutation();
  const updateMutation = useUpdateTripMutation();

  const isEdit = activeTripModal?.mode === 'edit';
  const editingTrip = activeTripModal?.trip;

  const [companyId, setCompanyId] = useState('');
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [departureAt, setDepartureAt] = useState('');
  const [arrivalAt, setArrivalAt] = useState('');
  const [price, setPrice] = useState('75000');
  const [totalSeats, setTotalSeats] = useState('30');
  const [status, setStatus] = useState('AVAILABLE');

  useEffect(() => {
    if (!activeTripModal) return;

    if (isEdit && editingTrip) {
      setCompanyId(String(editingTrip.companyId || companies[0]?.id || 1));
      setOriginId(String(editingTrip.originId || cities[0]?.id || 1));
      setDestinationId(String(editingTrip.destinationId || cities[1]?.id || 2));
      setDepartureAt(
        toDatetimeLocalValue(editingTrip.departureAt) || getDefaultDepartureIso()
      );
      setArrivalAt(
        toDatetimeLocalValue(editingTrip.arrivalAt) || getDefaultArrivalIso()
      );
      setPrice(String(editingTrip.price ?? 75000));
      setTotalSeats(String(editingTrip.totalSeats ?? 30));
      setStatus(editingTrip.status || 'AVAILABLE');
    } else {
      const defaultCompany =
        companies.find((c) => c.isActive)?.id || companies[0]?.id || 1;
      setCompanyId(String(defaultCompany));
      setOriginId(String(cities[0]?.id || 1));
      setDestinationId(String(cities[1]?.id || 2));
      setDepartureAt(getDefaultDepartureIso());
      setArrivalAt(getDefaultArrivalIso());
      setPrice('75000');
      setTotalSeats('30');
      setStatus('AVAILABLE');
    }
  }, [activeTripModal, isEdit, editingTrip, cities, companies]);

  useEffect(() => {
    if (!activeTripModal) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeTripModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTripModal, closeTripModal]);

  if (!activeTripModal) return null;

  const handleSwapCities = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  const applySeatPreset = (seatsCount, farePreset) => {
    setTotalSeats(String(seatsCount));
    if (farePreset) setPrice(String(farePreset));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (String(originId) === String(destinationId)) {
      showToast('يرجى اختيار محافظتين مختلفتين للانطلاق والوصول.', 'error');
      return;
    }

    const depTime = new Date(departureAt).getTime();
    const arrTime = new Date(arrivalAt).getTime();
    if (Number.isNaN(depTime) || Number.isNaN(arrTime) || arrTime <= depTime) {
      showToast('يجب أن يكون وقت الوصول بعد وقت الانطلاق.', 'error');
      return;
    }

    const numericPrice = Number(price);
    const numericSeats = Number(totalSeats);
    if (numericPrice <= 0 || numericSeats < 1) {
      showToast('يرجى التحقق من سعر التذكرة وعدد المقاعد.', 'error');
      return;
    }

    try {
      if (isEdit && editingTrip) {
        await updateMutation.mutateAsync({
          id: editingTrip.id,
          companyId: Number(companyId),
          originId: Number(originId),
          destinationId: Number(destinationId),
          departureAt,
          arrivalAt,
          price: numericPrice,
          totalSeats: numericSeats,
          status,
        });
        showToast(`تم تحديث بيانات الرحلة (${editingTrip.code}) بنجاح.`);
      } else {
        const created = await createMutation.mutateAsync({
          companyId: Number(companyId),
          originId: Number(originId),
          destinationId: Number(destinationId),
          departureAt,
          arrivalAt,
          price: numericPrice,
          totalSeats: numericSeats,
        });
        showToast(
          `تمت إضافة رحلة البولمان الجديدة (${created?.code || 'مَسار'}) بنجاح.`
        );
      }
      closeTripModal();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          error.message ||
          'تعذر حفظ بيانات الرحلة. تأكد من صحة الحقول.',
        'error'
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-[210] grid animate-fade place-items-center overflow-y-auto bg-[rgba(22,58,95,0.68)] p-4 backdrop-blur-[5px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTripModal();
      }}
    >
      <div
        className="animate-pop relative my-auto flex max-h-[calc(100dvh-32px)] w-[min(650px,100%)] flex-col overflow-hidden rounded-[22px] border border-border bg-surface shadow-card-md"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'تعديل رحلة بولمان' : 'إضافة رحلة بولمان جديدة'}
      >
        <div className="ablaq-ribbon ablaq-ribbon-animated" aria-hidden="true" />

        <div className="flex items-center justify-between bg-navy px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-accent/40 bg-white/10 text-accent">
              <SairnaIcon name="bus" size={22} />
            </span>
            <div>
              <h3 className="m-0 font-heading text-[17px] font-bold">
                {isEdit
                  ? `تعديل رحلة البولمان (${editingTrip?.code})`
                  : 'جدولة رحلة بولمان جديدة بين المحافظات'}
              </h3>
              <small className="text-[11px] text-[#DCE6F0]">
                حدد شركة النقل والكراجات والمواعيد وسعر التذكرة بالليرة السورية
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTripModal}
            className="grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-accent"
            aria-label="إغلاق"
          >
            <SairnaIcon name="x" size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 max-[650px]:p-4 flex flex-col gap-4"
        >
          {/* Company & Status */}
          <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-4">
            <label className="block">
              <span className="mb-2 block text-[12px] font-bold text-text">
                شركة النقل المعتمدة <em className="not-italic text-danger">*</em>
              </span>
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
                <SairnaIcon name="building" size={18} className="text-primary" />
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                  className="w-full bg-transparent text-[13px] font-bold text-text outline-none [&>option]:bg-white [&>option]:text-[#23272D]"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.isActive ? '— (نشطة)' : '— (غير مفعّلة)'}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[12px] font-bold text-text">
                حالة الرحلة التشغيلية
              </span>
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
                <SairnaIcon name="activity" size={18} className="text-secondary" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!isEdit}
                  className="w-full bg-transparent text-[13px] font-bold text-text outline-none disabled:opacity-65 [&>option]:bg-white [&>option]:text-[#23272D]"
                >
                  <option value="AVAILABLE">متاحة للحجز</option>
                  <option value="CANCELLED">ملغاة</option>
                  <option value="COMPLETED">مكتملة</option>
                </select>
              </div>
            </label>
          </div>

          {/* Origin & Destination with Swap */}
          <div className="grid grid-cols-[1fr_42px_1fr] max-[650px]:grid-cols-1 items-end gap-2.5">
            <label className="block">
              <span className="mb-2 block text-[12px] font-bold text-text">
                من محافظة (كراج الانطلاق){' '}
                <em className="not-italic text-danger">*</em>
              </span>
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
                <SairnaIcon name="pin" size={18} className="text-primary" />
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  required
                  className="w-full bg-transparent text-[13px] font-bold text-text outline-none [&>option]:bg-white [&>option]:text-[#23272D]"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.terminal})
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <button
              type="button"
              onClick={handleSwapCities}
              className="mb-1 grid size-[42px] max-[650px]:mx-auto place-items-center rounded-xl border border-accent/35 bg-soft-gold text-accent-deep transition-colors hover:bg-accent hover:text-white"
              title="تبديل الانطلاق والوجهة"
            >
              <SairnaIcon name="swap" size={18} />
            </button>

            <label className="block">
              <span className="mb-2 block text-[12px] font-bold text-text">
                إلى محافظة (كراج الوصول){' '}
                <em className="not-italic text-danger">*</em>
              </span>
              <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 focus-within:border-accent">
                <SairnaIcon name="pin" size={18} className="text-secondary" />
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  required
                  className="w-full bg-transparent text-[13px] font-bold text-text outline-none [&>option]:bg-white [&>option]:text-[#23272D]"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.terminal})
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {/* Departure & Arrival Datetime */}
          <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-4">
            <FormInputField
              label="تاريخ ووقت الانطلاق"
              required
              iconName="calendar"
              type="datetime-local"
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
              dir="ltr"
              inputClassName="font-tabular font-bold"
            />

            <FormInputField
              label="تاريخ ووقت الوصول المتوقع"
              required
              iconName="clock"
              type="datetime-local"
              value={arrivalAt}
              onChange={(e) => setArrivalAt(e.target.value)}
              dir="ltr"
              inputClassName="font-tabular font-bold"
            />
          </div>

          {/* Price & Total Seats */}
          <div className="grid grid-cols-2 max-[650px]:grid-cols-1 gap-4">
            <FormInputField
              label={`سعر التذكرة بالليرة السورية (${formatMoney(price)})`}
              required
              iconName="wallet"
              type="number"
              min="1000"
              step="1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              dir="ltr"
              inputClassName="font-tabular font-bold"
            />

            <FormInputField
              label="إجمالي سعة مقاعد البولمان"
              required
              iconName="seat"
              type="number"
              min="1"
              max="60"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              dir="ltr"
              inputClassName="font-tabular font-bold"
            />
          </div>

          {/* Quick Presets for Pullman Classes */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-alt/70 px-3.5 py-2.5 text-[11px]">
            <span className="font-bold text-muted">
              قوالب سريعة لفئة الحافلة:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applySeatPreset(27, 95000)}
                className="rounded-lg border border-accent/40 bg-soft-gold px-2.5 py-1 font-bold text-accent-deep transition-colors hover:bg-accent hover:text-white"
              >
                بولمان ملكي VIP (2+1) · 27 مقعداً
              </button>
              <button
                type="button"
                onClick={() => applySeatPreset(30, 75000)}
                className="rounded-lg border border-accent/40 bg-soft-gold px-2.5 py-1 font-bold text-accent-deep transition-colors hover:bg-accent hover:text-white"
              >
                رجال أعمال VIP · 30 مقعداً
              </button>
              <button
                type="button"
                onClick={() => applySeatPreset(44, 55000)}
                className="rounded-lg border border-secondary/35 bg-soft-teal px-2.5 py-1 font-bold text-secondary transition-colors hover:bg-secondary hover:text-white"
              >
                بولمان سياحي (2+2) · 44 مقعداً
              </button>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={closeTripModal}
              className={buttonVariants({ variant: 'outline' })}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(buttonVariants({ variant: 'primary' }), 'min-w-[175px]')}
            >
              <SairnaIcon name="check" size={17} />
              {isPending
                ? 'جارٍ الحفظ...'
                : isEdit
                  ? 'حفظ تعديلات الرحلة'
                  : 'إصدار وجدولة الرحلة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripFormModal;
