import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ChatGateway } from './gateways/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"Mon App" <mariemwadhen123@gmail.com>',
      },
    }),

    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:async(configService:ConfigService)=>({
        uri:configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    ProjectModule,
    ChatModule
  ],


})
export class AppModule {}
