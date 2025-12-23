import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from 'src/entities/reports.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/Guard/auth.guard';

@Module({
  imports: [
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('EXPIRES_IN'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Reports]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AuthGuard], 
  exports: [AuthGuard], 
})
export class ReportsModule {}