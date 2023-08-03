import jsonwebtoken from "jsonwebtoken";

//generate token

export const generateToken = async (user: any) => {
  const token = jsonwebtoken.sign(user, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
  //   add token with bearer
  return `Bearer ${token}`;
};

//verify token

export const verifyToken = async (token: string) => {
  const result = jsonwebtoken.verify(
    token,
    process.env.JWT_SECRET_KEY as string
  );
  return result;
};

//verify token middleware

export const verifyTokenMiddleware = async (req: any, res: any, next: any) => {
  const BearerToken = req.headers.authorization;
  const token = BearerToken?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await verifyToken(token);
    req.user = result;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
