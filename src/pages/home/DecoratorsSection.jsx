import { Link } from "react-router-dom";

const DECORATORS = [
  {
    id: "d1",
    name: "Ayesha Rahman",
    role: "Lead Decorator",
    specialty: "Wedding stage • Floral styling",
    rating: "4.9",
    photo: "https://i.pravatar.cc/200?img=32",
    tags: ["Floral", "Stage", "Lighting", "Onsite setup"],
  },
  {
    id: "d2",
    name: "Sabbir Hossain",
    role: "Event Specialist",
    specialty: "Birthday • Home décor",
    rating: "4.8",
    photo: "https://i.pravatar.cc/200?img=14",
    tags: ["Balloon", "Theme", "Backdrop", "Coordination"],
  },
  {
    id: "d3",
    name: "Nusrat Jahan",
    role: "Corporate Decor",
    specialty: "Brand events • Backdrop design",
    rating: "4.7",
    photo: "https://i.pravatar.cc/200?img=47",
    tags: ["Branding", "Backdrop", "Lighting", "Setup"],
  },
  {
    id: "d4",
    name: "Rafi Ahmed",
    role: "Ceremony Expert",
    specialty: "Engagement • Holud • Reception",
    rating: "4.8",
    photo: "https://i.pravatar.cc/200?img=18",
    tags: ["Props", "Floral", "Stage", "Onsite setup"],
  },
  {
    id: "d5",
    name: "Tania Islam",
    role: "Studio Consultant",
    specialty: "Moodboard • Budget planning",
    rating: "4.6",
    photo: "https://i.pravatar.cc/200?img=22",
    tags: ["Planning", "Moodboard", "Consultation", "Theme"],
  },
  {
    id: "d6",
    name: "Imran Kabir",
    role: "Modern Minimal",
    specialty: "Minimal • Modern • Clean design",
    rating: "4.7",
    photo: "https://i.pravatar.cc/200?img=8",
    tags: ["Modern", "Lighting", "Setup", "Styling"],
  },
];

export default function DecoratorsSection() {
  return (
    <section className="bg-base-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black">Decorators</h2>
            <p className="opacity-70 mt-2 max-w-2xl">
              Hand-picked team for studio consultations and onsite decoration.
              Choose a style and book your service with confidence.
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

        {/* cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DECORATORS.map((d) => (
            <div
              key={d.id}
              className="card bg-base-100 border shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* subtle top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary/70 via-primary/25 to-transparent" />

              {/* IMPORTANT: make cards consistent height + footer aligned */}
              <div className="card-body flex flex-col gap-4 min-h-[240px]">
                {/* header row */}
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

                      {/* FIX: prevent badge wrap (no more weird cross lines) */}
                      <span className="badge badge-ghost whitespace-nowrap shrink-0">
                        {d.role}
                      </span>
                    </div>

                    {/* rating row */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="badge badge-ghost whitespace-nowrap">
                        ★ {d.rating}
                      </span>
                      <span className="text-xs opacity-60 truncate">
                        based on recent bookings
                      </span>
                    </div>
                  </div>
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-2">
                  {d.tags.slice(0, 4).map((t) => (
                    <span key={t} className="badge badge-ghost">
                      {t}
                    </span>
                  ))}
                </div>

                {/* footer actions pinned to bottom */}
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
