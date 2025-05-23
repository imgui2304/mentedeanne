-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "resumo" TEXT,
ALTER COLUMN "referencias" DROP NOT NULL;
