import { User } from "@prisma/client";
import { db } from "../../utils/db.server";

export const getUserList = async () => {
  const result = await db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });
  // console.log(result);
  return result;
};

export const getUserById = async (id: number) => {
  const result = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          bio: true,
          image: true,
          address: true,
        },
      },
    },
  });
  // console.log(result);
  return result;
};

//get user profile

export const getUserProfile = async () => {
  const result = await db.profile.findMany({
    include: {
      user: true,
    },
  });
  return result;
};

//findUser By Email

export const findExistingUser = async (data: any): Promise<User | null> => {
  // console.log(data);
  const result = await db.user.findUnique({
    where: {
      user_email_phone_username: {
        userName: data.userName,
        phone: parseInt(data.phone.toString()),
        email: data.email,
      },
    },
  });
  // console.log(result);
  return result;
};

//create user profile
// userId    Int       @unique
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
//   bio       String?   @db.VarChar(250)
//   image     String?
//   address   String    @db.VarChar(250)
//   district  String?   @db.VarChar(250)
//   city      String    @db.VarChar(250)
//   country   String?   @db.VarChar(250)
//   zipCode   String?   @db.VarChar(80)
//   gender    String?   @db.VarChar(80)
//   birthDate DateTime? @db.Date
//   user      User      @relation(fields: [userId], references: [id])

export const createUserProfile = async (data: any) => {
  const result = await db.profile.create({
    data: {
      address: data.address,
      bio: data.bio,
      city: data.city,
      country: data.country,
      district: data.district,
      zipCode: data.zipCode,
      gender: data.gender,
      birthDate: data.birthDate,
      image: data.image,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
  // console.log(result);
  return result;
};
