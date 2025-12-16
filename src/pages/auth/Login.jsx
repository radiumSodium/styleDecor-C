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

  // ✅ Redirect when db user is ready
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
      // ✅ no manual navigate here
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
      await googleLogin();
    } catch (error) {
      setErr(error?.message || "Google login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-black">Login</h2>

      {err && <div className="alert alert-error mt-3">{err}</div>}

      <form onSubmit={handleEmailLogin} className="mt-4 space-y-3">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            className="input input-bordered w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <input
            className="input input-bordered w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="divider">OR</div>

      <button
        onClick={handleGoogle}
        className="btn btn-outline w-full"
        disabled={submitting}
      >
        Continue with Google
      </button>

      <p className="mt-4 text-sm opacity-70">
        New here?{" "}
        <Link className="link link-primary" to="/register">
          Create account
        </Link>
      </p>
    </>
  );
}
