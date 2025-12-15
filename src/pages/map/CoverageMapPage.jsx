import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Link } from "react-router-dom";

export default function CoverageMapPage() {
  const center = [23.8103, 90.4125]; // Dhaka

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Service <span className="text-primary">Coverage</span>
          </h1>
          <p className="mt-3 opacity-70">
            We currently provide coverage in and around Dhaka (demo).
          </p>
        </div>
        <Link to="/services" className="btn btn-outline">
          Browse Services →
        </Link>
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden border bg-base-100">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: 520, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center}>
            <Popup>StyleDecor (Dhaka)</Popup>
          </Marker>

          {/* Example coverage radius */}
          <Circle center={center} radius={9000} pathOptions={{}}>
            <Popup>Approx coverage radius (demo)</Popup>
          </Circle>
        </MapContainer>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Onsite Setup</h3>
            <p className="opacity-70">
              Home & ceremony decoration within coverage area.
            </p>
          </div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Studio Consultation</h3>
            <p className="opacity-70">
              Meet in studio for planning, theme & budgeting.
            </p>
          </div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Custom Requests</h3>
            <p className="opacity-70">
              Outside area? Contact us for a custom arrangement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
