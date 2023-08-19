/*
  Warnings:

  - Added the required column `expireAt` to the `RegisterOtp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterOtp" ADD COLUMN     "expireAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "usingFor" VARCHAR(250);
