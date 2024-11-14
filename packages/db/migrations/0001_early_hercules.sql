ALTER TABLE "session" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "token_expiration" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;