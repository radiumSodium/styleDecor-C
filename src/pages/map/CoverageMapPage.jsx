import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Link } from "react-router-dom";

// City coordinates
const CITIES = [
  {
    name: "Dhaka",
    position: [23.8103, 90.4125],
    radius: 9000,
  },
  {
    name: "Mymensingh",
    position: [24.7471, 90.4203],
    radius: 7000,
  },
  {
    name: "Rajshahi",
    position: [24.3745, 88.6042],
    radius: 7000,
  },
  {
    name: "Sylhet",
    position: [24.8949, 91.8687],
    radius: 7000,
  },
  {
    name: "Chittagong",
    position: [22.3569, 91.7832],
    radius: 8000,
  },
  {
    name: "Khulna",
    position: [22.8456, 89.5403],
    radius: 7000,
  },
];

export default function CoverageMapPage() {
  const center = [23.8103, 90.4125]; // Dhaka center

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Service <span className="text-primary">Coverage</span>
          </h1>
          <p className="mt-3 opacity-70">
            We currently provide service across major cities in Bangladesh (demo
            coverage).
          </p>
        </div>
        <Link to="/services" className="btn btn-outline">
          Browse Services →
        </Link>
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden border bg-base-100">
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: 520, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {CITIES.map((city) => (
            <div key={city.name}>
              <Marker position={city.position}>
                <Popup>
                  <b>StyleDecor – {city.name}</b>
                  <br />
                  Service available
                </Popup>
              </Marker>

              <Circle
                center={city.position}
                radius={city.radius}
                pathOptions={{}}
              >
                <Popup>{city.name} coverage area (demo)</Popup>
              </Circle>
            </div>
          ))}
        </MapContainer>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Onsite Setup</h3>
            <p className="opacity-70">
              Home & ceremony decoration within coverage areas.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Studio Consultation</h3>
            <p className="opacity-70">
              Theme planning, budgeting & material discussion.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border">
          <div className="card-body">
            <h3 className="font-bold">Custom Requests</h3>
            <p className="opacity-70">
              Outside these cities? Contact us for special arrangements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
