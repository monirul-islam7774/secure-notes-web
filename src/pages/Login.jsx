import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/notes" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: form });
      login(token, user);
      navigate(location.state?.from || '/notes', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </>
  );
}
