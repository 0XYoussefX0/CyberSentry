ALTER TABLE "user" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "token_expiration" timestamp with time zone;