import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";
import { StatusTimeline } from "../../components/StatusTimeline";

export default function AdminDashboard() {
  // ====== data ======
  const [tab, setTab] = useState("bookings"); // bookings | users | services

  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [decoratorId, setDecoratorId] = useState("");
  const [team, setTeam] = useState("");

  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const [services, setServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);

  // edit service modal
  const [editingService, setEditingService] = useState(null);
  const [svcForm, setSvcForm] = useState({
    title: "",
    price: 0,
    category: "home",
    type: "onsite",
    image: "",
    description: "",
  });

  const activeBooking = useMemo(
    () => bookings.find((b) => b._id === activeId),
    [bookings, activeId]
  );

  // ====== loaders ======
  const loadBookings = async () => {
    const [bRes, dRes] = await Promise.all([
      axiosSecure.get("/api/bookings/all"),
      axiosSecure.get("/api/users?role=decorator"),
    ]);
    const bList = bRes.data?.data || [];
    setBookings(bList);
    setActiveId(bList?.[0]?._id || null);
    setDecorators(dRes.data?.data || []);
  };

  const loadUsers = async () => {
    setUserLoading(true);
    try {
      const res = await axiosSecure.get("/api/users"); // all users
      setUsers(res.data?.data || []);
    } finally {
      setUserLoading(false);
    }
  };

  const loadServices = async () => {
    setServiceLoading(true);
    try {
      const res = await axiosSecure.get("/api/services"); // all services
      setServices(res.data?.data || []);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    // initial load of bookings (most common)
    loadBookings();
  }, []);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "services") loadServices();
    if (tab === "bookings") loadBookings();
  }, [tab]);

  // ====== actions ======
  const assignBooking = async () => {
    if (!activeBooking) return;
    await axiosSecure.patch(`/api/bookings/${activeBooking._id}/assign`, {
      decoratorId: decoratorId || null,
      team: team || "",
    });
    await loadBookings();
  };

  const changeUserRole = async (userId, role) => {
    await axiosSecure.patch(`/api/users/${userId}/role`, { role });
    await loadUsers();
  };

  const openEditService = (s) => {
    setEditingService(s);
    setSvcForm({
      title: s.title || s.serviceTitle || "",
      price: Number(s.price || 0),
      category: s.category || "home",
      type: s.type || "onsite",
      image: s.image || "",
      description: s.description || "",
    });
    document.getElementById("svc_edit_modal")?.showModal?.();
  };

  const saveService = async () => {
    if (!editingService?._id) return;
    await axiosSecure.patch(`/api/services/${editingService._id}`, svcForm);
    setEditingService(null);
    await loadServices();
  };

  const deleteService = async (id) => {
    const ok = confirm("Delete this service? This cannot be undone.");
    if (!ok) return;
    await axiosSecure.delete(`/api/services/${id}`);
    await loadServices();
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top bar */}
      {/* <div className="navbar bg-base-100 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between">
          <div>
            <div className="text-xl font-black">
              Style<span className="text-primary">Decor</span> Admin
            </div>
            <div className="text-xs opacity-60">Control Panel</div>
          </div>

          <div className="flex gap-2">
            <Link to="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
            <button
              onClick={() => {
                if (tab === "bookings") loadBookings();
                if (tab === "users") loadUsers();
                if (tab === "services") loadServices();
              }}
              className="btn btn-outline btn-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-5">
        <div className="tabs tabs-boxed bg-base-100 border inline-flex">
          <button
            className={`tab ${tab === "bookings" ? "tab-active" : ""}`}
            onClick={() => setTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={`tab ${tab === "users" ? "tab-active" : ""}`}
            onClick={() => setTab("users")}
          >
            Users
          </button>
          <button
            className={`tab ${tab === "services" ? "tab-active" : ""}`}
            onClick={() => setTab("services")}
          >
            Services
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {tab === "bookings" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* booking list */}
            <div className="card bg-base-100 border lg:col-span-1">
              <div className="card-body">
                <h2 className="font-bold">All Bookings</h2>
                <div className="mt-3 space-y-2 max-h-[520px] overflow-y-auto">
                  {bookings.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => {
                        setActiveId(b._id);
                        setDecoratorId(b.assignedDecoratorId || "");
                        setTeam(b.assignedTeam || "");
                      }}
                      className={`w-full text-left p-3 rounded-xl border ${
                        b._id === activeId
                          ? "border-primary bg-primary/5"
                          : "border-base-300"
                      }`}
                    >
                      <div className="font-semibold">{b.serviceTitle}</div>
                      <div className="text-xs opacity-70">
                        {b.date} • {b.slot}
                      </div>
                      <div className="text-xs opacity-60">{b.userEmail}</div>
                    </button>
                  ))}
                  {!bookings.length && (
                    <div className="opacity-60">No bookings yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* booking details */}
            <div className="card bg-base-100 border lg:col-span-2">
              <div className="card-body">
                <h2 className="text-2xl font-black">Assignment & Status</h2>

                {!activeBooking ? (
                  <div className="opacity-70 mt-3">Select a booking.</div>
                ) : (
                  <>
                    <div className="mt-4 grid md:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl border">
                        <div className="text-sm opacity-70">Customer</div>
                        <div className="font-bold">
                          {activeBooking.userEmail}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border">
                        <div className="text-sm opacity-70">Venue</div>
                        <div className="font-bold">{activeBooking.venue}</div>
                      </div>
                      <div className="p-4 rounded-xl border">
                        <div className="text-sm opacity-70">Current</div>
                        <div className="font-bold">{activeBooking.status}</div>
                      </div>
                    </div>

                    <StatusTimeline statusKey={activeBooking.status} />

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text font-semibold">
                            Assign decorator
                          </span>
                        </div>
                        <select
                          className="select select-bordered"
                          value={decoratorId}
                          onChange={(e) => setDecoratorId(e.target.value)}
                        >
                          <option value="">(not assigned)</option>
                          {decorators.map((d) => (
                            <option key={d._id} value={d._id}>
                              {d.name || d.email}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="form-control">
                        <div className="label">
                          <span className="label-text font-semibold">
                            Assign team (onsite)
                          </span>
                        </div>
                        <input
                          className="input input-bordered"
                          value={team}
                          onChange={(e) => setTeam(e.target.value)}
                          placeholder="Team A / 3 persons / van"
                        />
                      </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={assignBooking}
                        className="btn btn-primary rounded-full"
                      >
                        Save Assignment
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h2 className="text-2xl font-black">User Management</h2>
              <p className="opacity-70 mt-1">
                View all users and change roles (admin/decorator/user).
              </p>

              {userLoading ? (
                <div className="mt-4 alert alert-info">Loading users...</div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="font-semibold">{u.name || "—"}</td>
                          <td className="opacity-80">{u.email}</td>
                          <td>
                            <span className="badge badge-outline capitalize">
                              {u.role}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-2">
                              <button
                                className="btn btn-xs btn-outline"
                                onClick={() => changeUserRole(u._id, "user")}
                              >
                                Make User
                              </button>
                              <button
                                className="btn btn-xs btn-outline"
                                onClick={() =>
                                  changeUserRole(u._id, "decorator")
                                }
                              >
                                Make Decorator
                              </button>
                              <button
                                className="btn btn-xs btn-primary"
                                onClick={() => changeUserRole(u._id, "admin")}
                              >
                                Make Admin
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!users.length && (
                        <tr>
                          <td colSpan={4} className="opacity-60">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="text-xs opacity-60 mt-2">
                    Note: role changes require user to log out/in to refresh
                    token (unless you rebuild JWT strategy).
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "services" && (
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h2 className="text-2xl font-black">Service Management</h2>
              <p className="opacity-70 mt-1">
                View, edit and delete services stored in database.
              </p>

              {serviceLoading ? (
                <div className="mt-4 alert alert-info">Loading services...</div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s._id}>
                          <td className="font-semibold">
                            {s.title || s.serviceTitle}
                          </td>
                          <td className="capitalize">{s.category}</td>
                          <td className="capitalize">{s.type}</td>
                          <td>
                            ৳{Number(s.price || 0).toLocaleString("en-BD")}
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-2">
                              <button
                                className="btn btn-xs btn-outline"
                                onClick={() => openEditService(s)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-xs btn-error"
                                onClick={() => deleteService(s._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!services.length && (
                        <tr>
                          <td colSpan={5} className="opacity-60">
                            No services found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Edit Service Modal */}
              <dialog id="svc_edit_modal" className="modal">
                <div className="modal-box">
                  <h3 className="font-black text-xl">Edit Service</h3>

                  <div className="mt-4 grid gap-3">
                    <input
                      className="input input-bordered"
                      placeholder="Title"
                      value={svcForm.title}
                      onChange={(e) =>
                        setSvcForm((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                    <input
                      className="input input-bordered"
                      type="number"
                      placeholder="Price"
                      value={svcForm.price}
                      onChange={(e) =>
                        setSvcForm((p) => ({
                          ...p,
                          price: Number(e.target.value),
                        }))
                      }
                    />
                    <select
                      className="select select-bordered"
                      value={svcForm.category}
                      onChange={(e) =>
                        setSvcForm((p) => ({ ...p, category: e.target.value }))
                      }
                    >
                      <option value="home">home</option>
                      <option value="ceremony">ceremony</option>
                    </select>
                    <select
                      className="select select-bordered"
                      value={svcForm.type}
                      onChange={(e) =>
                        setSvcForm((p) => ({ ...p, type: e.target.value }))
                      }
                    >
                      <option value="onsite">onsite</option>
                      <option value="studio">studio</option>
                      <option value="both">both</option>
                    </select>
                    <input
                      className="input input-bordered"
                      placeholder="Image URL"
                      value={svcForm.image}
                      onChange={(e) =>
                        setSvcForm((p) => ({ ...p, image: e.target.value }))
                      }
                    />
                    <textarea
                      className="textarea textarea-bordered"
                      placeholder="Description"
                      value={svcForm.description}
                      onChange={(e) =>
                        setSvcForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                      <button className="btn btn-ghost">Cancel</button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveService}
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
