ALTER TABLE "users"
ADD COLUMN "company_name" TEXT,
ADD COLUMN "company_logo_url" TEXT,
ADD COLUMN "agent_registration_number" TEXT,
ADD COLUMN "is_agent_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "agent_verified_at" TIMESTAMP(3);
