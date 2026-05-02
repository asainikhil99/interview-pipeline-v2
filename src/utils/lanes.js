export const LANES = ['Recruiter Screening', 'Interview', 'Rejected/Accepted'];

export const STATUS_TO_LANE = {
  // 'Applied' intentionally omitted — tracking starts when a recruiter engages
  'Screen Scheduled':    'Recruiter Screening',
  'Screen Done':         'Recruiter Screening',
  'Interview Scheduled': 'Interview',
  'Interview Done':      'Interview',
  'Onsite':              'Interview',
  'Final Round':         'Interview',
  'Offer':               'Rejected/Accepted',
  'Accepted':            'Rejected/Accepted',
  'Rejected':            'Rejected/Accepted',
  'Not Moving Forward':  'Rejected/Accepted',
  'Closed':              'Rejected/Accepted',
  'Withdrawn':           'Rejected/Accepted',
};

export const LANE_COLORS = {
  'Recruiter Screening': '#6c757d',
  'Interview':           '#0d6efd',
  'Rejected/Accepted':   '#495057',
};

// Exact string match — never use includes().
// Returns null for unmapped statuses (caller must filter nulls).
export function getLane(status) {
  return STATUS_TO_LANE[status] ?? null;
}

// Returns new array sorted by date ascending (soonest first).
// Missing/invalid dates sort to the bottom (treated as Infinity).
export function sortByDateAsc(entries) {
  return [...entries].sort((a, b) => {
    const da = Date.parse(a.date);
    const db = Date.parse(b.date);
    return (isNaN(da) ? Infinity : da) - (isNaN(db) ? Infinity : db);
  });
}

export function groupByLane(entries) {
  const groups = {
    'Recruiter Screening': [],
    'Interview': [],
    'Rejected/Accepted': [],
  };
  for (const entry of entries) {
    if (entry.status === 'Applied') continue;   // never tracked
    const lane = getLane(entry.status);
    if (lane === null) continue;                // unknown status — hide, don't misfile
    groups[lane].push(entry);
  }
  groups['Recruiter Screening'] = sortByDateAsc(groups['Recruiter Screening']);
  groups['Interview']           = sortByDateAsc(groups['Interview']);
  groups['Rejected/Accepted']   = sortByDateAsc(groups['Rejected/Accepted']);
  return groups;
}
