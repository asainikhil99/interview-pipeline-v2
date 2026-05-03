import { useState, useEffect, useRef } from 'react';
import { STATUS_TO_LANE } from '../utils/lanes';
import './EntryFormModal.css';

const EMPTY = { company: '', role: '', recruiter: '', status: '', stage: '', nextStep: '', date: '', notes: '' };

export default function EntryFormModal({ isOpen, onClose, onSubmit, isSaving, error }) {
  const [values, setValues] = useState(EMPTY);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setValues(EMPTY);
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = values.company.trim() && values.role.trim() && values.status && !isSaving;

  function set(field) {
    return e => setValues(v => ({ ...v, [field]: e.target.value }));
  }

  function handleBackdrop(e) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ ...values });
  }

  return (
    <div className="modal-backdrop" ref={backdropRef} onMouseDown={handleBackdrop}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal__close" onClick={onClose} aria-label="Close" disabled={isSaving}>
          ×
        </button>
        <h2 className="modal__title" id="modal-title">Add entry</h2>

        {error && <p className="modal__error">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-company">Company *</label>
            <input id="ef-company" type="text" value={values.company} onChange={set('company')} autoFocus />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-role">Role *</label>
            <input id="ef-role" type="text" value={values.role} onChange={set('role')} />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-recruiter">Recruiter</label>
            <input id="ef-recruiter" type="text" value={values.recruiter} onChange={set('recruiter')} />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-status">Status *</label>
            <select id="ef-status" value={values.status} onChange={set('status')}>
              <option value="">— select —</option>
              {Object.keys(STATUS_TO_LANE).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-stage">Stage</label>
            <input id="ef-stage" type="text" value={values.stage} onChange={set('stage')} />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-nextstep">Next step</label>
            <input id="ef-nextstep" type="text" value={values.nextStep} onChange={set('nextStep')} />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-date">Date</label>
            <input id="ef-date" type="date" value={values.date} onChange={set('date')} />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="ef-notes">Notes</label>
            <textarea id="ef-notes" rows={3} value={values.notes} onChange={set('notes')} />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!canSubmit}>
              {isSaving ? 'Saving…' : 'Add entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
