CREATE TABLE "prompt_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_categories_name_idx" ON "prompt_categories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_categories_slug_idx" ON "prompt_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");