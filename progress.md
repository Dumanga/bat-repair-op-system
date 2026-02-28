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

## 2026-02-12 16:53
- Added Repair/SMS/Audit models and relations in Prisma schema and created /api/repairs with create/list/status updates.
- Wired Repairs UI to API listing, filters, confirmation create flow, and status advance.
- Ran `npx prisma db push`; Prisma generate failed due to locked query engine (stop dev server and rerun `npx prisma generate`).

## 2026-02-12 16:54
- Added brand name search support in repairs listing API.

## 2026-02-12 17:06
- Added repair view mode: View button opens the create modal in read-only state.

## 2026-02-12 17:07
- Renamed status action to Update Status and added confirmation before advancing status.

## 2026-02-12 17:18
- Added repairs calendar counts API and wired delivery date picker to load real counts from DB.

## 2026-02-12 18:33
- Fixed repairs calendar hook placement to avoid invalid hook call runtime error.

## 2026-02-12 18:46
- Normalized estimated delivery date to YYYY-MM-DD (UTC midnight) in repairs API.
- Added calendar loading lock/spinner and wired picker to prevent clicks while counts load.
- Cleared existing Repair records to align with date-only change.

## 2026-02-12 18:48
- Prevented redundant calendar count fetches by de-duping month requests in date picker.

## 2026-02-12 19:02
- Fixed calendar API to return YYYY-MM-DD keys so date picker counts render correctly.

## 2026-02-12 19:05
- Hid zero delivery count badges in the date picker for cleaner UX.

## 2026-02-12 19:07
- Added Repair delete API (Super Admin only) and wired delete action + confirmation in Repairs UI.

## 2026-02-12 19:25
- Fixed Stores modals to lock background scroll and allow modal content scrolling on mobile.

## 2026-02-12 19:27
- Fixed Users create modal to lock background scroll and allow modal content scrolling on mobile.

## 2026-02-12 19:32
- Fixed Repairs create modal spacing and scroll locking so only the modal scrolls.

## 2026-02-12 20:35
- Added Edit/Reschedule flow for repairs with client locked and reschedule detection.

## 2026-02-12 21:51
- Moved theme toggle, admin badge, and logout controls into Settings; added header logo.

## 2026-02-12 21:52
- Increased header logo size.

## 2026-02-12 21:55
- Switched header right-side glow to a white fade.

## 2026-02-12 22:05
- Split sessions by portal with separate cookies and logout routes for operation/accounting.

## 2026-02-12 22:13
- Added public tracking page UI and base URL env entries.

## 2026-02-12 23:06
- Fixed tracking page horizontal overflow and added logo.

## 2026-02-12 23:07
- Clipped tracking page background overflow and adjusted logo size.

## 2026-02-12 23:10
- Increased tracking page logo height.

## 2026-02-12 23:11
- Adjusted tracking page logo sizing to match admin header proportions.

## 2026-02-12 23:12
- Increased tracking page logo size further.

## 2026-02-12 23:13
- Placed tracking logo and chip on the same line.

## 2026-02-12 23:16
- Replaced tracking form with repair details summary on tracking page.

## 2026-02-12 00:00
- Added 10 seeded clients to Prisma seed and ran the seed script.

## 2026-02-12 00:06
- Reset Repair create form fields when canceling the modal.

## 2026-02-13 14:25
- Restored Repairs Repair Types toggle view, inline Create Repair view, and invoice-style repair items in the create form.

## 2026-02-13 15:08
- Fixed Repairs page conditional render block by wrapping the KPI/list section in a fragment to resolve JSX parse errors.

## 2026-02-13 15:18
- Removed stray duplicated JSX appended after the Repairs page component closing brace to fix parse errors.

## 2026-02-13 15:22
- Noted that a stray duplicated JSX block caused a Repairs page parse error; removed it and will avoid repeating this mistake.

## 2026-02-13 15:31
- Adjusted the Repairs create form wrapper to render full-width when using the inline view instead of the modal popup container.

## 2026-02-13 15:40
- Reorganized Repairs create form fields into two desktop rows: bill/client/brand and intake/store/estimated date.

