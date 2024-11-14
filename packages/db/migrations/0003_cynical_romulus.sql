ALTER TABLE "user" RENAME COLUMN "token" TO "reset_token";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "token_expiration" TO "reset_token_expires_at";