import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { useDashboardStore } from '../../../../store/use-dashboard-store';
import {
  useCitiesQuery,
  useTripsQuery,
} from '../../../../hooks/use-dashboard-queries';
import { calculateApproxDistance } from '../../../../constants/cities';
import { LoadingState } from '../../../../components/shared/loading-state/loading-state';
import { SairnaIcon } from '../../../../components/ui/sairna-icon';
import { buttonVariants } from '../../../../components/ui/button';

export function CitiesContentSection() {
  const navigate = useNavigate();
  const citiesSearch = useDashboardStore((state) => state.citiesSearch);
  const setCitiesSearch = useDashboardStore((state) => state.setCitiesSearch);
  const setTripsFilters = useDashboardStore((state) => state.setTripsFilters);
  const openTripModal = useDashboardStore((state) => state.openTripModal);

  const { data: cities = [], isLoading } = useCitiesQuery();
  const { data: trips = [] } = useTripsQuery();

  const [selectedOriginIdx, setSelectedOriginIdx] = useState(0);
  const [selectedDestIdx, setSelectedDestIdx] = useState(1);

  const originCity = cities[selectedOriginIdx] || cities[0];
  const destCity = cities[selectedDestIdx] || cities[1] || cities[0];
  const approxDistance =
    originCity && destCity ? calculateApproxDistance(originCity, destCity) : 355;

  const filteredCities = cities.filter((city) => {
    const q = citiesSearch.trim().toLowerCase();
    return (
      !q ||
      String(city.name || '').toLowerCase().includes(q) ||
      String(city.terminal || '').toLowerCase().includes(q) ||
      String(city.id).includes(q)
    );
  });

  const mapPoint = (city) => ({
    x: 80 + (((city.lng || city.longitude || 36.3) - 35.4) / (41.4 - 35.4)) * 680,
    y: 55 + ((37.4 - (city.lat || city.latitude || 33.5)) / (37.4 - 32.2)) * 460,
  });

  return (
    <div className="flex flex-col gap-6 reveal">
      {/* Interactive Syrian Intercity Network Map Card */}
      <div className="bento-card grid grid-cols-[1.15fr_0.85fr] max-[1000px]:grid-cols-1 gap-6 overflow-hidden rounded-3xl p-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg/60 p-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              NETWORK TOPOLOGY
            </span>
            {originCity && destCity && (
              <span className="rounded-xl border border-[#C88A32]/30 bg-[#C88A32]/15 px-3 py-1 text-[11px] font-bold text-[#C88A32]">
                {originCity.name} ⟵ {destCity.name}
              </span>
            )}
          </div>

          <svg
            viewBox="0 0 850 560"
            className="h-[340px] w-full object-contain text-text"
            role="img"
            aria-label="خريطة المحافظات والكراجات السورية المعتمدة في مَسار"
          >
            <defs>
              <pattern
                id="syria-dots"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.2" fill="#C88A32" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="850" height="560" fill="url(#syria-dots)" />

            <path
              d="M90 110 450 40 690 85 755 230 770 390 610 495 475 525 340 510 265 445 125 405 85 280Z"
              fill="currentColor"
              fillOpacity="0.03"
              stroke="#C88A32"
              strokeOpacity="0.25"
              strokeWidth="2.5"
            />

            {originCity && destCity && (
              <>
                <line
                  x1={mapPoint(originCity).x}
                  y1={mapPoint(originCity).y}
                  x2={mapPoint(destCity).x}
                  y2={mapPoint(destCity).y}
                  stroke="#2E6F5E"
                  strokeOpacity="0.45"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1={mapPoint(originCity).x}
                  y1={mapPoint(originCity).y}
                  x2={mapPoint(destCity).x}
                  y2={mapPoint(destCity).y}
                  stroke="#C88A32"
                  strokeWidth="2.5"
                  className="route-pulse"
                />
              </>
            )}

            {cities.map((city, idx) => {
              const pt = mapPoint(city);
              const isSelected =
                idx === selectedOriginIdx || idx === selectedDestIdx;
              return (
                <g
                  key={city.id}
                  className="cursor-pointer"
                  onClick={() => {
                    if (idx !== selectedOriginIdx) setSelectedDestIdx(idx);
                  }}
                >
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="18"
                      fill="#C88A32"
                      fillOpacity="0.22"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 9 : 6}
                    fill={isSelected ? '#C88A32' : '#2E6F5E'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 14}
                    textAnchor="middle"
                    fontFamily="Readex Pro, IBM Plex Sans Arabic, sans-serif"
                    fontSize={isSelected ? '14' : '12'}
                    fontWeight={isSelected ? '700' : '500'}
                    fill="currentColor"
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Route Distance Estimator & Quick Trip Action */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C88A32]/30 bg-[#C88A32]/15 px-3 py-1 text-[11px] font-bold text-[#C88A32]">
              <SairnaIcon name="route" size={14} /> محاكي المسارات بين الكراجات
            </span>
            <h3 className="mt-3 mb-1 font-heading text-xl font-bold text-text">
              شبكة المحافظات والكراجات السورية ({cities.length})
            </h3>
            <p className="m-0 text-xs leading-relaxed text-muted">
              اختر محافظتين لمعاينة المسافة التقريبية وعدد الرحلات المجدولة
              بين الكراجات المعتمدة على الشبكة السورية.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-muted">
                  محافظة الانطلاق
                </span>
                <select
                  value={selectedOriginIdx}
                  onChange={(e) => setSelectedOriginIdx(Number(e.target.value))}
                  className="h-[42px] w-full rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
                >
                  {cities.map((c, idx) => (
                    <option key={c.id} value={idx}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-muted">
                  محافظة الوصول
                </span>
                <select
                  value={selectedDestIdx}
                  onChange={(e) => setSelectedDestIdx(Number(e.target.value))}
                  className="h-[42px] w-full rounded-xl border border-border bg-bg/60 px-3 text-xs font-bold text-text outline-none focus:border-[#C88A32] [&>option]:bg-surface [&>option]:text-text"
                >
                  {cities.map((c, idx) => (
                    <option key={c.id} value={idx}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {originCity && destCity && (
              <div className="mt-4 rounded-2xl border border-border bg-bg/60 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-text">
                  <span>{originCity.terminal}</span>
                  <SairnaIcon
                    name="arrow-left"
                    size={16}
                    className="text-[#C88A32]"
                  />
                  <span>{destCity.terminal}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                  <span className="text-muted">المسافة البرية التقديرية:</span>
                  <strong className="font-num text-[#3B8C77]">
                    ~{approxDistance} كم
                  </strong>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openTripModal('create')}
            className={buttonVariants({ variant: 'primary', fullWidth: true })}
          >
            <SairnaIcon name="plus" size={16} /> جدولة رحلة بولمان على هذا الخط
          </button>
        </div>
      </div>

      {/* Search & Cities Directory Grid */}
      <div className="bento-card rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-num text-[10px] font-bold uppercase tracking-widest text-[#C88A32]">
              TERMINAL DIRECTORY
            </span>
            <h2 className="m-0 font-heading text-lg font-bold text-text">
              دليل المحافظات والكراجات المعتمدة ({filteredCities.length})
            </h2>
          </div>

          <div className="flex h-[42px] min-w-[250px] items-center gap-2 rounded-xl border border-border bg-bg/60 px-3.5 focus-within:border-[#C88A32]">
            <SairnaIcon name="search" size={16} className="text-[#C88A32]" />
            <input
              type="text"
              value={citiesSearch}
              onChange={(e) => setCitiesSearch(e.target.value)}
              placeholder="ابحث باسم المحافظة أو الكراج..."
              className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="جارٍ تحميل المحافظات والكراجات..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCities.map((city) => {
            const departingCount = trips.filter(
              (t) => String(t.originId) === String(city.id)
            ).length;
            const arrivingCount = trips.filter(
              (t) => String(t.destinationId) === String(city.id)
            ).length;

            return (
              <div
                key={city.id}
                className="bento-card flex flex-col justify-between rounded-2xl p-5"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="m-0 font-heading text-base font-bold text-text">
                      {city.name}
                    </h3>
                    <span className="font-num rounded-full bg-[#2E6F5E]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#3B8C77]">
                      {departingCount + arrivingCount} رحلة
                    </span>
                  </div>
                  <p className="mt-1 mb-3 text-xs font-bold text-[#C88A32]">
                    {city.terminal}
                  </p>

                  <div
                    dir="ltr"
                    className="mb-4 rounded-xl border border-border bg-bg/60 px-3 py-2 font-num text-[11px] text-muted"
                  >
                    Lat: {Number(city.latitude).toFixed(4)} · Lng:{' '}
                    {Number(city.longitude).toFixed(4)}
                  </div>
                </div>

                <div>
                  <div className="mb-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-center text-[11px]">
                    <div>
                      <b className="font-num block text-sm text-[#C88A32]">
                        {departingCount}
                      </b>
                      <span className="text-muted">رحلة منطلقة</span>
                    </div>
                    <div className="border-r border-border">
                      <b className="font-num block text-sm text-[#3B8C77]">
                        {arrivingCount}
                      </b>
                      <span className="text-muted">رحلة قادمة</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTripsFilters({
                        originId: String(city.id),
                        destinationId: 'all',
                      });
                      navigate(ROUTES.TRIPS);
                    }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'xs',
                      fullWidth: true,
                    })}
                  >
                    استعراض رحلات {city.name}{' '}
                    <SairnaIcon name="arrow-left" size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CitiesContentSection;
