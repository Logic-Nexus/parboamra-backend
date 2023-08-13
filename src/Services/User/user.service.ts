import { User } from "@prisma/client";
import { db } from "../../utils/db.server";
import exclude from "../../Others/DataExcludeFunction/exclude";

// Exclude keys from user

export const getUserList = async () => {
  const result = await db.user.findMany({
    include: {
      profile: true,
      profileImages: true,
      academicQualification: true,
    },
  });

  return result.map((user) => exclude(user, ["password"]));
};

export const getUserById = async (id: number) => {
  // console.log(id);
  const result = await db.user.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
    include: {
      profile: true,
      profileImages: true,
      academicQualification: true,
    },
  });
  // console.log(result);
  return result;
};

//findUser By Email
export const findExistingUser = async (data: any): Promise<User | null> => {
  const result = await db.user.findFirst({
    where: {
      OR: [{ email: data.email }, { userName: data.userName }],
    },
  });
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
    // image: data.image,
  };

  const result = await db.profile.upsert({
    where: {
      userId: parseInt(data.userId.toString()),
    },
    update: {
      ...forUpdateOrCreate,
      //also update user table
      user: {
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    },
    create: {
      userId: parseInt(data.userId.toString()),
      ...(forUpdateOrCreate as any),
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userName: true,
        },
      },
    },
  });

  // console.log(result);
  return result;
};

//update user profile image
export const updateUserProfileImage = async (data: any) => {
  const result = await db.profileImage.upsert({
    where: {
      userId: parseInt(data.userId.toString()),
    },
    update: {
      imageUrl: data.image,
    },
    create: {
      userId: parseInt(data.userId.toString()),
      imageUrl: data.image,
      // profileId: parseInt(data.profileId.toString()),
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

export const deleteAllUsers = async () => {
  const result = await db.user.deleteMany();
  // console.log(result);
  return result;
};
