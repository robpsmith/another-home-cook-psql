-- CreateTable
CREATE TABLE "recipes" (
    "recipe_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "prep_time_min" INTEGER,
    "cook_time_min" INTEGER,
    "servings" VARCHAR(50),
    "image_url" VARCHAR(255),
    "ingredients" JSONB,
    "instructions" JSONB,
    "published_date" TIMESTAMPTZ(6),
    "updated_date" TIMESTAMPTZ(6),

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");
