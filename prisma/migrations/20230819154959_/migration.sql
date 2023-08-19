/*
  Warnings:

  - You are about to alter the column `otp` on the `RegisterOtp` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `VarChar(6)`.
  - A unique constraint covering the columns `[email]` on the table `RegisterOtp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RegisterOtp" ALTER COLUMN "otp" SET DATA TYPE VARCHAR(6),
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RegisterOtp_email_key" ON "RegisterOtp"("email");
