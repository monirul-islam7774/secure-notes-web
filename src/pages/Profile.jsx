import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { toInterests } from '../components.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [interests, setInterests] = useState((user.interests || []).join(', '));
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');
    try {
      const res = await api('/users/me', { method: 'PATCH', body: { name, interests: toInterests(interests) } });
      setUser(res.user);
      setMsg('Profile saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1>Profile</h1>
      <p className="muted">{user.email} · role: {user.role}</p>
      <form onSubmit={submit}>
        <label>Name <input required value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Interests (comma separated) <input value={interests} onChange={(e) => setInterests(e.target.value)} /></label>
        <div><button disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
      </form>
      {msg && <p>{msg}</p>}
      {error && <p className="error">{error}</p>}
    </>
  );
}
