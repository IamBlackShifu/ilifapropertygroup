# Production pilot database cleanup

The cleanup script removes all accounts and operational/test data while retaining `service_categories` and Prisma migration history. It does not run unless explicitly confirmed.

1. Stop application writes and verify the database hostname/name in `DATABASE_URL`.
2. Take a restorable backup, for example: `pg_dump "$DATABASE_URL" --format=custom --file=ilifa-pre-pilot.dump`.
3. Preview row counts: `psql "$DATABASE_URL" -f backend/scripts/production-pilot-cleanup.sql`.
4. Run the reset: `psql "$DATABASE_URL" -v confirm_cleanup=true -f backend/scripts/production-pilot-cleanup.sql`.
5. Recreate the first administrator with the existing `backend/scripts/create-admin.ts` workflow, then smoke-test login and core journeys.

Do not point the script at production until the backup has been restored successfully in a separate environment. Uploaded files in object storage or on disk are not deleted by this SQL and should be reviewed separately against the retention policy.
