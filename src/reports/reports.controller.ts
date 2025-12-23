import { Controller, Post, Get, Put, Body , Delete ,Param } from '@nestjs/common';
import { createReportDto } from 'src/DTOS/create-reports.dto';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guard/auth.guard';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { Users } from 'src/entities/users.entity';
import { RolesGuard } from 'src/Guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role';


@Controller('reports')
export class ReportsController {

    constructor(private reportService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.User)
    createReport(@Body() body: createReportDto, @CurrentUser() user: Users) {
        console.log(user);
        return this.reportService.create(body, user);
    }


    @Get()
    getAllReports() {
        return this.reportService.getAll();
    }

    @Get('/:id')
    getReport(@Param('id') id: string) {
        return this.reportService.getOne(parseInt(id));
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    updateReport(@Param('id') id: string, @Body() body: Partial<createReportDto>, @CurrentUser() user: Users) {
        return this.reportService.update(parseInt(id), body);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteReport(@Param('id') id: string, @CurrentUser() user: Users) {
        return this.reportService.delete(parseInt(id));
    }

}
