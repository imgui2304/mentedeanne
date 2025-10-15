-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "resumo" TEXT,
    "palavrasChave" JSONB NOT NULL,
    "referencias" JSONB,
    "capitulos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
