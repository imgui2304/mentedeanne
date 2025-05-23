/*
  Warnings:

  - The `capitulos` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `palavrasChave` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `referencias` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "capitulos",
ADD COLUMN     "capitulos" JSONB,
DROP COLUMN "palavrasChave",
ADD COLUMN     "palavrasChave" TEXT[],
DROP COLUMN "referencias",
ADD COLUMN     "referencias" TEXT[];
