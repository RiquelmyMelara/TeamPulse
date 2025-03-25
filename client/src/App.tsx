import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import TeamDashboard from "./pages/TeamDashboard";
import Navbar from './components/Navbar';
import RequireAdmin from './components/RequireAdmin';
import RequireAuth from './components/RequireAuth';
import HomeRedirect from './pages/HomeRedirect';

function App() {
  return (
      <Router>
          <Navbar />
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/team-dashboard"
                element={
                    <RequireAdmin>
                        <TeamDashboard />
                    </RequireAdmin>
                }
            />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
  );
}

export default App;