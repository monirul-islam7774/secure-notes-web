import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Pager, Status, fmt, useLoad } from '../components.jsx';

export default function Posts() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useLoad(() => api('/posts', { params: { page, limit: 5 } }), [page]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  async function create(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await api('/posts', { method: 'POST', body: form });
      setForm({ title: '', body: '' });
      if (page === 1) reload();
      else setPage(1);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1>Posts</h1>
      <p className="muted">Posts are visible to everyone.</p>
      <form onSubmit={create}>
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <div><button disabled={saving}>{saving ? 'Posting…' : 'Create post'}</button></div>
        {formError && <p className="error">{formError}</p>}
      </form>
      <Status loading={loading} error={error} />
      {data?.data.length === 0 && <p className="muted">No posts yet.</p>}
      {data?.data.map((p) => (
        <div className="card" key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
          <span className="muted">
            by {p.author ? <Link to={`/users/${p.author._id}/posts`}>{p.author.name}</Link> : 'unknown'} · {fmt(p.createdAt)}
          </span>
        </div>
      ))}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
