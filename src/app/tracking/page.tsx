export default function TrackingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0f14] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[-10%] top-[-10%] h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src="/assets/logo-dob.png"
                alt="Doctor of Bat logo"
                className="h-20 w-auto max-w-full opacity-90 sm:h-24"
              />
              <span className="w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                Repair Tracking
              </span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Track your bat repair in real time.
            </h1>
            <p className="max-w-xl text-base text-white/70 sm:text-lg">
              Enter your tracking token to see the latest status, expected
              delivery date, and SMS updates from the workshop.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Status
                </p>
                <p className="mt-2 text-xl font-semibold">Processing</p>
                <p className="mt-1 text-xs text-white/50">
                  Current stage of the repair.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  ETA
                </p>
                <p className="mt-2 text-xl font-semibold">Feb 20, 2026</p>
                <p className="mt-1 text-xs text-white/50">
                  Estimated delivery date.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  Repair Summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Job details</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                Live data
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Bat
                </p>
                <p className="mt-2 text-lg font-semibold">Kookaburra Beast</p>
                <p className="mt-1 text-xs text-white/50">Grade A English Willow</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Client
                </p>
                <p className="mt-2 text-lg font-semibold">Nimal Perera</p>
                <p className="mt-1 text-xs text-white/50">071 880 8854</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Bill number
                </p>
                <p className="mt-2 text-lg font-semibold">B-3094</p>
                <p className="mt-1 text-xs text-white/50">Issued at Colombo Workshop</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Total amount
                  </p>
                  <p className="mt-2 text-xl font-semibold">LKR 6,500</p>
                  <p className="mt-1 text-xs text-white/50">
                    Includes labor and materials.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Advance paid
                  </p>
                  <p className="mt-2 text-xl font-semibold">LKR 2,500</p>
                  <p className="mt-1 text-xs text-white/50">
                    Balance due on pickup.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
