import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { roleToDashboard } from "../../auth/roleRedirect";
import { uploadToImgBB } from "../../utils/uploadToImgBB";

export default function Register() {
  const { register, googleLogin, user, loading, authReady } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null); 
  const [photoPreview, setPhotoPreview] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Redirect when dbUser is ready
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
      let photoURL = "";

      if (photoFile) {
        photoURL = await uploadToImgBB(photoFile);
      }

      await register({ name, email, password, photoURL });
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
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black">Create your account</h2>
        <p className="text-sm opacity-70 mt-1">
          New accounts start as <span className="font-semibold">User</span>.
          Admin can assign Decorator/Admin later.
        </p>
      </div>

      {/* Error */}
      {err && <div className="alert alert-error">{err}</div>}

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <label className="form-control w-full">
          <div className="label pb-1">
            <span className="label-text font-medium">Full name</span>
          </div>
          <input
            className="input input-bordered w-full h-12 rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </label>

        {/* REAL profile image upload */}
        <label className="form-control w-full">
          <div className="label pb-1">
            <span className="label-text font-medium">
              Profile photo (optional)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
                <img
                  src={photoPreview || "https://i.pravatar.cc/100?img=12"}
                  alt="preview"
                />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full h-12 rounded-xl"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setPhotoFile(f);
                setPhotoPreview(f ? URL.createObjectURL(f) : "");
              }}
            />
          </div>

          <div className="mt-2 text-xs opacity-60">
            Uploads to ImageBB, then saves URL automatically.
          </div>
        </label>

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
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
        </label>

        <button
          className="btn btn-primary w-full h-12 rounded-xl mt-2"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Register"}
        </button>
      </form>

      <div className="divider my-2">OR</div>

      <button
        onClick={handleGoogle}
        className="btn btn-outline w-full h-12 rounded-xl"
        disabled={submitting}
      >
        Continue with Google
      </button>

      <p className="text-sm opacity-70 text-center">
        Already have an account?{" "}
        <Link className="link link-primary font-medium" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
