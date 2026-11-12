import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AdminRoute, ProtectedRoute, useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Notes from './pages/Notes.jsx';
import NoteView from './pages/NoteView.jsx';
import Profile from './pages/Profile.jsx';
import Posts from './pages/Posts.jsx';
import UserPosts from './pages/UserPosts.jsx';
import Interests from './pages/Interests.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminNotes from './pages/AdminNotes.jsx';

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav>
      <strong>Secure Notes</strong>
      {user ? (
        <>
          <Link to="/notes">My notes</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/interests">Interests</Link>
          <Link to="/profile">Profile</Link>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/users">Admin: users</Link>
              <Link to="/admin/notes">Admin: notes</Link>
            </>
          )}
          <span className="spacer" />
          <span>{user.name} ({user.role})</span>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </>
      ) : (
        <>
          <span className="spacer" />
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;
const adminGuard = (el) => <ProtectedRoute><AdminRoute>{el}</AdminRoute></ProtectedRoute>;

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notes" element={guard(<Notes />)} />
          <Route path="/notes/:id" element={guard(<NoteView />)} />
          <Route path="/profile" element={guard(<Profile />)} />
          <Route path="/posts" element={guard(<Posts />)} />
          <Route path="/users/:id/posts" element={guard(<UserPosts />)} />
          <Route path="/interests" element={guard(<Interests />)} />
          <Route path="/admin/users" element={adminGuard(<AdminUsers />)} />
          <Route path="/admin/notes" element={adminGuard(<AdminNotes />)} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
