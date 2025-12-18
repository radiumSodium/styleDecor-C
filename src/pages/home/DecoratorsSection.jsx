import { Link } from "react-router-dom";

const FALLBACK = [
  {
    id: "f1",
    name: "Ayesha Rahman",
    role: "Lead Decorator",
    specialty: "Wedding stage • Floral styling",
    rating: 4.9,
    photo: "https://i.pravatar.cc/200?img=32",
    tags: ["Floral", "Stage", "Lighting", "Onsite setup"],
  },
  {
    id: "f2",
    name: "Sabbir Hossain",
    role: "Event Specialist",
    specialty: "Birthday • Home décor",
    rating: 4.8,
    photo: "https://i.pravatar.cc/200?img=14",
    tags: ["Balloon", "Theme", "Backdrop", "Coordination"],
  },
];

export default function DecoratorsSection({
  loading = false,
  decorators = [],
}) {
  // ✅ dynamic list from server (fallback only if none)
  const list =
    decorators?.length > 0
      ? decorators.slice(0, 6).map((d) => ({
          id: d._id,
          name: d.name || "Decorator",
          role: "Decorator",
          specialty: d.specialty || "Onsite setup • Theme planning",
          rating: Number(d.rating || 4.8),
          photo: d.photoURL || "https://i.pravatar.cc/200?img=12",
          tags:
            Array.isArray(d.tags) && d.tags.length
              ? d.tags
              : ["Onsite setup", "Theme planning", "Coordination", "Setup"],
        }))
      : FALLBACK;

  return (
    <section className="bg-base-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black">Decorators</h2>
            <p className="opacity-70 mt-2 max-w-2xl">
              Verified profiles from our team (loaded from server).
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/contact" className="btn btn-outline rounded-full">
              Become a decorator
            </Link>
            <Link to="/services" className="btn btn-primary rounded-full">
              Browse Services
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card bg-base-100 border">
                <div className="card-body">
                  <div className="h-5 w-2/3 bg-base-300 rounded animate-pulse" />
                  <div className="mt-3 h-4 w-1/2 bg-base-300 rounded animate-pulse" />
                  <div className="mt-5 h-24 bg-base-300 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d) => (
              <div
                key={d.id}
                className="card bg-base-100 border shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-primary/70 via-primary/25 to-transparent" />

                <div className="card-body flex flex-col gap-4 min-h-60">
                  <div className="flex items-start gap-4">
                    <div className="avatar shrink-0">
                      <div className="w-14 rounded-2xl ring ring-primary/15 ring-offset-2 ring-offset-base-100">
                        <img src={d.photo} alt={d.name} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-black text-lg truncate">
                            {d.name}
                          </h3>
                          <p className="text-sm opacity-70 mt-1 truncate">
                            {d.specialty}
                          </p>
                        </div>

                        <span className="badge badge-ghost whitespace-nowrap shrink-0">
                          {d.role}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="badge badge-ghost whitespace-nowrap">
                          ★ {Number(d.rating).toFixed(1)}
                        </span>
                        <span className="text-xs opacity-60 truncate">
                          based on recent bookings
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {d.tags.slice(0, 4).map((t) => (
                      <span key={t} className="badge badge-ghost">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <Link to="/services" className="btn btn-sm btn-ghost">
                      View packages →
                    </Link>
                    <Link
                      to="/contact"
                      className="btn btn-sm btn-primary rounded-full px-5"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-sm opacity-70">
          Want to work with us?{" "}
          <Link className="link link-primary font-medium" to="/contact">
            Apply as Decorator
          </Link>
        </div>
      </div>
    </section>
  );
}
