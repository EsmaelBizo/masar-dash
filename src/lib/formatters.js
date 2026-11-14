export function getNextDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function formatMoney(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return '0 ل.س';
  return `${num.toLocaleString('en-US')} ل.س`;
}

export function formatNumber(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export function formatDateArabic(dateString) {
  if (!dateString) return '—';
  try {
    const d = dateString.includes('T')
      ? new Date(dateString)
      : new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('ar-SY', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTimeArabic(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('ar-SY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTimeShort(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString('ar-SY', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDuration(minutes) {
  const total = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins} د`;
  if (mins === 0) return `${hours} س`;
  return `${hours} س ${mins} د`;
}

export function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}
