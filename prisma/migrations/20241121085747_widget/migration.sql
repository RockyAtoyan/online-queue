-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Widget_companyId_key" ON "Widget"("companyId");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
