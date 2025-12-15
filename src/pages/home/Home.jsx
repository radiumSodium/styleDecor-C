import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function Home() {
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);

  useEffect(() => {
    axiosSecure
      .get("/api/services")
      .then((r) => setServices(r.data?.data || r.data || []))
      .catch(() => {});

    axiosSecure
      .get("/api/decorators")
      .then((r) => setDecorators(r.data?.data || r.data || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="bg-[#f6e6dc]">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
          >
            Your decoration team and
            <br />
            everything in between
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl text-lg opacity-80"
          >
            Book studio consultations or onsite decoration services for home &
            ceremonies. Pick a date, choose a slot, and we’ll handle the rest.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex items-center gap-3"
          >
            <Link to="/services" className="btn btn-primary rounded-full px-8">
              Book Decoration Service
            </Link>
            <Link to="/coverage" className="btn btn-outline rounded-full px-8">
              View Coverage
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Popular Packages</h2>
            <p className="opacity-70 mt-2">
              Loaded from server • grid layout with images
            </p>
          </div>
          <Link to="/services" className="link link-hover font-medium">
            View all →
          </Link>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services.length ? services : Array.from({ length: 6 })).map(
            (s, idx) => (
              <div
                key={s?._id || idx}
                className="card bg-base-100 border shadow-sm hover:shadow-md transition"
              >
                <figure className="h-44 bg-base-200">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      s?.image ||
                      "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                    }
                    alt={s?.title || "Service"}
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">
                    {s?.title || "Premium Ceremony Decor"}
                  </h3>
                  <p className="opacity-70">
                    {s?.description || "Stage, floral, lighting & full setup."}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">
                      {s?.price ? `৳${s.price}` : "From ৳5,000"}
                    </span>
                    <Link to="/services" className="btn btn-sm btn-ghost">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* TOP DECORATORS */}
      <section className="bg-base-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Top Decorators</h2>
              <p className="opacity-70 mt-2">
                Dynamic • Ratings and specialties
              </p>
            </div>
            <Link to="/services" className="link link-hover font-medium">
              Explore →
            </Link>
          </div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(decorators.length ? decorators : Array.from({ length: 6 })).map(
              (d, idx) => (
                <div key={d?._id || idx} className="card bg-base-100 border">
                  <div className="card-body">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img
                            src={
                              d?.photoURL || "https://i.pravatar.cc/100?img=12"
                            }
                            alt="decorator"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-base">
                          {d?.name || "Decorator Pro"}
                        </div>

                        <div className="text-sm opacity-70 flex items-center gap-2">
                          <span className="font-semibold">
                            ⭐ {d?.rating ?? "4.8"}
                          </span>
                          <span className="opacity-40">•</span>
                          <span>
                            {d?.specialty || "Wedding, Home, Ceremony"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(d?.tags || ["Floral", "Stage", "Lighting"]).map((t) => (
                        <span key={t} className="badge badge-outline">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-sm btn-primary">
                        View profile
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* COVERAGE MAP */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Service Coverage Map</h2>
            <p className="opacity-70 mt-2">React Leaflet map section</p>
          </div>
          <Link to="/coverage" className="link link-hover font-medium">
            Open map page →
          </Link>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden border bg-base-100">
          <MapContainer
            center={[23.8103, 90.4125]}
            zoom={11}
            style={{ height: 380, width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[23.8103, 90.4125]}>
              <Popup>StyleDecor coverage (Dhaka)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
