import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Pager, Status, fmt, useLoad } from '../components.jsx';

function NoteItem({ note, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: note.title, content: note.content });
  const [error, setError] = useState('');

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      await api(`/notes/${note._id}`, { method: 'PATCH', body: form });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    try {
      await api(`/notes/${note._id}`, { method: 'DELETE' });
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card">
      {editing ? (
        <form onSubmit={save}>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="row">
            <button>Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h3><Link to={`/notes/${note._id}`}>{note.title}</Link></h3>
          <p>{note.content}</p>
          <div className="row">
            <span className="muted">{fmt(note.updatedAt)}</span>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button className="danger" onClick={remove}>Delete</button>
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default function Notes() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useLoad(() => api('/notes', { params: { page, limit: 5 } }), [page]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  async function create(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await api('/notes', { method: 'POST', body: form });
      setForm({ title: '', content: '' });
      if (page === 1) reload();
      else setPage(1);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // If the last note on a page was deleted, step back a page.
  const afterChange = () => (data?.data.length === 1 && page > 1 ? setPage(page - 1) : reload());

  return (
    <>
      <h1>My notes</h1>
      <form onSubmit={create}>
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <div><button disabled={saving}>{saving ? 'Adding…' : 'Add note'}</button></div>
        {formError && <p className="error">{formError}</p>}
      </form>
      <Status loading={loading} error={error} />
      {data?.data.length === 0 && <p className="muted">No notes yet.</p>}
      {data?.data.map((n) => <NoteItem key={n._id} note={n} onChanged={afterChange} />)}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
