CREATE TYPE "public"."request_status" AS ENUM('open', 'accepted', 'closed');--> statement-breakpoint
CREATE TABLE "prompt_request_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"responder_id" uuid NOT NULL,
	"prompt_id" uuid NOT NULL,
	"prompt_version_id" uuid NOT NULL,
	"note" text,
	"is_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "prompt_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text NOT NULL,
	"context" text,
	"category_id" uuid,
	"status" "request_status" DEFAULT 'open' NOT NULL,
	"accepted_response_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "prompt_requests_accepted_response_check" CHECK (("prompt_requests"."status" = 'accepted') = ("prompt_requests"."accepted_response_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "request_tags" (
	"request_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "request_tags_request_id_tag_id_pk" PRIMARY KEY("request_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "prompt_request_responses" ADD CONSTRAINT "prompt_request_responses_request_id_prompt_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."prompt_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_request_responses" ADD CONSTRAINT "prompt_request_responses_responder_id_users_id_fk" FOREIGN KEY ("responder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_request_responses" ADD CONSTRAINT "prompt_request_responses_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_requests" ADD CONSTRAINT "prompt_requests_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompt_requests" ADD CONSTRAINT "prompt_requests_category_id_prompt_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."prompt_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_tags" ADD CONSTRAINT "request_tags_request_id_prompt_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."prompt_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_tags" ADD CONSTRAINT "request_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_request_responses_request_id_id_idx" ON "prompt_request_responses" USING btree ("request_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_request_responses_active_responder_idx" ON "prompt_request_responses" USING btree ("request_id","responder_id") WHERE "prompt_request_responses"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "prompt_request_responses_one_accepted_idx" ON "prompt_request_responses" USING btree ("request_id") WHERE "prompt_request_responses"."is_accepted" = true AND "prompt_request_responses"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "prompt_request_responses_request_created_idx" ON "prompt_request_responses" USING btree ("request_id","created_at");--> statement-breakpoint
CREATE INDEX "prompt_requests_category_idx" ON "prompt_requests" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "prompt_requests_active_status_created_idx" ON "prompt_requests" USING btree ("status","created_at") WHERE "prompt_requests"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "prompt_requests_active_requester_created_idx" ON "prompt_requests" USING btree ("requester_id","created_at") WHERE "prompt_requests"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "request_tags_tag_idx" ON "request_tags" USING btree ("tag_id");

--> statement-breakpoint
ALTER TABLE "prompt_request_responses"
ADD CONSTRAINT "prompt_request_responses_prompt_version_fk"
FOREIGN KEY ("prompt_id", "prompt_version_id")
REFERENCES "public"."prompt_versions" ("prompt_id", "id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "prompt_requests"
ADD CONSTRAINT "prompt_requests_accepted_response_fk"
FOREIGN KEY ("id", "accepted_response_id")
REFERENCES "public"."prompt_request_responses" ("request_id", "id")
ON DELETE NO ACTION
ON UPDATE NO ACTION;