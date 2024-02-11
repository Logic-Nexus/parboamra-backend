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
  const result = await db.user.findUnique({
    where: {
      email: data.email,

      // OR: [
      //   {
      //     email: data.email,
      //   },
      //   {
      //     userName: data.userName,
      //   },
      //   {
      //     phone: Number(data?.phone) || undefined,
      //   },
      // ],
      // password: data.password,
    },
  });
  //   console.log(result);
  return result;
};

// User OTP
export const saveOtp = async (data: any) => {
  const { email, otp, expiresAt, usingFor } = data;
  const timestamp = expiresAt;
  const expireAt = new Date(timestamp);

  const result = await db.registerOtp.upsert({
    where: {
      email: email,
    },
    create: {
      email: email,
      otp: otp,
      expireAt: expireAt,
      usingFor: usingFor,
    },
    update: {
      otp: otp,
      expireAt: expireAt,
      usingFor: usingFor,
    },
  });
  return result;
};

// User OTP Verify
export const verifyOtp = async (data: any) => {
  const { email, usingFor } = data;
  const result = await db.registerOtp.findUnique({
    where: {
      email: email,
      usingFor: usingFor,
    },
  });
  return result;
};

// User Reset Password
export const resetPassword = async (data: any) => {
  const { email, password } = data;
  const result = await db.user.update({
    where: {
      email: email,
    },
    data: {
      password: password,
    },
  });
  return result;
};

//update status of otp
export const updateOtpStatus = async (email: any, status: any) => {
  const result = await db.registerOtp.update({
    where: {
      email: email,
    },
    data: {
      status: status,
    },
  });
  return result;
};

//update user profile email verification status
export const updateEmailVerificationStatus = async (email: any) => {
  const result = await db.user.update({
    where: {
      email: email,
    },
    data: {
      isEmailVerified: true,
    },
  });
  return result;
};

// User OTP List
export const getOtpList = async () => {
  const result = await db.registerOtp.findMany();
  return result;
};

//delete all otp
export const deleteAllOtp = async () => {
  const result = await db.registerOtp.deleteMany();
  return result;
};
