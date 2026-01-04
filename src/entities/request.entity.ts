import { Entity, Column, ManyToMany, CreateDateColumn, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { IsString, IsNumber, IsDate } from "class-validator";
import { RequestType } from "src/enums/request-type";
import { RequestStatus } from "src/enums/request-status";
import { ManyToOne } from "typeorm";
import { Users } from "./users.entity";
import { Reports } from "./reports.entity";
import { Role } from "src/enums/role";

@Entity()
export class Request {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', enum: RequestType })
    requestType: RequestType;

    @Column({ type: 'text', enum: RequestStatus })
    status: RequestStatus;

    @Column({ type: 'text' })
    requestedRole: Role;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Users, (user) => user.requests)
    user: Users;

    @ManyToMany(() => Users, (user) => user.reviewedRequests)
    reviewedBy: Users[];
}
