import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useDashboardStore } from '../../../../store/use-dashboard-store';
import { useToastStore } from '../../../../store/use-toast-store';
import {
  useCompaniesQuery,
  useTripsQuery,
  useBookingsQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} from '../../../../hooks/use-dashboard-queries';
import { CompanyLogo } from '../../../../components/shared/company-logo/company-logo';
import { ServiceBadges } from '../../../../components/shared/service-badges/service-badges';
import { StatusBadge } from '../../../../components/shared/status-badge/status-badge';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { EmptyStateCard } from '../../../../components/shared/empty-state-card/empty-state-card';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../components/ui/button';
import { cn } from '../../../../lib/cn';

export function CompaniesContentSection() {
  const navigate = useNavigate();
  const filters = useDashboardStore((state) => state.companiesFilters);
  const setFilters = useDashboardStore((state) => state.setCompaniesFilters);
  const resetFilters = useDashboardStore(
    (state) => state.resetCompaniesFilters
  );
  const openCompanyModal = useDashboardStore((state) => state.openCompanyModal);
  const openConfirmDialog = useDashboardStore(
    (state) => state.openConfirmDialog
  );
  const setTripsFilters = useDashboardStore((state) => state.setTripsFilters);
  const showToast = useToastStore((state) => state.showToast);

  const { data: companies = [], isLoading, isError } = useCompaniesQuery();
  const { data: trips = [] } = useTripsQuery();
  const { data: bookings = [] } = useBookingsQuery();

  const updateCompanyMutation = useUpdateCompanyMutation();
  const deleteCompanyMutation = useDeleteCompanyMutation();

  const filteredCompanies = companies.filter((company) => {
    const q = filters.search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(company.name || '').toLowerCase().includes(q) ||
      String(company.id).includes(q);

    const matchesStatus =
      filters.status === 'all' ||
      (filters.status === 'active' ? company.isActive : !company.isActive);

    return matchesSearch && matchesStatus;
  });

  const activeCount = companies.filter((c) => c.isActive).length;
  const inactiveCount = companies.length - activeCount;

  const handleToggleActive = async (company) => {
    try {
      await updateCompanyMutation.mutateAsync({
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl || '',
        isActive: !company.isActive,
      });
      showToast(
        `تم ${!company.isActive ? 'تفعيل' : 'إيقاف'} شركة «${company.name}» بنجاح.`
      );
    } catch (error) {
      showToast(
        error.response?.data?.message || 'تعذر تحديث حالة الشركة.',
        'error'
      );
    }
  };

  const handleDeleteCompany = (company) => {
    const companyTripsCount = trips.filter(
      (trip) => String(trip.companyId) === String(company.id)
    ).length;
    const companyBookingsCount = bookings.filter(
      (booking) => String(booking.company?.id) === String(company.id)
    ).length;
    const hasRelations = companyTripsCount > 0 || companyBookingsCount > 0;

    openConfirmDialog({
      title: hasRelations
        ? `إيقاف شركة النقل «${company.name}»`
        : `حذف شركة النقل «${company.name}»`,
      description: hasRelations
        ? `لا يمكن حذف الشركة لارتباطها بـ ${companyTripsCount} رحلة و${companyBookingsCount} حجز. سيتم إيقافها بدلاً من ذلك للحفاظ على السجلات الحالية.`
        : 'هل أنت متأكد من حذف هذه الشركة من قاعدة بيانات مَسار؟',
      confirmLabel: hasRelations ? 'إيقاف الشركة' : 'حذف الشركة',
      variant: 'danger',
      onConfirm: async () => {
        try {
          if (hasRelations) {
            await updateCompanyMutation.mutateAsync({
              id: company.id,
              name: company.name,
              logoUrl: company.logoUrl || '',
              isActive: false,
            });
            showToast(`تم إيقاف شركة «${company.name}» للحفاظ على الرحلات والحجوزات المرتبطة بها.`);
          } else {
            await deleteCompanyMutation.mutateAsync(company.id);
            showToast(`تم حذف شركة «${company.name}» بنجاح.`);
          }
        } catch (error) {
          showToast(
            error.response?.data?.message ||
              (hasRelations
                ? 'تعذر إيقاف الشركة.'
                : 'تعذر حذف الشركة.'),
            'error'
          );
        }
      },
    });
  };

  const handleViewCompanyTrips = (companyId) => {
    setTripsFilters({ companyId: String(companyId) });
    navigate(ROUTES.TRIPS);
  };

  return (
    <div className="flex flex-col gap-6 reveal">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#3B82F6]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              إجمالي شركات البولمان المسجلة
            </span>
            <span className="rounded-xl bg-[#163A5F]/20 p-2.5 text-[#3B82F6]">
              <SairnaIcon name="building" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-text">
            {companies.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#2E6F5E]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              الشركات النشطة والمعتمدة
            </span>
            <span className="rounded-xl bg-[#2E6F5E]/15 p-2.5 text-[#3B8C77]">
              <SairnaIcon name="check-circle" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#3B8C77]">
            {activeCount}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#C88A32]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              الشركات المتوقفة مؤقتاً
            </span>
            <span className="rounded-xl bg-[#C88A32]/15 p-2.5 text-[#C88A32]">
              <SairnaIcon name="pause" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#C88A32]">
            {inactiveCount}
          </strong>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bento-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
            <div className="flex h-[44px] flex-1 min-w-[220px] items-center gap-2 rounded-xl border border-border bg-bg/60 px-3.5 focus-within:border-[#C88A32]">
              <SairnaIcon name="search" size={16} className="text-[#C88A32]" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="ابحث باسم شركة البولمان أو رقم المعرف..."
                className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="h-[44px] rounded-xl border border-border bg-bg/60 px-3.5 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
            >
              <option value="all">جميع الحالات ({companies.length})</option>
              <option value="active">نشطة ومفعّلة ({activeCount})</option>
              <option value="inactive">غير مفعّلة ({inactiveCount})</option>
            </select>

            {(filters.search || filters.status !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                إعادة ضبط
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => openCompanyModal('create')}
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
          >
            <SairnaIcon name="plus" size={16} /> إضافة شركة بولمان جديدة
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <LoadingState label="جارٍ تحميل شركات النقل من الخادم..." />
      ) : isError ? (
        <EmptyStateCard
          iconName="alert"
          title="تعذر تحميل شركات النقل"
          description="يرجى التحقق من الاتصال بخادم SAIRNA والمحاولة مجدداً."
        />
      ) : filteredCompanies.length === 0 ? (
        <EmptyStateCard
          iconName="building"
          title="لا توجد شركات نقل مطابقة"
          description="يمكنك إضافة شركة نقل جديدة وربطها برحلات البولمان."
          action={
            <button
              type="button"
              onClick={() => openCompanyModal('create')}
              className={buttonVariants({ variant: 'primary' })}
            >
              <SairnaIcon name="plus" size={16} /> إضافة شركة جديدة
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => {
            const compTripsCount = trips.filter(
              (t) => String(t.companyId) === String(company.id)
            ).length;
            const compBookingsCount = bookings.filter(
              (b) => String(b.company?.id) === String(company.id)
            ).length;

            return (
              <article
                key={company.id}
                className="bento-card flex flex-col justify-between rounded-3xl p-6"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <CompanyLogo company={company} size="normal" />
                      <div>
                        <span className="font-num text-[11px] font-bold text-[#C88A32]">
                          شركة #{company.id}
                        </span>
                        <h3 className="m-0 font-heading text-base font-bold text-text">
                          {company.name}
                        </h3>
                      </div>
                    </div>
                    <StatusBadge
                      status={company.isActive ? 'ACTIVE' : 'INACTIVE'}
                    />
                  </div>

                  <p className="mb-3 text-xs leading-relaxed text-muted">
                    {company.about}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    <ServiceBadges company={company} />
                  </div>
                </div>

                <div>
                  <div className="mb-4 grid grid-cols-2 gap-2.5 rounded-2xl border border-border bg-bg/60 p-3 text-center">
                    <div>
                      <strong className="font-num block text-base font-bold text-[#C88A32]">
                        {compTripsCount}
                      </strong>
                      <small className="text-[10px] font-bold text-muted">
                        رحلة مجدولة
                      </small>
                    </div>
                    <div className="border-r border-border">
                      <strong className="font-num block text-base font-bold text-[#3B8C77]">
                        {compBookingsCount}
                      </strong>
                      <small className="text-[10px] font-bold text-muted">
                        تذكرة محجوزة
                      </small>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewCompanyTrips(company.id)}
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'xs' }),
                        'flex-1'
                      )}
                    >
                      <SairnaIcon name="bus" size={14} /> رحلات الشركة
                    </button>

                    <button
                      type="button"
                      onClick={() => openCompanyModal('edit', company)}
                      className={buttonVariants({
                        variant: 'softGold',
                        size: 'xs',
                      })}
                      title="تعديل بيانات الشركة"
                    >
                      <SairnaIcon name="edit" size={14} /> تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(company)}
                      className={buttonVariants({
                        variant: company.isActive ? 'subtle' : 'softTeal',
                        size: 'xs',
                      })}
                      title={company.isActive ? 'إيقاف مؤقت' : 'تفعيل الشركة'}
                    >
                      <SairnaIcon
                        name={company.isActive ? 'pause' : 'play'}
                        size={14}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCompany(company)}
                      className={buttonVariants({
                        variant: 'softDanger',
                        size: 'xs',
                      })}
                      title="حذف الشركة"
                    >
                      <SairnaIcon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CompaniesContentSection;
