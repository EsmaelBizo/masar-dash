import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SIDEBAR_NAV_GROUPS } from '../../../constants/routes';
import {
  useCitiesQuery,
  useCompaniesQuery,
  useTripsQuery,
} from '../../../hooks/use-dashboard-queries';
import { useDashboardStore } from '../../../store/use-dashboard-store';
import { SairnaIcon } from '../../ui/sairna-icon';

export function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  const setTripsFilters = useDashboardStore((state) => state.setTripsFilters);
  const setCitiesSearch = useDashboardStore((state) => state.setCitiesSearch);
  const { data: trips = [] } = useTripsQuery();
  const { data: cities = [] } = useCitiesQuery();
  const { data: companies = [] } = useCompaniesQuery();

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const navItems = useMemo(
    () => SIDEBAR_NAV_GROUPS.flatMap((group) => group.items),
    []
  );

  const q = query.trim().toLowerCase();

  const matchedPages = useMemo(
    () =>
      navItems.filter(
        (n) =>
          !q ||
          n.label.toLowerCase().includes(q) ||
          (n.eyebrow || '').toLowerCase().includes(q)
      ),
    [navItems, q]
  );

  const matchedCities = useMemo(
    () =>
      q
        ? cities
            .filter(
              (c) =>
                String(c.name || '').toLowerCase().includes(q) ||
                String(c.terminal || '').toLowerCase().includes(q)
            )
            .slice(0, 4)
        : [],
    [cities, q]
  );

  const matchedCompanies = useMemo(
    () =>
      q
        ? companies
            .filter((c) => String(c.name || '').toLowerCase().includes(q))
            .slice(0, 4)
        : [],
    [companies, q]
  );

  const matchedTrips = useMemo(
    () =>
      q
        ? trips
            .filter(
              (t) =>
                String(t.code || '').toLowerCase().includes(q) ||
                String(t.origin?.name || '').toLowerCase().includes(q) ||
                String(t.destination?.name || '').toLowerCase().includes(q)
            )
            .slice(0, 4)
        : [],
    [trips, q]
  );

  if (!open) return null;

  const hasResults =
    matchedPages.length > 0 ||
    matchedCities.length > 0 ||
    matchedCompanies.length > 0 ||
    matchedTrips.length > 0;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-start justify-center bg-black/65 p-4 pt-20 backdrop-blur-sm animate-fade"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="البحث السريع في لوحة مَسار"
    >
      <div className="reveal w-full max-w-xl overflow-hidden rounded-2xl border border-border-gold bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <SairnaIcon name="search" size={17} className="text-[#C88A32]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن صفحة، محافظة، رحلة، أو شركة..."
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
          <kbd className="font-num rounded border border-border bg-bg px-2 py-0.5 text-[10px] text-muted">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {matchedPages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-[#C88A32]/15"
            >
              <span className="flex items-center gap-2.5 font-bold text-text">
                <SairnaIcon name={item.icon} size={15} className="text-[#C88A32]" />
                {item.label}
              </span>
              <span className="font-num text-[10px] font-bold text-[#C88A32]">
                {item.eyebrow}
              </span>
            </button>
          ))}

          {matchedTrips.map((trip) => (
            <button
              key={`trip-${trip.id}`}
              type="button"
              onClick={() => {
                setTripsFilters({ search: trip.code || '' });
                navigate('/trips');
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-[#C88A32]/15"
            >
              <span className="font-bold text-text">
                رحلة {trip.code}: {trip.origin?.name} ⟵ {trip.destination?.name}
              </span>
              <span className="font-num text-[10px] text-muted">OPS // TRIP</span>
            </button>
          ))}

          {matchedCities.map((city) => (
            <button
              key={`city-${city.id}`}
              type="button"
              onClick={() => {
                setCitiesSearch(city.name || '');
                navigate('/cities');
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-[#C88A32]/15"
            >
              <span className="font-bold text-text">
                {city.name} — {city.terminal}
              </span>
              <span className="font-num text-[10px] text-[#3B8C77]">GEO // CITY</span>
            </button>
          ))}

          {matchedCompanies.map((company) => (
            <button
              key={`comp-${company.id}`}
              type="button"
              onClick={() => {
                setTripsFilters({ companyId: String(company.id) });
                navigate('/trips');
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right transition-colors hover:bg-[#C88A32]/15"
            >
              <span className="font-bold text-text">{company.name}</span>
              <span className="font-num text-[10px] text-muted">NET // CARRIER</span>
            </button>
          ))}

          {!hasResults && (
            <p className="p-4 text-center text-muted">لا توجد نتائج مطابقة</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
