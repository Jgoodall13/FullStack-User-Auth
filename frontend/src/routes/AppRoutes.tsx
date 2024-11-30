import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../pages/ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId?"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
