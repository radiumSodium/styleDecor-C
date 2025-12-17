import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { roleToDashboard } from "../../auth/roleRedirect";

export default function Register() {
  const { register, googleLogin, user, loading, authReady } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Redirect when dbUser is ready
  useEffect(() => {
    if (!authReady) return;
    if (!loading && user?.role) {
      navigate(roleToDashboard(user.role), { replace: true });
    }
  }, [authReady, loading, user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await register({ name, email, password, photoURL });
      // ✅ no navigate here
    } catch (error) {
      setErr(error?.message || "Registration failed");
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
      setErr(error?.message || "Google signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-black">Create your account</h2>
      <p className="opacity-70">
        New accounts start as <span className="font-semibold">User</span>. Admin
        can assign Decorator/Admin later.
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
            minLength={6}
            required
          />
        </label>

        <button className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Creating..." : "Register"}
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
        Already have an account?{" "}
        <Link className="link link-primary" to="/login">
          Login
        </Link>
      </p>
    </>
  );
}
