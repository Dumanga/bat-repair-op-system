"use client";

import { useMemo, useState } from "react";
import { printIncomeReport } from "@/lib/print/income-report";

type IncomeReportRow = {
  id: string;
  billNo: string;
  clientName: string;
  status: "PENDING" | "PROCESSING" | "REPAIR_COMPLETED" | "DELIVERED";
  totalAmount: number;
  advanceAmount: number;
  receivedAmount: number;
  balance: number;
};

type IncomeReportResponse = {
  fromDate: string;
  toDate: string;
  repairCount: number;
  deliveredCount: number;
  rows: IncomeReportRow[];
  totals: {
    totalAmount: number;
    totalAdvance: number;
    totalReceived: number;
    totalBalance: number;
  };
};

export default function SettingsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<IncomeReportResponse | null>(null);

  const canGenerate = fromDate.trim() !== "" && toDate.trim() !== "" && !loading;

  const totals = useMemo(() => {
    if (!reportData) {
      return {
        totalAmount: 0,
        totalAdvance: 0,
        totalReceived: 0,
        totalBalance: 0,
      };
    }
    return reportData.totals;
  }, [reportData]);

  async function handleGenerateReport() {
    if (!fromDate || !toDate) {
      return;
    }

    setLoading(true);
    setLoadError(null);
    setReportGenerated(false);

    try {
      const response = await fetch(
        `/api/reports/income?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(
          toDate
        )}`
      );
      const payload = (await response.json()) as {
        success: boolean;
        message: string;
        data?: IncomeReportResponse | null;
      };

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || "Unable to generate report.");
      }

      setReportData(payload.data);
      setReportGenerated(true);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to generate report."
      );
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }

  function handlePrintReport() {
    if (!reportData) {
      return;
    }
    printIncomeReport({
      fromDate: reportData.fromDate,
      toDate: reportData.toDate,
      generatedAt: new Date(),
      rows: reportData.rows.map((row) => ({
        billNo: row.billNo,
        clientName: row.clientName,
        totalAmount: row.totalAmount,
        receivedAmount: row.receivedAmount,
        balance: row.balance,
      })),
      totals: {
        totalAmount: reportData.totals.totalAmount,
        totalReceived: reportData.totals.totalReceived,
        totalBalance: reportData.totals.totalBalance,
      },
    });
  }

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
              className={`h-11 w-full rounded-2xl border px-5 text-xs font-semibold uppercase tracking-[0.2em] transition md:w-auto ${
                canGenerate
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  : "cursor-not-allowed border-[var(--stroke)] bg-[var(--panel-muted)] text-[var(--text-muted)]"
              }`}
              onClick={handleGenerateReport}
              disabled={!canGenerate}
            >
              {loading ? "Generating..." : "Generate report"}
            </button>
          </div>
        </div>
        {loadError ? (
          <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {loadError}
          </div>
        ) : null}
      </div>

      {reportGenerated ? (
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Income Report
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[var(--text-muted)]">
                {reportData?.fromDate || "From"} to {reportData?.toDate || "To"}
              </p>
              <button
                type="button"
                onClick={handlePrintReport}
                className="h-8 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:bg-[var(--panel)]"
              >
                Print Report
              </button>
            </div>
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
                {!reportData || reportData.rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-sm text-[var(--text-muted)]"
                      colSpan={5}
                    >
                      No repairs found for the selected date range.
                    </td>
                  </tr>
                ) : (
                  reportData.rows.map((row) => (
                    <tr key={row.id} className="border-t border-[var(--stroke)]">
                      <td className="px-4 py-3 font-semibold">{row.billNo}</td>
                      <td className="px-4 py-3">{row.clientName}</td>
                      <td className="px-4 py-3 text-right">
                        LKR {row.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        LKR {row.receivedAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        LKR {row.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
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
                    LKR {totals.totalReceived.toLocaleString()}
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
