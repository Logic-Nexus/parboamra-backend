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

export const createUserProfile = async (data: any) => {
  const birthDate = new Date(data.birthDate); // Convert the date string to a Date object
  const isoBirthDate = birthDate.toISOString();

  const forUpdateOrCreate = {
    address: data.address,
    bio: data.bio,
    city: data.city,
    country: data.country,
    district: data.district,
    zipCode: data.zipCode,
    gender: data.gender,
    birthDate: isoBirthDate,
    image: data.image,
  };

  const result = await db.profile.upsert({
    where: {
      userId: parseInt(data.userId.toString()),
    },
    update: {
      ...forUpdateOrCreate,
    },
    create: {
      ...forUpdateOrCreate,
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

//delete user

export const deleteUser = async (id: number) => {
  const result = await db.user.delete({
    where: {
      id: id,
    },
  });
  // console.log(result);
  return result;
};
