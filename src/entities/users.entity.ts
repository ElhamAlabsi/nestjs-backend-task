import { IsEmail, IsString } from "class-validator";
import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn , OneToMany} from "typeorm";
import { Exclude } from "class-transformer";
import { Role } from "src/enums/role";
import { Reports } from "./reports.entity";


@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    name: string;

    @Column()
    @Exclude()
    @IsString()
    password: string;

    @IsString()
    @Column({default :Role.User})
    role: Role

    @OneToMany(() => Reports, (report) => report.user)
    reports: Reports[];

}