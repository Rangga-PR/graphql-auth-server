import { ServerContext } from "./../context";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Query,
  ObjectType,
  Ctx
} from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  sendNewRefreshToken
} from "../service/UserService";

@InputType()
class RegisterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  gender: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  privilage: string;
}

@ObjectType()
class AccessTokenResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("user", () => RegisterInput) user: RegisterInput) {
    const hashedPassword = hash(user.password, 12);
    user.password = await hashedPassword;
    const registeredUser = await User.create(user).save();
    return registeredUser;
  }

  @Mutation(() => AccessTokenResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: ServerContext
  ): Promise<AccessTokenResponse> {
    const user = await User.findOneOrFail({ where: { email } });

    if (!user) {
      throw new Error("User not Registered");
    }

    const passwordIsMatch = await compare(password, user.password);

    if (!passwordIsMatch) {
      throw new Error("Your Email or Password is incorrect");
    }

    sendNewRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user)
    };
  }

  @Mutation(() => AccessTokenResponse)
  async refresh_access_token(
    @Ctx() { req, res }: ServerContext
  ): Promise<AccessTokenResponse> {
    const token = req.cookies.refreshToken;

    const user = await verifyAccessToken(token);

    if (!user) {
      throw new Error("no user found");
    }

    sendNewRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user)
    };
  }

  @Query(() => [User])
  users() {
    return User.find();
  }
}