## 2026-02-13 15:46
- Fixed an extra closing div in the Repairs create form row to resolve the JSX parse error.

## 2026-02-13 15:55
- Added a read-only summary layout for Repairs view mode and routed View to the inline create-style panel.

## 2026-02-13 16:04
- Included repair type details in repairs API responses and used them to show proper item names in view mode.

## 2026-02-13 16:12
- Updated Repairs create/view header copy to reflect view and edit modes instead of always showing create text.

## 2026-02-13 16:26
- Routed Edit/Reschedule to the inline view and hid non-editable fields behind a summary while keeping ETA, items, and description editable.

## 2026-02-13 16:38
- Restored edit-mode editable sections (ETA, repair items, totals, description) while keeping non-editable fields as a summary.

## 2026-02-13 16:56
- Cleaned Repairs form render branches so create and edit sections no longer overlap, fixing the edit-mode layout and compile errors.

## 2026-02-13 17:03
- Returned to the repairs main view after a successful update instead of leaving the create form open.

## 2026-02-13 17:11
- Added a short success banner after updating a repair, then auto-returned to the main repairs screen.

## 2026-02-14 02:46
- Fixed auth portal resolution for shared `/api/auth/*` routes by adding `resolvePortal()` (explicit portal/query/header/referer/path fallback) and using it in login + session APIs.
- Extended login DTO + form submission to include portal context (`portal`), and wired operation login to send `portal=OPERATION`.
- Resolved lint-blocking errors:
  - Escaped unescaped apostrophes in operational dashboard JSX.
  - Refactored `ThemeProvider` to avoid `setState` in `useEffect` (derive initial theme in state initializer + sync effect).
  - Refactored `DeliveryDatePicker` to avoid `setState` in `useEffect` (sync selected month/year on open interaction).
  - Updated Prisma seed script to use dynamic imports instead of `require()` to satisfy lint rules.
- Ran `npm run lint`: now passes with 0 errors (warnings only).
- Ran `npm run build`: compile reached a pre-existing TypeScript error in `src/app/api/repairs/route.ts` (status filter typing), not introduced by these changes.

## 2026-02-14 10:59
- Repairs edit/reschedule flow now tracks original snapshot values and disables `Update Repair` until actual changes are made.
- Added edit guard to block PATCH submission when no changes are detected.
- Tightened repair item validation so blank repair-type rows are not allowed (rows must have a selected type or be removed).
- Applied the same validation path to create/update form checks for consistent behavior.
- Verified with ESLint: no new errors introduced by this patch.

## 2026-02-22 17:04
- Replaced SMS Portal placeholder with a full UI-only Delivery Reminder Queue in `src/app/operation/admin/sms/page.tsx`.
- Added three filter chips (All / Walk-in / Courier), today-date chip in header, and dynamic list columns (bill no, client, bat, status, estimated delivery, action).
- Loaded all repairs scheduled for exactly two days ahead (no pagination in UI), with per-row `Send Reminder` action and confirmation popup.
- Added repair status badges to the SMS listing.
- Refined SMS header card spacing/alignment and reduced gap between header and listing cards per UI feedback.

## 2026-02-22 17:09
- Improved SMS Portal responsiveness to match other operational modules:
  - Added mobile-first reminder cards for small screens and kept the table view for `md+`.
  - Tightened responsive paddings/typography in SMS header and listing containers.
  - Kept chip filters and reminder action behavior consistent across mobile and desktop layouts.

## 2026-02-22 17:40
- Implemented Text.lk SMS provider wrapper with retry and response/error normalization in `src/lib/sms/textlk.ts`.
- Added shared repair SMS message helpers in `src/lib/sms/messages.ts` to build tracking links and repair-created message content.
- Updated `POST /api/repairs` to:
  - Build tracking URL and repair-created SMS content.
  - Create `SmsOutbox` records in `PENDING`.
  - Attempt real SMS send via Text.lk wrapper.
  - Persist SMS outcome to outbox (`SENT` + `sentAt` or `FAILED`) with provider response.
  - Write repair audit events for SMS results (`SMS_SENT` / `SMS_FAILED`).
