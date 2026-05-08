import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IClientRepository } from '../domain/ports/client.repository.interface';
import { I_CLIENT_REPOSITORY } from '../domain/ports/client.repository.interface';
import { User, UserRole, UserStatus } from '../../entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(I_CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async findAllClients(): Promise<User[]> {
    return this.clientRepository.findAllClients();
  }

  async getTrainerClients(trainerId: number, filters: any): Promise<{ data: any[], total: number }> {
    const result = await this.clientRepository.findTrainerClients(trainerId, filters);
    
    // Calcular grasa perdida
    const dataWithComputations = result.data.map(user => {
      const userObj = { ...user } as any;
      if (user.profile) {
        if (user.profile.initialBodyFat && user.profile.bodyFat) {
          userObj.lostBodyFat = parseFloat((user.profile.initialBodyFat - user.profile.bodyFat).toFixed(2));
        } else {
          userObj.lostBodyFat = 0;
        }
      }
      return userObj;
    });

    return { data: dataWithComputations, total: result.total };
  }

  async getPendingClients(): Promise<User[]> {
    return this.clientRepository.findPendingClients();
  }

  async approveClient(id: number): Promise<User> {
    const client = await this.clientRepository.getClientById(id);
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    // Cambiar estado a ACTIVE
    return this.clientRepository.updateClientStatus(id, UserStatus.ACTIVE);
  }

  async uploadProgressPhoto(clientId: number, photoType: string, filePath: string) {
    return this.clientRepository.saveProgressPhoto(clientId, photoType, filePath);
  }

  async getProgressPhotos(clientId: number) {
    return this.clientRepository.getProgressPhotos(clientId);
  }

  async getClient(id: number): Promise<User> {
    const client = await this.clientRepository.getClientById(id);
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return client;
  }
}
