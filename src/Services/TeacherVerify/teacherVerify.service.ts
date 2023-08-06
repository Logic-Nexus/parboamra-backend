import { convertIsoDate } from "../../Others/DateConvertIso";
import { db } from "../../utils/db.server";

// model AcademicQualification {
//     id                   Int      @id @default(autoincrement())
//     createdAt            DateTime @default(now())
//     updatedAt            DateTime @updatedAt
//     education_background String   @db.VarChar(250)

//     ssc_result       String    @db.VarChar(250)
//     ssc_board        String?   @db.VarChar(250)
//     ssc_passing_year DateTime? @db.Date
//     ssc_institute    String?   @db.VarChar(250)
//     ssc_group        String    @db.VarChar(250)
//     ssc_certificate  String

//     hsc_result       String    @db.VarChar(250)
//     hsc_board        String?   @db.VarChar(250)
//     hsc_passing_year DateTime? @db.Date
//     hsc_institute    String?   @db.VarChar(250)
//     hsc_group        String    @db.VarChar(250)
//     hsc_certificate  String

//     running_degree       String    @db.VarChar(250)
//     running_institute    String    @db.VarChar(250)
//     running_subject      String    @db.VarChar(250)
//     running_passing_year DateTime? @db.Date
//     running_semester     String?   @db.VarChar(250)
//     running_cgpa         String?   @db.VarChar(250)

//     nidORbirth_number String @db.VarChar(250)
//     nidORbirth_image  String

//     completed_degree String?  @db.VarChar(250)
//     status           Boolean? @default(false)
//     user             User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

//     // Foreign keys to link to User and Profile
//     userId Int @unique // Foreign key column (not marked as unique, so it's not required)

//     @@index([userId], name: "user_academic_index")
//   }
//create academicQualification
export const createTeacherAcademicQualification = async (body: any) => {
  //   console.log(body);

  const result = await db.academicQualification.create({
    data: {
      education_background: body.education_background,
      ssc_result: body.ssc_result,
      ssc_board: body.ssc_board,
      ssc_passing_year: convertIsoDate(body.ssc_passing_year),
      ssc_institute: body.ssc_institute,
      ssc_group: body.ssc_group,
      ssc_certificate: body.ssc_certificate,
      hsc_result: body.hsc_result,
      hsc_board: body.hsc_board,
      hsc_passing_year: convertIsoDate(body.hsc_passing_year),
      hsc_institute: body.hsc_institute,
      hsc_group: body.hsc_group,
      hsc_certificate: body.hsc_certificate,
      running_degree: body.running_degree,
      running_institute: body.running_institute,
      running_subject: body.running_subject,
      running_passing_year: convertIsoDate(body.running_passing_year),
      running_semester: body.running_semester,
      running_cgpa: body.running_cgpa,
      nidORbirth_number: body.nidORbirth_number,
      nidORbirth_image: body.nidORbirth_image,
      completed_degree: body.completed_degree,
      status: body.status,
      userId: parseInt(body.userId.toString()),
    },
  });
  console.log(result);
  return result;
};

export const getTeacherAcademicQualificationVerify = async () => {
  const result = await db.academicQualification.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userName: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          phone: true,
        },
      },
    },
  });
  return result;
};

export const getTeacherAcademicQualificationOwnVerifyData = async (
  id: number
) => {
  const result = await db.academicQualification.findUnique({
    where: {
      userId: parseInt(id.toString()),
    },
  });
  return result;
};

export const updateTeacherAcademicQualificationVerify = async (
  userId: number,
  status: any
) => {
  const result = await db.academicQualification.update({
    where: {
      userId: parseInt(userId.toString()),
    },
    data: {
      status: status,
      user: {
        update: {
          isProfileVerified: status,
        },
      },
    },
  });
  return result;
};
