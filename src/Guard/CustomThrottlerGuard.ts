import { ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Injectable } from "@nestjs/common";
import * as throttler from "@nestjs/throttler";
import { Reflector } from "@nestjs/core";


@Injectable()
export class CustomThrottlerGuard extends throttler.ThrottlerGuard {
    constructor(
        options: throttler.ThrottlerModuleOptions,
        storage: throttler.ThrottlerStorageService,
        reflector: Reflector,
    ) {
        super(options, storage, reflector);
    }

    protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const url = request.url;

        return url.startsWith('/auth');
    }
}
