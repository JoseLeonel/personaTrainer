import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IAuthRepository } from '../../domain/ports/auth.repository.interface';
import { User, UserRole, UserStatus } from '../../../entities/user.entity';
import { ClientProfile } from '../../../entities/client-profile.entity';
import { InviteCode } from '../../../entities/invite-code.entity';
import { SystemParameter } from '../../../entities/system-parameter.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: Repository<InviteCode>,
    @InjectRepository(SystemParameter)
    private readonly systemParameterRepository: Repository<SystemParameter>,
    private readonly dataSource: DataSource,
  ) {}

  async findTrainers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.TRAINER },
      select: ['id', 'firstName', 'lastName', 'email'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async seedTrainer(): Promise<User> {
    // Check if trainer exists first
    let trainer = await this.userRepository.findOne({ where: { email: 'trainer@eforge.com' } });
    
    if (!trainer) {
      trainer = this.userRepository.create({
        firstName: 'Entrenador',
        lastName: 'Maestro',
        email: 'trainer@eforge.com',
        password: 'admin', // Demo text plain
        role: UserRole.TRAINER,
        status: UserStatus.ACTIVE, // Trainer active by default
      });
      trainer = await this.userRepository.save(trainer);
    } else {
      // Forzar que el password sea admin por si acaso
      trainer.password = 'admin';
      await this.userRepository.save(trainer);
    }

    // Seed System Parameter – ensure 60 minutes expiration
    let param = await this.systemParameterRepository.findOne({ where: { key: 'INVITE_CODE_EXPIRATION_MINS' } });
    if (!param) {
      param = this.systemParameterRepository.create({
        key: 'INVITE_CODE_EXPIRATION_MINS',
        value: '60',
        description: 'Expiration time for invite codes in minutes',
      });
      await this.systemParameterRepository.save(param);
    } else if (param.value !== '60') {
      // Update existing parameter to new default
      param.value = '60';
      await this.systemParameterRepository.save(param);
    }

    return trainer;
  }

  async getSystemParameter(key: string): Promise<string | null> {
    const param = await this.systemParameterRepository.findOne({ where: { key } });
    return param ? param.value : null;
  }

  async createInviteCode(trainerId: number, code: string, expiresAt: Date): Promise<InviteCode> {
    const trainer = await this.userRepository.findOne({ where: { id: trainerId } });
    if (!trainer) throw new InternalServerErrorException('Trainer not found');
    
    // Invalidate previous active codes for this trainer
    await this.inviteCodeRepository.update(
      { trainer: { id: trainerId }, isActive: true },
      { isActive: false }
    );

    const inviteCode = this.inviteCodeRepository.create({
      code,
      expiresAt,
      isActive: true,
      trainer,
    });
    return this.inviteCodeRepository.save(inviteCode);
  }

  async findInviteCode(code: string): Promise<InviteCode | null> {
    return this.inviteCodeRepository.findOne({
      where: { code, isActive: true },
      relations: ['trainer'],
    });
  }

  async getActiveInviteCode(trainerId: number): Promise<InviteCode | null> {
    return this.inviteCodeRepository.findOne({
      where: { trainer: { id: trainerId }, isActive: true },
    });
  }

  async registerClientWithProfile(userData: Partial<User>, profileData: Partial<ClientProfile>, trainerId: number): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Encontrar el trainer
      const trainer = await queryRunner.manager.findOne(User, { where: { id: trainerId } });
      if (!trainer) {
        throw new Error('Entrenador no encontrado');
      }

      // 2. Crear y guardar el ClientProfile
      const profile = queryRunner.manager.create(ClientProfile, profileData);
      const savedProfile = await queryRunner.manager.save(profile);

      // 3. Crear y guardar el User asociándolo al profile y al trainer
      const user = queryRunner.manager.create(User, {
        ...userData,
        profile: savedProfile,
        trainer: trainer,
      });
      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error registrando al cliente: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
