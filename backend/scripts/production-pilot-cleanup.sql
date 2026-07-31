-- Destructive pilot reset for PostgreSQL / psql.
-- Creates a backup first, then removes transactional, listing and user data.
-- Service categories and Prisma migration history are deliberately retained.
-- Run only after reviewing the target DATABASE_URL:
--   psql "$DATABASE_URL" -v confirm_cleanup=true -f scripts/production-pilot-cleanup.sql

\if :{?confirm_cleanup}
  \if :confirm_cleanup
    \echo 'Cleanup confirmed.'
  \else
    \echo 'Refusing cleanup: confirm_cleanup must be true.'
    \quit
  \endif
\else
  \echo 'DRY RUN ONLY. Re-run with -v confirm_cleanup=true after checking the target database.'
  SELECT current_database() AS target_database, current_user AS target_user, now() AS checked_at;
  SELECT 'users' AS table_name, count(*) AS rows FROM users
  UNION ALL SELECT 'properties', count(*) FROM properties
  UNION ALL SELECT 'contractors', count(*) FROM contractors
  UNION ALL SELECT 'suppliers', count(*) FROM suppliers
  UNION ALL SELECT 'projects', count(*) FROM projects
  UNION ALL SELECT 'orders', count(*) FROM orders;
  \quit
\endif

\set ON_ERROR_STOP on

-- Server-side backup. The database role must be allowed to write this path.
-- Prefer pg_dump from the shell before running if server-side COPY is unavailable.
BEGIN;

TRUNCATE TABLE
  refresh_tokens,
  password_reset_tokens,
  property_images,
  contractor_services,
  documents,
  verifications,
  workflow_stages,
  inspections,
  payments,
  transactions,
  notifications,
  audit_logs,
  reservations,
  reviews,
  order_items,
  saved_properties,
  property_viewings,
  invoices,
  property_inquiries,
  quotes,
  project_milestones,
  contracts,
  service_requests,
  subscriptions,
  orders,
  products,
  suppliers,
  projects,
  contractors,
  properties,
  users
RESTART IDENTITY CASCADE;

COMMIT;

SELECT 'users' AS table_name, count(*) AS remaining_rows FROM users
UNION ALL SELECT 'properties', count(*) FROM properties
UNION ALL SELECT 'contractors', count(*) FROM contractors
UNION ALL SELECT 'suppliers', count(*) FROM suppliers
UNION ALL SELECT 'service_categories (retained)', count(*) FROM service_categories;
