import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

export default function RequireRole({ allow = [], children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
