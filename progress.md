# Progress Log

## 2026-02-01 23:54
- Initialized Next.js app with TypeScript, Tailwind, App Router, and src directory.
- Created database `doctor_of_bat_op` and configured Prisma schema for users/sessions.
- Seeded Super Admin (SuperAdmin@DOB) credentials.
- Built initial login UI at `/auth/login` and routed `/` to login.
- Added login API with validation, session creation, and response helpers.
- Added `.env`/`.env.example` updates (DATABASE_URL, SESSION_SECRET) and Prisma scripts.
## 2026-02-01 23:56
- Suppressed hydration warnings on root html/body to avoid mismatch noise from injected attributes.

## 2026-02-01 23:58
- Committed initial Next.js setup, auth scaffolding, Prisma schema/seed, and login UI.

## 2026-02-02 00:01
- Pushed main branch to remote.

## 2026-02-02 00:05
- Made login a client flow with API submission, loading/error states, and redirect to /admin.
- Added a bold admin dashboard UI with sidebar, KPIs, deliveries, queue, and quick actions.
- Added a subtle rise-in animation utility in global styles.

## 2026-02-02 00:11
- Expanded admin dashboard layout to use ~90% viewport width.

## 2026-02-02 00:12
- Expanded admin dashboard container to full width with a larger max width.

## 2026-02-02 00:13
- Removed the Create Repair button from the admin header.

## 2026-02-02 00:16
- Added theme provider and toggle with persistent dark/light mode.
- Restyled admin dashboard to use theme variables for true light/dark switching.

## 2026-02-02 00:18
- Softened light theme palette for reduced glare and better eye comfort.

## 2026-02-02 00:20
- Added a logout button next to the Super Admin badge in the admin header.

## 2026-02-02 00:23
- Added logout route and session token helpers; logout clears session and redirects to login.
- Styled admin logout button with a red accent and wired it to the logout route.

## 2026-02-02 00:33
- Added mobile nav toggle to the admin header and collapsed the sidebar on small screens.
- Fixed admin panel content encoding issues (currency/arrow) with ASCII-safe text.

## 2026-02-02 00:40
- Added separate mobile Settings toggle to reveal theme switch, Super Admin badge, and logout.
- Kept Menu toggle for mobile nav list while hiding desktop-only header controls on small screens.

## 2026-02-02 00:41
- Fixed JSX parsing error by escaping the arrow text in admin quick actions.

## 2026-02-02 00:44
- Replaced unsupported mobile header icons with ASCII-safe menu bars and a settings badge.

## 2026-02-02 00:46
- Installed lucide-react and replaced mobile header placeholders with Lucide Menu/Settings icons.

## 2026-02-02 00:55
- Committed and pushed admin dashboard, theme switching, mobile controls, and logout updates.

## 2026-02-02 10:01
- Added Bat Brands admin UI page with filters, KPI cards, and brand listing.
- Updated admin nav items to use links for section navigation.

## 2026-02-02 10:13
- Added shared admin layout shell so header/nav persist while page content changes.
- Refactored admin dashboard and Bat Brands pages to render only their content sections.

## 2026-02-02 10:16
- Added placeholder admin pages for Repairs, Clients, Users, SMS, and Settings routes.

## 2026-02-02 10:20
- Added admin loading skeletons for global and section-level routes.

## 2026-02-02 10:29
- Removed admin skeleton loading components per request.

## 2026-02-02 10:32
- Set initial theme to dark before hydration to prevent light-theme flash.

## 2026-02-02 10:33
- Added hydration warning suppression to admin shell root to avoid extension-injected attribute mismatches.

## 2026-02-02 10:35
- Removed the Most repaired KPI card from Bat Brands.

## 2026-02-02 10:36
- Added Add Brand modal popup with bat name input on the Bat Brands page.

## 2026-02-02 10:37
- Removed Close text button from the Add Brand modal header.

## 2026-02-02 10:39
- Removed Bat Brands filter sidebar and added a search field next to the list count.

## 2026-02-02 10:41
- Added pagination UI to Bat Brands list.

## 2026-02-02 10:44
- Moved the Bat Brands "Showing 5 of 12" indicator to the pagination footer.

## 2026-02-02 10:47
- Removed status column from Bat Brands list and vertically centered row content.

## 2026-02-02 10:56
- Added Brand model and /api/brands endpoints with pagination + search.
- Wired Bat Brands UI to load from DB and create new brands via modal.
- Prisma generate failed due to locked query engine; stop dev server and rerun `npx prisma generate`.

