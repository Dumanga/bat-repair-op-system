const users = [
  {
    id: "u-001",
    name: "Super Admin",
    role: "Super Admin",
    profileImageId: 1,
  },
];

export default function UsersPage() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Users
          </p>
          <h2 className="mt-2 text-2xl font-semibold">User management</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Manage staff roles and profile photos.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Staff list
            </p>
            <h3 className="mt-2 text-xl font-semibold">Active users</h3>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 py-3 sm:grid-cols-[1.4fr_0.6fr_0.4fr]"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--panel)]">
                  <img
                    src={`/assets/profile-imgs/${user.profileImageId}.png`}
                    alt={`${user.name} profile`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">ID {user.id}</p>
                </div>
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                {user.role}
              </div>
              <div className="text-right text-xs text-[var(--text-muted)]">
                Profile {user.profileImageId}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
