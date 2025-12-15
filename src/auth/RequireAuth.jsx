import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
