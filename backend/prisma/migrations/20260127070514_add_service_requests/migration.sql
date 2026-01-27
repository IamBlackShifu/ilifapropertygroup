-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "contractor_id" TEXT NOT NULL,
    "property_id" TEXT,
    "service_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "preferred_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "completed_date" TIMESTAMP(3),
    "location_city" TEXT,
    "location_address" TEXT,
    "estimated_budget" DECIMAL(15,2),
    "quoted_amount" DECIMAL(15,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contractor_notes" TEXT,
    "rejection_reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_requests_requester_id_idx" ON "service_requests"("requester_id");

-- CreateIndex
CREATE INDEX "service_requests_contractor_id_idx" ON "service_requests"("contractor_id");

-- CreateIndex
CREATE INDEX "service_requests_property_id_idx" ON "service_requests"("property_id");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_requested_at_idx" ON "service_requests"("requested_at");

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
