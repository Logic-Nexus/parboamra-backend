import exclude from "../../Others/DataExcludeFunction/exclude";
import { convertIsoDate } from "../../Others/DateConvertIso";
import { paginationCustomResult } from "../../Others/paginationCustomResult";
import { db } from "../../utils/db.server";

//create academicQualification
export const createTeacherAcademicQualification = async (body: any) => {
  //   console.log(body);
  const updateOrInsert = {
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
  };
  const result = await db.academicQualification.upsert({
    where: {
      userId: parseInt(body.userId.toString()),
    },
    update: {
      ...updateOrInsert,
    },
    create: {
      ...updateOrInsert,
      userId: parseInt(body.userId.toString()),
    },
  });
  // console.log(result);
  return result;
};

export const getTeacherAcademicQualificationVerify = async (
  status: any,
  page: any,
  perPage: any
) => {
  const pageNumbers = page ? parseInt(page.toString()) : 1;
  const resultPerPage = perPage ? parseInt(perPage.toString()) : 10;

  const result = await db.academicQualification.findMany({
    skip: (pageNumbers - 1) * resultPerPage,
    take: resultPerPage,
    where: {
      status: status?.toUpperCase() || "PENDING",
    },
    orderBy: {
      createdAt: "desc",
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
          profileVerifyRejectReason: true,
          phone: true,
        },
      },
    },
  });

  const totalResultCount = await db.academicQualification.count({
    where: {
      status: status?.toUpperCase() || "PENDING",
    },
  });
  const res = paginationCustomResult({
    pageNumbers,
    resultPerPage,
    totalResultCount,
    result,
  });
  return res;
};

export const getTeacherAcademicQualificationOwnVerifyData = async (
  id: number,
  status: any
) => {
  const result = await db.academicQualification.findUnique({
    where: {
      userId: parseInt(id.toString()),
      status: status?.toUpperCase() || "PENDING",
    },
  });
  return result;
};

export const updateTeacherAcademicQualificationVerify = async (
  userId: number,
  status: any,
  rejectReason: any
) => {
  const result = await db.academicQualification.update({
    where: {
      userId: parseInt(userId.toString()),
    },
    data: {
      status: status?.toUpperCase(),
      user: {
        update: {
          isProfileVerified: status?.toUpperCase(),
          profileVerifyRejectReason: rejectReason,
        },
      },
    },
    select: {
      status: true,
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          profileVerifyRejectReason: true,
        },
      },
    },
  });
  return result;
};

export const getAllTeacherList = async (
  page: any,
  perPage: any,
  queryData: {
    email: any;
    phone: any;
    userName: any;
    isProfileVerified: any;
    role: any;
  }
) => {
  const pageNumbers = page ? parseInt(page.toString()) : 1;
  const resultPerPage = perPage ? parseInt(perPage.toString()) : 10;

  const result = await db.user.findMany({
    skip: (pageNumbers - 1) * resultPerPage,
    take: resultPerPage,

    where: {
      email: queryData.email,
      phone: Number(queryData.phone) || undefined,
      userName: queryData.userName,
      isProfileVerified: queryData.isProfileVerified.toUpperCase(),
      role: queryData.role,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
    include: {
      profile: true,
      profileImages: true,
      academicQualification: true,
    },
  });

  // console.log(result);
  const totalResultCount = await db.user.count({
    where: {
      email: queryData.email,
      phone: Number(queryData.phone) || undefined,
      userName: queryData.userName,
      isProfileVerified: queryData.isProfileVerified.toUpperCase(),
      role: queryData.role,
    },
  });

  const res = paginationCustomResult({
    pageNumbers,
    resultPerPage,
    totalResultCount,
    result,
  });
  const val = res.results?.map((user: any) => exclude(user, ["password"]));
  return { ...res, results: val };
};
