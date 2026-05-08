import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClientRepository } from '../../domain/ports/client.repository.interface';
import { User, UserRole, UserStatus } from '../../../entities/user.entity';
import { ProgressPhoto, PhotoType } from '../../../entities/progress-photo.entity';

@Injectable()
export class ClientsRepository implements IClientRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepository: Repository<User>,
    @InjectRepository(ProgressPhoto)
    private readonly photoRepository: Repository<ProgressPhoto>,
  ) {}

  async findAllClients(): Promise<User[]> {
    return this.typeOrmRepository.find({
      where: { role: UserRole.CLIENT },
      relations: ['profile'],
    });
  }

  async findTrainerClients(trainerId: number, filters: any): Promise<{ data: User[], total: number }> {
    const { search, objective, chargeType, limit = 10, offset = 0 } = filters;
    const query = this.typeOrmRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.trainerId = :trainerId', { trainerId })
      .andWhere('user.role = :role', { role: UserRole.CLIENT })
      .andWhere('user.status != :status', { status: UserStatus.INACTIVE }); // Don't show inactive unless requested

    if (search) {
      query.andWhere('(user.firstName ILIKE :search OR user.lastName ILIKE :search)', { search: `%${search}%` });
    }
    
    if (objective) {
      query.andWhere('profile.mainGoal = :objective', { objective });
    }

    if (chargeType) {
      query.andWhere('profile.chargeType = :chargeType', { chargeType });
    }

    query.skip(offset).take(limit).orderBy('user.firstName', 'ASC');

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async createClient(clientData: Partial<User>): Promise<User> {
    const client = this.typeOrmRepository.create(clientData);
    return this.typeOrmRepository.save(client);
  }

  async getClientById(id: number): Promise<User | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['weeklyPlans', 'measurements', 'profile'],
    });
  }

  async findPendingClients(): Promise<User[]> {
    return this.typeOrmRepository.find({
      where: { role: UserRole.CLIENT, status: UserStatus.PENDING_APPROVAL },
      relations: ['profile'],
    });
  }

  async updateClientStatus(id: number, status: UserStatus): Promise<User> {
    await this.typeOrmRepository.update(id, { status });
    return this.getClientById(id) as Promise<User>;
  }

  async saveProgressPhoto(clientId: number, photoType: string, filePath: string): Promise<ProgressPhoto> {
    const client = await this.typeOrmRepository.findOne({ where: { id: clientId } });
    if (!client) throw new Error('Cliente no encontrado');

    const photo = this.photoRepository.create({
      photoType: photoType as PhotoType,
      filePath,
      client,
    });
    return this.photoRepository.save(photo);
  }

  async getProgressPhotos(clientId: number): Promise<ProgressPhoto[]> {
    return this.photoRepository.find({
      where: { client: { id: clientId } },
      order: { createdAt: 'DESC' },
    });
  }
}
