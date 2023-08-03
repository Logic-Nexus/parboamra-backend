import { User } from "@prisma/client";
import { db } from "../../utils/db.server";
import exclude from "../../Others/DataExcludeFunction/exclude";

// Exclude keys from user

export const getUserList = async () => {
  const result = await db.user.findMany({
    include: {
      profile: true,
    },
  });
  // console.log(result);
  return result.map((user) => exclude(user, ["password"]));
};

export const getUserById = async (id: number) => {
  const result = await db.user.findUnique({
    where: {
      id: id,
    },
    include: {
      profile: true,
    },
  });
  // console.log(result);
  return exclude(result, ["password"]);
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

export const createUserProfile = async (data: any) => {
  const birthDate = new Date(data.birthDate); // Convert the date string to a Date object
  const isoBirthDate = birthDate.toISOString();

  const result = await db.profile.create({
    data: {
      address: data.address,
      bio: data.bio,
      city: data.city,
      country: data.country,
      district: data.district,
      zipCode: data.zipCode,
      gender: data.gender,
      birthDate: isoBirthDate,
      image: data.image,
      user: {
        connect: {
          id: parseInt(data.userId.toString()),
        },
      },
    },
  });
  // console.log(result);
  return result;
};
