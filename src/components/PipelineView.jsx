import { useState, useEffect } from 'react';
import { getPipelineFile } from '../api/github';
import { OWNER, REPO, PIPELINE_PATH } from '../utils/config';
import './PipelineView.css';

export default function PipelineView({ token }) {
  const [data, setData] = useState(null);
  const [sha, setSha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p className="pipeline-view__status">Loading pipeline…</p>;

  if (error) return (
    <div className="pipeline-view__status">
      <p className="pipeline-view__error">{error}</p>
      <button className="pipeline-view__retry" onClick={fetchPipeline}>Retry</button>
    </div>
  );

  return (
    <div className="pipeline-view">
      <pre className="pipeline-view__json">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
