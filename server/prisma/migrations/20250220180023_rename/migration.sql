/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Book";

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "photoDocument" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "DocumentoDescription" TEXT NOT NULL,
    "DocumentoInsight" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
