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
