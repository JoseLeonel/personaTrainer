import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './infrastructure/controllers/clients.controller';
import { ClientsService } from './application/clients.service';
import { ClientsRepository } from './infrastructure/adapters/clients.repository';
import { I_CLIENT_REPOSITORY } from './domain/ports/client.repository.interface';
import { User } from '../entities/user.entity';
import { ProgressPhoto } from '../entities/progress-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProgressPhoto])],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    {
      provide: I_CLIENT_REPOSITORY,
      useClass: ClientsRepository,
    },
  ],
})
export class ClientsModule {}
