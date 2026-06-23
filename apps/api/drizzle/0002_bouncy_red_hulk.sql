CREATE TABLE "app_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "height" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "weight" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "daily_food_pattern" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "sleep_pattern" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "stress_level" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "smoking_status" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "exercise_pattern" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "prior_illnesses" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "family_medical_history" text;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "notes" text;