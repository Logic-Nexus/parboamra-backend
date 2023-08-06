/*
  Warnings:

  - The `status` column on the `AcademicQualification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "AcademicQualification" DROP COLUMN "status",
ADD COLUMN     "status" "Status" DEFAULT 'PENDING';
