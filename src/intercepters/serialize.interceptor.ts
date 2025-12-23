import { Injectable, UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToClass } from "class-transformer";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { Any } from "typeorm";


interface CalssContructor {
    new(...arg: any[]): {}
}

export function serialize(dto: CalssContructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                console.log('interceptor is working !')
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                })

            }));

    }

}