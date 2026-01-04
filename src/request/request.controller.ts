import { Controller, Post, UseGuards, Get, Patch, Request, ParseIntPipe } from '@nestjs/common';
import { RequestService } from './request.service';
import { AuthGuard } from 'src/Guard/auth.guard';
import { Body, Param } from '@nestjs/common';
import { CreateRequestDto } from 'src/DTOS/Request_dto/create-request.dto';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role';
import { UpdateRequestDto } from 'src/DTOS/Request_dto/update-request.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('request')
export class RequestController {
    constructor(private requestService: RequestService) { }

    @Post('/create/:id')
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    createRequest(@Param('id') id: string, @Body() createRequestDto: CreateRequestDto) {
        return this.requestService.createRequest(parseInt(id), createRequestDto);
    }

    @Get()
    @Roles(Role.Manager, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getAllRequest() {
                return this.requestService.getAllRequest();
    }


    @Get()
    @SkipThrottle()
    @Roles(Role.Manager, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getPendingRequests() {
        return this.requestService.getPendingRequests();
    }


    @Patch('/:id')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @Roles(Role.Manager, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    updateRequest(@Param('id') id: string, @Body() body: UpdateRequestDto) {
        return this.requestService.UpdateRequest(parseInt(id), body);
    }
}
