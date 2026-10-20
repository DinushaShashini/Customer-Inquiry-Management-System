# Customer Inquiry Management System

A full-stack monorepo application designed to streamline customer inquiries, tracking, status transitions, and customer service workflows.

## Architecture

- **Backend**: Node.js, Express, PostgreSQL (`pg`), Zod, Dotenv, CORS, Cookie-Parser, Jest & Supertest.
- **Frontend**: Next.js (App Router), TypeScript, Vitest, Testing Library.
- **Monorepo**: Root workspace managing `/backend` and `/frontend`.

---

## Directory Structure

```text
customer-inquiry-system/
├── README.md
├── DECISIONS.md
├── .gitignore
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── jest.config.js
│   ├── migrations/
│   │   └── 001_init.sql
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── src/
│   │   ├── server.js              # starts the server (listen)
│   │   ├── app.js                 # express app (exported for tests)
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── db.js              # pg Pool
│   │   ├── middleware/
│   │   │   ├── requireAuth.js
│   │   │   ├── validate.js        # zod wrapper
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── inquiries.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── inquiries.controller.js
│   │   ├── services/
│   │   │   └── inquiries.service.js   # business rules (transitions, duplicates, access)
│   │   ├── schemas/
│   │   │   └── inquiry.schema.js      # zod schemas
│   │   └── utils/
│   │       └── AppError.js
│   └── tests/
│       ├── setup.js
│       └── inquiries.test.js
│
└── frontend/
    ├── package.json
    ├── .env.local.example
    ├── vitest.config.ts
    ├── vitest.setup.ts
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx                    # redirects to /inquiries
        │   ├── globals.css
        │   ├── login/
        │   │   └── page.tsx
        │   └── inquiries/
        │       ├── page.tsx                # list
        │       ├── new/
        │       │   └── page.tsx            # create form
        │       └── [id]/
        │           └── page.tsx            # detail + status change
        ├── components/
        │   ├── InquiryForm.tsx
        │   ├── InquiryTable.tsx
        │   ├── StatusBadge.tsx
        │   ├── StatusActions.tsx
        │   ├── SearchFilterBar.tsx
        │   ├── Skeleton.tsx
        │   ├── EmptyState.tsx
        │   ├── ErrorState.tsx
        │   ├── StaleBanner.tsx
        │   └── Toast.tsx
        ├── lib/
        │   ├── api.ts                      # fetch wrapper (credentials: 'include')
        │   ├── validation.ts               # client-side rules
        │   └── types.ts
        ├── hooks/
        │   ├── useDebounce.ts
        │   └── useInquiries.ts
        └── __tests__/
            ├── InquiryForm.test.tsx
            └── InquiryDetail.test.tsx
```

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

### 3. Running Tests
- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend && npm test`
