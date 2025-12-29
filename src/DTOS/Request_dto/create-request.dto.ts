import { RequestType } from "src/enums/request-type";
import { IsEnum, IsOptional  , IsNotEmpty} from 'class-validator';
import { Role } from 'src/enums/role';

export class CreateRequestDto {
    @IsEnum(RequestType, { message: 'requestType must be a valid RequestType value' })
    requestType: RequestType;

    @IsNotEmpty()
    @IsEnum(Role, { message: 'requestedRole must be a valid role (admin, manager, user, driver, storeowner)' })
    requestedRole: Role;
}