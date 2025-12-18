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
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingDeco, setLoadingDeco] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      // one render turn flips both loading states
      setLoadingServices(true);
      setLoadingDeco(true);

      try {
        const [servicesRes, decoRes] = await Promise.allSettled([
          axiosSecure.get("/api/services"),
          axiosSecure.get("/api/decorators"),
        ]);

        if (ignore) return;

        // services
        if (servicesRes.status === "fulfilled") {
          const list =
            servicesRes.value?.data?.data || servicesRes.value?.data || [];
          setServices(Array.isArray(list) ? list : []);
        } else {
          setServices([]);
        }

        // decorators
        if (decoRes.status === "fulfilled") {
          const list = decoRes.value?.data?.data || decoRes.value?.data || [];
          setDecorators(Array.isArray(list) ? list : []);
        } else {
          setDecorators([]);
        }
      } finally {
        if (!ignore) {
          setLoadingServices(false);
          setLoadingDeco(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Only show real decorators; no fake dummy cards in Home (fallback handled inside DecoratorsSection)
  const realDecorators = useMemo(() => {
    return (decorators || [])
      .filter(
        (d) =>
          d && (d.name || d.email) && (d.role ? d.role === "decorator" : true)
      )
      .slice(0, 6);
  }, [decorators]);

  const servicesToRender = useMemo(() => {
    // show 6 skeleton cards while loading
    if (loadingServices)
      return Array.from({ length: 6 }).map((_, i) => ({ _id: `sk-${i}` }));
    return services;
  }, [loadingServices, services]);

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
          {servicesToRender.map((s, idx) => {
            const isSkeleton = String(s?._id || "").startsWith("sk-");
            return (
              <div
                key={s?._id || idx}
                className="card bg-base-100 border shadow-sm hover:shadow-md transition"
              >
                <figure className="h-44 bg-base-200">
                  {isSkeleton ? (
                    <div className="h-full w-full animate-pulse bg-base-300" />
                  ) : (
                    <img
                      className="h-full w-full object-cover"
                      src={
                        s?.image ||
                        "https://images.unsplash.com/photo-1523438097201-512ae7d59cfc?auto=format&fit=crop&w=1200&q=60"
                      }
                      alt={s?.title || "Service"}
                    />
                  )}
                </figure>

                <div className="card-body">
                  {isSkeleton ? (
                    <>
                      <div className="h-5 w-3/4 rounded bg-base-200 animate-pulse" />
                      <div className="mt-3 h-4 w-full rounded bg-base-200 animate-pulse" />
                      <div className="mt-2 h-4 w-2/3 rounded bg-base-200 animate-pulse" />
                      <div className="mt-5 flex items-center justify-between">
                        <div className="h-5 w-20 rounded bg-base-200 animate-pulse" />
                        <div className="h-9 w-20 rounded bg-base-200 animate-pulse" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="card-title">{s?.title}</h3>
                      <p className="opacity-70">
                        {s?.description ||
                          "Stage, floral, lighting & full setup."}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">
                          {typeof s?.price === "number" ? `৳${s.price}` : "—"}
                        </span>
                        <Link
                          to={`/services/${s?._id}`}
                          className="btn btn-sm btn-ghost"
                        >
                          Details
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOP DECORATORS */}
      <DecoratorsSection loading={loadingDeco} decorators={realDecorators} />

      {/* COVERAGE MAP */}
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
            zoom={7}
            style={{ height: 380, width: "100%" }}
            scrollWheelZoom={false}
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

                <Circle center={c.position} radius={c.radius}>
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