- Added `TEXTLK_API_TOKEN` and `TEXTLK_SENDER_ID` placeholders to `.env.example`.

## 2026-02-22 17:49
- Enforced SMS-size-safe repair-created message composition with a 170-character limit in `src/lib/sms/messages.ts`.
- Switched tracking URL in SMS to a shorter route (`/t/:token`) and added redirect handler `src/app/t/[token]/route.ts` to forward to `/tracking?token=...`.
- Updated tracking token extraction in repairs API to support token parsing from:
  - `Tracking token: ...`
  - short link path (`/t/<token>`)
  - query string token (`?token=...`)
- Resolved multiple strict TypeScript/build blockers across existing files (users/stores/brands/clients/repairs/tracking pages).
- Added local type declaration for `textlk-node` and updated `tsconfig.json` include patterns for `*.d.ts`.
- Verified production build now passes successfully.

## 2026-02-22 18:24
- Added SMS send on repair update (`PATCH /api/repairs`) using the same tracking link flow as create.
- Update SMS body now uses "updated" wording (instead of "created"), with the same 170-character-safe formatter.
- Implemented update-SMS outbox lifecycle:
  - Create `SmsOutbox` row as `PENDING` with type `REPAIR_UPDATED`
  - Attempt send via Text.lk wrapper
  - Persist result as `SENT`/`FAILED` with provider response
- Added audit events for update SMS outcomes (`SMS_SENT`, `SMS_FAILED`), and `SMS_SKIPPED` when tracking token cannot be resolved from existing SMS history.

## 2026-02-22 18:48
- Implemented status-transition SMS notifications in `PATCH /api/repairs`:
  - `PENDING -> PROCESSING`: sends "repair started" SMS with tracking link.
  - `PROCESSING -> REPAIR_COMPLETED`: sends "repair completed" SMS with tracking link.
  - `REPAIR_COMPLETED -> DELIVERED`: sends "repair delivered successfully, thank you" SMS without link.
- Added dedicated status SMS message builder in `src/lib/sms/messages.ts` with 170-character-safe formatting.
- Status-transition SMS now creates outbox rows with explicit types (`REPAIR_STARTED`, `REPAIR_COMPLETED`, `REPAIR_DELIVERED`) and persists `SENT`/`FAILED` outcomes + provider responses.
- Extended tracking token extraction compatibility during update/status SMS to support legacy and current URL patterns.

## 2026-02-22 18:58
- Extended repair action toast notifications (top-right, auto-hide) to cover:
  - Repair edit/update responses
  - Status transition update responses
- Toast messaging now surfaces backend SMS outcomes consistently for create/update/status flows (success vs SMS-failure/error states).

## 2026-02-22 23:15
- Added thermal-style repair bill printing support for Repairs module.
- Implemented reusable print utility in `src/lib/print/repair-receipt.ts` with receipt layout tuned for 80mm paper (`@page size: 80mm auto`) and auto-print trigger.
- Wired auto-print after successful repair creation (without changing DB/SMS backend flow).
- Added manual `Print` action button in repairs listing rows so users can reprint closed bills.
- Receipt includes bill metadata, client/store/intake/status, itemized repair lines, subtotal/total/advance/balance, and thank-you footer.

## 2026-02-23 00:36
- Adjusted repair receipt print layout width from 80mm-style to 72mm paper sizing.
- Added B&W logo (`/assets/logo-dob-bw.png`) at receipt top and replaced brand header text with contact details (`doctorofbat@gmail.com`, `+94 77 718 4814`).
- Split print flow into two copy types:
  - `Repair Copy`: full line-item details with repair names and per-line amounts.
  - `Customer Copy`: hides repair names and breakdown costs, shows a `Repairs` section with repair codes only + totals block.
- Updated Repairs listing layout to include a dedicated `Print` column with two buttons:
  - `Customer Copy`
  - `Repair Copy`
- Removed old single `Print` button from actions.
- After successful repair creation, auto-print now opens `Customer Copy` (not repair copy).

