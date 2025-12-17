import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../auth/useAuth";

const empty = {
  title: "",
  price: "",
  category: "home",
  type: "both",
  durationMins: 60,
  image: "",
  description: "",
  tags: "",
  active: true,
};

export default function CreateService() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || "user";
  const canCreate = role === "admin" || role === "decorator";

  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!canCreate) navigate("/dashboard/user");
  }, [canCreate, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");

    try {
      const payload = {
        title: form.title.trim(),
        price: Number(form.price) || 0,
        category: form.category,
        type: form.type,
        durationMins: Number(form.durationMins) || 60,
        image: form.image.trim(),
        description: form.description.trim(),
        tags: String(form.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        active: Boolean(form.active),
      };

      await axiosSecure.post("/api/services", payload);

      setMsg("Service created successfully ✅");
      setForm(empty);

      setTimeout(() => {
        navigate(
          role === "admin" ? "/dashboard/admin" : "/dashboard/decorator"
        );
      }, 600);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create service");
    } finally {
      setSaving(false);
    }
  };

  if (!canCreate) return null;

  return (
    <div className="w-full">
      {/* Header row (aligned like your dashboards) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">Create Service</h1>
          <p className="opacity-70 mt-2">
            Add a new package to your services list.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={role === "admin" ? "/dashboard/admin" : "/dashboard/decorator"}
            className="btn btn-ghost btn-sm"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={() => setForm(empty)}
            className="btn btn-outline btn-sm"
            disabled={saving}
          >
            Reset
          </button>
        </div>
      </div>

      {err && <div className="alert alert-error mt-4">{err}</div>}
      {msg && <div className="alert alert-success mt-4">{msg}</div>}

      {/* Card */}
      <div className="card bg-base-100 border mt-6">
        <div className="card-body">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* Title */}
            <div className="form-control lg:col-span-2">
              <label className="label pb-1">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                className="input input-bordered w-full"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Premium Wedding Stage Decor"
              />
            </div>

            {/* Price */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Price (৳)</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="12000"
              />
            </div>

            {/* Duration */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">
                  Duration (mins)
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                type="number"
                min={15}
                value={form.durationMins}
                onChange={(e) =>
                  setForm((p) => ({ ...p, durationMins: e.target.value }))
                }
              />
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                <option value="home">home</option>
                <option value="ceremony">ceremony</option>
              </select>
            </div>

            {/* Type */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold">Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="studio">studio</option>
                <option value="onsite">onsite</option>
                <option value="both">both</option>
              </select>
            </div>

            {/* Image */}
            <div className="form-control lg:col-span-2">
              <label className="label pb-1">
                <span className="label-text font-semibold">Image URL</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>

            {/* Description */}
            <div className="form-control lg:col-span-2">
              <label className="label pb-1">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full min-h-[120px]"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Stage + floral + lighting + setup..."
              />
            </div>

            {/* Tags */}
            <div className="form-control lg:col-span-2">
              <label className="label pb-1">
                <span className="label-text font-semibold">
                  Tags (comma separated)
                </span>
              </label>
              <input
                className="input input-bordered w-full"
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="Floral, Lighting, Stage"
              />
              <div className="text-xs opacity-60 mt-1">
                Example: Floral, Lighting, Stage
              </div>
            </div>

            {/* Active toggle row (aligned nicely) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between p-4 rounded-2xl border bg-base-200">
                <div>
                  <div className="font-semibold">Active</div>
                  <div className="text-xs opacity-70">
                    Turn off to hide this service from public listing.
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, active: e.target.checked }))
                  }
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  navigate(
                    role === "admin"
                      ? "/dashboard/admin"
                      : "/dashboard/decorator"
                  )
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary rounded-full"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* bottom spacing like other pages */}
      <div className="h-6" />
    </div>
  );
}
