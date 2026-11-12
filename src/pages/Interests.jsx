import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Pager, Status, useLoad } from '../components.jsx';

export default function Interests() {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const { data, loading, error } = useLoad(() => api('/users/grouped-by-interest', { params: { page, limit: 5, interest } }), [page, interest]);

  function apply(e) {
    e.preventDefault();
    setPage(1);
    setInterest(input.trim());
  }

  return (
    <>
      <h1>Users grouped by interest</h1>
      <form className="row" onSubmit={apply}>
        <input placeholder="Filter by interest (e.g. chess)" value={input} onChange={(e) => setInput(e.target.value)} />
        <button>Filter</button>
        {interest && <button type="button" onClick={() => { setInput(''); setInterest(''); setPage(1); }}>Clear</button>}
      </form>
      <Status loading={loading} error={error} />
      {data?.data.length === 0 && <p className="muted">No users found.</p>}
      {data?.data.map((g) => (
        <div className="card" key={g._id}>
          <h3>{g._id} <span className="muted">({g.count} {g.count === 1 ? 'user' : 'users'})</span></h3>
          <ul>
            {g.users.map((u) => (
              <li key={u._id}><Link to={`/users/${u._id}/posts`}>{u.name}</Link> <span className="muted">{u.email}</span></li>
            ))}
          </ul>
        </div>
      ))}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
