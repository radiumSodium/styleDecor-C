import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import DecoratorsSection from "./DecoratorsSection";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const CITIES = [
  { name: "Dhaka", position: [23.8103, 90.4125], radius: 9000 },
  { name: "Mymensingh", position: [24.7471, 90.4203], radius: 7000 },
  { name: "Rajshahi", position: [24.3745, 88.6042], radius: 7000 },
  { name: "Sylhet", position: [24.8949, 91.8687], radius: 7000 },
  { name: "Chittagong", position: [22.3569, 91.7832], radius: 8000 },
  { name: "Khulna", position: [22.8456, 89.5403], radius: 7000 },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loadingDeco, setLoadingDeco] = useState(false);

  useEffect(() => {
    axiosSecure
      .get("/api/services")
      .then((r) => setServices(r.data?.data || r.data || []))
      .catch(() => {});

    setLoadingDeco(true);
    axiosSecure
      .get("/api/decorators")
      .then((r) => setDecorators(r.data?.data || r.data || []))
      .catch(() => {})
      .finally(() => setLoadingDeco(false));
  }, []);

  // Only show real decorators; no fake dummy cards
  const realDecorators = useMemo(() => {
    return (decorators || [])
      .filter(
        (d) =>
          d && (d.name || d.email) && (d.role ? d.role === "decorator" : true)
      )
      .slice(0, 6);
  }, [decorators]);

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
            <p className="opacity-70 mt-2">Loaded from server</p>
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
                    <Link
                      to={`/services/${s?._id || ""}`}
                      className="btn btn-sm btn-ghost"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Top Decorator  */}
      <DecoratorsSection loading={loadingDeco} decorators={realDecorators} />

      {/* COVERAGE MAP (multi-city markers) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Service Coverage Map</h2>
            <p className="opacity-70 mt-2">
              Major cities we currently serve (demo coverage)
            </p>
          </div>
          <Link to="/coverage" className="link link-hover font-medium">
            Open map page →
          </Link>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden border bg-base-100">
          <MapContainer
            center={[23.8103, 90.4125]}
            zoom={10}
            style={{ height: 380, width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {CITIES.map((c) => (
              <div key={c.name}>
                <Marker position={c.position}>
                  <Popup>
                    <b>{c.name}</b>
                    <br />
                    StyleDecor coverage (demo)
                  </Popup>
                </Marker>

                <Circle center={c.position} radius={c.radius} pathOptions={{}}>
                  <Popup>{c.name} coverage radius (demo)</Popup>
                </Circle>
              </div>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
