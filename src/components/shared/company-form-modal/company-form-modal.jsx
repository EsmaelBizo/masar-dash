import { useState, useEffect } from 'react';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import { useToastStore } from '../../../store/use-toast-store';
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from '../../../hooks/use-dashboard-queries';
import { FormInputField } from '../form-input-field/form-input-field';
import { CompanyLogo } from '../company-logo/company-logo';
import { SairnaIcon } from '../../ui/sairna-icon';
import { buttonVariants } from '../../ui/button';
import { cn } from '../../../lib/cn';

const SAMPLE_COMPANIES = [
  { name: 'قوافل الشام للبولمان (VIP 2+1)', logoUrl: '' },
  { name: 'أجنحة تدمر الملكية للنقل', logoUrl: '' },
  { name: 'الشهباء إكسبرس للبولمان', logoUrl: '' },
  { name: 'درب الساحل والقدموس', logoUrl: '' },
];

export function CompanyFormModal() {
  const activeCompanyModal = useDashboardStore(
    (state) => state.activeCompanyModal
  );
  const closeCompanyModal = useDashboardStore(
    (state) => state.closeCompanyModal
  );
  const showToast = useToastStore((state) => state.showToast);

  const createMutation = useCreateCompanyMutation();
  const updateMutation = useUpdateCompanyMutation();

  const isEdit = activeCompanyModal?.mode === 'edit';
  const editingCompany = activeCompanyModal?.company;

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!activeCompanyModal) return;
    if (isEdit && editingCompany) {
      setName(editingCompany.name || '');
      setLogoUrl(editingCompany.logoUrl || '');
      setIsActive(
        typeof editingCompany.isActive === 'boolean'
          ? editingCompany.isActive
          : true
      );
    } else {
      setName('');
      setLogoUrl('');
      setIsActive(true);
    }
  }, [activeCompanyModal, isEdit, editingCompany]);

  useEffect(() => {
    if (!activeCompanyModal) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeCompanyModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeCompanyModal, closeCompanyModal]);

  if (!activeCompanyModal) return null;

  const previewCompany = {
    id: editingCompany?.id || 1,
    name: name || 'شركة مَسار للنقل',
    short: (name || 'م').trim()[0] || 'م',
    logoUrl: logoUrl && logoUrl.startsWith('http') ? logoUrl : null,
    color: '#163A5F',
    bg: '#E8EFF6',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      showToast('يرجى إدخال اسم شركة نقل صحيح.', 'error');
      return;
    }

    try {
      if (isEdit && editingCompany) {
        await updateMutation.mutateAsync({
          id: editingCompany.id,
          name: trimmedName,
          logoUrl: logoUrl.trim(),
          isActive,
        });
        showToast(`تم تحديث بيانات شركة «${trimmedName}» بنجاح.`);
      } else {
        await createMutation.mutateAsync({
          name: trimmedName,
          logoUrl: logoUrl.trim() || undefined,
        });
        showToast(`تمت إضافة شركة النقل «${trimmedName}» إلى منصة مَسار.`);
      }
      closeCompanyModal();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          error.message ||
          'تعذر حفظ بيانات شركة النقل.',
        'error'
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-[210] grid animate-fade place-items-center overflow-y-auto bg-[rgba(22,58,95,0.68)] p-4 backdrop-blur-[5px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCompanyModal();
      }}
    >
      <div
        className="animate-pop relative my-auto flex max-h-[calc(100dvh-32px)] w-[min(540px,100%)] flex-col overflow-hidden rounded-[22px] border border-border bg-surface shadow-card-md"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'تعديل شركة النقل' : 'إضافة شركة نقل جديدة'}
      >
        <div className="ablaq-ribbon ablaq-ribbon-animated" aria-hidden="true" />

        <div className="flex items-center justify-between bg-navy px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-accent/40 bg-white/10 text-accent">
              <SairnaIcon name="building" size={21} />
            </span>
            <div>
              <h3 className="m-0 font-heading text-[17px] font-bold">
                {isEdit
                  ? `تعديل شركة النقل (#${editingCompany?.id})`
                  : 'اعتماد شركة بولمان جديدة في مَسار'}
              </h3>
              <small className="text-[11px] text-[#DCE6F0]">
                إدارة اسم الشركة وشعارها وحالة تفعيلها في محرك البحث
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCompanyModal}
            className="grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-accent"
            aria-label="إغلاق"
          >
            <SairnaIcon name="x" size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto p-6 max-[650px]:p-4"
        >
          {/* Live Brand Preview */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface-alt/70 p-3.5">
            <CompanyLogo company={previewCompany} size="normal" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-muted">
                معاينة بطاقة الشركة في مَسار
              </span>
              <strong className="block truncate font-heading text-[15px] text-text">
                {name || 'اسم شركة البولمان'}
              </strong>
              <small className="text-[11px] font-semibold text-secondary">
                {isActive ? 'نشطة ومعتمدة للحجز' : 'متوقفة مؤقتاً'}
              </small>
            </div>
          </div>

          <FormInputField
            label="اسم شركة البولمان"
            required
            iconName="building"
            name="name"
            placeholder="مثال: قوافل الشام للبولمان"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
          />

          <FormInputField
            label="رابط شعار الشركة (اختياري)"
            iconName="globe"
            name="logoUrl"
            type="url"
            dir="ltr"
            placeholder="https://example.com/company-logo.png"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />

          {!isEdit && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="font-bold text-muted">اقتراحات سريعة:</span>
              {SAMPLE_COMPANIES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setName(preset.name)}
                  className="rounded-lg border border-border bg-surface-alt px-2.5 py-1 font-semibold text-text transition-colors hover:border-accent hover:bg-soft-gold"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}

          {isEdit && (
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-surface-alt/50 px-4 py-3">
              <div>
                <b className="block text-[13px] text-text">
                  تفعيل الشركة في محرك البحث
                </b>
                <small className="text-[11px] text-muted">
                  تحديد ما إذا كانت رحلات الشركة متاحة للظهور والحجز
                </small>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-5 cursor-pointer accent-secondary"
              />
            </label>
          )}

          <div className="mt-1 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={closeCompanyModal}
              className={buttonVariants({ variant: 'outline' })}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(buttonVariants({ variant: 'primary' }), 'min-w-[165px]')}
            >
              <SairnaIcon name="check" size={17} />
              {isPending
                ? 'جارٍ الحفظ...'
                : isEdit
                  ? 'حفظ التعديلات'
                  : 'إضافة شركة النقل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyFormModal;
