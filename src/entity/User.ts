import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  privilage: string;
}