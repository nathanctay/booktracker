CREATE TABLE "books" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"hardcover_id" integer NOT NULL,
	"title" text NOT NULL,
	"page_count" integer NOT NULL,
	"author" text NOT NULL,
	"cover_url" text NOT NULL,
	"progress" integer,
	"complete" boolean DEFAULT false,
	"date_started" date,
	"date_finished" date,
	"last_read" date,
	CONSTRAINT "progress_check1" CHECK ("books"."progress" >= 0),
	CONSTRAINT "progress_check2" CHECK ("books"."progress" <= "books"."page_count")
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "list_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"bookId" integer,
	"listId" integer,
	"position" integer,
	"addedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_listId_lists_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hardcover_id_idx" ON "books" USING btree ("hardcover_id");--> statement-breakpoint
CREATE INDEX "list_items_book_id_idx" ON "list_items" USING btree ("bookId");--> statement-breakpoint
CREATE INDEX "list_items_list_id_idx" ON "list_items" USING btree ("listId");