import { IsEmail, IsString, IsNumber } from "class-validator";
import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Users } from "./users.entity";

@Entity()
export class Reports {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    make: string;

    @Column()
    @IsString()
    model: string;

    @Column()
    @IsNumber()
    year: number;

    @Column()
    @IsNumber()
    Longitude: number;

    @Column()
    @IsNumber()
    Latitude: number;

    @Column()
    @IsNumber()
    price: number;

    @ManyToOne(() => Users, (user) => user.reports)
    user: Users;
}