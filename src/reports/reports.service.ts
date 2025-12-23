import { ConsoleLogger, Injectable ,NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from 'src/entities/reports.entity';
import { createReportDto } from 'src/DTOS/create-reports.dto';
import { Users } from 'src/entities/users.entity';
import { Console } from 'console';



@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Reports) private repo: Repository<Reports>) { }

    async create(reportDto: createReportDto, user: Users) {
        const report = await this.repo.create(reportDto);
        report.user = user
        return this.repo.save(report);
    }

    async getAll() {
        return this.repo.find({ relations: ['user'] });
    }

    async getOne(id: number) {
        const report = await this.repo.findOne({
            where: { id },
            relations: ['user']
        });
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        return report;
    }

    async update(id: number, updateDto: Partial<createReportDto>) {
        const report = await this.repo.findOne({ where: { id } });
        if (!report) {
            throw new NotFoundException('Report not found');
        }

        Object.assign(report, updateDto);
        return this.repo.save(report);
    }

    async delete(id: number) {
        const report = await this.repo.findOne({ where: { id } });
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        return this.repo.remove(report);
    }
}
