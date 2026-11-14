import { useEffect } from 'react';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import { SairnaIcon } from '../../ui/sairna-icon';
import { buttonVariants } from '../../ui/button';
import { cn } from '../../../lib/cn';

export function ConfirmDialog() {
  const confirmDialog = useDashboardStore((state) => state.confirmDialog);
  const closeConfirmDialog = useDashboardStore((state) => state.closeConfirmDialog);

  useEffect(() => {
    if (!confirmDialog) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeConfirmDialog();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [confirmDialog, closeConfirmDialog]);

  if (!confirmDialog) return null;

  const isDanger = confirmDialog.variant === 'danger';

  const handleConfirm = async () => {
    if (confirmDialog.onConfirm) {
      await confirmDialog.onConfirm();
    }
    closeConfirmDialog();
  };

  return (
    <div
      className="fixed inset-0 z-[250] grid animate-fade place-items-center bg-[rgba(22,58,95,0.68)] p-4 backdrop-blur-[5px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeConfirmDialog();
      }}
    >
      <div
        className="animate-pop relative w-[min(440px,100%)] overflow-hidden rounded-[20px] border border-border bg-surface shadow-card-md"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="ablaq-ribbon" aria-hidden="true" />
        <div className="p-6 text-center">
          <span
            className={cn(
              'mx-auto mb-4 grid size-14 place-items-center rounded-2xl',
              isDanger
                ? 'bg-soft-danger text-danger'
                : 'bg-soft-gold text-accent-deep'
            )}
          >
            <SairnaIcon name={isDanger ? 'alert' : 'info'} size={28} />
          </span>
          <h3 className="mb-2 font-heading text-[19px] font-bold text-text">
            {confirmDialog.title || 'تأكيد الإجراء'}
          </h3>
          <p className="mb-6 text-[13px] leading-[1.8] text-muted">
            {confirmDialog.description}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              className={cn(
                buttonVariants({
                  variant: isDanger ? 'danger' : 'primary',
                }),
                'flex-1'
              )}
            >
              <SairnaIcon name={isDanger ? 'trash' : 'check'} size={16} />
              {confirmDialog.confirmLabel || 'تأكيد'}
            </button>
            <button
              type="button"
              onClick={closeConfirmDialog}
              className={cn(buttonVariants({ variant: 'outline' }), 'flex-1')}
            >
              تراجع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
