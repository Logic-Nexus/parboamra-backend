/*
  Warnings:

  - You are about to drop the column `profileImageId` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_profileImageId_fkey";

-- DropIndex
DROP INDEX "Profile_profileImageId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "profileImageId";
