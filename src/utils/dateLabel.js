export function dateLabel(isoString) {
  if (!isoString) return null;
  const parts = isoString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);
  const opts = { weekday: 'short', month: 'short', day: 'numeric' };
  if (year !== new Date().getFullYear()) opts.year = 'numeric';
  const formatted = date.toLocaleDateString('en-US', opts);
  if (diffDays === 0) return { label: 'Today', urgency: 'today' };
  if (diffDays === 1) return { label: 'Tomorrow', urgency: 'today' };
  if (diffDays >= 2 && diffDays <= 7) return { label: `In ${diffDays} days · ${formatted}`, urgency: 'soon' };
  return { label: formatted, urgency: 'normal' };
}
