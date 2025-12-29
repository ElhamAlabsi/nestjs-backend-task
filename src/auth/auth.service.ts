import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async signup(email: string, password: string, name: string) {
        
        const user = await this.userService.getUserByEmail(email);
        if (user) {
            throw new BadRequestException('this email already used !');
        }
        const hashPassword = await bcrypt.hash(password,bcrypt.genSaltSync(10));

        const newUser = await this.userService.CreateUser(email, hashPassword, name);

        const payload = { id: newUser.id , role: newUser.role};
        const token = this.jwtService.sign(payload);
        return { user: newUser, token };
    }

    async signIn(email: string, password: string) {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: user.id , role: user.role  };
        const token = this.jwtService.sign(payload);

        return { user, token };
    }
}