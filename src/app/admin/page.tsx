const kpis = [
  { label: "Active repairs", value: "38", trend: "+6 today" },
  { label: "Pending intake", value: "12", trend: "4 courier" },
  { label: "Ready for delivery", value: "9", trend: "Due tomorrow" },
  { label: "Revenue (week)", value: "INR 62,400", trend: "+12%" },
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
  return (
    <>
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
              <h2 className="mt-2 text-xl font-semibold">Schedule overview</h2>
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
            <h2 className="mt-2 text-xl font-semibold">What's on the bench</h2>
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
    </>
  );
}