-- Safety migration for environments that applied an earlier version of the
-- review polymorphic FK migration before the dedicated relation columns existed.
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "contractor_id" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "property_id" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "supplier_id" TEXT;

UPDATE "reviews"
SET "contractor_id" = "reviewed_entity_id"
WHERE "reviewed_entity_type" = 'CONTRACTOR'
  AND "contractor_id" IS NULL;

UPDATE "reviews"
SET "property_id" = "reviewed_entity_id"
WHERE "reviewed_entity_type" = 'PROPERTY'
  AND "property_id" IS NULL;

UPDATE "reviews"
SET "supplier_id" = "reviewed_entity_id"
WHERE "reviewed_entity_type" = 'SUPPLIER'
  AND "supplier_id" IS NULL;

ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "review_property_fk";
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "review_contractor_fk";
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "review_supplier_fk";

UPDATE "reviews" r
SET "contractor_id" = NULL
WHERE r."contractor_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "contractors" c WHERE c."id" = r."contractor_id"
  );

UPDATE "reviews" r
SET "property_id" = NULL
WHERE r."property_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "properties" p WHERE p."id" = r."property_id"
  );

UPDATE "reviews" r
SET "supplier_id" = NULL
WHERE r."supplier_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "suppliers" s WHERE s."id" = r."supplier_id"
  );

CREATE INDEX IF NOT EXISTS "reviews_contractor_id_idx" ON "reviews"("contractor_id");
CREATE INDEX IF NOT EXISTS "reviews_property_id_idx" ON "reviews"("property_id");
CREATE INDEX IF NOT EXISTS "reviews_supplier_id_idx" ON "reviews"("supplier_id");

ALTER TABLE "reviews"
  ADD CONSTRAINT "review_contractor_fk"
  FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "review_property_fk"
  FOREIGN KEY ("property_id") REFERENCES "properties"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "review_supplier_fk"
  FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
