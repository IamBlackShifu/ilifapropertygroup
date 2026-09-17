CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "device_type" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "page_views_occurred_at_idx" ON "page_views"("occurred_at");
CREATE INDEX "page_views_visitor_id_occurred_at_idx" ON "page_views"("visitor_id", "occurred_at");
CREATE INDEX "page_views_path_occurred_at_idx" ON "page_views"("path", "occurred_at");