## 2026-02-02 12:40
- Disabled React strict mode to prevent duplicate Bat Brands API fetches in dev.
- Added abortable brand loading with request ordering and a reload token for post-create refetch.
- Triggered a full Bat Brands refetch after successful create to refresh KPIs and table.

## 2026-02-02 13:23
- Added the dashboard KPI rise-in animation class to both Bat Brands KPI cards to match the dashboard.

## 2026-02-02 13:26
- Added Bat Brands edit flow using the existing modal with PATCH support.
- Wired Edit buttons to preload brand name and submit updates.
- Triggered refetch after edits to refresh KPIs and table.

## 2026-02-02 13:28
- Added basic Bat Brands modal validation for empty or unchanged names and disabled submit accordingly.

## 2026-02-02 13:32
- Built Clients UI with KPI cards, search, and customer list mock data.
- Added Add Customer modal with name, mobile, and loyalty tier (Bronze/Silver/Gold) inputs.

## 2026-02-02 14:34
- Added Clients pagination (10 per page) with page controls and counts.
- Styled loyalty tier display with color-coded badges and improved tier select styling.

## 2026-02-02 14:38
- Replaced Clients loyalty tier native select with a custom-styled dropdown for consistent option styling.

## 2026-02-02 14:42
- Removed last-visit text from the Clients table and updated mock data accordingly.

## 2026-02-02 15:10
- Added Client model with loyalty tier enum and indexes in Prisma schema.
- Implemented /api/clients GET/POST/PATCH with pagination, search, and KPI counts.
- Wired Clients UI to DB-backed listing, create, and edit with modal validation and refetch.

## 2026-02-02 15:13
- Ran prisma db push and prisma generate for the new Client model (stopped dev server processes to unlock query engine).

## 2026-02-02 15:50
- Updated Clients mobile input to fixed +94 prefix with 9-digit entry, storing full 94XXXXXXXXX in DB.
- Added client-side validation and server-side normalization for +94 mobile format.

## 2026-02-02 15:56
- Enforced unique client mobile numbers in Prisma and returned friendly duplicate errors.
- Ran prisma db push with accept-data-loss and regenerated Prisma Client (stopped dev server to unlock query engine).

## 2026-02-02 15:59
- Fixed client create duplicate mobile handling to return a friendly 409 error.
- Showed client save errors inside the modal for visibility.

## 2026-02-02 16:04
- Added Clients delete endpoint and UI delete button with confirmation and refetch.

## 2026-02-02 16:07
- Added reusable ConfirmDialog component and wired Clients delete to use a styled confirmation popup.

## 2026-02-02 16:20
- Added Super Admin profile image (1.png) to the admin header badge.
- Built a Users page list showing profile image id for Super Admin.

## 2026-02-02 16:23
- Replaced the header badge square above the dashboard title with Super Admin profile image 1.png.

## 2026-02-02 16:24
- Moved the Super Admin profile image to the sidebar Workshop Hub card and removed it from the top header.

## 2026-02-02 16:25
- Updated the sidebar card text to show Super Admin and Online status.

## 2026-02-02 16:25
- Added green online status dot next to the Super Admin label in the sidebar card.

## 2026-02-02 16:29
- Added profileImageId to User model, seeded Super Admin with image 1, and exposed /api/auth/me.
- Wired sidebar profile image to load from session user with gradient fallback on image load error.
- Ran prisma db push, generate, and seed (stopped dev server to unlock query engine).

## 2026-02-02 16:34
- Restyled Users page to match Clients/Bat Brands layout with header actions, KPI cards, and list row styling.

## 2026-02-02 16:36
- Removed KPI cards from the Users page while keeping layout aligned with other modules.

## 2026-02-02 16:37
- Tightened Users page spacing by wrapping header and list in a single grid with smaller gap.

## 2026-02-02 16:38
- Restored Users page KPI cards layout per request.

## 2026-02-02 16:50
- Added user access flags to the User model and seeded Super Admin with full access.
- Implemented /api/users listing and create with role/access validation and password hashing.
- Wired Users UI to API with create modal, profile image selector, role dropdown, and access checkboxes.
- Updated /api/auth/me and nav filtering to respect per-user access selections.
- Ran prisma db push, generate, and seed (stopped dev server to unlock query engine).

## 2026-02-02 16:54
- Fixed Users nav rendering crash by moving visibleNavItems inside AdminShell component scope.

## 2026-02-02 16:58
- Restored Users KPI cards and added API counts for super admins and staff totals.

