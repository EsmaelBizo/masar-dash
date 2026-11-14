import { apiClient } from './api-client';
import { CITIES, getCityById, calculateApproxDistance } from '../constants/cities';
import { getCompanyById } from '../constants/companies';

function unwrap(data) {
  return data?.value ?? data?.data ?? data;
}

export function normalizeCityItem(city, fallbackId) {
  const resolved = getCityById(city || fallbackId);
  return {
    ...resolved,
    ...(city || {}),
    id: city?.id ?? resolved.id,
    name: city?.name || city?.title || resolved.name,
    latitude: Number(city?.latitude ?? city?.lat ?? resolved.lat),
    longitude: Number(city?.longitude ?? city?.lng ?? resolved.lng),
    lat: Number(city?.latitude ?? city?.lat ?? resolved.lat),
    lng: Number(city?.longitude ?? city?.lng ?? resolved.lng),
    terminal: city?.terminal || resolved.terminal || 'كراج البولمان المركزي',
    region: resolved.region || 'المحافظات السورية',
  };
}

export function normalizeCompanyItem(company, fallbackId) {
  const resolved = getCompanyById(company || fallbackId);
  return {
    ...resolved,
    ...(company || {}),
    id: company?.id ?? fallbackId ?? resolved.id,
    name: company?.name || company?.title || resolved.name,
    logoUrl:
      company?.logoUrl &&
      company.logoUrl !== 'string' &&
      company.logoUrl.startsWith('http')
        ? company.logoUrl
        : null,
    rawLogoUrl: company?.logoUrl || '',
    isActive: typeof company?.isActive === 'boolean' ? company.isActive : true,
  };
}

