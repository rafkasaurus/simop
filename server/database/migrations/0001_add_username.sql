-- Add username field to users table
ALTER TABLE "user" ADD COLUMN "username" text NOT NULL DEFAULT '';
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE ("username");
