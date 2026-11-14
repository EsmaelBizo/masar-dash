import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useThemeStore } from '../../../../../../store/use-theme-store';
import { formatMoney } from '../../../../../../lib/formatters';

const HERITAGE_COLORS = ['#163A5F', '#2E6F5E', '#C88A32', '#B83B3B', '#5C6470'];

export function OverviewAnalyticsSection({
  trips = [],
  bookings = [],
  companies = [],
}) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(247,244,238,0.08)' : 'rgba(22,58,95,0.08)';
  const textColor = isDark ? '#8E9BAE' : '#5C6470';

  const companyStats = companies.slice(0, 6).map((company) => {
    const compTrips = trips.filter(
      (t) => String(t.companyId) === String(company.id)
    ).length;
    const compBookings = bookings.filter(
      (b) => String(b.company?.id) === String(company.id)
    ).length;

    return {
      name:
        company.name.length > 16
          ? `${company.name.slice(0, 15)}…`
          : company.name,
      trips: compTrips,
      bookings: compBookings,
    };
  });

  const confirmedCount = bookings.filter(
    (b) => String(b.status).toUpperCase() === 'CONFIRMED'
  ).length;
  const cancelledCount = bookings.filter(
    (b) => String(b.status).toUpperCase() === 'CANCELLED'
  ).length;

  const statusData = [
    { name: 'حجوزات مؤكدة (CONFIRMED)', value: confirmedCount || 1, color: '#2E6F5E' },
    { name: 'حجوزات ملغاة (CANCELLED)', value: cancelledCount, color: '#B83B3B' },
  ];

  const routeMap = new Map();
  bookings.forEach((b) => {
    const key = `${b.origin?.name || 'دمشق'} ⟵ ${b.destination?.name || 'حلب'}`;
    const existing = routeMap.get(key) || { route: key, count: 0, revenue: 0 };
    existing.count += 1;
    if (String(b.status).toUpperCase() === 'CONFIRMED') {
      existing.revenue += b.totalPrice || 0;
    }
    routeMap.set(key, existing);
  });
  const topRoutes = Array.from(routeMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 reveal">
      {/* Bar Chart: Trips & Bookings per Company */}
      <div className="xl:col-span-7 bento-card rounded-3xl p-6 flex flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              CARRIER PERFORMANCE
            </span>
            <h3 className="m-0 font-heading text-lg font-bold text-text">
              أداء الشركات والحجوزات
            </h3>
          </div>
          <span className="rounded-xl border border-[#C88A32]/30 bg-[#C88A32]/15 px-3 py-1 text-[11px] font-bold text-[#C88A32]">
            بيانات حية
          </span>
        </div>

        <div className="h-72 w-full flex-1" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companyStats}
              margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: textColor, fontWeight: 600 }}
                axisLine={{ stroke: gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: textColor }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#111824' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(200,138,50,0.32)' : 'rgba(22,58,95,0.12)',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isDark ? '#F7F4EE' : '#1B2028',
                }}
              />
              <Bar
                dataKey="trips"
                name="الرحلات المجدولة"
                fill="#163A5F"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="bookings"
                name="الحجوزات الصادرة"
                fill="#C88A32"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart + Top Intercity Corridors */}
      <div className="xl:col-span-5 bento-card rounded-3xl p-6 flex flex-col justify-between gap-4">
        <div>
          <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
            CORRIDORS & STATUS
          </span>
          <h3 className="m-0 font-heading text-lg font-bold text-text">
            توزيع الحجوزات وأنشط المسارات
          </h3>

          <div className="my-4 grid grid-cols-[125px_1fr] items-center gap-4">
            <div className="h-[120px] w-[120px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={36}
                    outerRadius={54}
                    paddingAngle={4}
                  >
                    {statusData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color || HERITAGE_COLORS[idx]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-[#2E6F5E]/25 bg-[#2E6F5E]/15 px-3 py-2">
                <span className="flex items-center gap-2 font-bold text-[#3B8C77]">
                  <span className="size-2.5 rounded-full bg-[#3B8C77]" />
                  مؤكدة
                </span>
                <b className="font-tabular text-[#3B8C77]">{confirmedCount}</b>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#B83B3B]/25 bg-[#B83B3B]/15 px-3 py-2">
                <span className="flex items-center gap-2 font-bold text-[#E05A5A]">
                  <span className="size-2.5 rounded-full bg-[#E05A5A]" />
                  ملغاة
                </span>
                <b className="font-tabular text-[#E05A5A]">{cancelledCount}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-3.5">
          <span className="mb-2.5 block text-[11px] font-bold text-muted">
            أعلى خطوط السير حجزا وإيراداً:
          </span>
          <div className="flex flex-col gap-2">
            {topRoutes.length > 0 ? (
              topRoutes.map((item) => (
                <div
                  key={item.route}
                  className="flex items-center justify-between rounded-xl border border-border bg-bg/50 px-3 py-2 text-xs"
                >
                  <span className="font-bold text-text">{item.route}</span>
                  <div className="flex items-center gap-3 font-tabular">
                    <span className="rounded-md bg-[#C88A32]/15 px-2 py-0.5 text-[11px] font-bold text-[#C88A32]">
                      {item.count} حجز
                    </span>
                    <b className="text-[#3B8C77]">{formatMoney(item.revenue)}</b>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-muted">
                جارٍ تجميع إحصائيات المسارات...
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OverviewAnalyticsSection;
