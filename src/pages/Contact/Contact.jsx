import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Contact <span className="text-primary">StyleDecor</span>
          </h1>
          <p className="mt-4 opacity-70 text-lg">
            Need a quote, consultation, or onsite booking? Send a message—our
            team will respond quickly.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="card bg-base-100 border">
              <div className="card-body">
                <div className="font-bold">Phone</div>
                <div className="opacity-70">+8801XXXXXXXXX</div>
              </div>
            </div>
            <div className="card bg-base-100 border">
              <div className="card-body">
                <div className="font-bold">Email</div>
                <div className="opacity-70">support@styledecor.com</div>
              </div>
            </div>
            <div className="card bg-base-100 border">
              <div className="card-body">
                <div className="font-bold">Studio Address</div>
                <div className="opacity-70">Dhaka, Bangladesh</div>
              </div>
            </div>
          </div>

          <div className="mt-8 card bg-base-200 border">
            <div className="card-body">
              <div className="font-bold">Working Hours</div>
              <div className="opacity-70">Sat–Thu: 10:00 AM – 8:00 PM</div>
              <div className="opacity-70">Friday: Closed</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body">
            <h2 className="text-2xl font-bold">Send us a message</h2>

            {sent && (
              <div className="alert alert-success mt-4">
                Message sent! We’ll contact you soon.
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Your name</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  required
                  placeholder="Full name"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  required
                  placeholder="you@email.com"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Message</span>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={5}
                  required
                  placeholder="Tell us what you need..."
                />
              </label>

              <button className="btn btn-primary w-full">Send</button>
              <p className="text-xs opacity-60">
                (This is UI only for now. We’ll connect it to backend later.)
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
