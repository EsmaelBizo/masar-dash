import { useToastStore } from '../../store/use-toast-store';
import { SairnaIcon } from './sairna-icon';
import { cn } from '../../lib/cn';

export function ToastNotification() {
  const toast = useToastStore((state) => state.toast);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div
      id="toast"
      className={cn(
        'fixed bottom-6 left-6 z-[300] flex max-w-[calc(100%-48px)] items-center gap-2.5 rounded-xl px-[19px] py-3.5 text-[12px] font-bold text-white shadow-[0_20px_45px_rgba(22,58,95,0.24)] transition-all duration-250 pointer-events-none [&>svg]:flex-none',
        isError ? 'bg-danger' : 'bg-secondary',
        toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      data-type={toast.type}
      role="status"
      aria-live="polite"
    >
      <SairnaIcon name={isError ? 'info' : 'check-circle'} size={19} />{' '}
      {toast.message}
    </div>
  );
}
