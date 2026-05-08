import { Injectable, Inject, BadRequestException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import type { IAuthRepository } from '../domain/ports/auth.repository.interface';
import { I_AUTH_REPOSITORY } from '../domain/ports/auth.repository.interface';
import { UserRole, UserStatus } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(I_AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async getTrainers() {
    return this.authRepository.findTrainers();
  }

  async seedTrainer() {
    return this.authRepository.seedTrainer();
  }

  async generateInviteCode(trainerId: number) {
    // 1. Get duration from SystemParameter
    const durationParam = await this.authRepository.getSystemParameter('INVITE_CODE_EXPIRATION_MINS');
    const minutes = durationParam ? parseInt(durationParam) : 2; // Default 2 minutes if not found

    // 2. Generate 8 digits + 1 letter code
    const digits = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digits
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters.charAt(Math.floor(Math.random() * letters.length));
    const code = `${digits}${letter}`;

    // 3. Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

    // 4. Save and return
    return this.authRepository.createInviteCode(trainerId, code, expiresAt);
  }

  async getActiveInviteCode(trainerId: number) {
    return this.authRepository.getActiveInviteCode(trainerId);
  }

  async registerClient(payload: any) {
    // 1. Validaciones requeridas por reglas de negocio
    if (!payload.firstName || !payload.lastName) {
      throw new BadRequestException('El nombre completo es obligatorio.');
    }
    if (!payload.currentWeight) {
      throw new BadRequestException('El peso actual es obligatorio.');
    }
    if (!payload.height) {
      throw new BadRequestException('La estatura es obligatoria.');
    }
    if (!payload.mainGoal) {
      throw new BadRequestException('El objetivo es obligatorio.');
    }
    if (!payload.inviteCode) {
      throw new BadRequestException('Debe ingresar el código de invitación de su entrenador.');
    }

    // 1.5 Validar el código de invitación
    const inviteCode = await this.authRepository.findInviteCode(payload.inviteCode);
    if (!inviteCode) {
      throw new BadRequestException('Código de invitación inválido o inactivo.');
    }
    if (new Date() > inviteCode.expiresAt) {
      throw new BadRequestException('El código de invitación ha expirado.');
    }
    const trainerId = inviteCode.trainer.id;

    // 2. Extraer datos de User
    const userData = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email, // Deberíamos validar si el email existe, pero lo asume la restricción UNIQUE de la DB por ahora
      password: payload.password, // Temporalmente en texto plano según spec.md MVP
      role: UserRole.CLIENT,
      status: UserStatus.PENDING_APPROVAL, // REQUERIMIENTO CUMPLIDO: Pendiente por defecto
    };

    // 3. Extraer datos del Perfil
    const profileData = {
      // Personales
      dob: payload.dob,
      gender: payload.gender,
      phone: payload.phone,
      identificationNumber: payload.identificationNumber,
      // Físicos
      currentWeight: payload.currentWeight,
      height: payload.height,
      bodyFat: payload.bodyFat,
      waist: payload.waist,
      hips: payload.hips,
      // Objetivos
      mainGoal: payload.mainGoal,
      targetWeight: payload.targetWeight,
      // ... resto de mapeos que vengan en el payload (se asumen directos para el MVP)
    };
    
    // Asignamos el resto de propiedades del payload dinámicamente que pertenezcan a ClientProfile
    const profileKeys = [
      'chest', 'arms', 'legs', 'estimatedTime', 'experienceLevel', 'trainingTime', 
      'previousTrainingType', 'injuries', 'medicalConditions', 'medication', 
      'physicalLimitations', 'trainingDays', 'preferredTime', 'activityLevel', 
      'sleepQuality', 'dietType', 'foodRestrictions', 'caloricGoal', 'preferences'
    ];
    for (const key of profileKeys) {
      if (payload[key] !== undefined) {
        profileData[key] = payload[key];
      }
    }

    // Nota: El cálculo de Edad e IMC no se guarda físicamente aquí, 
    // sino que los getters nativos de la entidad ClientProfile lo calculan "on the fly"
    // en cuanto se instancian los datos.

    return this.authRepository.registerClientWithProfile(userData, profileData, trainerId);
  }

  async login(payload: any) {
    if (!payload.email || !payload.password) {
      throw new BadRequestException('Email y contraseña son obligatorios.');
    }

    const user = await this.authRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user.password !== payload.password) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user.status === UserStatus.PENDING_APPROVAL) {
      throw new ForbiddenException('Tu cuenta aún debe ser aprobada por tu entrenador.');
    }
    
    if (user.status === UserStatus.REJECTED) {
      throw new ForbiddenException('Tu cuenta ha sido rechazada.');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status
    };
  }
}
