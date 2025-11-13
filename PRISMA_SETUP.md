Prisma + Docker Postgres setup (for local development)

Overview
--------
This repo uses Prisma (schema at `apps/backend/prisma/schema.prisma`) and expects a PostgreSQL database. The repository includes a `docker-compose.yml` which spins up a Postgres 15 container.

Quick start
-----------
1. Copy `.env.example` to `.env` at the project root and adjust values if needed.

   cp .env.example .env

2. Bring up the Postgres container:

   npm run db:up

   This runs `docker-compose up -d db` and exposes Postgres on localhost:5432.

3. Generate the Prisma client:

   npm run prisma:generate

4. Run an initial migration (development):

   npm run prisma:migrate:dev

   This will create a migration and apply it to the running DB. If you prefer to use `prisma db push` (no migration history), you can instead run:

   npx prisma db push --schema=apps/backend/prisma/schema.prisma

5. Open Prisma Studio to view data in the DB:

   npm run prisma:studio

Stopping the DB
----------------

npm run db:down

Notes
-----
- The Prisma schema's datasource URL uses the `DATABASE_URL` env var. The `.env` file contains a `DATABASE_URL` example pointing at `localhost:5432`.

- If you run Postgres inside a Docker network and Prisma runs from your host, `localhost` in `DATABASE_URL` is correct because Docker publishes the port to the host (see `docker-compose.yml`). If you instead run the app inside a Docker container, update `DATABASE_URL` to use the container name `bookify_db` as the host.

- After creating migrations, commit them under `apps/backend/prisma/migrations/` so teammates can apply them.
