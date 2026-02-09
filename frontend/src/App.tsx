import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncidentsPage from './pages/IncidentsPage';

function App() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
            />
            <Route
                path="/"
                element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
            >
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="incidents" element={<IncidentsPage />} />
            </Route>
        </Routes>
    );
}

export default App;
