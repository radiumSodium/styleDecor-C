import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { roleToDashboard } from "../../auth/roleRedirect";

export default function Login() {
  const { login, googleLogin, user, loading, authReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Redirect once auth + DB role is ready
  useEffect(() => {
    if (!authReady) return;
    if (!loading && user?.role) {
      navigate(from || roleToDashboard(user.role), { replace: true });
    }
  }, [authReady, loading, user, from, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    setSubmitting(true);
    try {
      await googleLogin(); // now returns, no redirect
    } catch (error) {
      setErr(error?.message || "Google login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black">Login</h2>
        <p className="text-sm opacity-70 mt-1">
          Access your dashboard based on your role
        </p>
      </div>

      {/* Error */}
      {err && <div className="alert alert-error">{err}</div>}

      {/* Email login */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <label className="form-control w-full">
          <div className="label pb-1">
            <span className="label-text font-medium">Email</span>
          </div>
          <input
            className="input input-bordered w-full h-12 rounded-xl"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label pb-1">
            <span className="label-text font-medium">Password</span>
          </div>
          <input
            className="input input-bordered w-full h-12 rounded-xl"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button
          className="btn btn-primary w-full h-12 rounded-xl mt-2"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="divider my-2">OR</div>

      {/* Google login */}
      <button
        onClick={handleGoogle}
        className="btn btn-outline w-full h-12 rounded-xl"
        disabled={submitting}
      >
        Continue with Google
      </button>

      <p className="text-sm opacity-70 text-center">
        New here?{" "}
        <Link className="link link-primary font-medium" to="/register">
          Create account
        </Link>
      </p>
    </div>
  );
}
