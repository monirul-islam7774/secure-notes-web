import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { Pager, Status, fmt, useLoad } from '../components.jsx';

export default function UserPosts() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const { data, loading, error } = useLoad(() => api(`/users/${id}/posts`, { params: { page, limit: 5 } }), [id, page]);
  return (
    <>
      <p><Link to="/posts">&larr; All posts</Link></p>
      <h1>Posts by {data?.user?.name ?? '…'}</h1>
      {data?.user?.interests?.length > 0 && <p>{data.user.interests.map((i) => <span className="tag" key={i}>{i}</span>)}</p>}
      <Status loading={loading} error={error} />
      {data?.data.length === 0 && <p className="muted">This user has no posts.</p>}
      {data?.data.map((p) => (
        <div className="card" key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
          <span className="muted">{fmt(p.createdAt)}</span>
        </div>
      ))}
      <Pager data={data} onPage={setPage} />
    </>
  );
}
