export const COMPANIES = [
  {
    id: 1,
    slug: 'qawafel',
    name: 'قوافل الشام للبولمان',
    short: 'ق',
    color: '#163A5F',
    bg: '#E8EFF6',
    rating: '4.9',
    tag: 'فئة رجال الأعمال VIP 2+1',
    busClass: 'vip',
    features: ['مكيّف', 'Wi-Fi', 'شحن USB', 'ضيافة ومياه'],
    about: 'بولمانات ملكية حديثة بنظام مقاعد (2+1) الواسعة ورحلات مباشرة عبر الأوتوستراد الدولي.',
    isActive: true,
  },
  {
    id: 2,
    slug: 'palmyra',
    name: 'أجنحة تدمر الملكية',
    short: 'ت',
    color: '#C88A32',
    bg: '#FBF3E4',
    rating: '4.8',
    tag: 'الأكثر حجزاً (VIP 2+1)',
    busClass: 'vip',
    features: ['مكيّف', 'شحن USB', 'ضيافة ومياه'],
    about: 'أسطول بولمانات VIP فاخر يربط المحافظات السورية بمواعيد دقيقة وراحة استثنائية.',
    isActive: true,
  },
  {
    id: 3,
    slug: 'shahba',
    name: 'الشهباء إكسبرس',
    short: 'ش',
    color: '#2E6F5E',
    bg: '#E6F0EC',
    rating: '4.7',
    tag: 'بولمان سياحي (2+2)',
    busClass: 'standard',
    features: ['مكيّف', 'Wi-Fi', 'شحن USB'],
    about: 'رحلات يومية منتظمة ببولمانات سياحية حديثة وأسعار مدروسة تناسب العائلات والطلاب.',
    isActive: true,
  },
  {
    id: 4,
    slug: 'darb',
    name: 'درب الساحل للنقل',
    short: 'د',
    color: '#B83B3B',
    bg: '#FCEAEA',
    rating: '4.6',
    tag: 'مواعيد مرنة (2+2)',
    busClass: 'standard',
    features: ['مكيّف', 'شحن USB'],
    about: 'شبكة خطوط واسعة تربط دمشق وحلب بمدن الساحل والمنطقة الوسطى على مدار الساعة.',
    isActive: true,
  },
];

const PALETTE_PRESETS = [
  { color: '#163A5F', bg: '#E8EFF6', tag: 'فئة رجال الأعمال VIP 2+1', busClass: 'vip' },
  { color: '#C88A32', bg: '#FBF3E4', tag: 'بولمان ملكي (VIP 2+1)', busClass: 'vip' },
  { color: '#2E6F5E', bg: '#E6F0EC', tag: 'بولمان سياحي (2+2)', busClass: 'standard' },
  { color: '#B83B3B', bg: '#FCEAEA', tag: 'خطوط سريعة (2+2)', busClass: 'standard' },
];

export function getCompanyById(idOrCompany) {
  if (!idOrCompany) return COMPANIES[0];
  const rawId = typeof idOrCompany === 'object' ? idOrCompany.id : idOrCompany;
  const rawName = typeof idOrCompany === 'object' ? idOrCompany.name : null;

  const found = COMPANIES.find(
    (c) =>
      String(c.id) === String(rawId) ||
      c.slug === String(rawId) ||
      (rawName && c.name === rawName)
  );

  const numericIndex = Math.abs(Number(rawId) || 0) % PALETTE_PRESETS.length;
  const preset = found || PALETTE_PRESETS[numericIndex] || COMPANIES[0];
  const displayName =
    (typeof idOrCompany === 'object' && idOrCompany.name) ||
    found?.name ||
    `شركة نقل #${rawId}`;
  const cleanFirstChar =
    displayName.replace(/[\[\]()A-Za-z0-9\s_-]/g, '').trim()[0] ||
    displayName.trim()[0] ||
    'م';

  return {
    ...COMPANIES[0],
    ...preset,
    ...(typeof idOrCompany === 'object' ? idOrCompany : {}),
    id: rawId ?? COMPANIES[0].id,
    name: displayName,
    short: cleanFirstChar,
  };
}