## 2026-02-02 17:17
- Added Users edit/delete support with modal reuse and styled confirmation dialog.
- Disabled edit/delete for Super Admin while allowing updates for other roles.

## 2026-02-03 21:34
- Added hydration warning suppression on AdminShell layout wrappers to mitigate extension-injected attribute mismatches.

## 2026-02-10 11:05
- Added operational portal routes under /operation with copied admin pages.
- Redirected legacy /auth/login, /auth/logout, /admin/*, and root / to /operation equivalents.
- Updated admin shell navigation and logout to use /operation paths.

## 2026-02-10 11:24
- Removed /admin and /auth route files to avoid duplicated UI/routes.
- Added middleware redirects for /admin/*, /auth/login, and /auth/logout to /operation paths.

## 2026-02-10 22:17
- Added Stores nav item and operational Stores page with sample UI and modal.
- Added required field validation/disable-save logic and custom status dropdown styling.
- Simplified Stores KPIs to Active Stores and Total Staff only.
- Removed the top-right Close button from the Store create modal.

## 2026-02-10 22:22
- Added Store model and status enum to Prisma schema.
- Implemented /api/stores CRUD with validation, search, pagination, and KPI counts.
- Wired Stores UI to API with fetch, pagination, and create modal submission.
- Ran `npx prisma db push`; Prisma generate failed due to locked query engine (stop dev server and rerun `npx prisma generate`).

## 2026-02-10 22:23
- Split Stores UI error states for list load vs form submission.

## 2026-02-10 22:29
- Added Stores edit and delete actions with modal flows wired to /api/stores.

## 2026-02-10 22:31
- Disabled Store save button when editing with no changes.

## 2026-02-10 22:39
- Added User system enum + store assignment fields to Prisma schema and super admin seed.
- Updated Users API to require store assignment and return store details for operational system users.
- Added store dropdown to Users UI with store listing column and validation.
- Ran `npx prisma db push`; Prisma generate failed due to locked query engine (stop dev server and rerun `npx prisma generate`).

## 2026-02-11 00:09
- Added staff counts per store in Stores API and UI (excluding Super Admin).

## 2026-02-11 00:48
- Built Repairs sample UI with KPIs, status flow, list, and intake modal fields per requirements.

## 2026-02-11 12:45
- Added custom delivery date picker UI with per-day delivery count badges (template data).

## 2026-02-11 12:47
- Extracted custom delivery date picker into reusable component for repairs and future dashboards.

## 2026-02-11 12:50
- Enhanced delivery date picker with month navigation and modal-style overlay; added multi-month template counts.

## 2026-02-11 12:56
- Fixed delivery date picker close behavior and defaulted month view to current date when no selection.

## 2026-02-11 12:57
- Adjusted delivery date picker open/close handling and preserved last viewed month when no date is selected.

## 2026-02-11 12:58
- Disabled date picker trigger while open to prevent immediate reopen on close.

## 2026-02-11 13:03
- Updated Repair create placeholders for bill number and amount fields.

## 2026-02-11 13:07
- Restricted total/advance inputs to digits only and updated placeholders to "xxxx".

## 2026-02-11 13:33
- Switched intake type to a Walk-in/Courier dropdown and added repair description field.

## 2026-02-11 13:34
- Replaced intake type select with a custom-styled dropdown UI.

## 2026-02-11 13:39
- Wired intake type dropdown open/close state and selection handling.

## 2026-02-11 14:12
- Fixed intake type dropdown to close immediately on option selection.

## 2026-02-11 15:32
- Fixed intake type dropdown selection so chosen option updates correctly.

## 2026-02-11 15:34
- Rebuilt intake type dropdown with the standard custom-styled pattern used elsewhere.

## 2026-02-11 15:38
- Re-aligned intake type dropdown markup to match Users form dropdown pattern.

## 2026-02-11 15:57
- Fixed intake type dropdown closing by removing label wrapper.

## 2026-02-11 23:42
- Added client dropdown in Repair create modal with search input and DB-backed list.

## 2026-02-11 23:47
- Improved client search: numeric queries match mobile startsWith (0-prefixed local supported), text queries match name.

## 2026-02-11 23:53
- Added client dropdown pagination with "Load more" to avoid fixed size limits.

## 2026-02-11 23:55
- Updated client search to fetch all matching pages so results are not capped by initial page size.

## 2026-02-12 00:09
- Added brand and store dropdowns in Repair create modal with search and DB-backed lists.

## 2026-02-12 00:00
- Added 10 seeded clients to Prisma seed and ran the seed script.

## 2026-02-12 00:06
- Reset Repair create form fields when canceling the modal.
