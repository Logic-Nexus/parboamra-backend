-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "userName" VARCHAR(15) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" DEFAULT 'USER',
    "isEmailVerified" BOOLEAN DEFAULT false,
    "isPhoneVerified" BOOLEAN DEFAULT false,
    "isProfileVerified" "Status" DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bio" VARCHAR(250),
    "address" VARCHAR(250) NOT NULL,
    "district" VARCHAR(250),
    "city" VARCHAR(250) NOT NULL,
    "country" VARCHAR(250),
    "zipCode" VARCHAR(80),
    "gender" VARCHAR(80),
    "birthDate" DATE,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileImage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "profileId" INTEGER,

    CONSTRAINT "ProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicQualification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "education_background" VARCHAR(250) NOT NULL,
    "ssc_result" VARCHAR(250) NOT NULL,
    "ssc_board" VARCHAR(250),
    "ssc_passing_year" DATE,
    "ssc_institute" VARCHAR(250),
    "ssc_group" VARCHAR(250) NOT NULL,
    "ssc_certificate" TEXT NOT NULL,
    "hsc_result" VARCHAR(250) NOT NULL,
    "hsc_board" VARCHAR(250),
    "hsc_passing_year" DATE,
    "hsc_institute" VARCHAR(250),
    "hsc_group" VARCHAR(250) NOT NULL,
    "hsc_certificate" TEXT NOT NULL,
    "running_degree" VARCHAR(250) NOT NULL,
    "running_institute" VARCHAR(250) NOT NULL,
    "running_subject" VARCHAR(250) NOT NULL,
    "running_passing_year" DATE,
    "running_semester" VARCHAR(250),
    "running_cgpa" VARCHAR(250),
    "nidORbirth_number" VARCHAR(250) NOT NULL,
    "nidORbirth_image" TEXT NOT NULL,
    "completed_degree" VARCHAR(250),
    "status" "Status" DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AcademicQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterOtp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expireAt" TIMESTAMP(6) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "email" TEXT NOT NULL,
    "usingFor" VARCHAR(250),
    "status" "Status" DEFAULT 'PENDING',

    CONSTRAINT "RegisterOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_phone_userName_key" ON "User"("email", "phone", "userName");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "user_address" ON "Profile"("userId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileImage_userId_key" ON "ProfileImage"("userId");

-- CreateIndex
CREATE INDEX "user_profile_index" ON "ProfileImage"("userId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicQualification_userId_key" ON "AcademicQualification"("userId");

-- CreateIndex
CREATE INDEX "user_academic_index" ON "AcademicQualification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterOtp_email_key" ON "RegisterOtp"("email");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileImage" ADD CONSTRAINT "ProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicQualification" ADD CONSTRAINT "AcademicQualification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
