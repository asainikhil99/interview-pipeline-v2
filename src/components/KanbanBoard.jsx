import { LANES, groupByLane } from '../utils/lanes';
import Lane from './Lane';
import './KanbanBoard.css';

export default function KanbanBoard({ entries, onCardClick }) {
  const grouped = groupByLane(entries);

  return (
    <div className="kanban-board">
      {LANES.map(lane => (
        <Lane key={lane} name={lane} entries={grouped[lane]} onCardClick={onCardClick} />
      ))}
    </div>
  );
}
