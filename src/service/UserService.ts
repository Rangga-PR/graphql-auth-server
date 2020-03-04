import { Response } from "express";
import { User } from "../entity/User";
import { sign, verify } from "jsonwebtoken";

export const createAccessToken = (user: User): string => {
  return sign(
    {
      id: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      gender: user.gender,
      privilage: user.privilage
    },
    process.env.ACCESS_TOKEN_KEY!,
    { expiresIn: "24h" }
  );
};

export const createRefreshToken = (user: User): string => {
  return sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_KEY!,
    {
      expiresIn: "30d"
    }
  );
};

export const verifyAccessToken = (token: string): Promise<User> => {
  if (!token) {
    throw new Error("no refresh token");
  }

  const validToken: any = verify(token, process.env.REFRESH_TOKEN_KEY!);

  if (!validToken) {
    throw new Error("invalid access token");
  }

  return User.findOneOrFail({ email: validToken.email });
};

export const sendNewRefreshToken = (res: Response, token: string) => {
  res.cookie("refreshToken", token, { httpOnly: true });
};
