import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Users } from 'src/entities/users.entity';
import { Role } from 'src/enums/role';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/utils/password.util';
@Injectable()
export class UsersService {

    constructor(@InjectRepository(Users) private repo: Repository<Users>, private jwtService: JwtService) { }

    CreateUser(email: string, password: string, name: string) {
        const user = this.repo.create({ email, password, name })
        return this.repo.save(user);
    }
    getAll() {
        return this.repo.find();
    }

    getUserById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async updateInfo(id: number, arr: Partial<Users>) {
        const user = await this.repo.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('user not found');
        }
        if (arr.password) {
            arr.password = await hashPassword(arr.password);
        }
        console.log(arr);
        Object.assign(user, arr);
        return this.repo.save(user);
    }

    async removeUser(id: number) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('user not found !')
        }
        return this.repo.delete(user);
    }

    getUserByEmail(email: string) {
        return this.repo.findOneBy({ email })
    }

    getUserByUserId(userId: number) {
        return this.repo.findOneBy({ id: userId });
    }
}
