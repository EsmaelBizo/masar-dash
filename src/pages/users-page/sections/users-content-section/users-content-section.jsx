import { useDashboardStore } from '../../../../store/use-dashboard-store';
import {
  useUsersQuery,
  useBookingsQuery,
} from '../../../../hooks/use-dashboard-queries';
import { formatDateTimeArabic, formatMoney } from '../../../../lib/formatters';
import { StatusBadge } from '../../../../components/shared/status-badge/status-badge';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { EmptyStateCard } from '../../../../components/shared/empty-state-card/empty-state-card';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../components/ui/button';

export function UsersContentSection() {
  const filters = useDashboardStore((state) => state.usersFilters);
  const setFilters = useDashboardStore((state) => state.setUsersFilters);
  const resetFilters = useDashboardStore((state) => state.resetUsersFilters);
  const openUserModal = useDashboardStore((state) => state.openUserModal);

  const { data: users = [], isLoading, isError } = useUsersQuery();
  const { data: bookings = [] } = useBookingsQuery();

  const filteredUsers = users.filter((u) => {
    const q = filters.search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q) ||
      String(u.id).includes(q);

    const matchesRole =
      filters.role === 'all' || String(u.role).toUpperCase() === filters.role;

    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(
    (u) => String(u.role).toUpperCase() === 'ADMIN'
  ).length;
  const travelerCount = users.length - adminCount;

  return (
    <div className="flex flex-col gap-6 reveal">
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#3B82F6]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              إجمالي الحسابات المسجلة
            </span>
            <span className="rounded-xl bg-[#163A5F]/20 p-2.5 text-[#3B82F6]">
              <SairnaIcon name="users" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-text">
            {users.length}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#2E6F5E]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              حسابات المسافرين
            </span>
            <span className="rounded-xl bg-[#2E6F5E]/15 p-2.5 text-[#3B8C77]">
              <SairnaIcon name="user" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#3B8C77]">
            {travelerCount}
          </strong>
        </div>

        <div className="bento-card rounded-3xl p-5 border-t-2 border-t-[#C88A32]">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-muted">
              مديرو النظام والمشرفون
            </span>
            <span className="rounded-xl bg-[#C88A32]/15 p-2.5 text-[#C88A32]">
              <SairnaIcon name="shield" size={18} />
            </span>
          </div>
          <strong className="mt-3 block font-tabular text-2xl sm:text-3xl font-extrabold text-[#C88A32]">
            {adminCount || 1}
          </strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bento-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
            <div className="flex h-[44px] flex-1 min-w-[220px] items-center gap-2 rounded-xl border border-border bg-bg/60 px-3.5 focus-within:border-[#C88A32]">
              <SairnaIcon name="search" size={16} className="text-[#C88A32]" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="ابحث بالاسم أو البريد الإلكتروني أو المعرف..."
                className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
              />
            </div>

            <select
              value={filters.role}
              onChange={(e) => setFilters({ role: e.target.value })}
              className="h-[44px] rounded-xl border border-border bg-bg/60 px-3.5 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
            >
              <option value="all">جميع الأدوار ({users.length})</option>
              <option value="USER">مسافر ({travelerCount})</option>
              <option value="ADMIN">مدير النظام ({adminCount})</option>
            </select>

            {(filters.search || filters.role !== 'all') && (
              <button
                type="button"
                onClick={resetFilters}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                إعادة ضبط
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Data View */}
      {isLoading ? (
        <LoadingState label="جارٍ تحميل سجل المسافرين والمستخدمين..." />
      ) : isError ? (
        <EmptyStateCard
          iconName="alert"
          title="تعذر تحميل سجل المستخدمين"
          description="تحقق من الاتصال وصلاحية المشرف."
        />
      ) : filteredUsers.length === 0 ? (
        <EmptyStateCard
          iconName="users"
          title="لا يوجد مستخدمون مطابقون للبحث"
          description="جرّب تغيير معايير البحث لاستعراض الحسابات."
        />
      ) : (
        <>
          {/* Desktop & Tablet Architectural Table */}
          <div className="hidden md:block bento-card overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right text-xs">
                <thead>
                  <tr className="border-b border-border bg-bg/80 text-[11px] font-bold text-muted">
                    <th className="px-5 py-4 whitespace-nowrap">المعرف</th>
                    <th className="px-4 py-4 whitespace-nowrap">الاسم الكامل</th>
                    <th className="px-4 py-4 whitespace-nowrap">البريد الإلكتروني</th>
                    <th className="px-4 py-4 whitespace-nowrap">الدور</th>
                    <th className="px-4 py-4 whitespace-nowrap">الحجوزات</th>
                    <th className="px-4 py-4 whitespace-nowrap">المدفوعات المؤكدة</th>
                    <th className="px-4 py-4 whitespace-nowrap">تاريخ التسجيل</th>
                    <th className="px-5 py-4 whitespace-nowrap text-left">الملف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => {
                    const userBookings = bookings.filter(
                      (b) =>
                        String(b.userId) === String(user.id) ||
                        (user.email && b.user?.email === user.email)
                    );
                    const confirmedSpent = userBookings
                      .filter(
                        (b) => String(b.status).toUpperCase() === 'CONFIRMED'
                      )
                      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

                    return (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-[#C88A32]/[0.04]"
                      >
                        <td className="px-5 py-4 align-middle whitespace-nowrap font-num font-bold text-[#C88A32]">
                          #{user.id}
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center gap-2.5 whitespace-nowrap">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#163A5F] to-[#0B1929] border border-[#C88A32]/35 font-heading text-xs font-bold text-[#C88A32]">
                              {(user.name || 'م')[0]}
                            </span>
                            <b className="text-xs text-text">{user.name}</b>
                          </div>
                        </td>

                        <td
                          dir="ltr"
                          className="px-4 py-4 align-middle text-right font-num whitespace-nowrap text-muted"
                        >
                          {user.email}
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap">
                          <StatusBadge status={user.role} />
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap font-num font-bold text-text">
                          {userBookings.length} تذكرة
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap font-num font-bold text-[#3B8C77]">
                          {formatMoney(confirmedSpent)}
                        </td>

                        <td className="px-4 py-4 align-middle whitespace-nowrap font-num text-muted">
                          {formatDateTimeArabic(user.createdAt)}
                        </td>

                        <td className="px-5 py-4 align-middle whitespace-nowrap text-left">
                          <button
                            type="button"
                            onClick={() => openUserModal(user)}
                            className="rounded-lg border border-border-gold px-3 py-1.5 text-[11px] font-bold text-text transition-all hover:bg-[#C88A32] hover:text-white"
                          >
                            استعراض الملف
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Responsive Bento Cards */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredUsers.map((user) => {
              const userBookings = bookings.filter(
                (b) =>
                  String(b.userId) === String(user.id) ||
                  (user.email && b.user?.email === user.email)
              );
              const confirmedSpent = userBookings
                .filter((b) => String(b.status).toUpperCase() === 'CONFIRMED')
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

              return (
                <div
                  key={user.id}
                  className="bento-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#163A5F] to-[#0B1929] border border-[#C88A32]/35 font-heading text-xs font-bold text-[#C88A32]">
                        {(user.name || 'م')[0]}
                      </span>
                      <div className="min-w-0">
                        <b className="block truncate text-xs text-text">
                          {user.name}
                        </b>
                        <span
                          dir="ltr"
                          className="block truncate font-num text-[11px] text-muted"
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={user.role} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-bg/60 p-3 text-center text-xs">
                    <div>
                      <b className="font-num block text-sm text-text">
                        {userBookings.length} تذكرة
                      </b>
                      <span className="text-[10px] text-muted">الحجوزات</span>
                    </div>
                    <div className="border-r border-border">
                      <b className="font-num block text-sm text-[#3B8C77]">
                        {formatMoney(confirmedSpent)}
                      </b>
                      <span className="text-[10px] text-muted">
                        المدفوعات المؤكدة
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
                    <span className="font-num">
                      #{user.id} · {formatDateTimeArabic(user.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openUserModal(user)}
                      className="rounded-lg border border-border-gold px-3 py-1.5 text-[11px] font-bold text-text hover:bg-[#C88A32] hover:text-white"
                    >
                      استعراض الملف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default UsersContentSection;
