/*
  Warnings:

  - Changed the type of `palavrasChave` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `referencias` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "palavrasChave",
ADD COLUMN     "palavrasChave" JSONB NOT NULL,
DROP COLUMN "referencias",
ADD COLUMN     "referencias" JSONB NOT NULL;
