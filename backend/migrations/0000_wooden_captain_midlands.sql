CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text,
	"hardcover_id" integer NOT NULL,
	"title" text NOT NULL,
	"page_count" integer NOT NULL,
	"author" text NOT NULL,
	"cover_url" text NOT NULL,
	"progress" integer DEFAULT 0,
	"complete" boolean DEFAULT false,
	"date_started" date,
	"date_finished" date,
	"last_read" date,
	CONSTRAINT "progress_check1" CHECK ("books"."progress" >= 0),
	CONSTRAINT "progress_check2" CHECK ("books"."progress" <= "books"."page_count")
);
--> statement-breakpoint
ALTER TABLE "books" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "list_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"book_id" integer NOT NULL,
	"list_id" integer NOT NULL,
	"position" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "list_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text,
	"name" text NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "lists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" varchar(255),
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "hardcover_id_idx" ON "books" USING btree ("hardcover_id");--> statement-breakpoint
CREATE INDEX "list_items_book_id_idx" ON "list_items" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "list_items_list_id_idx" ON "list_items" USING btree ("list_id");--> statement-breakpoint
CREATE UNIQUE INDEX "One_default_per_user" ON "lists" USING btree ("user_id") WHERE is_default = true;--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE POLICY "books_select" ON "books" AS PERMISSIVE FOR SELECT TO public USING (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "books_insert" ON "books" AS PERMISSIVE FOR INSERT TO public WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "books_update" ON "books" AS PERMISSIVE FOR UPDATE TO public USING (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "books_delete" ON "books" AS PERMISSIVE FOR DELETE TO public USING (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "list_items_select" ON "list_items" AS PERMISSIVE FOR SELECT TO public USING (exists (
            select 1 from lists
            where lists.id = list_id
            and lists.user_id = current_setting('app.current_user_id')::text
        ));--> statement-breakpoint
CREATE POLICY "list_items_insert" ON "list_items" AS PERMISSIVE FOR INSERT TO public WITH CHECK (exists (
            select 1 from lists
            where lists.id = list_id
            and lists.user_id = current_setting('app.current_user_id')::text
        ));--> statement-breakpoint
CREATE POLICY "list_items_update" ON "list_items" AS PERMISSIVE FOR UPDATE TO public USING (exists (
            select 1 from lists
            where lists.id = list_id
            and lists.user_id = current_setting('app.current_user_id')::text
        ));--> statement-breakpoint
CREATE POLICY "list_items_delete" ON "list_items" AS PERMISSIVE FOR DELETE TO public USING (exists (
            select 1 from lists
            where lists.id = list_id
            and lists.user_id = current_setting('app.current_user_id')::text
        ));--> statement-breakpoint
CREATE POLICY "lists_select" ON "lists" AS PERMISSIVE FOR SELECT TO public USING (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "lists_insert" ON "lists" AS PERMISSIVE FOR INSERT TO public WITH CHECK (user_id = current_setting('app.current_user_id')::text);--> statement-breakpoint
CREATE POLICY "lists_update" ON "lists" AS PERMISSIVE FOR UPDATE TO public USING (user_id = current_setting('app.current_user_id')::text AND is_default = false);--> statement-breakpoint
CREATE POLICY "lists_delete" ON "lists" AS PERMISSIVE FOR DELETE TO public USING (user_id = current_setting('app.current_user_id')::text AND is_default = false);