# Requirements Specification (Codex Ready)
## Cricket Bat Repair Shop – Operations + Accounting System

**Version:** 1.0  
**Date:** 2026-02-10  

---

## 0. Execution Rule (Critical)

### 0.1 Must read current project progress
- A root-level file **`progress.md`** exists and is maintained as the live status tracker.
- **Before implementing any new work**, developers MUST read `progress.md` to understand:
  - What is already implemented
  - What is partially implemented
  - What is pending

### 0.2 Delivery Order (Strict)
1. **Complete Operational Management System**
2. Proceed to **Accounting Portal** only after Operational completion

---

## 1. Project Overview

This document defines the **final, confirmed, and approved requirements** for the Cricket Bat Repair Shop system.

The system consists of:
- **Operational Management Portal**
- **Accounting Portal**

Both portals:
- Run inside a **single Next.js application**
- Use a **single shared MySQL database**
- Have **separate logins, roles, and UIs**

This document is the **single source of truth for Codex and development**.

---

## 2. Non‑Negotiable Engineering Constraints

### 2.1 Database
- **MySQL must be used in all environments**
  - Local development: MySQL
  - Production: Railway.app (Singapore)
- **Single shared database/schema**
- No alternative DB engines allowed

### 2.2 Environment & Secrets
- Secrets stored in `.env` / `.env.local`
- `.env` files must NOT be committed
- `.env.example` must exist

### 2.3 Stability Requirements
- Stable DB schema
- Explicit nullable vs non-nullable fields
- Correct data types
- No unhandled API errors
- Safe CORS and internal error handling

---

## 3. Technology Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js + TypeScript |
| UI | Tailwind CSS |
| Backend | Next.js Route Handlers |
| ORM | Prisma |
| Database | MySQL |
| Hosting | Vercel / AWS Lightsail / DigitalOcean |
| DB Hosting | Railway.app (SG) |

---

## 4. Development Workflow Rules

### 4.1 UI‑First, DTO‑Driven
- UI built first using mock data
- DTOs are the single source of truth
- New fields must:
  1. Be added to DTO
  2. Be added to mock data
  3. Have validation + justification

### 4.2 API Response Shape (Mandatory)
```json
{
  "success": true,
  "message": "string",
  "data": {},
  "error": null
}
```

- Correct HTTP codes
- Reject unknown fields
- Clear field-level errors
- Enums for constrained values

---

## 5. Portal Architecture

### 5.1 Routes (Mandatory)

**Operational Portal**
- `/operation/login`
- `/operation/admin`

**Accounting Portal**
- `/accounting/login`
- `/accounting/admin`

> Existing `/admin/login` MUST be refactored.

### 5.2 Separate UIs
- Operational UI ≠ Accounting UI
- Accounting UI uses **light theme**
- Brand colors:
  - `#ff7101`
  - `#2c2a2c`
  - `#ffffff`

---

## 6. Authentication & Authorization

### 6.1 Operational Roles
- Super Admin
- Cashier
- Repair Staff

### 6.2 Accounting Roles
- Super Admin
- Accountant
- Data Entry

### 6.3 User Table Strategy
- Single `users` table
- Add `portal/system` column (`OPERATION` / `ACCOUNTING`)
- Login screens must restrict access by portal

### 6.4 Seeding
- Only Super Admin is manually seeded
- All others created via system

---

## 7. Stores / Locations (CRITICAL)

### 7.1 Stores Module
- Shared across both portals
- Central list of locations

### 7.2 User Assignment
- Each non-super-admin user assigned to one store
- Super Admin sees all stores

### 7.3 Store‑Scoped Data
- All records MUST include:
  - `storeId`
  - `createdBy`

Applies to:
- Repairs
- PO / GRN / Invoices
- Inventory changes
- Payments
- Returns

---

## 8. Current Implementation Status

Already completed (Operational):
- Login + Dashboard UI
- Brands module (UI + API + DB)
- Clients module (CRUD + DB)
- Users module
- RBAC implementation

---

# PART A — OPERATIONAL MANAGEMENT SYSTEM

## 9. Repair Jobs

### 9.1 Status Enum
- `PENDING`
- `PROCESSING`
- `REPAIR_COMPLETED`
- `DELIVERED`

### 9.2 Allowed Transitions
- PENDING → PROCESSING
- PROCESSING → REPAIR_COMPLETED
- REPAIR_COMPLETED → DELIVERED

### 9.3 Repair Creation Fields
- Manual bill number (unique)
- Client
- Bat brand
- Intake type
- Store
- Total amount
- Advance amount
- Estimated delivery date

On success:
- Atomic DB write
- Tracking token generated (hashed)
- SMS queued

### 9.4 Postponement
- Unlimited reschedules
- `isPostponed` boolean

### 9.5 Tracking Token
- 8–12 chars
- Hashed in DB
- Disabled after delivery

### 9.6 Deletion
- No hard deletes
- Delivered hidden via UI only

---

## 10. SMS System

### 10.1 SMS Outbox
- repairId
- recipient
- message
- type
- status
- scheduledFor
- sentAt
- providerResponse

### 10.2 SMS History
- Last SMS content
- Timestamp

---

## 11. Audit Trail (Mandatory)

Log:
- Repair creation
- Status changes
- Reschedules
- Location changes
- SMS events

Fields:
- repairId
- eventType
- oldValue
- newValue
- performedBy
- timestamp (UTC)

---

## 12. Operational Modules
- Dashboard
- Repairs
- Bat Brands
- Clients
- Users
- SMS Portal

---

# PART B — ACCOUNTING PORTAL

## 13. Sidebar Modules
1. Suppliers / Vendors
2. Customers / Clients
3. Inventory
4. Chart of Accounts
5. Settings

---

## 14. Suppliers / Vendors
- Vendor CRUD
- Purchase Orders
- PO History
- GRN
- Goods Return
- Supplier Payments

---

## 15. Customers / Clients
- Shared client DB
- Quotations
- Invoices/Bills
- Customer Returns
- Customer Payments

### 15.1 Mark as Paid Flow
- Default: UNPAID
- Select payment method
- Record paid timestamp + method

---

## 16. Inventory

### 16.1 Product Master
- Name
- Code
- Initial buying price
- Initial selling price
- Specification / description

### 16.2 Stock Sources
- GRN (IN)
- Invoice (OUT)
- Returns
- Material Issue Note (internal use)

---

## 17. Performance
- Pagination (10/page)
- Indexed columns
- Minimal selects

---

**END OF REQUIREMENTS**