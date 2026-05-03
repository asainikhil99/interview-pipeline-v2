import { useState, useEffect } from 'react';
import { getPipelineFile, updatePipelineFile } from '../api/github';
import { OWNER, REPO, PIPELINE_PATH } from '../utils/config';
import { newId } from '../utils/idGenerator';
import KanbanBoard from './KanbanBoard';
import EntryFormModal from './EntryFormModal';
import './PipelineView.css';

export default function PipelineView({ token }) {
  const [data, setData] = useState(null);
  const [sha, setSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  async function fetchPipeline() {
    setLoading(true);
    setError('');
    try {
      const result = await getPipelineFile(token, OWNER, REPO, PIPELINE_PATH);
      setData(result.content);
      setSha(result.sha);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPipeline(); }, []);

  async function handleAddEntry(formValues) {
    setIsSaving(true);
    setModalError('');
    const newEntry = { id: newId(), ...formValues };
    const prevData = data;
    const nextData = [...data, newEntry];
    setData(nextData);
    try {
      const newSha = await updatePipelineFile(
        token, OWNER, REPO, PIPELINE_PATH,
        nextData, sha,
        `Add entry: ${formValues.company}`
      );
      setSha(newSha);
      setIsModalOpen(false);
    } catch (err) {
      setData(prevData);
      if (err.code === 'CONFLICT') {
        setModalError('Pipeline changed elsewhere. Refresh and try again.');
        fetchPipeline();
      } else {
        setModalError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <p className="pipeline-view__status">Loading pipeline…</p>;

  if (error) return (
    <div className="pipeline-view__status">
      <p className="pipeline-view__error">{error}</p>
      <button className="pipeline-view__retry" onClick={fetchPipeline}>Retry</button>
    </div>
  );

  return (
    <div className="pipeline-view">
      <div className="pipeline-view__toolbar">
        <button
          className="pipeline-view__add-btn"
          onClick={() => { setModalError(''); setIsModalOpen(true); }}
        >
          Add entry
        </button>
      </div>
      <KanbanBoard entries={data} />
      <EntryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEntry}
        isSaving={isSaving}
        error={modalError}
      />
    </div>
  );
}
