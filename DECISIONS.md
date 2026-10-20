# Architecture & Technical Decisions

## 1. Monorepo Organization
- **Separation of Concerns**: Kept `/backend` and `/frontend` cleanly separated within a monorepo structure.
- **Root Scripts**: Standardized root workspace configurations for shared coordination.

## 2. Backend Design
- **Express + App / Server Separation**:
  - `src/app.js`: Exports the Express app instance configured with middleware and routes without calling `app.listen()`, allowing seamless integration testing with Supertest.
  - `src/server.js`: Imports `app.js` and handles process lifecycle, environment configuration, and port binding.
- **Layered Architecture**:
  - `routes/`: Routing layer with validation middleware attached.
  - `controllers/`: Handles HTTP request/response mapping and delegating to services.
  - `services/`: Encapsulates core business logic, including inquiry status transitions (`NEW` -> `IN_PROGRESS` -> `RESOLVED` / `CLOSED`), duplicate checks, and ownership/role checks.
  - `middleware/`: Reusable validation with Zod, JWT/session authentication, and standardized error handling.
  - `config/`: Explicit environment parsing and database pooling using `pg.Pool`.
- **Database Migrations & Seed**:
  - Simple, lightweight SQL migration files (`migrations/001_init.sql`) executed through standard node scripts (`scripts/migrate.js`) without heavy ORM overhead.

## 3. Frontend Architecture
- **Next.js App Router**:
  - Utilizes modern App Router (`src/app`) with file-based routing.
  - Route groups and clean page navigation (`/inquiries`, `/inquiries/new`, `/inquiries/[id]`, `/login`).
- **State Management & Custom Hooks**:
  - `useInquiries`: Central hook managing fetching, filtering, pagination, and optimistic/stale updates.
  - `useDebounce`: Custom hook for debouncing search query input before issuing API calls.
- **Component Design**:
  - Modular, reusable UI components (`StatusBadge`, `StatusActions`, `InquiryTable`, `SearchFilterBar`, `Skeleton`, `Toast`, `EmptyState`, `ErrorState`).
- **Testing**:
  - Vitest + Testing Library for fast, DOM-based component testing with mock API requests.
