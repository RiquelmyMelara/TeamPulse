import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from "./pages/Dashboard";
import TeamDashboard from "./pages/TeamDashboard";
import RequireAdmin from './components/RequireAdmin';
import RequireAuth from './components/RequireAuth';
import HomeRedirect from './pages/HomeRedirect';
import GlobalLayout from './layouts/GlobalLayout';
import PublicLayout from "./layouts/PublicLayout";

function App() {
    return (
        <Router>
            <Routes>
                {/* Protected routes with header/footer */}
                <Route element={<GlobalLayout />}>
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
                </Route>

                {/* Public routes (no header/footer) */}
                <Route element={<PublicLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;