CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'NUMBER', 'YES_NO', 'EMAIL', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"type" "field_type_enum" NOT NULL,
	"form_Id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_fields_form_Id_index_unique" UNIQUE("form_Id","index")
);
--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "description" varchar(300);--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_Id_forms_id_fk" FOREIGN KEY ("form_Id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" DROP COLUMN "description : 300";