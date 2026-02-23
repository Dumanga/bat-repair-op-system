"use client";

import { useMemo, useState } from "react";

export default function SettingsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);

  const reportRows = [
    {
      id: "row-1",
      billNo: "RB1084",
      clientName: "Anushka Fernando",
      totalAmount: 12500,
      advanceReceived: 5000,
    },
    {
      id: "row-2",
      billNo: "RB1085",
      clientName: "Kasun Perera",
      totalAmount: 9800,
      advanceReceived: 3000,
    },
    {
      id: "row-3",
      billNo: "RB1086",
      clientName: "Nipuna Silva",
      totalAmount: 14200,
      advanceReceived: 6000,
    },
  ];

  const totals = useMemo(() => {
    const totalAmount = reportRows.reduce((sum, row) => sum + row.totalAmount, 0);
    const totalAdvance = reportRows.reduce((sum, row) => sum + row.advanceReceived, 0);
    return {
      totalAmount,
      totalAdvance,
      totalBalance: totalAmount - totalAdvance,
    };
  }, [reportRows]);

  return (
    <div className="grid content-start gap-6 self-start">
      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Reports
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Income Reporting</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Generate date-range summaries for repair income and pending balances.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span>From date</span>
            <input
              type="date"
              className="h-11 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span>To date</span>
            <input
              type="date"
              className="h-11 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              className="h-11 w-full rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 transition hover:bg-emerald-500/25 md:w-auto"
              onClick={() => setReportGenerated(true)}
            >
              Generate report
            </button>
          </div>
        </div>
      </div>

      {reportGenerated ? (
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Income Report
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {fromDate || "From"} to {toDate || "To"}
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[var(--stroke)]">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--panel-muted)] text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Bill no</th>
                  <th className="px-4 py-3 text-left">Client name</th>
                  <th className="px-4 py-3 text-right">Total amount</th>
                  <th className="px-4 py-3 text-right">Advance received</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map((row) => {
                  const balance = row.totalAmount - row.advanceReceived;
                  return (
                    <tr key={row.id} className="border-t border-[var(--stroke)]">
                      <td className="px-4 py-3 font-semibold">{row.billNo}</td>
                      <td className="px-4 py-3">{row.clientName}</td>
                      <td className="px-4 py-3 text-right">
                        LKR {row.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        LKR {row.advanceReceived.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        LKR {balance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-[var(--stroke)] bg-[var(--panel-muted)]">
                <tr>
                  <td className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Overall
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right font-semibold">
                    LKR {totals.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    LKR {totals.totalAdvance.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    LKR {totals.totalBalance.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
