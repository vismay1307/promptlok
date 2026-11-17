CREATE TYPE "public"."prompt_lifecycle_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."prompt_type" AS ENUM('text', 'image');--> statement-breakpoint
CREATE TYPE "public"."prompt_visibility" AS ENUM('private', 'shared', 'team', 'organization', 'public');--> statement-breakpoint
CREATE TABLE "prompt_tags" (
	"prompt_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "prompt_tags_prompt_id_tag_id_pk" PRIMARY KEY("prompt_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "prompt_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prompt_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"content" text NOT NULL,
	"change_note" text,
	"editor_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(140) NOT NULL,
	"description" text,
	"category_id" uuid,
	"prompt_type" "prompt_type" DEFAULT 'text' NOT NULL,
	"ai_model_metadata" varchar(100),
	"visibility" "prompt_visibility" DEFAULT 'private' NOT NULL,
	"lifecycle_status" "prompt_lifecycle_status" DEFAULT 'draft' NOT NULL,
	"current_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_editor_id_users_id_fk" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_category_id_prompt_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."prompt_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prompt_tags_tag_idx" ON "prompt_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_versions_prompt_version_idx" ON "prompt_versions" USING btree ("prompt_id","version_number");--> statement-breakpoint
CREATE INDEX "prompt_versions_prompt_idx" ON "prompt_versions" USING btree ("prompt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_versions_prompt_id_id_idx" ON "prompt_versions" USING btree ("prompt_id", "id");
ALTER TABLE "prompts"
ADD CONSTRAINT "prompts_current_version_composite_fk"
FOREIGN KEY ("id", "current_version_id")
REFERENCES "prompt_versions" ("prompt_id", "id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;
CREATE INDEX "prompts_author_idx" ON "prompts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "prompts_author_deleted_created_idx" ON "prompts" USING btree ("author_id","deleted_at","created_at");