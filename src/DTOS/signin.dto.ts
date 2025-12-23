import { IsString, IsEmail } from "class-validator";


export class signinDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

}