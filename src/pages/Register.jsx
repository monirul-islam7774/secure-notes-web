import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { toInterests } from '../components.jsx';

export default function Register() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/notes" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api('/auth/register', {
        method: 'POST',
        body: { name: form.name, email: form.email, password: form.password, interests: toInterests(form.interests) },
      });
      login(token, user);
      navigate('/notes', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input placeholder="Name" required value={form.name} onChange={set('name')} />
        <input type="email" placeholder="Email" required value={form.email} onChange={set('email')} />
        <input type="password" placeholder="Password (min 6 chars)" minLength={6} required value={form.password} onChange={set('password')} />
        <input placeholder="Interests, comma separated (e.g. chess, reading)" value={form.interests} onChange={set('interests')} />
        <button disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="muted">Have an account? <Link to="/login">Login</Link></p>
    </>
  );
}
