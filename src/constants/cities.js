const CITY_DATA = [
  [1, 'damascus', 'دمشق', 33.5138, 36.2765, 'كراج القابون الدولي', 'العاصمة وبوابة الجنوب'],
  [2, 'aleppo', 'حلب', 36.2021, 37.1343, 'كراج الراموسة', 'عاصمة الشمال الاقتصادي'],
  [3, 'homs', 'حمص', 34.7324, 36.7137, 'كراج البولمان الشمالي', 'عقدة المواصلات الوسطى'],
  [4, 'hama', 'حماة', 35.1318, 36.7578, 'كراج البولمان المركزي', 'حاضرة العاصي والنواعير'],
  [5, 'latakia', 'اللاذقية', 35.5317, 35.7901, 'كراج البولمان الجديد', 'عروس الساحل السوري'],
  [6, 'tartus', 'طرطوس', 34.8959, 35.8866, 'كراج طرطوس للبولمان', 'بوابة المتوسط الساحلية'],
  [7, 'idlib', 'إدلب', 35.9306, 36.6339, 'كراج الانطلاق المركزي', 'الشمال الغربي والزيتون'],
  [8, 'deir', 'دير الزور', 35.3359, 40.1408, 'كراج البولمان العام', 'حاضرة الفرات والشرق'],
  [9, 'raqqa', 'الرقة', 35.95, 39.0167, 'كراج الرقة المركزي', 'ضفاف الفرات والجزيرة'],
  [10, 'hasakah', 'الحسكة', 36.5024, 40.7477, 'كراج الحسكة للبولمان', 'أقصى الشمال الشرقي'],
  [11, 'daraa', 'درعا', 32.6189, 36.1021, 'كراج درعا العام', 'سهل حوران وبوابة الجنوب'],
  [12, 'sweida', 'السويداء', 32.7081, 36.5695, 'كراج السويداء الجنوبي', 'جبل العرب وحجر البازلت'],
  [13, 'quneitra', 'القنيطرة', 33.1265, 35.8246, 'محطة انطلاق القنيطرة', 'الجولان والجنوب الغربي'],
  [14, 'rif-damascus', 'ريف دمشق', 33.63, 36.46, 'كراج السومرية', 'الغوطة والقلمون والزبداني'],
];

export const CITIES = CITY_DATA.map(([numericId, slug, name, lat, lng, terminal, region]) => ({
  id: numericId,
  slug,
  name,
  lat,
  lng,
  latitude: lat,
  longitude: lng,
  terminal,
  region,
}));

export function getCityById(idOrCity) {
  if (!idOrCity) return CITIES[0];

  const rawId = typeof idOrCity === 'object' ? idOrCity.id : idOrCity;
  const rawName = typeof idOrCity === 'object' ? idOrCity.name || idOrCity.title : null;
  const rawLat = typeof idOrCity === 'object' ? Number(idOrCity.latitude ?? idOrCity.lat) : NaN;
  const rawLng = typeof idOrCity === 'object' ? Number(idOrCity.longitude ?? idOrCity.lng) : NaN;

  const byExactMatch = CITIES.find(
    (city) =>
      String(city.id) === String(rawId) ||
      city.slug === String(rawId).toLowerCase() ||
      city.name === rawId ||
      (rawName && city.name === rawName)
  );
  if (byExactMatch) {
    return {
      ...byExactMatch,
      ...(typeof idOrCity === 'object' ? idOrCity : {}),
      name: rawName || byExactMatch.name,
      terminal: (typeof idOrCity === 'object' && idOrCity.terminal) || byExactMatch.terminal,
    };
  }

  if (!Number.isNaN(rawLat) && !Number.isNaN(rawLng)) {
    const byCoords = CITIES.find(
      (city) => Math.abs(city.lat - rawLat) < 0.08 && Math.abs(city.lng - rawLng) < 0.08
    );
    if (byCoords) {
      return {
        ...byCoords,
        ...(typeof idOrCity === 'object' ? idOrCity : {}),
        name: rawName || byCoords.name,
      };
    }
  }

  if (typeof idOrCity === 'object' && idOrCity !== null) {
    return {
      ...CITIES[0],
      ...idOrCity,
      name: idOrCity.name || CITIES[0].name,
      terminal: idOrCity.terminal || 'الكراج المركزي للبولمان',
      lat: rawLat || CITIES[0].lat,
      lng: rawLng || CITIES[0].lng,
    };
  }

  return CITIES[0];
}

export function calculateApproxDistance(originCity, destinationCity) {
  const lat1 = Number(originCity?.lat ?? originCity?.latitude ?? 33.5138);
  const lng1 = Number(originCity?.lng ?? originCity?.longitude ?? 36.2765);
  const lat2 = Number(destinationCity?.lat ?? destinationCity?.latitude ?? 36.2021);
  const lng2 = Number(destinationCity?.lng ?? destinationCity?.longitude ?? 37.1343);
  const latDist = (lat1 - lat2) * 110;
  const lonDist = (lng1 - lng2) * 88;
  return Math.max(75, Math.round(Math.hypot(latDist, lonDist) * 1.2));
}
