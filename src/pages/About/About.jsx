import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div>
      <section className="bg-[#f6e6dc]">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-20">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-6xl font-black leading-tight tracking-tight"
          >
            About <span className="text-primary">StyleDecor</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-2xl text-lg opacity-80"
          >
            We offer studio consultations and onsite decoration services for
            homes and ceremonies. From concept to setup—our team handles it
            end-to-end.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-7 flex gap-3"
          >
            <Link to="/services" className="btn btn-primary rounded-full px-8">
              Explore Services
            </Link>
            <Link to="/contact" className="btn btn-outline rounded-full px-8">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="opacity-70">
                Make premium decoration accessible—simple booking, transparent
                pricing, and reliable delivery.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border">
            <div className="card-body">
              <h3 className="text-xl font-bold">What We Do</h3>
              <ul className="opacity-70 list-disc pl-5 space-y-1">
                <li>Studio consultation & planning</li>
                <li>Onsite decoration setup</li>
                <li>Event styling & props</li>
                <li>Lighting and floral</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 border">
            <div className="card-body">
              <h3 className="text-xl font-bold">Why Choose Us</h3>
              <ul className="opacity-70 list-disc pl-5 space-y-1">
                <li>Verified decorators</li>
                <li>Fast booking & confirmation</li>
                <li>Clear status tracking</li>
                <li>Support for home & ceremony</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card bg-base-200 border">
            <div className="card-body">
              <h3 className="text-xl font-bold">Our Process</h3>
              <div className="opacity-80 space-y-2">
                <p>1) Choose a package & date</p>
                <p>2) Check availability</p>
                <p>3) Pay securely</p>
                <p>4) Admin assigns team (onsite)</p>
                <p>5) Decorator updates status → final confirmation</p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border">
            <div className="card-body">
              <h3 className="text-xl font-bold">Working Hours</h3>
              <p className="opacity-70">Sat–Thu: 10:00 AM – 8:00 PM</p>
              <p className="opacity-70">Friday: Closed</p>
              <div className="mt-4">
                <Link to="/coverage" className="btn btn-sm btn-outline">
                  View Coverage Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
