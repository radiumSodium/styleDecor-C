import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { roleToDashboard } from "../../auth/roleRedirect";

export default function Login() {
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname; // if user tried a protected page first

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const goNext = (role) => {
    // if they came from a protected route, take them there, else role dashboard
    navigate(from || roleToDashboard(role), { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password });
      // AuthProvider will create session and set user.role
      // Wait a micro tick for context update:
      setTimeout(() => goNext(user?.role || "user"), 0);
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      await googleLogin();
      setTimeout(() => goNext(user?.role || "user"), 0);
    } catch (error) {
      setErr(error?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: brand */}
        <div className="hidden lg:block">
          <h1 className="text-5xl font-black leading-tight">
            Welcome back to <span className="text-primary">StyleDecor</span>
          </h1>
          <p className="mt-4 opacity-70 text-lg">
            Login to book services, manage bookings, or update projects based on
            your role.
          </p>
          <div className="mt-8 p-6 rounded-2xl bg-base-200 border">
            <p className="font-semibold">Roles supported</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="badge badge-outline">User</span>
              <span className="badge badge-outline">Admin</span>
              <span className="badge badge-outline">Decorator</span>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-2xl">Login</h2>

            {err && <div className="alert alert-error mt-2">{err}</div>}

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

              <button className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="divider">OR</div>

            <button
              onClick={handleGoogle}
              className="btn btn-outline w-full"
              disabled={loading}
            >
              Continue with Google
            </button>

            <p className="mt-4 text-sm opacity-70">
              New here?{" "}
              <Link className="link link-primary" to="/register">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
