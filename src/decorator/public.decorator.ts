import { SetMetadata } from "@nestjs/common";

export const publicRoute = () => SetMetadata('isPublic', true);


