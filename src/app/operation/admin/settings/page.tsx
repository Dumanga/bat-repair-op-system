"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Settings
        </p>
        <h2 className="mt-2 text-2xl font-semibold">System Settings</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Manage operational preferences, appearance, and session controls.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Appearance
          </p>
          <h3 className="mt-2 text-lg font-semibold">Theme</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Toggle between light and dark modes for the operations portal.
          </p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Account
          </p>
          <h3 className="mt-2 text-lg font-semibold">Session</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Signed in as Super Admin.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex h-10 items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-xs text-[var(--text-muted)]">
              Super Admin
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </div>
            <form action="/operation/logout" method="post">
              <button className="h-10 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 text-xs text-rose-600 transition hover:bg-rose-500/20">
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
