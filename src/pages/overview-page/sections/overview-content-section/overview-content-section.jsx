import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useDashboardStore } from '../../../../store/use-dashboard-store';
import {
  useOverviewQuery,
  useTripsQuery,
  useBookingsQuery,
  useCompaniesQuery,
} from '../../../../hooks/use-dashboard-queries';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { OverviewKpiGrid } from './components/overview-kpi-grid/overview-kpi-grid';
import { OverviewAnalyticsSection } from './components/overview-analytics-section/overview-analytics-section';
import { OverviewRecentTables } from './components/overview-recent-tables/overview-recent-tables';

export function OverviewContentSection() {
  const navigate = useNavigate();
  const openTripModal = useDashboardStore((state) => state.openTripModal);
  const openCompanyModal = useDashboardStore((state) => state.openCompanyModal);

  const { data: overview, isLoading: overviewLoading } = useOverviewQuery();
  const { data: trips = [], isLoading: tripsLoading } = useTripsQuery();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookingsQuery();
  const { data: companies = [] } = useCompaniesQuery();

  return (
    <div className="space-y-6">
      {/* Editorial Hero Banner */}
      <section className="bento-card rounded-3xl p-6 sm:p-8 relative overflow-hidden reveal">
        <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-[#C88A32]/10 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C88A32]/30 bg-[#C88A32]/10 px-3 py-1 text-[11px] font-bold text-[#C88A32]">
              <span className="size-1.5 rounded-full bg-[#C88A32] animate-ping" />
              التشغيل المباشر لشبكة البولمانات السورية
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold leading-tight text-text">
              منصة <span className="text-[#C88A32]">مَسار</span> — هندسة السفر
              الذكي بين المحافظات
            </h2>
            <p className="mt-3 mb-0 text-sm leading-relaxed text-muted">
              راقب حركة الأسطول عبر محور M5 والساحل، أدر المقاعد التفاعلية
              (VIP 2+1 والسياحي 2+2)، وأصدر التذاكر الرقمية واعتمد شركات النقل
              في الكراجات.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate(ROUTES.TRIPS)}
              className="rounded-2xl border border-border-gold bg-bg/70 px-5 py-3 text-xs font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
            >
              استعراض الرحلات ({trips.length})
            </button>
            <button
              type="button"
              onClick={() => openTripModal('create')}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#163A5F] px-5 py-3 text-xs font-bold text-white transition-all hover:bg-[#1E4E8C]"
            >
              <SairnaIcon name="plus" size={15} /> جدولة رحلة جديدة
            </button>
            <button
              type="button"
              onClick={() => openCompanyModal('create')}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-4 py-3 text-xs font-bold text-text transition-all hover:border-[#C88A32]"
            >
              <SairnaIcon name="building" size={15} /> إضافة شركة
            </button>
          </div>
        </div>
      </section>

      {overviewLoading && tripsLoading && bookingsLoading ? (
        <LoadingState label="جارٍ تحميل مؤشرات وإحصائيات منصة مَسار..." />
      ) : (
        <>
          <OverviewKpiGrid
            overview={overview}
            trips={trips}
            bookings={bookings}
          />
          <OverviewAnalyticsSection
            trips={trips}
            bookings={bookings}
            companies={companies}
          />
          <OverviewRecentTables trips={trips} bookings={bookings} />
        </>
      )}
    </div>
  );
}

export default OverviewContentSection;
