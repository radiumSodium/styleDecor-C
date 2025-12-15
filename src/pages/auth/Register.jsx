import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { roleToDashboard } from "../../auth/roleRedirect";

export default function Register() {
  const { register, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const goNext = (role) => navigate(roleToDashboard(role), { replace: true });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register({ name, email, password, photoURL });
      // default role is "user"
      setTimeout(() => goNext(user?.role || "user"), 0);
    } catch (error) {
      setErr(error?.message || "Registration failed");
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
      setErr(error?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="card bg-base-100 border shadow-sm max-w-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl">Create your account</h2>
          <p className="opacity-70">
            New accounts start as <span className="font-semibold">User</span>.
            Admin can assign Decorator/Admin later.
          </p>

          {err && <div className="alert alert-error mt-3">{err}</div>}

          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Full name</span>
              </div>
              <input
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Profile photo URL (optional)</span>
              </div>
              <input
                className="input input-bordered w-full"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
              />
            </label>

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
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </label>

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
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
            Already have an account?{" "}
            <Link className="link link-primary" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
