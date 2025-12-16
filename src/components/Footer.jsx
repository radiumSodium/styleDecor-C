import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-16">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="text-2xl font-black">
            style<span className="text-primary">decor</span>
          </div>
          <p className="opacity-80 mt-2">
            Studio consultation & onsite decoration services for home and
            ceremony.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold tracking-wide mb-3">Company</h4>
          <ul className="space-y-2 opacity-80">
            <li>
              <NavLink to="/about" className="hover:text-primary">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className="hover:text-primary">
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-primary">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold tracking-wide mb-3">Contact</h4>
          <ul className="space-y-2 opacity-80">
            <li>Dhaka, Bangladesh</li>
            <li>Phone: +8801XXXXXXXXX</li>
            <li>Email: support@styledecor.com</li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-bold tracking-wide mb-3">Working hours</h4>
          <p className="opacity-80">Sat–Thu: 10:00 AM – 8:00 PM</p>
          <p className="opacity-80">Friday: Closed</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-neutral-content/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="opacity-70 text-sm">
            © {new Date().getFullYear()} StyleDecor. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/sir4n4"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-neutral-content/10 hover:bg-primary transition"
            >
              <FaFacebookF className="text-white text-lg" />
            </a>

            <a
              href="https://www.instagram.com/sir4n4/"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-neutral-content/10 hover:bg-primary transition"
            >
              <FaInstagram className="text-white text-lg" />
            </a>

            <a
              href="https://www.youtube.com/@sojibulislamrana"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-neutral-content/10 hover:bg-primary transition"
            >
              <FaYoutube className="text-white text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
