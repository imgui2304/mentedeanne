-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "photoBook" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bookDescription" TEXT NOT NULL,
    "bookInsight" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
