/*
  Warnings:

  - You are about to drop the column `DocumentDescription` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `DocumentInsight` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `photoDocument` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Document` table. All the data in the column will be lost.
  - Added the required column `capitulos` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formData` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palavrasChave` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referencias` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumo` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumoPages` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "DocumentDescription",
DROP COLUMN "DocumentInsight",
DROP COLUMN "photoDocument",
DROP COLUMN "title",
ADD COLUMN     "capitulos" TEXT NOT NULL,
ADD COLUMN     "formData" JSONB NOT NULL,
ADD COLUMN     "palavrasChave" TEXT NOT NULL,
ADD COLUMN     "referencias" TEXT NOT NULL,
ADD COLUMN     "resumo" TEXT NOT NULL,
ADD COLUMN     "resumoPages" TEXT NOT NULL;
