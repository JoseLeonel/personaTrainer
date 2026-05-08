import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { I_AUTH_REPOSITORY } from '../domain/ports/auth.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { UserRole, UserStatus } from '../../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  
  const mockAuthRepository = {
    registerClientWithProfile: jest.fn(),
    findByEmail: jest.fn(),
    findInviteCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: I_AUTH_REPOSITORY,
          useValue: mockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerClient', () => {
    it('should successfully register a client with all valid data', async () => {
      const validPayload = {
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
        password: 'password123',
        inviteCode: '12345678A',
        dob: '1990-01-01',
        gender: 'MALE',
        currentWeight: 75.5,
        height: 175,
        mainGoal: 'LOSE_FAT',
      };

      const expectedUser = {
        id: 10,
        ...validPayload,
        role: UserRole.CLIENT,
        status: UserStatus.PENDING_APPROVAL,
      };

      const mockDate = new Date();
      mockDate.setMinutes(mockDate.getMinutes() + 10);
      mockAuthRepository.findInviteCode.mockResolvedValue({
        code: '12345678A',
        expiresAt: mockDate,
        trainer: { id: 1 }
      });

      mockAuthRepository.registerClientWithProfile.mockResolvedValue(expectedUser);

      const result = await service.registerClient(validPayload);

      expect(mockAuthRepository.registerClientWithProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Juan',
          lastName: 'Perez',
          email: 'juan@example.com',
          password: 'password123',
          role: UserRole.CLIENT,
          status: UserStatus.PENDING_APPROVAL,
        }),
        expect.objectContaining({
          dob: '1990-01-01',
          gender: 'MALE',
          currentWeight: 75.5,
          height: 175,
          mainGoal: 'LOSE_FAT',
        }),
        1 // trainerId extraído del invite code
      );
      
      expect(result).toEqual(expectedUser);
    });

    it('should throw BadRequestException if firstName is missing', async () => {
      const payload = {
        lastName: 'Perez',
        currentWeight: 75,
        height: 175,
        mainGoal: 'LOSE_FAT',
        trainerId: 1,
      };
      
      await expect(service.registerClient(payload)).rejects.toThrow(BadRequestException);
      await expect(service.registerClient(payload)).rejects.toThrow('El nombre completo es obligatorio.');
    });

    it('should throw BadRequestException if currentWeight is missing', async () => {
      const payload = {
        firstName: 'Juan',
        lastName: 'Perez',
        height: 175,
        mainGoal: 'LOSE_FAT',
        trainerId: 1,
      };
      
      await expect(service.registerClient(payload)).rejects.toThrow(BadRequestException);
      await expect(service.registerClient(payload)).rejects.toThrow('El peso actual es obligatorio.');
    });

    it('should throw BadRequestException if inviteCode is missing', async () => {
      const payload = {
        firstName: 'Juan',
        lastName: 'Perez',
        currentWeight: 75,
        height: 175,
        mainGoal: 'LOSE_FAT',
      };
      
      await expect(service.registerClient(payload)).rejects.toThrow(BadRequestException);
      await expect(service.registerClient(payload)).rejects.toThrow('Debe ingresar el código de invitación de su entrenador.');
    });
  });

  describe('login', () => {
    it('should return user info on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'trainer@eforge.com',
        password: 'admin',
        firstName: 'Entrenador',
        lastName: 'Maestro',
        role: UserRole.TRAINER,
        status: UserStatus.ACTIVE,
      };

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'trainer@eforge.com', password: 'admin' });

      expect(result).toEqual({
        id: 1,
        email: 'trainer@eforge.com',
        firstName: 'Entrenador',
        lastName: 'Maestro',
        role: UserRole.TRAINER,
        status: UserStatus.ACTIVE,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login({ email: 'fake@example.com', password: '123' })).rejects.toThrow('Credenciales inválidas.');
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = {
        id: 1,
        email: 'trainer@eforge.com',
        password: 'admin',
        role: UserRole.TRAINER,
        status: UserStatus.ACTIVE,
      };

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.login({ email: 'trainer@eforge.com', password: 'wrongpassword' })).rejects.toThrow('Credenciales inválidas.');
    });

    it('should throw ForbiddenException if user is PENDING_APPROVAL', async () => {
      const mockUser = {
        id: 2,
        email: 'client@example.com',
        password: '123',
        role: UserRole.CLIENT,
        status: UserStatus.PENDING_APPROVAL,
      };

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.login({ email: 'client@example.com', password: '123' })).rejects.toThrow('Tu cuenta aún debe ser aprobada por tu entrenador.');
    });
  });
});
