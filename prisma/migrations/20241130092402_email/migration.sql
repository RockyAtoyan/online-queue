-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "makeCustomHtml" TEXT,
    "unmakeCustomHtml" TEXT,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_companyId_key" ON "Email"("companyId");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
