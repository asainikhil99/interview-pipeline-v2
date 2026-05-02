import './EntryCard.css';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  const opts = { weekday: 'short', month: 'short', day: 'numeric' };
  if (year !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('en-US', opts);
}

export default function EntryCard({ entry }) {
  const formatted = formatDate(entry.date);

  return (
    <div className="entry-card">
      <div className="entry-card__company">{entry.company}</div>
      <div className="entry-card__fields">
        {entry.recruiter && (
          <div className="entry-card__field">
            <span className="entry-card__label">Recruiter</span>
            <span>{entry.recruiter}</span>
          </div>
        )}
        {formatted && (
          <div className="entry-card__field">
            <span className="entry-card__label">Next</span>
            <span>{formatted}</span>
          </div>
        )}
      </div>
    </div>
  );
}
