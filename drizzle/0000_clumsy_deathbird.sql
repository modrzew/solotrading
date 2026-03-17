CREATE TABLE "account" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solotrading_expense" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "solotrading_expense_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(36) NOT NULL,
	"payee_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"amount" text NOT NULL,
	"currency" varchar(3) DEFAULT 'AUD' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "solotrading_payee" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "solotrading_payee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(36) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solotrading_receipt" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "solotrading_receipt_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"expense_id" integer NOT NULL,
	"filename" varchar(255) NOT NULL,
	"stored_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(36) NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "solotrading_user_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "solotrading_user_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" varchar(36) NOT NULL,
	"currency" varchar(3) DEFAULT 'AUD' NOT NULL,
	"financial_year_type" varchar(10) DEFAULT 'jul-jun' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "solotrading_user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solotrading_expense" ADD CONSTRAINT "solotrading_expense_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solotrading_expense" ADD CONSTRAINT "solotrading_expense_payee_id_solotrading_payee_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."solotrading_payee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solotrading_payee" ADD CONSTRAINT "solotrading_payee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solotrading_receipt" ADD CONSTRAINT "solotrading_receipt_expense_id_solotrading_expense_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."solotrading_expense"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solotrading_user_settings" ADD CONSTRAINT "solotrading_user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_date_idx" ON "solotrading_expense" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "user_payee_idx" ON "solotrading_payee" USING btree ("user_id","name");