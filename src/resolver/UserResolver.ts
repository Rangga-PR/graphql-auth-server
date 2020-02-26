import { Resolver, Mutation, InputType, Field, Arg, Query } from "type-graphql";
import { User } from "../entity/User";
import { hash } from "bcryptjs";

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

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("user", () => RegisterInput) user: RegisterInput) {
    const hashedPassword = hash(user.password, 12);
    user.password = await hashedPassword;
    const registeredUser = await User.create(user).save();
    return registeredUser;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }
}
