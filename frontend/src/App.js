import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import AdminDashboard from './pages/AdminDashboard';
import { useSelector } from 'react-redux';

export default function App() {

  const { token, user } = useSelector(s => s.auth);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element={<Register />} />

        {!token && <Route path="*" element={<Login />} />}

        {token && (
          <>
            <Route path="/" element={<QuizList />} />
            <Route path="/quiz" element={<QuizDetail />} />
            {user?.role === 'admin' &&
              <Route path="/admin" element={<AdminDashboard />} />
            }
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
}