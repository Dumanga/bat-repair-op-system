# Requirements Specification (Codex Ready)
## Cricket Bat Repair Shop – Operations Management System

## Project Name - Doctor of Bat

---

## 1. Project Overview
This document defines the **final, confirmed, and approved requirements** for the Cricket Bat Repair Shop Operations Management System. This document is intended to be used as the **single source of truth for Codex kickoff and development**.

The primary goal is to digitize repair operations while maintaining compatibility with existing physical workflows, ensuring stability, correctness, and minimal runtime errors.

---

## 2. Non‑Negotiable Engineering Constraints

### 2.1 Database
- **MySQL must be used in all environments**
  - Development: Localhost MySQL
  - Production: Railway.app (Singapore)
- No alternative database engines allowed

### 2.2 Environment & Secrets
- All credentials must be stored in `.env` / `.env.local`
- `.env` files must not be committed to GitHub
- A `.env.example` with placeholders must exist

### 2.3 Stability Requirements
- Database schema must be stable
- Nullable vs non-nullable fields must be explicitly decided
- Correct data types must be used
- APIs must not throw unhandled errors
- CORS and internal server errors must be handled safely

## 2.4 Mobile Responsiveness (Mandatory)
- The entire application must be fully **responsive** and usable on:
  - Mobile phones
  - Tablets
  - Laptops / desktops
- Mobile usability is a **non-negotiable requirement** (staff should be able to operate the system from a phone if needed).
- All main screens must be designed mobile-first and then scaled up for larger screens:
  - Dashboard
  - Repairs (list + create/edit)
  - Brands
  - Clients
  - Users
  - SMS Portal
- No UI feature should be desktop-only unless explicitly approved.


---

## 3. Technology Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js + TypeScript |
| UI | Tailwind CSS |
| Backend | Next.js API / Route Handlers |
| ORM | Prisma |
| Database | MySQL |
| Hosting | Vercel (App), Railway.app (DB – SG) |

---

## 4. Development Workflow Rules (Mandatory)

### 4.1 UI‑First, DTO‑Driven Development
- Build UI **first** using mock data
- Maintain a **single source of truth** via TypeScript DTOs

Example DTOs:
- `RepairJobDTO`
- `ClientDTO`
- `RepairStatusHistoryDTO`
- `TrackingViewDTO`

### 4.2 Field Discipline
- Any new field discovered during UI design:
  1. Must be added to DTO
  2. Must be added to mock data
  3. Must include required/optional reason, default, and validation
- Prisma schema and migrations are generated **only after UI is finalized**
- Do not invent fields or mark optional without justification

---

## 5. Authentication & Authorization
- Role‑based access control (RBAC)
- Roles (final):
  - **Super Admin**
  - **Cashier**
  - **Repair Staff**
- Only **Super Admin** credentials are manually seeded
- All other users (Cashier, Repair Staff) are created through the system by Super Admin
- All staff/admin routes are protected
- Customer tracking route is public but token‑protected

### 5.1 Role Permissions (High Level)
- **Super Admin**: Full access to all modules and operations
- **Cashier**: Same operational access as Super Admin for day-to-day work (UI may render differently, but permissions are equivalent)
- **Repair Staff**: Restricted access
  - Can access **Repairs** module only
  - Can update repair status according to allowed transitions
  - Cannot access Brands, Clients, Users, SMS Portal, or Dashboard KPIs (unless explicitly allowed later)

---

## 6. Core Domain: Repair Jobs

### 6.1 Repair Statuses (Enum – Final)
1. `PENDING`
2. `PROCESSING`
3. `REPAIR_COMPLETED`
4. `DELIVERED`

Rules:
- Status transitions must be validated server‑side
- Once `DELIVERED`, customer tracking link is disabled

---

### 6.2 Status Transition Validation
Allowed transitions:
- `PENDING → PROCESSING`
- `PROCESSING → REPAIR_COMPLETED`
- `REPAIR_COMPLETED → DELIVERED`

Invalid transitions must be rejected with clear errors.

---

### 6.3 Repair Creation (Happy Path)

Fields:
- Manual bill number (required)
- Client (name + mobile)
- Bat brand (dropdown)
- Intake type (In‑store / Courier)
- Store location
- Total amount
- Advance amount
- Estimated delivery date

Rules:
- Manual bill number maps physical bill to system
- Bill number must be **unique or uniquely scoped** (indexed)
- Delivery date picker must show number of scheduled deliveries per day

On successful creation:
- Repair record is created atomically
- Tracking token is generated and stored (hashed)
- SMS entry is queued (not sent inline)

---

## 7. Delivery Date & Postponement

- Repairs can be rescheduled any number of times
- Boolean field `isPostponed`:
  - Default: false
  - Set to true when delivery date changes after creation
- No limits or counters for postponement
- Used only for admin visibility

---

## 8. Tracking Token Rules

- Token must be **short** (SMS cost consideration)
- Use random short token (8–12 chars)
- Store only **hashed token** in DB
- Tracking disabled when:
  - Status becomes `DELIVERED`

---

## 9. SMS Architecture (Phase‑Ready)

### 9.1 SMS Queue / Outbox Table

Fields:
- repairId
- recipient
- message
- type
- status (PENDING / SENT / FAILED)
- scheduledFor
- sentAt
- providerResponse

Rules:
- SMS sending occurs **after DB commit**
- System must support:
  - Manual sending
  - Automatic sending
  - Hybrid model (decided later)

### 9.2 SMS History
- Repair must store:
  - Last SMS sent
  - SMS content
  - Timestamp

---

## 10. Dashboard & Modules

### 10.1 Dashboard
- Modern left‑sidebar layout
- KPI cards
- Today’s deliveries
- Date‑based filtering

### 10.2 Modules
- **Dashboard** (Super Admin, Cashier)
  - KPI cards
  - Today’s deliveries
  - Date-based filtering
- **Repairs**
  - Super Admin, Cashier: create, edit, reschedule, status update
  - Repair Staff: view assigned/visible repairs and **status update only**
- **Bat Brands** (Super Admin, Cashier): create/edit
- **Clients** (Super Admin, Cashier): create/edit, loyalty tier management
- **Users** (Super Admin only)
- **SMS Portal** (Super Admin, Cashier): view & send pending SMS

---

## 11. Pagination & Performance

- Pagination is mandatory (default: 10 items/page)
- Default sorting:
  - Repairs: estimatedDeliveryDate ASC, createdAt ASC
- Select only required fields
- Index frequently queried columns

---

## 12. Audit Trail (Mandatory)

Create audit log for:
- Repair creation
- Status changes
- Delivery reschedules
- Location changes
- SMS events

Audit fields:
- repairId
- eventType
- oldValue (JSON)
- newValue (JSON)
- performedBy
- timestamp (UTC)

---

## 13. API Standards

- Strict input validation on all endpoints
- Reject unknown fields
- Use enums for constrained values

### 13.1 Response Shape (Mandatory)
```json
{
  "success": true,
  "message": "string",
  "data": {},
  "error": null
}
```

- Correct HTTP status codes
- Clear, field‑level error messages

---

## 14. Date & Time Rules

- Store all timestamps in UTC
- Never store local time strings
- UI handles timezone conversion

---

## 15. Deletion Policy

- Repair jobs are never hard‑deleted
- Delivered jobs are hidden via UI filtering only

---

## 16. Acceptance
This document is approved and serves as the **authoritative reference for development**.

---

*End of Codex‑ready Requirements*

