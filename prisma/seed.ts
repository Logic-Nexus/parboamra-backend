import { Role } from "@prisma/client";
import { db } from "../src/utils/db.server";

// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   phone     Int      @unique
//   firstName  String?
//   lastName  String?
//   userName  String   @unique @db.VarChar(15) // 15 characters
//   password  String   @db.VarChar(20) // 20 characters
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   role      Role     @default(USER)
//   profileId Int?    @unique
//   profile   Profile?
// }

// model Profile {
//   id        Int       @id @default(autoincrement())
//   user      User      @relation(fields: [userId], references: [id])
//   userId    Int       @unique
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
//   bio       String?   @db.VarChar(250) // 250 characters
//   image     String?
//   address   String    @db.VarChar(250) // 250 characters
//   district  String?   @db.VarChar(250) // 250 characters
//   city      String    @db.VarChar(250) // 250 characters
//   country   String?   @db.VarChar(250) // 250 characters
//   zipCode   String?   @db.VarChar(80) // 250 characters
//   gender    String?   @db.VarChar(80) // 250 characters
//   birthDate DateTime? @db.Date

//   @@index([userId, address], name: "user_address") // composite index on userId and address columns with name user_address
// }
function getAuthors() {
  return [
    {
      name: "admin",
      email: "admin@gmail.com",
      phone: 123456789,
      userName: "admin",
      firstName: null,
      lastName: null,
      password: "0011",
      role: "ADMIN",
      profile: null,
      academicQualification: null,
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  ];
}

async function seed() {
  await Promise.all(
    getAuthors().map((author) => {
      return db.user.create({
        data: {
          email: author.email,
          phone: author.phone,
          userName: author.userName,
          firstName: author.firstName,
          lastName: author.lastName,
          password: author.password,
          role: author.role as Role,
          isEmailVerified: author.isEmailVerified,
          isPhoneVerified: author.isPhoneVerified,
          isProfileVerified: "APPROVED",
        },
      });
    })
  );

  console.log("Seeding completed.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
