import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { Status, fmt, useLoad } from '../components.jsx';

export default function NoteView() {
  const { id } = useParams();
  const { data, loading, error } = useLoad(() => api(`/notes/${id}`), [id]);
  const note = data?.note;
  return (
    <>
      <p><Link to="/notes">&larr; Back to notes</Link></p>
      <Status loading={loading} error={error} />
      {note && (
        <div className="card">
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <p className="muted">
            Owner: {note.owner?.name} ({note.owner?.email}) · Created {fmt(note.createdAt)} · Updated {fmt(note.updatedAt)}
          </p>
        </div>
      )}
    </>
  );
}
