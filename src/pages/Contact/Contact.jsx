import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2600);
    return () => clearTimeout(t);
  }, [showToast]);

  const onSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <section className="bg-[#f6e6dc]">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-20">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Contact <span className="text-primary">StyleDecor</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg opacity-80">
            Need a quote, consultation, or onsite booking? Send a message—our
            team will respond quickly.
          </p>

          <div className="mt-7 flex gap-3">
            <a
              href="#contact-form"
              className="btn btn-primary rounded-full px-8"
            >
              Send Message
            </a>

            <Link to="/services" className="btn btn-outline rounded-full px-8">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        {/* SUCCESS TOAST */}
        {showToast && (
          <div className="toast toast-top toast-end z-50">
            <div className="alert alert-success shadow-lg rounded-2xl">
              <span>✅ Message sent successfully! We’ll contact you soon.</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT INFO */}
          <div className="space-y-4">
            <div className="card bg-base-100 border rounded-2xl">
              <div className="card-body p-6">
                <div className="text-sm opacity-70">Quick contacts</div>

                <div className="mt-4 grid gap-3">
                  <div className="flex items-start gap-3 p-4 rounded-2xl border bg-base-100">
                    <div className="badge badge-primary badge-outline mt-1">
                      Phone
                    </div>
                    <div>
                      <div className="font-semibold">+8801XXXXXXXXX</div>
                      <div className="text-sm opacity-70">
                        Call for urgent booking
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl border bg-base-100">
                    <div className="badge badge-primary badge-outline mt-1">
                      Email
                    </div>
                    <div>
                      <div className="font-semibold">
                        support@styledecor.com
                      </div>
                      <div className="text-sm opacity-70">
                        Share event details for a quote
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl border bg-base-100">
                    <div className="badge badge-primary badge-outline mt-1">
                      Studio
                    </div>
                    <div>
                      <div className="font-semibold">Dhaka, Bangladesh</div>
                      <div className="text-sm opacity-70">
                        Studio consultation available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border rounded-2xl">
              <div className="card-body p-6">
                <div className="font-bold">Working Hours</div>
                <div className="mt-2 space-y-1 text-sm opacity-80">
                  <div>Sat–Thu: 10:00 AM – 8:00 PM</div>
                  <div>Friday: Closed</div>
                </div>
                <div className="mt-3 text-xs opacity-60">
                  Response time: usually within 2–6 hours.
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="card bg-base-100 border rounded-2xl shadow-sm">
            <div className="card-body p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">Send a message</h2>
                <span className="badge badge-outline">Support</span>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                {/* Name */}
                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text font-semibold">Your name</span>
                  </div>
                  <input
                    className="input input-bordered w-full h-12 rounded-xl"
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </label>

                {/* Email */}
                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text font-semibold">Email</span>
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full h-12 rounded-xl"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </label>

                {/* Message */}
                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text font-semibold">Message</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl"
                    rows={6}
                    required
                    placeholder="Tell us what you need (date, venue, budget, theme)..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                  />
                </label>

                {/* Actions */}
                <div className="pt-2">
                  <button className="btn btn-primary w-full h-12 rounded-xl">
                    Send Message
                  </button>
                  <p className="mt-2 text-xs opacity-60">
                    UI only for now. Backend will be connected later.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
