import { User } from "../entity/User";
import { sign } from "jsonwebtoken";

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
  return sign({ id: user.id }, process.env.REFRESH_TOKEN_KEY!, {
    expiresIn: "30d"
  });
};
