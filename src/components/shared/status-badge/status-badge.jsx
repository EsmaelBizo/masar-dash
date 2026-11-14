import { SairnaIcon } from '../../ui/sairna-icon';
import { cn } from '../../../lib/cn';

const STATUS_MAP = {
  AVAILABLE: {
    label: 'متاحة للحجز',
    icon: 'check-circle',
    classes: 'border-[#2E6F5E]/30 bg-[#2E6F5E]/15 text-[#3B8C77]',
  },
  CONFIRMED: {
    label: 'حجز مؤكد',
    icon: 'check-circle',
    classes: 'border-[#2E6F5E]/30 bg-[#2E6F5E]/15 text-[#3B8C77]',
  },
  ACTIVE: {
    label: 'نشطة ومعتمدة',
    icon: 'check-circle',
    classes: 'border-[#2E6F5E]/30 bg-[#2E6F5E]/15 text-[#3B8C77]',
  },
  INACTIVE: {
    label: 'متوقفة مؤقتاً',
    icon: 'pause',
    classes: 'border-border bg-surface-alt text-muted',
  },
  CANCELLED: {
    label: 'ملغاة',
    icon: 'x-circle',
    classes: 'border-[#B83B3B]/30 bg-[#B83B3B]/15 text-[#E05A5A]',
  },
  COMPLETED: {
    label: 'مكتملة',
    icon: 'check',
    classes: 'border-[#C88A32]/30 bg-[#C88A32]/15 text-[#C88A32]',
  },
  ADMIN: {
    label: 'مدير النظام (ADMIN)',
    icon: 'shield',
    classes: 'border-[#C88A32]/35 bg-[#C88A32]/15 text-[#C88A32]',
  },
  USER: {
    label: 'مسافر (USER)',
    icon: 'user',
    classes: 'border-[#3B82F6]/30 bg-[#3B82F6]/12 text-[#3B82F6]',
  },
};

export function StatusBadge({ status, customLabel, className }) {
  const key = String(status || '').toUpperCase();
  const config = STATUS_MAP[key] || {
    label: customLabel || status || 'غير محدد',
    icon: 'info',
    classes: 'border-border bg-surface-alt text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold',
        config.classes,
        className
      )}
    >
      <SairnaIcon name={config.icon} size={12} />
      <span>{customLabel || config.label}</span>
    </span>
  );
}

export default StatusBadge;
