import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getSeedAdverts, getSeedUsers } from './utils/seed';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    const areThereUsers = await this.user.count();
    if (!areThereUsers) {
      await this.user.createMany({ data: getSeedUsers() });
    }
    const areThereAdverts = await this.advert.count();
    if (!areThereAdverts) {
      const users = await this.user.findMany();
      await this.advert.createMany({ data: getSeedAdverts(users) });
      this.logger.log('Database is empty, seeding... x----D');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