## 2026-02-23 01:05
- Added optional `physicalBillNo` field to `Repair` model in Prisma schema (`String?`, nullable).
- Extended `POST /api/repairs` create validation/persistence to accept `physicalBillNo` (trimmed, max 50 chars, saved as `null` when empty).
- Extended `PATCH /api/repairs` update flow to accept/edit/clear `physicalBillNo` with the same validation and added `PHYSICAL_BILL_NO_UPDATED` audit event.
- Updated Repairs UI form layout to include `Physical bill no (optional)` on the intake/store/estimated date row.
- Wired `physicalBillNo` through create, edit, and view flows (state, payloads, edit snapshot comparison, and view-only rendering).

## 2026-02-23 01:42
- Renamed `Settings` navigation label to `Reports` in the operation portal sidebar while keeping the same route (`/operation/admin/settings`).
- Removed account/session card from the Reports page and moved logout to a sidebar profile-row icon button (plus mobile-nav logout action).
- Updated Users access label from `Settings` to `Reports` in UI text (permission key unchanged).
- Fixed oversized vertical gaps caused by grid stretch behavior in:
  - `src/app/operation/admin/settings/page.tsx`
  - `src/app/operation/admin/sms/page.tsx`
  by applying content-start/self-start layout so title/list cards keep natural height.

## 2026-02-23 02:10
- Implemented real date-range income reporting with new API endpoint `GET /api/reports/income`.
- Added strict report validation:
  - `from` and `to` dates are required.
  - format must be `YYYY-MM-DD`.
  - `from` can be equal to `to` (same-day report supported).
  - `from` cannot be later than `to`.
- Added status-aware collection logic in report rows:
  - `DELIVERED` repairs treated as fully received (`receivedAmount = totalAmount`).
  - non-delivered repairs use advance as received amount.
  - balance is computed per row as outstanding.
- Wired Reports UI to call the API, disable Generate until both dates are selected, show loading/error/empty states, and render real totals.
- Added printable A4 income report utility in `src/lib/print/income-report.ts` with B&W logo (`/assets/logo-dob-bw.png`) and a `Print Report` action after generation.

## 2026-02-23 02:24
- Safely migrated Reports page route from `/operation/admin/settings` to `/operation/admin/reports`:
  - Added new page file at `src/app/operation/admin/reports/page.tsx`.
  - Updated sidebar nav target and access path checks in `src/components/admin-shell.tsx`.
- Preserved backward compatibility for old links/bookmarks:
  - Added redirect page at `src/app/operation/admin/settings/page.tsx` to `/operation/admin/reports`.
  - Added middleware redirect for `/operation/admin/settings` to `/operation/admin/reports`.
- Kept role/access model unchanged (`accessSettings` permission key still used), so existing RBAC behavior remains intact.

## 2026-02-23 02:45
- Added dedicated Stores access permission (`accessStores`) to the `User` model in Prisma schema.
- Updated Super Admin seed defaults to include `accessStores: true`.
- Extended Users API access handling to support `stores` permission:
  - Included `stores` in allowed access keys.
  - Read/write `accessStores` in create/update payload mapping.
  - Returned `accessStores` in user list responses.
- Extended auth session payload (`/api/auth/me`) to return `accessStores`.
- Updated Users management UI:
  - Added `Stores` to access permission options in create/edit user form.
  - Included `accessStores` in access-list mapping for edit mode.
- Updated sidebar RBAC enforcement in `AdminShell`:
  - `/operation/admin/stores` visibility now depends on `currentUser.accessStores` for non-super-admin users (instead of always visible).
  - Super Admin still retains full access to all modules.
- Ran `npx prisma db push` and regenerated Prisma Client successfully.

## 2026-02-23 03:12
- Rebuilt operation dashboard (`src/app/operation/admin/page.tsx`) from static mock widgets to live, delivery-focused UI.
- Replaced revenue KPI with a delivery operations KPI (`Due Today`) and switched KPI cards to real data from pending repairs.
- Added a delivery calendar panel with per-day count badges (sourced from `/api/repairs/calendar`), month navigation, and month-count caching.
- Implemented date selection modes on dashboard:
  - `Single date` (today auto-selected by default)
  - `Date range` (start/end selection, inclusive filtering)
