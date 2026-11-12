import { useCallback, useEffect, useState } from 'react';

// Loads data from an async function; exposes loading / error / reload.
export function useLoad(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((e) => !cancelled && setState({ data: null, loading: false, error: e.message }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => run(), [run]);
  return { ...state, reload: run };
}

export function Status({ loading, error }) {
  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  return null;
}

export function Pager({ data, onPage }) {
  if (!data) return null;
  return (
    <div className="pager">
      <button disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>Prev</button>
      <span>Page {data.page} of {data.totalPages} ({data.total} total)</span>
      <button disabled={data.page >= data.totalPages} onClick={() => onPage(data.page + 1)}>Next</button>
    </div>
  );
}

export const fmt = (d) => new Date(d).toLocaleString();
export const toInterests = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
