-- DropForeignKey
ALTER TABLE "Widget" DROP CONSTRAINT "Widget_companyId_fkey";

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
