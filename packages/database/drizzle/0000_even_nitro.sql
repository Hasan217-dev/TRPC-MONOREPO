CREATE TABLE "uers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "uers_email_unique" UNIQUE("email")
);
