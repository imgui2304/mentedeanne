/*
  Warnings:

  - You are about to drop the column `DocumentoDescription` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `DocumentoInsight` on the `Document` table. All the data in the column will be lost.
  - Added the required column `DocumentDescription` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DocumentInsight` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "DocumentoDescription",
DROP COLUMN "DocumentoInsight",
ADD COLUMN     "DocumentDescription" TEXT NOT NULL,
ADD COLUMN     "DocumentInsight" TEXT NOT NULL;
