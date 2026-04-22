# backend

## Prerequisites

- [Bun](https://bun.com) v1.3+
- A running PostgreSQL database (local or remote)

## Setup

1. Install dependencies:

```bash
bun install
```

2. Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bookplanner
HARDCOVER_KEY=your_hardcover_api_key
CORS_ORIGIN=http://localhost:5173
```

3. Generate and run database migrations:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

## Running

Development (with hot reload):

```bash
bun dev
```

Production:

```bash
bun start
```
