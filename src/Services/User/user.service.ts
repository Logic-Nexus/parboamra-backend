import { db } from "../../utils/db.server";

export const getUserList = async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};
