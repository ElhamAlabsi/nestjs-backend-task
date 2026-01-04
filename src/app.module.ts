import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Reports } from './entities/reports.entity';
import { CurrentUserMiddleware } from './Middlware/current-user-middileware';
import { JwtModule } from '@nestjs/jwt';
import { METHODS } from 'http';
import { RequestModule } from './request/request.module';
import { Request } from './entities/request.entity';
import { SkipThrottle, Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { throttle } from 'rxjs';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      expandVariables: true,
      ignoreEnvFile: false,
    }),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('EXPIRES_IN'),
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entities: [Users, Reports, Request],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 20
      }
    ]),
    TypeOrmModule.forFeature([Users]),
    UsersModule,
    ReportsModule,
    RequestModule,
  ],
  controllers: [],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],

})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .exclude(
        { path: 'auth/signup', method: RequestMethod.POST },
        { path: 'auth/signin', method: RequestMethod.POST }
      )
      .forRoutes('*');
  }
}