export function normalizeTripItem(trip) {
  const origin = normalizeCityItem(trip.origin, trip.originId);
  const destination = normalizeCityItem(trip.destination, trip.destinationId);
  const company = normalizeCompanyItem(trip.company, trip.companyId);

  const departureDate = trip.departureAt ? new Date(trip.departureAt) : null;
  const arrivalDate = trip.arrivalAt ? new Date(trip.arrivalAt) : null;
  const validDates =
    departureDate &&
    arrivalDate &&
    !Number.isNaN(departureDate.getTime()) &&
    !Number.isNaN(arrivalDate.getTime());

  const durationMinutes = validDates
    ? Math.max(0, Math.round((arrivalDate.getTime() - departureDate.getTime()) / 60000))
    : trip.duration || 240;

  const totalSeats = Number(trip.totalSeats ?? 40);
  const bookedCount = Number(
    trip._count?.bookingSeats ??
      (typeof trip.availableSeats === 'number'
        ? Math.max(0, totalSeats - trip.availableSeats)
        : 0)
  );
  const availableSeats =
    typeof trip.availableSeats === 'number'
      ? trip.availableSeats
      : Math.max(0, totalSeats - bookedCount);

  return {
    ...trip,
    id: trip.id,
    code: trip.code || `TR-${trip.id}`,
    companyId: trip.companyId ?? company.id,
    originId: trip.originId ?? origin.id,
    destinationId: trip.destinationId ?? destination.id,
    company,
    origin,
    destination,
    departureAt: trip.departureAt,
    arrivalAt: trip.arrivalAt,
    date: trip.departureAt ? trip.departureAt.slice(0, 10) : '',
    departureTime: validDates
      ? departureDate.toLocaleTimeString('ar-SY', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—',
    arrivalTime: validDates
      ? arrivalDate.toLocaleTimeString('ar-SY', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—',
    duration: durationMinutes,
    distance: calculateApproxDistance(origin, destination),
    price: Number(trip.price ?? 0),
    totalSeats,
    bookedSeatsCount: bookedCount,
    availableSeats,
    status: trip.status || 'AVAILABLE',
    busClass: totalSeats <= 32 ? 'vip' : 'standard',
    classLabel: totalSeats <= 32 ? 'بولمان رجال أعمال VIP (2+1)' : 'بولمان سياحي (2+2)',
  };
}

export function normalizeBookingItem(booking) {
  const trip = booking.trip ? normalizeTripItem(booking.trip) : null;
  const origin = trip?.origin || normalizeCityItem(booking.origin, booking.originId);
  const destination =
    trip?.destination || normalizeCityItem(booking.destination, booking.destinationId);
  const company = trip?.company || normalizeCompanyItem(booking.company, booking.companyId);
  const rawSeats = Array.isArray(booking.seats) ? booking.seats : [];

  return {
    ...booking,
    id: booking.id,
    code: booking.code || `SR-${booking.id}`,
    status: booking.status || 'CONFIRMED',
    totalPrice: Number(booking.totalPrice ?? booking.total ?? 0),
    createdAt: booking.createdAt,
    cancelledAt: booking.cancelledAt || null,
    userId: booking.userId ?? booking.user?.id,
    user: {
      id: booking.user?.id ?? booking.userId,
      name: booking.user?.name || 'مسافر مَسار',
      email: booking.user?.email || '—',
    },
    tripId: booking.tripId ?? trip?.id,
    trip,
    origin,
    destination,
    company,
    seats: rawSeats.map((s) => ({
      id: s.id,
      seatNumber: s.seatNumber ?? s.number ?? s,
      passengerName: s.passengerName || booking.user?.name || 'مسافر',
      passengerPhone: s.passengerPhone || '—',
    })),
    seatNumbers: rawSeats.map((s) =>
      typeof s === 'object' ? s.seatNumber ?? s.number : s
    ),
  };
}

export function normalizeUserItem(user) {
  return {
    ...user,
    id: user.id,
    name: user.name || 'مستخدم مَسار',
    email: user.email || '—',
    role: user.role || 'USER',
    createdAt: user.createdAt || null,
  };
}

// 1. Overview
export async function fetchDashboardOverview() {
  const { data } = await apiClient.get('/overview');
  const raw = unwrap(data) || {};
  return {
    customers: Number(raw.customers ?? 0),
    companies: Number(raw.companies ?? 0),
    upcomingTrips: Number(raw.upcomingTrips ?? 0),
    totalBookings: Number(raw.totalBookings ?? 0),
    confirmedBookings: Number(raw.confirmedBookings ?? 0),
  };
}

// 2. Cities
export async function fetchDashboardCities() {
  const { data } = await apiClient.get('/cities');
  const list = unwrap(data);
  const items = Array.isArray(list) ? list : list?.items || CITIES;
  return items.map((city) => normalizeCityItem(city, city.id));
}

// 3. Companies (GET, POST, PATCH, DELETE)
export async function fetchDashboardCompanies() {
  const { data } = await apiClient.get('/companies');
  const list = unwrap(data);
  const items = Array.isArray(list) ? list : list?.items || [];
  return items.map((company) => normalizeCompanyItem(company, company.id));
}

export async function createDashboardCompany({ name, logoUrl }) {
  const payload = {
    name: String(name || '').trim(),
    ...(logoUrl && String(logoUrl).trim() ? { logoUrl: String(logoUrl).trim() } : {}),
  };
  const { data } = await apiClient.post('/companies', payload);
  return normalizeCompanyItem(unwrap(data));
}

export async function updateDashboardCompany({ id, name, logoUrl, isActive }) {
  const payload = {};
  if (typeof name === 'string' && name.trim()) payload.name = name.trim();
  if (typeof logoUrl === 'string') payload.logoUrl = logoUrl.trim();
  if (typeof isActive === 'boolean') payload.isActive = isActive;

  const { data } = await apiClient.patch(`/companies/${id}`, payload);
  return normalizeCompanyItem(unwrap(data), id);
}

export async function deleteDashboardCompany(id) {
  const { data } = await apiClient.delete(`/companies/${id}`);
  return unwrap(data);
}

// 4. Trips (GET, GET/:id, POST, PATCH/:id, DELETE/:id)
export async function fetchDashboardTrips() {
  const { data } = await apiClient.get('/trips');
  const list = unwrap(data);
  const items = Array.isArray(list) ? list : list?.items || [];
  return items.map(normalizeTripItem);
}

export async function fetchDashboardTripById(id) {
  const { data } = await apiClient.get(`/trips/${id}`);
  return normalizeTripItem(unwrap(data));
}

export async function createDashboardTrip({
  companyId,
  originId,
  destinationId,
  departureAt,
  arrivalAt,
  price,
  totalSeats,
}) {
  const payload = {
    companyId: Number(companyId),
    originId: Number(originId),
    destinationId: Number(destinationId),
    departureAt: new Date(departureAt).toISOString(),
    arrivalAt: new Date(arrivalAt).toISOString(),
    price: Number(price),
    totalSeats: Number(totalSeats),
  };
  const { data } = await apiClient.post('/trips', payload);
  return normalizeTripItem(unwrap(data));
}

export async function updateDashboardTrip({
  id,
  companyId,
  originId,
  destinationId,
  departureAt,
  arrivalAt,
  price,
  totalSeats,
  status,
}) {
  const payload = {};
  if (companyId !== undefined) payload.companyId = Number(companyId);
  if (originId !== undefined) payload.originId = Number(originId);
  if (destinationId !== undefined) payload.destinationId = Number(destinationId);
  if (departureAt) payload.departureAt = new Date(departureAt).toISOString();
  if (arrivalAt) payload.arrivalAt = new Date(arrivalAt).toISOString();
  if (price !== undefined) payload.price = Number(price);
  if (totalSeats !== undefined) payload.totalSeats = Number(totalSeats);
  if (status) payload.status = status;

  const { data } = await apiClient.patch(`/trips/${id}`, payload);
  return normalizeTripItem(unwrap(data));
}

export async function deleteDashboardTrip(id) {
  const { data } = await apiClient.delete(`/trips/${id}`);
  return unwrap(data);
}

// 5. Bookings (GET, GET/:id, POST/:id/cancel)
export async function fetchDashboardBookings() {
  const { data } = await apiClient.get('/bookings');
  const list = unwrap(data);
  const items = Array.isArray(list) ? list : list?.items || [];
  return items.map(normalizeBookingItem);
}

export async function fetchDashboardBookingById(id) {
  const { data } = await apiClient.get(`/bookings/${id}`);
  return normalizeBookingItem(unwrap(data));
}

export async function cancelDashboardBooking(id) {
  const { data } = await apiClient.post(`/bookings/${id}/cancel`);
  return unwrap(data);
}

// 6. Users (GET, GET/:id)
export async function fetchDashboardUsers() {
  const { data } = await apiClient.get('/users');
  const list = unwrap(data);
  const items = Array.isArray(list) ? list : list?.items || [];
  return items.map(normalizeUserItem);
}

export async function fetchDashboardUserById(id) {
  const { data } = await apiClient.get(`/users/${id}`);
  return normalizeUserItem(unwrap(data));
}
