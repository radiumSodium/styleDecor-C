import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  tags: "", // comma separated
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

  useEffect(() => {
    if (!canCreate) navigate("/dashboard/user");
  }, [canCreate, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      const payload = {
        title: form.title.trim(),
        price: Number(form.price) || 0,
        category: form.category,
        type: form.type,
        durationMins: Number(form.durationMins) || 60,
        image: form.image.trim(),
        description: form.description.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        active: Boolean(form.active),
      };

      await axiosSecure.post("/api/services", payload);

      setForm(empty);

      // redirect after create
      if (role === "admin") navigate("/dashboard/admin");
      else navigate("/dashboard/decorator");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Failed to create service");
    } finally {
      setSaving(false);
    }
  };

  if (!canCreate) return null;

  return (
    <div className="max-w-4xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-black">Create Service</h1>
        <p className="opacity-70 mt-2">
          Add a new package to show on the Services page.
        </p>
      </div>

      {err && <div className="alert alert-error mt-4">{err}</div>}

      <div className="card bg-base-100 border mt-6">
        <div className="card-body">
          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
            <label className="form-control md:col-span-2">
              <div className="label">
                <span className="label-text font-semibold">Title</span>
              </div>
              <input
                className="input input-bordered"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Premium Wedding Stage Decor"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text font-semibold">Price (৳)</span>
              </div>
              <input
                className="input input-bordered"
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="12000"
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text font-semibold">
                  Duration (mins)
                </span>
              </div>
              <input
                className="input input-bordered"
                type="number"
                min={15}
                value={form.durationMins}
                onChange={(e) =>
                  setForm((p) => ({ ...p, durationMins: e.target.value }))
                }
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text font-semibold">Category</span>
              </div>
              <select
                className="select select-bordered"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                <option value="home">home</option>
                <option value="ceremony">ceremony</option>
              </select>
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text font-semibold">Type</span>
              </div>
              <select
                className="select select-bordered"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="studio">studio</option>
                <option value="onsite">onsite</option>
                <option value="both">both</option>
              </select>
            </label>

            <label className="form-control md:col-span-2">
              <div className="label">
                <span className="label-text font-semibold">Image URL</span>
              </div>
              <input
                className="input input-bordered"
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://..."
              />
            </label>

            <label className="form-control md:col-span-2">
              <div className="label">
                <span className="label-text font-semibold">Description</span>
              </div>
              <textarea
                className="textarea textarea-bordered"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Stage + floral + lighting + setup..."
              />
            </label>

            <label className="form-control md:col-span-2">
              <div className="label">
                <span className="label-text font-semibold">Tags</span>
              </div>
              <input
                className="input input-bordered"
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="Floral, Lighting, Stage"
              />
            </label>

            <label className="label cursor-pointer md:col-span-2 justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={form.active}
                onChange={(e) =>
                  setForm((p) => ({ ...p, active: e.target.checked }))
                }
              />
              <span className="label-text">Active</span>
            </label>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setForm(empty)}
                disabled={saving}
              >
                Reset
              </button>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Creating..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
