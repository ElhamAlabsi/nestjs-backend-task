import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestDto } from 'src/DTOS/Request_dto/create-request.dto';
import { Request } from 'src/entities/request.entity';
import { Repository } from 'typeorm';
import { RequestStatus } from 'src/enums/request-status';
import { UsersService } from 'src/users/users.service';
import { UpdateRequestDto } from 'src/DTOS/Request_dto/update-request.dto';

@Injectable()
export class RequestService {
    constructor(@InjectRepository(Request) private repo: Repository<Request>, private usersService: UsersService) { }
    async createRequest(id: number, dto: CreateRequestDto): Promise<Request> {

        const user = await this.usersService.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const request = this.repo.create({
            requestType: dto.requestType,
            status: RequestStatus.PENDING,
            requestedRole: dto.requestedRole,
            user,
        });

        const newRequest = this.repo.save(request);
        return Promise.resolve(newRequest);
    }


    async getAllRequest() {
        return this.repo.find();
    }

    async getPendingRequests() {
        return await this.repo
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.user', 'user')
            .where('request.status = :status', { status: RequestStatus.PENDING })
            .orderBy('request.createdAt', 'DESC')
            .getMany();
    }

    async UpdateRequest(requestId: string, dto: UpdateRequestDto) {
        const request = await this.repo.findOne({
            where: { id: parseInt(requestId) },
            relations: ['user']
        });

        if (!request)
            throw new NotFoundException('Request not found');

        if (request.status !== RequestStatus.PENDING)
            throw new BadRequestException('Request already handled');

        if (dto.action === 'approve') {
            request.user.role = request.requestedRole;
            request.status = RequestStatus.APPROVED;

        } else {
            request.status = RequestStatus.REJECTED;
        }
        return this.repo.save(request);

    }




}

