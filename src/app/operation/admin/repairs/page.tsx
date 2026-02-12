"use client";

import { useEffect, useState } from "react";
import { DeliveryDatePicker } from "@/components/delivery-date-picker";

const repairs = [
  {
    id: "R-1023",
    billNo: "B-3092",
    client: "H. Perera",
    brand: "Gray-Nicolls",
    intakeType: "Walk-in",
    store: "Colombo Workshop",
    total: 6500,
    advance: 2500,
    eta: "2026-02-18",
    status: "PENDING",
    postponed: false,
  },
  {
    id: "R-1022",
    billNo: "B-3091",
    client: "S. Jayasinghe",
    brand: "Kookaburra",
    intakeType: "Courier",
    store: "Kandy Pickup Hub",
    total: 8200,
    advance: 4200,
    eta: "2026-02-15",
    status: "PROCESSING",
    postponed: true,
  },
  {
    id: "R-1021",
    billNo: "B-3090",
    client: "M. Fernando",
    brand: "SG",
    intakeType: "Walk-in",
    store: "Colombo Workshop",
    total: 5400,
    advance: 2000,
    eta: "2026-02-13",
    status: "REPAIR_COMPLETED",
    postponed: false,
  },
  {
    id: "R-1020",
    billNo: "B-3089",
    client: "R. Silva",
    brand: "SS",
    intakeType: "Drop-off",
    store: "Galle Repair Desk",
    total: 9100,
    advance: 4500,
    eta: "2026-02-10",
    status: "DELIVERED",
    postponed: false,
  },
];

const statusMeta: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-400/15 text-amber-400",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-sky-400/15 text-sky-400",
  },
  REPAIR_COMPLETED: {
    label: "Repair Completed",
    className: "bg-emerald-400/15 text-emerald-400",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-zinc-400/15 text-zinc-400",
  },
};

type ClientOption = {
  id: string;
  name: string;
  mobile: string;
};

type BrandOption = {
  id: string;
  name: string;
};

type StoreOption = {
  id: string;
  name: string;
  code?: string;
  city?: string;
};

function formatMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("94") && digits.length === 11) {
    return `0${digits.slice(2)}`;
  }
  return value;
}

