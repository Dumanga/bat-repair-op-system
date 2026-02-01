"use client";

import { useState } from "react";
import { Menu, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const kpis = [
  { label: "Active repairs", value: "38", trend: "+6 today" },
  { label: "Pending intake", value: "12", trend: "4 courier" },
  { label: "Ready for delivery", value: "9", trend: "Due tomorrow" },
  { label: "Revenue (week)", value: "INR 62,400", trend: "+12%" },
];

const navItems = [
  "Dashboard",
  "Repairs",
  "Clients",
  "Bat Brands",
  "Users",
  "SMS Portal",
  "Settings",
];

const deliveries = [
  {
    client: "Rahul Sharma",
    bat: "Grey-Nicolls Ultima",
    time: "11:30 AM",
    status: "Ready for pickup",
  },
  {
    client: "Arjun Patel",
    bat: "SG Players Edition",
    time: "1:00 PM",
    status: "Courier booked",
  },
  {
    client: "Amit Verma",
    bat: "MRF Genius Elite",
    time: "4:15 PM",
    status: "Final polish",
  },
];

const queue = [
  {
    job: "DOB-2341",
    client: "Neha Kapoor",
    task: "Handle refit + toe guard",
    stage: "Processing",
  },
  {
    job: "DOB-2342",
    client: "Vikram Rao",
    task: "Crack repair + rebinding",
    stage: "Pending",
  },
  {
    job: "DOB-2343",
    client: "Ishita Singh",
    task: "Oil + polish",
    stage: "Ready",
  },
];

export default function AdminDashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative overflow-hidden border-b border-[var(--stroke)] bg-[var(--panel)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" />
          <div className="absolute right-[-12%] top-[-25%] h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute bottom-[-30%] left-1/2 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-[110rem] flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
              Admin Console
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Doctor of Bat Operations
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Live status of workshop repairs, staff, and deliveries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)] lg:hidden"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-expanded={mobileNavOpen}
              aria-controls="admin-mobile-nav"
            >
              {mobileNavOpen ? "Close" : "Menu"}
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)] lg:hidden"
              onClick={() => setMobileControlsOpen((open) => !open)}
              aria-expanded={mobileControlsOpen}
              aria-controls="admin-mobile-controls"
            >
              {mobileControlsOpen ? "Close" : "Settings"}
              <Settings className="h-4 w-4" />
            </button>
            <div className="hidden lg:flex">
              <ThemeToggle />
            </div>
            <div className="hidden h-10 items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs text-[var(--text-muted)] lg:flex">
              Super Admin
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </div>
            <form action="/auth/logout" method="post" className="hidden lg:block">
              <button className="h-10 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 text-xs text-rose-600 transition hover:bg-rose-500/20">
                Logout
              </button>
            </form>
          </div>
        </div>

        {mobileControlsOpen ? (
          <div
            id="admin-mobile-controls"
            className="lg:hidden border-t border-[var(--stroke)] bg-[var(--panel)]"
          >
            <div className="mx-auto flex w-full max-w-[110rem] flex-wrap items-center gap-3 px-6 py-4 text-sm text-[var(--text-muted)]">
              <ThemeToggle />
              <div className="flex h-10 items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs text-[var(--text-muted)]">
                Super Admin
                <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </div>
              <form action="/auth/logout" method="post">
                <button className="h-10 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 text-xs text-rose-600 transition hover:bg-rose-500/20">
                  Logout
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {mobileNavOpen ? (
          <div
            id="admin-mobile-nav"
            className="lg:hidden border-t border-[var(--stroke)] bg-[var(--panel)]"
          >
            <nav className="mx-auto grid w-full max-w-[110rem] gap-2 px-6 py-4 text-sm text-[var(--text-muted)]">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                    item === "Dashboard"
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "hover:bg-[var(--panel-muted)]"
                  }`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span>{item}</span>
                  {item === "Repairs" ? (
                    <span className="rounded-full bg-[var(--panel-muted)] px-2 py-1 text-[10px] text-[var(--text-muted)]">
                      38
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        ) : null}
      </div>

      <div className="mx-auto grid w-full max-w-[110rem] gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5 lg:block">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400/70 via-emerald-300/50 to-orange-400/60" />
            <div>
              <p className="text-sm font-semibold">Workshop Hub</p>
              <p className="text-xs text-[var(--text-muted)]">SG Road, Pune</p>
            </div>
          </div>
          <nav className="mt-6 grid gap-2 text-sm text-[var(--text-muted)]">
            {navItems.map((item) => (
              <div
                key={item}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                  item === "Dashboard"
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "hover:bg-[var(--panel-muted)]"
                }`}
              >
                <span>{item}</span>
                {item === "Repairs" ? (
                  <span className="rounded-full bg-[var(--panel-muted)] px-2 py-1 text-[10px] text-[var(--text-muted)]">
                    38
                  </span>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 text-xs text-[var(--text-muted)]">
            Next audit sync in <span className="text-white">3 hrs</span>
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="animate-rise rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {kpi.label}
                </p>
                <p className="mt-3 text-2xl font-semibold">{kpi.value}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{kpi.trend}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Today's Deliveries
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Schedule overview
                  </h2>
                </div>
                <button className="h-9 rounded-full border border-[var(--stroke)] px-4 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel-muted)]">
                  View calendar
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {deliveries.map((item) => (
                  <div
                    key={item.client}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.client}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.bat}</p>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{item.time}</div>
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Quick Actions
              </p>
              <h2 className="mt-2 text-xl font-semibold">Move faster</h2>
              <div className="mt-6 grid gap-4 text-sm">
                {[
                  "Register new repair",
                  "Send pickup SMS",
                  "Assign staff to job",
                  "Reschedule delivery",
                ].map((action) => (
                  <button
                    key={action}
                    className="flex items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-3 text-left text-[var(--text-muted)] transition hover:bg-[var(--panel)]"
                  >
                    <span>{action}</span>
                    <span className="text-xs text-[var(--text-muted)]">-&gt;</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-xs text-amber-100">
                6 repairs flagged for delayed delivery.
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Active Workshop Queue
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  What's on the bench
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span>Sort:</span>
                <span className="rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-1">
                  Delivery date
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {queue.map((row) => (
                <div
                  key={row.job}
                  className="grid gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-3 sm:grid-cols-[120px_1fr_140px]"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {row.job}
                    </p>
                    <p className="text-sm font-semibold">{row.client}</p>
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">{row.task}</div>
                  <div className="text-xs text-[var(--text-muted)] sm:text-right">
                    {row.stage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}