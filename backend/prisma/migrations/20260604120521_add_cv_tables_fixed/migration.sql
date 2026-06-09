-- CreateTable
CREATE TABLE "cv_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cv_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "education" JSONB,
    "skills" TEXT[],
    "experience" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_profiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cv_profiles" ADD CONSTRAINT "cv_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_profiles" ADD CONSTRAINT "cv_profiles_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "cv_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
