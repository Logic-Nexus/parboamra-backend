import { Role, User } from "@prisma/client";
import { db } from "../../utils/db.server";

// User Register

type RegisterData = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: Role;
  phone: number;
  password: string;
};

export const registerUser = async (
  data: RegisterData
): Promise<User | null> => {
  // console.log(data);
  const result = await db.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      email: data.email,
      role: data.role,
      phone: Number(data.phone),
      password: data.password,
    },
  });

    // console.log(result);
  return result;
};

// User Login

type LoginData = {
  email: string;
  userName: string;
  password: string;
};

export const loginUser = async (data: any) => {
  const result = await db.user.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          userName: data.userName,
        },
      ],
      password: data.password,
    },
  });
//   console.log(result);
  return result;
};
