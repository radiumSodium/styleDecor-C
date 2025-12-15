export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-16">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="text-2xl font-black">
            style<span className="text-primary">decor</span>
          </div>
          <p className="opacity-80 mt-2">
            Studio consultation & onsite decoration services for home and
            ceremony.
          </p>
        </div>

        <div>
          <h4 className="font-bold tracking-wide mb-3">Company</h4>
          <ul className="space-y-2 opacity-80">
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>

        <div id="contact">
          <h4 className="font-bold tracking-wide mb-3">Contact</h4>
          <ul className="space-y-2 opacity-80">
            <li>Dhaka, Bangladesh</li>
            <li>Phone: +8801XXXXXXXXX</li>
            <li>Email: support@styledecor.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold tracking-wide mb-3">Working hours</h4>
          <p className="opacity-80">Sat–Thu: 10:00 AM – 8:00 PM</p>
          <p className="opacity-80">Friday: Closed</p>
        </div>
      </div>

      <div className="border-t border-neutral-content/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="opacity-70 text-sm">
            © {new Date().getFullYear()} StyleDecor. All rights reserved.
          </p>
          <div className="flex gap-3 opacity-80">
            <span className="cursor-pointer">Facebook</span>
            <span className="cursor-pointer">Instagram</span>
            <span className="cursor-pointer">YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
