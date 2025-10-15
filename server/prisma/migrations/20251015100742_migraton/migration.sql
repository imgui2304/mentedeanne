/*
  Warnings:

  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "status",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "formData" DROP NOT NULL,
ALTER COLUMN "palavrasChave" DROP NOT NULL;
