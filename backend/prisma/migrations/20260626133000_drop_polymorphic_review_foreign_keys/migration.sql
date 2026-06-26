-- Reviews are polymorphic via reviewed_entity_type + reviewed_entity_id.
-- Keep that generic lookup pair, but move real foreign keys to dedicated
-- nullable columns so a supplier review is not forced to also match a
-- contractor and property row.
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
