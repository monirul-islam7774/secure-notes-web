import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { Pager, Status, toInterests, useLoad } from '../components.jsx';

const empty = { name: '', email: '', password: '', role: 'user', interests: '' };

function UserRow({ u, isSelf, onChanged, onError }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: u.name, role: u.role });

  async function save() {
    try {
      await api(`/admin/users/${u._id}`, { method: 'PATCH', body: form });
      setEditing(false);
      onChanged();
    } catch (err) {
      onError(err.message);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${u.email} and all their notes and posts?`)) return;
    try {
      await api(`/admin/users/${u._id}`, { method: 'DELETE' });
      onChanged(true);
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <tr>
      <td>{editing ? <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /> : u.name}</td>
      <td>{u.email}</td>
      <td>
        {editing ? (
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        ) : u.role}
      </td>
      <td>{(u.interests || []).map((i) => <span className="tag" key={i}>{i}</span>)}</td>
      <td className="row">
        {editing ? (
          <>
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button className="danger" disabled={isSelf} title={isSelf ? 'You cannot delete yourself' : ''} onClick={remove}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useLoad(() => api('/admin/users', { params: { page, limit: 10 } }), [page]);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [rowError, setRowError] = useState('');
  const [saving, setSaving] = useState(false);

  async function create(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await api('/admin/users', { method: 'POST', body: { ...form, interests: toInterests(form.interests) } });
      setForm(empty);
      if (page === 1) reload();
      else setPage(1);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const changed = (deleted) => {
    setRowError('');
    if (deleted && data?.data.length === 1 && page > 1) setPage(page - 1);
    else reload();
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <h1>Users</h1>
      <form className="row" onSubmit={create}>
        <input placeholder="Name" required value={form.name} onChange={set('name')} />
        <input type="email" placeholder="Email" required value={form.email} onChange={set('email')} />
        <input type="password" placeholder="Password" minLength={6} required value={form.password} onChange={set('password')} />
        <select value={form.role} onChange={set('role')}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <input placeholder="Interests (comma separated)" value={form.interests} onChange={set('interests')} />
        <button disabled={saving}>{saving ? 'Creating…' : 'Create user'}</button>
      </form>
      {formError && <p className="error">{formError}</p>}
      {rowError && <p className="error">{rowError}</p>}
      <Status loading={loading} error={error} />
      {data && (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Interests</th><th /></tr></thead>
          <tbody>
            {data.data.map((u) => (
              <UserRow key={u._id} u={u} isSelf={u._id === me._id} onChanged={changed} onError={setRowError} />
            ))}
          </tbody>
        </table>
      )}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
