import EntryCard from './EntryCard';
import './Lane.css';

export default function Lane({ name, entries }) {
  return (
    <div className="lane">
      <div className="lane__header">
        <span className="lane__name">{name}</span>
        <span className="lane__count">{entries.length}</span>
      </div>
      <div className="lane__body">
        {entries.length === 0 ? (
          <p className="lane__empty">No entries</p>
        ) : (
          entries.map(entry => <EntryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );
}
