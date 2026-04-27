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
DATABASE_URL=postgresql://app_user:password@localhost:5432/bookplanner
ADMIN_DATABASE_URL=postgresql://postgres:password@localhost:5432/bookplanner
HARDCOVER_KEY=your_hardcover_api_key
CORS_ORIGIN=http://localhost:5173
```

`DATABASE_URL` uses the least-privilege `app_user` role (RLS enforced). `ADMIN_DATABASE_URL` uses the superuser and is used by Drizzle Studio and migrations.

3. Set up the database roles and RLS configuration:

Connect to your database as the superuser and run:

```sql
-- Create the application role
CREATE ROLE app_user LOGIN PASSWORD 'yourpassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Pre-declare the RLS configuration parameter
ALTER DATABASE bookplanner SET app.current_user_id = '';

-- Allow app_user to set the RLS parameter
GRANT SET ON PARAMETER app.current_user_id TO app_user;
```

This only needs to be done once per database instance.

4. Generate and run database migrations:

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
