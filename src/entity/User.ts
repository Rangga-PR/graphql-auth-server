import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

export type privilages = "admin" | "member";
export type genders = "male" | "female" | "secret";
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ nullable: true })
  lastName: string;

  // @Field()
  // @Column({ unique: true })
  // username: string;

  @Field()
  @Column({
    type: "enum",
    enum: ["male", "female", "secret"],
    default: "secret"
  })
  gender: genders;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ type: "enum", enum: ["admin", "member"], default: "member" })
  privilage: privilages;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
