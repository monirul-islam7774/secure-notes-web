import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { Pager, Status, fmt, useLoad } from '../components.jsx';

export default function AdminNotes() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useLoad(() => api('/admin/notes', { params: { page, limit: 10 } }), [page]);
  return (
    <>
      <h1>All notes</h1>
      <Status loading={loading} error={error} />
      {data && (
        <table>
          <thead><tr><th>Title</th><th>Owner</th><th>Updated</th></tr></thead>
          <tbody>
            {data.data.map((n) => (
              <tr key={n._id}>
                <td><Link to={`/notes/${n._id}`}>{n.title}</Link></td>
                <td>{n.owner ? `${n.owner.name} (${n.owner.email})` : 'deleted user'}</td>
                <td>{fmt(n.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
