import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../../../constants/routes';
import { useToastStore } from '../../../../../../store/use-toast-store';
import { useAdminLoginMutation } from '../../../../../../hooks/use-auth-mutation';
import { Eyebrow } from '../../../../../../components/ui/eyebrow';
import { SairnaIcon } from '../../../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../../../components/ui/button';
import { FormInputField } from '../../../../../../components/shared/form-input-field/form-input-field';
import { InfoNotice } from '../../../../../../components/shared/info-notice/info-notice';
import { cn } from '../../../../../../lib/cn';

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = '1111111111111111';

export function AuthFormPanel() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const loginMutation = useAdminLoginMutation();

  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);

  const handleFillDefaultAdmin = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    showToast('تمت تعبئة بيانات حساب المدير المعتمد (ADMIN).');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || password.length < 6) {
      showToast('يرجى إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح.', 'error');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: trimmedEmail,
        password,
      });
      showToast('أهلاً بك في لوحة تحكم مَسار! تم تسجيل دخول المدير بنجاح.');
      navigate(ROUTES.OVERVIEW, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'تعذر تسجيل الدخول. تأكد من صلاحيات المدير (ADMIN).';
      showToast(message, 'error');
    }
  };

  return (
    <div className="flex flex-col justify-center px-[min(5vw,64px)] py-10 max-[900px]:p-8 max-[650px]:px-5 max-[650px]:py-6">
      <div>
        <Eyebrow>بوابة المشرفين ومديري النظام (ADMIN)</Eyebrow>
        <h1 className="mt-3 mb-1.5 font-heading text-[28px] max-[650px]:text-[23px] font-bold text-text">
          تسجيل الدخول إلى <span className="text-primary dark:text-accent">لوحة مَسار</span>
        </h1>
        <p className="text-[13px] text-muted">
          أدخل بيانات حساب المشرف للوصول إلى إدارة الشركات، جدول الرحلات،
          والحجوزات عبر مسار{' '}
          <code dir="ltr" className="font-tabular font-bold text-primary dark:text-accent">
            POST /api/v1/dashboard/auth/login
          </code>
          .
        </p>
      </div>

      <form className="mt-6 mb-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormInputField
          label="البريد الإلكتروني للمشرف (Admin Email)"
          required
          iconName="mail"
          iconSize={19}
          heightClass="h-[52px]"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@gmail.com"
          autoComplete="email"
          dir="ltr"
          inputClassName="font-tabular font-bold"
        />

        <FormInputField
          label="كلمة المرور (Admin Password)"
          required
          iconName="lock"
          iconSize={19}
          heightClass="h-[52px]"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          placeholder="••••••••••••••••"
          autoComplete="current-password"
          dir="ltr"
          inputClassName="font-tabular font-bold"
          rightAddon={
            <button
              className="grid place-items-center border-0 bg-transparent p-1.5 text-muted hover:text-primary"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="إظهار كلمة المرور"
            >
              <SairnaIcon name={showPassword ? 'eye-off' : 'eye'} size={19} />
            </button>
          }
        />

        <button
          className={cn(
            buttonVariants({ variant: 'primary', fullWidth: true }),
            'mt-1 min-h-[52px]'
          )}
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending
            ? 'جارٍ التحقق من صلاحية ADMIN...'
            : 'الدخول إلى لوحة التحكم'}
          <SairnaIcon name="arrow-left" size={18} />
        </button>
      </form>

      {/* Pre-configured Admin Credentials Card */}
      <div className="mt-2 rounded-2xl border border-accent/35 bg-soft-gold p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-accent-deep">
            <SairnaIcon name="key" size={16} />
            بيانات الدخول المعتمدة (SAIRNA Admin)
          </span>
          <button
            type="button"
            onClick={handleFillDefaultAdmin}
            className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-accent-deep"
          >
            تعبئة تلقائية
          </button>
        </div>
        <div
          dir="ltr"
          className="grid grid-cols-3 max-[650px]:grid-cols-1 gap-2 font-tabular text-[11px] text-text"
        >
          <div className="rounded-lg bg-surface/80 px-2.5 py-1.5">
            <span className="block text-[9px] text-muted">Email</span>
            <b>admin@gmail.com</b>
          </div>
          <div className="rounded-lg bg-surface/80 px-2.5 py-1.5">
            <span className="block text-[9px] text-muted">Password</span>
            <b>1111111111111111</b>
          </div>
          <div className="rounded-lg bg-surface/80 px-2.5 py-1.5">
            <span className="block text-[9px] text-muted">Role</span>
            <b className="text-secondary">ADMIN</b>
          </div>
        </div>
      </div>

      <InfoNotice iconName="shield" variant="teal" className="mt-4">
        تُحفظ جلسة المشرف برمز التوثيق (JWT Bearer Token) في المتصفح وتُرسل
        تلقائياً مع جميع طلبات لوحة التحكم.
      </InfoNotice>
    </div>
  );
}

export default AuthFormPanel;
