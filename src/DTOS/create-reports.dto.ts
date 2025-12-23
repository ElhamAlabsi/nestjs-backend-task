import { IsEmail, IsString, IsNumber , Min , Max , IsLongitude , IsLatitude} from "class-validator";

export class createReportDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(2025)
    year: number;


    @IsLongitude()
    Longitude: number;

    @IsLatitude()
    Latitude: number;


    @IsNumber()
    price: number;

}


