-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "saved_properties" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "notes" TEXT,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_viewings" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "requested_by" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "preferred_date" TIMESTAMP(3) NOT NULL,
    "preferred_time" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "message" TEXT,
    "status" "ViewingStatus" NOT NULL DEFAULT 'REQUESTED',
    "confirmed_date" TIMESTAMP(3),
    "confirmed_time" TEXT,
    "owner_notes" TEXT,
    "completion_notes" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "property_viewings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_properties_user_id_idx" ON "saved_properties"("user_id");

-- CreateIndex
CREATE INDEX "saved_properties_property_id_idx" ON "saved_properties"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_properties_user_id_property_id_key" ON "saved_properties"("user_id", "property_id");

-- CreateIndex
CREATE INDEX "property_viewings_property_id_idx" ON "property_viewings"("property_id");

-- CreateIndex
CREATE INDEX "property_viewings_requested_by_idx" ON "property_viewings"("requested_by");

-- CreateIndex
CREATE INDEX "property_viewings_owner_id_idx" ON "property_viewings"("owner_id");

-- CreateIndex
CREATE INDEX "property_viewings_status_idx" ON "property_viewings"("status");

-- CreateIndex
CREATE INDEX "property_viewings_preferred_date_idx" ON "property_viewings"("preferred_date");

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_viewings" ADD CONSTRAINT "property_viewings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_viewings" ADD CONSTRAINT "property_viewings_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_viewings" ADD CONSTRAINT "property_viewings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
