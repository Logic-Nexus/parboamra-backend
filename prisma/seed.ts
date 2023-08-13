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
      name: "Emon",
      email: "emon@gmail.com",
      phone: 123456789,
      userName: "Emon",
      firstName: "Md",
      lastName: "Doee",
      password: "12346",
      role: "ADMIN",

      profile: {
        bio: "I am a software engineer",
        // image: "https://i.pravatar.cc/300",
        address: "123 Main St",
        district: "District 1",
        city: "Ho Chi Minh",
        country: "Vietnam",
        zipCode: "700000",
        gender: "Male",
        birthDate: new Date("1990-01-01"),
      },
      academicQualification: {
        userId: 1,
      },
    },
  ];
}
// id                   Int      @id @default(autoincrement())
//   createdAt            DateTime @default(now())
//   updatedAt            DateTime @updatedAt
//   education_background String   @db.VarChar(250)

//   ssc_result       String    @db.VarChar(250)
//   ssc_board        String?   @db.VarChar(250)
//   ssc_passing_year DateTime? @db.Date
//   ssc_institute    String?   @db.VarChar(250)
//   ssc_group        String    @db.VarChar(250)
//   ssc_certificate  String

//   hsc_result       String    @db.VarChar(250)
//   hsc_board        String?   @db.VarChar(250)
//   hsc_passing_year DateTime? @db.Date
//   hsc_institute    String?   @db.VarChar(250)
//   hsc_group        String    @db.VarChar(250)
//   hsc_certificate  String

//   running_degree       String    @db.VarChar(250)
//   running_institute    String    @db.VarChar(250)
//   running_subject      String    @db.VarChar(250)
//   running_passing_year DateTime? @db.Date
//   running_semester     String?   @db.VarChar(250)
//   running_cgpa         String?   @db.VarChar(250)

//   nidORbirth_number String @db.VarChar(250)
//   nidORbirth_image  String

//   completed_degree String? @db.VarChar(250)

//   user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

//   // Foreign keys to link to User and Profile
//   userId Int @unique // Foreign ke

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
          profile: {
            create: {
              bio: author.profile.bio,
              address: author.profile.address,
              district: author.profile.district,
              city: author.profile.city,
              country: author.profile.country,
              zipCode: author.profile.zipCode,
              gender: author.profile.gender,
              birthDate: author.profile.birthDate,
            },
          },
          academicQualification: {
            create: {
              education_background: "BSc in CSE",
              ssc_result: "5.00",
              ssc_board: "Dhaka",
              ssc_passing_year: new Date("2015-01-01"),
              ssc_institute: "Dhaka College",
              ssc_group: "Science",
              ssc_certificate: "ssc_certificate",
              hsc_result: "5.00",
              hsc_board: "Dhaka",
              hsc_passing_year: new Date("2017-01-01"),
              hsc_institute: "Dhaka College",
              hsc_group: "Science",
              hsc_certificate: "hsc_certificate",
              running_degree: "BSc in CSE",
              running_institute: "Dhaka College",
              running_subject: "CSE",
              running_passing_year: new Date("2021-01-01"),
              running_semester: "8th",
              running_cgpa: "3.50",
              nidORbirth_number: "123456789",
              nidORbirth_image: "nidORbirth_image",
              completed_degree: "BSc in CSE",
              status: "PENDING",
            },
          },
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
