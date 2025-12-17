import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading, authReady } = useAuth();
  const location = useLocation();

  // wait until auth is ready (important for refresh)
  if (!authReady || loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="alert alert-info">Checking login...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // so you can redirect back after login
      />
    );
  }

  return children;
}
