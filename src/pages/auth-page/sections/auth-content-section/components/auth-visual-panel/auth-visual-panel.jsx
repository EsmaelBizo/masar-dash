import heroSvg from '../../../../../../assets/images/hero.svg';
import logoSvg from '../../../../../../assets/images/masar-icon-white.svg';
import { SairnaIcon } from '../../../../../../components/ui/sairna-icon';

const ADMIN_HIGHLIGHTS = [
  'إدارة مركزية لجدول رحلات البولمان (VIP 2+1 والسياحي 2+2)',
  'اعتماد وتحديث شركات النقل والكراجات في 14 محافظة سورية',
  'مراقبة فورية للحجوزات وتذاكر الصعود الرقمية (QR E-Tickets)',
];

export function AuthVisualPanel() {
  return (
    <div className="relative flex max-[850px]:-order-1 flex-col justify-between overflow-hidden bg-navy px-9 py-10 max-[650px]:p-6 text-white">
      <div className="ablaq-ribbon absolute inset-x-0 top-0" aria-hidden="true" />

      <div className="relative z-20">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold text-[#F7F4EE]">
          <img src={logoSvg} alt="" className="size-5" />
          <span>بوابة الإدارة المركزية — مَسار | MASAR</span>
        </div>

        <h2 className="mt-5 mb-2 font-heading text-[31px] max-[900px]:text-[25px] font-bold leading-[1.35] text-white">
          قيادة ذكية لمنظومة
          <br />
          <span className="text-accent">حجز البولمانات في سوريا</span>
        </h2>
        <p className="text-[13px] leading-[1.8] text-[#DCE6F0]">
          على الرحب والسعة في لوحة تحكم «مَسار» المركزية لإدارة أساطيل البولمان
          والمواعيد والحجوزات بين المحافظات السورية بدقة وموثوقية.
        </p>
      </div>

      <div className="relative my-5">
        <img
          src={heroSvg}
          alt="بوابة مَسار وحافلة البولمان الحديثة"
          className="h-[240px] max-[650px]:h-[190px] w-full rounded-2xl border border-accent/35 object-cover shadow-[0_22px_46px_rgba(0,0,0,0.28)]"
        />
        <div className="mt-4 flex flex-col gap-2">
          {ADMIN_HIGHLIGHTS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[12px] font-semibold text-[#F7F4EE]"
            >
              <SairnaIcon
                name="check-circle"
                size={16}
                className="text-accent"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4 text-[11px] text-[#DCE6F0]">
        <span className="flex items-center gap-1.5 font-semibold">
          <SairnaIcon name="shield" size={15} className="text-accent" />
          منصة مَسار للنقل الذكي
        </span>
        <span className="font-bold text-accent">
          تغطية شاملة لـ 14 محافظة سورية
        </span>
      </div>
    </div>
  );
}

export default AuthVisualPanel;
