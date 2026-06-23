ALTER TABLE "applications"
ADD COLUMN "match_score_source" TEXT;

ALTER TABLE "testimonials"
ADD COLUMN "title" TEXT,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "author_id" TEXT,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "testimonials"
ADD CONSTRAINT "testimonials_author_id_fkey"
FOREIGN KEY ("author_id") REFERENCES "candidate_profiles"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "testimonials_status_created_at_idx"
ON "testimonials"("status", "created_at");
