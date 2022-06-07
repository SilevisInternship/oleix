import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdvertsModule } from './modules/adverts/adverts.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
const EMAIL_USER = process.env.MAIL_USER;
const EMAIL_PASSWORD = process.env.MAIL_PASS;
const EMAIL_HOST = process.env.MAIL_HOST;
const EMAIL_PORT = process.env.MAIL_PORT;

@Module({
  imports: [
    AdvertsModule,
    UsersModule,
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: EMAIL_HOST,
          port: EMAIL_PORT,
          secure: false,
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
