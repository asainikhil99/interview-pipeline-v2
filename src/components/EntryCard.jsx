import { dateLabel } from '../utils/dateLabel';
import './EntryCard.css';

export default function EntryCard({ entry, onClick }) {
  const dl = dateLabel(entry.date);

  return (
    <button className="entry-card" onClick={onClick}>
      <div className="entry-card__company">{entry.company}</div>
      <div className="entry-card__fields">
        {entry.recruiter && (
          <div className="entry-card__recruiter">&bull; {entry.recruiter}</div>
        )}
        {dl && (
          <div className={`entry-card__date-pill entry-card__date-pill--${dl.urgency}`}>
            {dl.label}
          </div>
        )}
      </div>
    </button>
  );
}