- Added pending-delivery listing tied to current calendar selection:
  - Loads all non-delivered repairs (no pagination in dashboard list view).
  - Filters rows by selected single date or selected date range.
  - Shows bill no, client, bat, status, and estimated delivery.
- Added refresh action and loading/error/empty states for both calendar counts and delivery listing.

## 2026-02-23 03:18
- Adjusted dashboard split layout so pending-delivery listing appears on the left and delivery calendar panel appears on the right on desktop (`xl`) screens.

## 2026-02-23 03:26
- Fixed dashboard responsiveness/overflow issues on laptop and mobile:
  - Prevented page-level horizontal overflow in dashboard container.
  - Added `min-w-0` safeguards to dashboard grid panels.
  - Removed hard table min-width forcing layout overflow.
  - Added mobile-first delivery cards (`md:hidden`) for selected pending deliveries.
  - Kept desktop table view (`md:block`) for larger screens.

## 2026-02-23 03:34
- Enhanced dashboard pending-delivery listing details:
  - Added customer mobile number to delivery rows/cards.
  - Added `View` action button for each listed repair (mobile and desktop rows), routing to Repairs module for detailed handling.

## 2026-02-23 03:42
- Changed dashboard `View` action behavior to open an in-page details popup for the selected repair instead of navigating away.
- Added full repair detail modal content on dashboard:
  - bill/status/client/mobile/brand/store/intake/estimated delivery
  - physical bill no
  - repair line items with prices
  - total/advance/balance summary
  - description
- Added modal close controls and body-scroll lock while popup is open.

## 2026-02-23 03:56
- Implemented real SMS Portal reminder sending flow (backend + UI integration).
- Added new endpoint `GET/POST /api/sms/reminders`:
  - `GET` returns already-sent reminder repair ids for a target date.
  - `POST` sends a reminder SMS for a selected repair using Text.lk wrapper, persists outbox status, and blocks duplicate sends after first successful reminder.
- Added delivery reminder SMS message builder in `src/lib/sms/messages.ts` with 170-char-safe formatting.
- SMS Portal UI now:
  - Fetches sent-status from DB (not local-only state) for two-day scheduled deliveries.
  - Sends real reminder SMS on confirmation.
  - Persists "Reminder Sent" indication after successful first send (including after reload).
  - Shows reminder send errors without breaking listing/filter flows.

## 2026-02-23 04:08
- Updated SMS templates to match finalized draft wording across lifecycle messages:
  - Repair created (pending)
  - Repair started (processing)
  - Repair completed (ready for pickup)
  - Repair delivered (thank-you)
  - Repair updated
  - Repair rescheduled
  - Pickup reminder (2 days before)
- Kept tracking URL structure unchanged using base URL + `/tracking?token=...`.
- Added dedicated reschedule SMS selection in repair update flow:
  - When estimated delivery date changes (without status transition), SMS type/message now uses `REPAIR_RESCHEDULED`.
  - When date does not change but details change, SMS remains `REPAIR_UPDATED`.
- Updated SMS reminder API to require and include real tracking link in pickup reminder messages by extracting existing tracking token from prior SMS history.

## 2026-02-23 04:14
- Removed the `Repair types` / repair items box from customer tracking UI (`/tracking`) while keeping the rest of the tracking summary unchanged.

## 2026-02-23 04:22
- Fixed Repairs KPI cards to be independent from listing filters/pagination.
- Root cause: KPI values were computed from current page/filtered `repairs` list, causing counts to change when switching status tabs.
- Added separate global KPI count loader in `src/app/operation/admin/repairs/page.tsx` that fetches totals per status (`PENDING`, `PROCESSING`, `REPAIR_COMPLETED`, `DELIVERED`) via API.
- Updated KPI cards to use dedicated `kpiCounts` state, so list filters now affect only table/list data and not KPI totals.

## 2026-02-23 04:29
- Replaced hardcoded Repairs nav badge count in `AdminShell` with live pending count.
- Sidebar/mobile `Repairs` badge now shows real `PENDING` repair total fetched from `/api/repairs?status=PENDING`.