export default function RepairsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [intakeType, setIntakeType] = useState("Walk-in");
  const [clientOpen, setClientOpen] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientLoading, setClientLoading] = useState(false);
  const [clientPage, setClientPage] = useState(1);
  const [clientHasMore, setClientHasMore] = useState(false);
  const [clientLoadingMore, setClientLoadingMore] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [billNo, setBillNo] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandPage, setBrandPage] = useState(1);
  const [brandHasMore, setBrandHasMore] = useState(false);
  const [brandLoadingMore, setBrandLoadingMore] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandOption | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [storeOpen, setStoreOpen] = useState(false);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [storeSearch, setStoreSearch] = useState("");
  const [storeLoading, setStoreLoading] = useState(false);
  const [storePage, setStorePage] = useState(1);
  const [storeHasMore, setStoreHasMore] = useState(false);
  const [storeLoadingMore, setStoreLoadingMore] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreOption | null>(null);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [description, setDescription] = useState("");
  const deliveryCounts = {
    "2026-02-03": 2,
    "2026-02-05": 6,
    "2026-02-10": 3,
    "2026-02-13": 5,
    "2026-02-15": 7,
    "2026-02-18": 4,
    "2026-02-22": 1,
    "2026-02-26": 3,
    "2026-03-04": 2,
    "2026-03-12": 4,
    "2026-03-19": 1,
    "2026-03-27": 5,
  } as Record<string, number>;

  useEffect(() => {
    if (!clientOpen) {
      return;
    }
    setClientPage(1);
  }, [clientOpen, clientSearch]);

  useEffect(() => {
    if (!clientOpen) {
      return;
    }
    const timeout = setTimeout(async () => {
      setClientError(null);
      const searchTerm = clientSearch.trim();

      if (searchTerm) {
        setClientLoading(true);
        try {
          const collected: ClientOption[] = [];
          let page = 1;
          let hasMore = true;
          const pageSize = 50;

          while (hasMore && page <= 20) {
            const params = new URLSearchParams({
              page: String(page),
              pageSize: String(pageSize),
              search: searchTerm,
            });
            const response = await fetch(`/api/clients?${params.toString()}`);
            const payload = (await response.json()) as {
              success: boolean;
              data: { items: ClientOption[]; total: number; page: number; pageSize: number } | null;
              message: string;
            };
            if (!response.ok || !payload.success || !payload.data) {
              throw new Error(payload.message || "Unable to load clients.");
            }
            collected.push(...payload.data.items);
            const loaded = page * payload.data.pageSize;
            hasMore = loaded < payload.data.total;
            page += 1;
          }

          setClients(collected);
          setClientHasMore(false);
        } catch (err) {
          setClientError(
            err instanceof Error ? err.message : "Unable to load clients."
          );
        } finally {
          setClientLoading(false);
          setClientLoadingMore(false);
        }
        return;
      }

      if (clientPage === 1) {
        setClientLoading(true);
      } else {
        setClientLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(clientPage),
          pageSize: "50",
        });
        const response = await fetch(`/api/clients?${params.toString()}`);
        const payload = (await response.json()) as {
          success: boolean;
          data: { items: ClientOption[]; total: number; page: number; pageSize: number } | null;
          message: string;
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message || "Unable to load clients.");
        }
        setClients((prev) =>
          clientPage === 1 ? payload.data.items : [...prev, ...payload.data.items]
        );
        const loaded = clientPage * payload.data.pageSize;
        setClientHasMore(loaded < payload.data.total);
      } catch (err) {
        setClientError(
          err instanceof Error ? err.message : "Unable to load clients."
        );
      } finally {
        setClientLoading(false);
        setClientLoadingMore(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [clientOpen, clientPage, clientSearch]);

  useEffect(() => {
    if (!brandOpen) {
      return;
    }
    setBrandPage(1);
  }, [brandOpen, brandSearch]);

  useEffect(() => {
    if (!brandOpen) {
      return;
    }
    const timeout = setTimeout(async () => {
      setBrandError(null);
      const searchTerm = brandSearch.trim();

      if (searchTerm) {
        setBrandLoading(true);
        try {
          const collected: BrandOption[] = [];
          let page = 1;
          let hasMore = true;
          const pageSize = 50;

          while (hasMore && page <= 20) {
            const params = new URLSearchParams({
              page: String(page),
              pageSize: String(pageSize),
              search: searchTerm,
            });
            const response = await fetch(`/api/brands?${params.toString()}`);
            const payload = (await response.json()) as {
              success: boolean;
              data: { items: BrandOption[]; total: number; page: number; pageSize: number } | null;
              message: string;
            };
            if (!response.ok || !payload.success || !payload.data) {
              throw new Error(payload.message || "Unable to load brands.");
            }
            collected.push(...payload.data.items);
            const loaded = page * payload.data.pageSize;
            hasMore = loaded < payload.data.total;
            page += 1;
          }

          setBrands(collected);
          setBrandHasMore(false);
        } catch (err) {
          setBrandError(
            err instanceof Error ? err.message : "Unable to load brands."
          );
        } finally {
          setBrandLoading(false);
          setBrandLoadingMore(false);
        }
        return;
      }

      if (brandPage === 1) {
        setBrandLoading(true);
      } else {
        setBrandLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(brandPage),
          pageSize: "50",
        });
        const response = await fetch(`/api/brands?${params.toString()}`);
        const payload = (await response.json()) as {
          success: boolean;
          data: { items: BrandOption[]; total: number; page: number; pageSize: number } | null;
          message: string;
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message || "Unable to load brands.");
        }
        setBrands((prev) =>
          brandPage === 1 ? payload.data.items : [...prev, ...payload.data.items]
        );
        const loaded = brandPage * payload.data.pageSize;
        setBrandHasMore(loaded < payload.data.total);
      } catch (err) {
        setBrandError(
          err instanceof Error ? err.message : "Unable to load brands."
        );
      } finally {
        setBrandLoading(false);
        setBrandLoadingMore(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [brandOpen, brandPage, brandSearch]);

  useEffect(() => {
    if (!storeOpen) {
      return;
    }
    setStorePage(1);
  }, [storeOpen, storeSearch]);

  useEffect(() => {
    if (!storeOpen) {
      return;
    }
    const timeout = setTimeout(async () => {
      setStoreError(null);
      const searchTerm = storeSearch.trim();

      if (searchTerm) {
        setStoreLoading(true);
        try {
          const collected: StoreOption[] = [];
          let page = 1;
          let hasMore = true;
          const pageSize = 50;

          while (hasMore && page <= 20) {
            const params = new URLSearchParams({
              page: String(page),
              pageSize: String(pageSize),
              search: searchTerm,
            });
            const response = await fetch(`/api/stores?${params.toString()}`);
            const payload = (await response.json()) as {
              success: boolean;
              data: { items: StoreOption[]; total: number; page: number; pageSize: number } | null;
              message: string;
            };
            if (!response.ok || !payload.success || !payload.data) {
              throw new Error(payload.message || "Unable to load stores.");
            }
            collected.push(...payload.data.items);
            const loaded = page * payload.data.pageSize;
            hasMore = loaded < payload.data.total;
            page += 1;
          }

          setStores(collected);
          setStoreHasMore(false);
        } catch (err) {
          setStoreError(
            err instanceof Error ? err.message : "Unable to load stores."
          );
        } finally {
          setStoreLoading(false);
          setStoreLoadingMore(false);
        }
        return;
      }

      if (storePage === 1) {
        setStoreLoading(true);
      } else {
        setStoreLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(storePage),
          pageSize: "50",
        });
        const response = await fetch(`/api/stores?${params.toString()}`);
        const payload = (await response.json()) as {
          success: boolean;
          data: { items: StoreOption[]; total: number; page: number; pageSize: number } | null;
          message: string;
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message || "Unable to load stores.");
        }
        setStores((prev) =>
          storePage === 1 ? payload.data.items : [...prev, ...payload.data.items]
        );
        const loaded = storePage * payload.data.pageSize;
        setStoreHasMore(loaded < payload.data.total);
      } catch (err) {
        setStoreError(
          err instanceof Error ? err.message : "Unable to load stores."
        );
      } finally {
        setStoreLoading(false);
        setStoreLoadingMore(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [storeOpen, storePage, storeSearch]);

  function resetRepairForm() {
    setBillNo("");
    setSelectedClient(null);
    setClientSearch("");
    setClientOpen(false);
    setSelectedBrand(null);
    setBrandSearch("");
    setBrandOpen(false);
    setIntakeType("Walk-in");
    setIntakeOpen(false);
    setSelectedStore(null);
    setStoreSearch("");
    setStoreOpen(false);
    setTotalAmount("");
    setAdvanceAmount("");
    setSelectedDate("");
    setDescription("");
  }

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Operations
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Repairs</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Intake, track, and deliver repair jobs with strict status flow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="h-10 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)]">
            Export
          </button>
          <button
            className="h-10 rounded-full bg-[var(--accent)] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90"
            onClick={() => setIsModalOpen(true)}
          >
            Create Repair
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Pending
          </p>
          <p className="mt-3 text-3xl font-semibold">12</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Intake awaiting start.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Processing
          </p>
          <p className="mt-3 text-3xl font-semibold">8</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Active bench work.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Completed
          </p>
          <p className="mt-3 text-3xl font-semibold">5</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Ready for delivery.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Delivered
          </p>
          <p className="mt-3 text-3xl font-semibold">21</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Hidden from main list.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Repair queue
            </p>
            <h3 className="mt-2 text-xl font-semibold">Active jobs</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="h-10 w-56 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs text-[var(--text-muted)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Search bill, client, brand"
            />
            <button className="h-10 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)]">
              Status: All
            </button>
            <button className="h-10 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)]">
              Store: All
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {repairs.map((repair) => (
            <div
              key={repair.id}
              className="grid gap-4 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-4 text-sm lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.7fr]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {repair.billNo}
                </p>
                <p className="mt-1 font-semibold">{repair.client}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {repair.brand} · {repair.intakeType}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Store: {repair.store}
                </p>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                <p>Total: LKR {repair.total.toLocaleString()}</p>
                <p className="mt-1">
                  Advance: LKR {repair.advance.toLocaleString()}
                </p>
                <p className="mt-1">ETA: {repair.eta}</p>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                <p>Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    statusMeta[repair.status]?.className ??
                    "bg-zinc-400/15 text-zinc-400"
                  }`}
                >
                  {statusMeta[repair.status]?.label ?? repair.status}
                </span>
                {repair.postponed ? (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-amber-400">
                    Postponed
                  </p>
                ) : null}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                <p>Actions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button className="h-9 rounded-full border border-[var(--stroke)] px-4 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)]">
                    Update Status
                  </button>
                  <button className="h-9 rounded-full border border-[var(--stroke)] px-4 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:bg-[var(--panel)]">
                    Postpone
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button className="h-9 rounded-full border border-[var(--stroke)] bg-[var(--panel)] px-4 text-xs text-[var(--text-muted)] transition hover:border-[var(--accent)]">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 text-xs text-[var(--text-muted)]">
            Status flow: PENDING → PROCESSING → REPAIR_COMPLETED → DELIVERED.
            Delivered jobs stay in the database and are hidden from the main list.
          </div>
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 text-xs text-[var(--text-muted)]">
            SMS + Audit: A tracking token is generated at intake, SMS queued, and
            every change is logged (status, reschedule, SMS events).
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6 shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                New Repair
              </p>
              <h3 className="mt-2 text-xl font-semibold">Create repair job</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Required fields generate bill, tracking token, and SMS queue.
              </p>
            </div>

            <form className="mt-6 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Bill number <span className="text-rose-400">*</span>
                  </span>
                  <input
                    className="h-11 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                    placeholder="Enter Bill No"
                    type="text"
                    value={billNo}
                    onChange={(event) => setBillNo(event.target.value)}
                  />
                </label>
                <div className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Client <span className="text-rose-400">*</span>
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)]"
                      onClick={() => setClientOpen((prev) => !prev)}
                      aria-expanded={clientOpen}
                    >
                      <span>
                        {selectedClient
                          ? `${selectedClient.name} - ${formatMobile(
                              selectedClient.mobile
                            )}`
                          : "Select client"}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">v</span>
                    </button>
                    {clientOpen ? (
                      <div className="absolute left-0 right-0 z-10 mt-2 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-2 shadow-xl">
                        <div className="p-2">
                          <input
                            className="h-10 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                            placeholder="Search name or mobile"
                            value={clientSearch}
                            onChange={(event) => setClientSearch(event.target.value)}
                          />
                        </div>
                        <div className="max-h-56 overflow-auto">
                          {clientLoading ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              Loading clients...
                            </div>
                          ) : clientError ? (
                            <div className="px-3 py-2 text-xs text-rose-500">
                              {clientError}
                            </div>
                          ) : clients.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              No clients found.
                            </div>
                          ) : (
                            clients.map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                                  selectedClient?.id === client.id
                                    ? "bg-[var(--panel-muted)] text-[var(--foreground)]"
                                    : "text-[var(--text-muted)] hover:bg-[var(--panel-muted)] hover:text-[var(--foreground)]"
                                }`}
                                onClick={() => {
                                  setSelectedClient(client);
                                  setClientOpen(false);
                                }}
                              >
                                <span>
                                  {client.name} - {formatMobile(client.mobile)}
                                </span>
                                {selectedClient?.id === client.id ? (
                                  <span className="text-xs text-[var(--text-muted)]">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            ))
                          )}
                          {clientHasMore && !clientLoading && !clientError && !clientSearch.trim() ? (
                            <button
                              type="button"
                              className="mt-2 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel)]"
                              onClick={() => setClientPage((prev) => prev + 1)}
                              disabled={clientLoadingMore}
                            >
                              {clientLoadingMore ? "Loading..." : "Load more"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Bat brand <span className="text-rose-400">*</span>
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)]"
                      onClick={() => setBrandOpen((prev) => !prev)}
                      aria-expanded={brandOpen}
                    >
                      <span>{selectedBrand?.name ?? "Select brand"}</span>
                      <span className="text-xs text-[var(--text-muted)]">v</span>
                    </button>
                    {brandOpen ? (
                      <div className="absolute left-0 right-0 z-10 mt-2 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-2 shadow-xl">
                        <div className="p-2">
                          <input
                            className="h-10 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                            placeholder="Search brands"
                            value={brandSearch}
                            onChange={(event) => setBrandSearch(event.target.value)}
                          />
                        </div>
                        <div className="max-h-56 overflow-auto">
                          {brandLoading ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              Loading brands...
                            </div>
                          ) : brandError ? (
                            <div className="px-3 py-2 text-xs text-rose-500">
                              {brandError}
                            </div>
                          ) : brands.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              No brands found.
                            </div>
                          ) : (
                            brands.map((brand) => (
                              <button
                                key={brand.id}
                                type="button"
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                                  selectedBrand?.id === brand.id
                                    ? "bg-[var(--panel-muted)] text-[var(--foreground)]"
                                    : "text-[var(--text-muted)] hover:bg-[var(--panel-muted)] hover:text-[var(--foreground)]"
                                }`}
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setBrandOpen(false);
                                }}
                              >
                                <span>{brand.name}</span>
                                {selectedBrand?.id === brand.id ? (
                                  <span className="text-xs text-[var(--text-muted)]">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            ))
                          )}
                          {brandHasMore && !brandLoading && !brandError && !brandSearch.trim() ? (
                            <button
                              type="button"
                              className="mt-2 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel)]"
                              onClick={() => setBrandPage((prev) => prev + 1)}
                              disabled={brandLoadingMore}
                            >
                              {brandLoadingMore ? "Loading..." : "Load more"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Intake type <span className="text-rose-400">*</span>
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)]"
                      onClick={() => setIntakeOpen((prev) => !prev)}
                      aria-expanded={intakeOpen}
                    >
                      <span>{intakeType}</span>
                      <span className="text-xs text-[var(--text-muted)]">v</span>
                    </button>
                    {intakeOpen ? (
                      <div className="absolute left-0 right-0 z-10 mt-2 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-2 shadow-xl">
                        {["Walk-in", "Courier"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                              option === intakeType
                                ? "bg-[var(--panel-muted)] text-[var(--foreground)]"
                                : "text-[var(--text-muted)] hover:bg-[var(--panel-muted)] hover:text-[var(--foreground)]"
                            }`}
                            onClick={() => {
                              setIntakeType(option);
                              setIntakeOpen(false);
                            }}
                          >
                            <span>{option}</span>
                            {option === intakeType ? (
                              <span className="text-xs text-[var(--text-muted)]">
                                Selected
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Store <span className="text-rose-400">*</span>
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)]"
                      onClick={() => setStoreOpen((prev) => !prev)}
                      aria-expanded={storeOpen}
                    >
                      <span>
                        {selectedStore?.name
                          ? selectedStore.name
                          : "Select store"}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">v</span>
                    </button>
                    {storeOpen ? (
                      <div className="absolute left-0 right-0 z-10 mt-2 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-2 shadow-xl">
                        <div className="p-2">
                          <input
                            className="h-10 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                            placeholder="Search stores"
                            value={storeSearch}
                            onChange={(event) => setStoreSearch(event.target.value)}
                          />
                        </div>
                        <div className="max-h-56 overflow-auto">
                          {storeLoading ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              Loading stores...
                            </div>
                          ) : storeError ? (
                            <div className="px-3 py-2 text-xs text-rose-500">
                              {storeError}
                            </div>
                          ) : stores.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                              No stores found.
                            </div>
                          ) : (
                            stores.map((store) => (
                              <button
                                key={store.id}
                                type="button"
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                                  selectedStore?.id === store.id
                                    ? "bg-[var(--panel-muted)] text-[var(--foreground)]"
                                    : "text-[var(--text-muted)] hover:bg-[var(--panel-muted)] hover:text-[var(--foreground)]"
                                }`}
                                onClick={() => {
                                  setSelectedStore(store);
                                  setStoreOpen(false);
                                }}
                              >
                                <span>
                                  {store.name}
                                  {store.city ? ` · ${store.city}` : ""}
                                </span>
                                {selectedStore?.id === store.id ? (
                                  <span className="text-xs text-[var(--text-muted)]">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            ))
                          )}
                          {storeHasMore && !storeLoading && !storeError && !storeSearch.trim() ? (
                            <button
                              type="button"
                              className="mt-2 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel)]"
                              onClick={() => setStorePage((prev) => prev + 1)}
                              disabled={storeLoadingMore}
                            >
                              {storeLoadingMore ? "Loading..." : "Load more"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Total amount <span className="text-rose-400">*</span>
                  </span>
                  <input
                    className="h-11 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                    placeholder="xxxx"
                    type="text"
                    inputMode="numeric"
                    pattern="\\d*"
                    onChange={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(
                        /\D/g,
                        ""
                      );
                      setTotalAmount(event.currentTarget.value);
                    }}
                    value={totalAmount}
                  />
                </label>
                <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <span>
                    Advance <span className="text-rose-400">*</span>
                  </span>
                  <input
                    className="h-11 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                    placeholder="xxxx"
                    type="text"
                    inputMode="numeric"
                    pattern="\\d*"
                    onChange={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(
                        /\D/g,
                        ""
                      );
                      setAdvanceAmount(event.currentTarget.value);
                    }}
                    value={advanceAmount}
                  />
                </label>
              </div>
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <span>
                  Estimated delivery date <span className="text-rose-400">*</span>
                </span>
                <DeliveryDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  countsByDate={deliveryCounts}
                />
              </label>
              <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 text-xs text-[var(--text-muted)]">
                Tracking token (8-12 chars) will be generated on save, stored as a
                hash, and disabled after delivery.
              </div>
              <label className="grid gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Description
                <textarea
                  className="min-h-[96px] rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="Add repair notes, issues, or special instructions."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  className="h-10 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel)]"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetRepairForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-10 rounded-full bg-[var(--accent)] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90"
                >
                  Save Repair
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
