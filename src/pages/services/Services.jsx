import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

function formatMoneyBDT(n) {
  if (typeof n !== "number") return "—";
  return `৳${n.toLocaleString("en-BD")}`;
}

function SkeletonCard() {
  return (
    <div className="card bg-base-100 border">
      <div className="h-44 bg-base-200 animate-pulse" />
      <div className="card-body">
        <div className="h-5 w-3/4 bg-base-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-base-200 rounded animate-pulse mt-3" />
        <div className="h-4 w-2/3 bg-base-200 rounded animate-pulse mt-2" />
        <div className="mt-5 flex justify-between items-center">
          <div className="h-6 w-20 bg-base-200 rounded animate-pulse" />
          <div className="h-9 w-24 bg-base-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // UI state
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all"); // home | ceremony | all
  const [type, setType] = useState("all"); // studio | onsite | both | all
  const [sort, setSort] = useState("newest"); // newest | price_low | price_high

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Option: You can pass query params if you later support server filtering
        const res = await axiosSecure.get("/api/services");
        const list = res.data?.data || [];

        if (!ignore) setServices(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!ignore)
          setErr(e?.response?.data?.message || "Failed to load services");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...services];

    // search
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((x) => {
        const hay = `${x.title || ""} ${x.description || ""} ${(
          x.tags || []
        ).join(" ")}`.toLowerCase();
        return hay.includes(s);
      });
    }

    // category filter
    if (category !== "all") {
      list = list.filter((x) => x.category === category);
    }

    // type filter
    if (type !== "all") {
      list = list.filter((x) => x.type === type);
    }

    // sort
    if (sort === "price_low")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price_high")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "newest")
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

    return list;
  }, [services, q, category, type, sort]);

  return (
    <div>
      {/* Header */}
      <section className="bg-[#f6e6dc]">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Services & <span className="text-primary">Packages</span>
          </h1>
          <p className="mt-4 opacity-80 max-w-2xl text-lg">
            Browse all decoration services created by admins and decorators.
            Choose studio consultation or onsite setup, pick a date, and book
            instantly.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="card bg-base-100 border">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              <label className="form-control w-full lg:w-1/2">
                <div className="label">
                  <span className="label-text font-semibold">Search</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by title, tags, description..."
                />
              </label>

              <div className="grid grid-cols-2 lg:flex gap-3 w-full lg:w-auto">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Category</span>
                  </div>
                  <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="home">Home</option>
                    <option value="ceremony">Ceremony</option>
                  </select>
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Type</span>
                  </div>
                  <select
                    className="select select-bordered"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="studio">Studio</option>
                    <option value="onsite">Onsite</option>
                    <option value="both">Both</option>
                  </select>
                </label>

                <label className="form-control col-span-2 lg:col-span-1">
                  <div className="label">
                    <span className="label-text font-semibold">Sort</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low → High</option>
                    <option value="price_high">Price: High → Low</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm opacity-70">
                Showing <span className="font-semibold">{filtered.length}</span>{" "}
                services
              </p>

              <div className="flex gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setQ("");
                    setCategory("all");
                    setType("all");
                    setSort("newest");
                  }}
                >
                  Reset
                </button>

                <Link to="/coverage" className="btn btn-outline btn-sm">
                  Coverage Map
                </Link>
              </div>
            </div>

            {err && <div className="alert alert-error mt-4">{err}</div>}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((s) => (
                <div
                  key={s._id}
                  className="card bg-base-100 border shadow-sm hover:shadow-md transition"
                >
                  <figure className="h-44 bg-base-200">
                    <img
                      className="h-full w-full object-cover"
                      src={
                        s.image ||
                        "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                      }
                      alt={s.title}
                    />
                  </figure>

                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="card-title leading-snug">{s.title}</h3>
                      <span className="badge badge-outline">
                        {s.type || "both"}
                      </span>
                    </div>

                    <p className="opacity-70">
                      {(s.description || "").slice(0, 90)}
                      {(s.description || "").length > 90 ? "..." : ""}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="badge badge-ghost">
                        {s.category || "category"}
                      </span>
                      {(s.tags || []).slice(0, 3).map((t) => (
                        <span key={t} className="badge badge-outline">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-black">
                        {formatMoneyBDT(s.price)}
                      </div>

                      {/* Booking flow later: service details page */}
                      <Link
                        to={`/services/${s._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View & Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-10 text-center">
            <div className="text-2xl font-black">No services found</div>
            <p className="opacity-70 mt-2">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
