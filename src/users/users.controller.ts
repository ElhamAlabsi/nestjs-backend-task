import { Body, Controller, Get, Post, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { serialize } from 'src/intercepters/serialize.interceptor';
import { signinDto } from 'src/DTOS/signin.dto';
import { CreateUserDto } from 'src/DTOS/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/Guard/auth.guard';
import { publicRoute } from 'src/decorator/public.decorator';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role  } from 'src/enums/role';


@Controller('auth')
export class UsersController {

    constructor(private service: UsersService, private authservice: AuthService) { }


    @publicRoute()
    @Post('/signup')
    signup(@Body() body: CreateUserDto) {
        return this.authservice.signup(body.email, body.password, body.name);
    }

    @Post('/signin')
    signin(@Body() body: signinDto) {
        return this.authservice.signIn(body.email, body.password);
    }

    @Get('/:id')
    getUser(@Param('id') id: string) {
        return this.service.getUserById(parseInt(id));
    }


    @Get()
    getAllUsers() {
        return this.service.getAll();
    }

    @Get()
    getUserByEmail(@Query('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required');
        }
        return this.service.getUserByEmail(email);
    }


    @Patch('/:id')
    async updateUserInfo(@Param('id') id: string, @Body() body: CreateUserDto) {
        return this.service.updateInfo(parseInt(id), body)
    }

    @Delete('/:id')
    @serialize(signinDto)
    async removeUser(@Param('id') id: string) {
        return this.service.removeUser(parseInt(id));
    }
}