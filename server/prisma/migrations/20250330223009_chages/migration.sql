/*
  Warnings:

  - You are about to drop the column `resumo` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `resumoPages` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "resumo",
DROP COLUMN "resumoPages";
