import { User } from '../../../entities/user.entity';
import { ClientProfile } from '../../../entities/client-profile.entity';
import { InviteCode } from '../../../entities/invite-code.entity';

export const I_AUTH_REPOSITORY = 'IAuthRepository';

export interface IAuthRepository {
  findTrainers(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  seedTrainer(): Promise<User>;
  registerClientWithProfile(userData: Partial<User>, profileData: Partial<ClientProfile>, trainerId: number): Promise<User>;
  getSystemParameter(key: string): Promise<string | null>;
  createInviteCode(trainerId: number, code: string, expiresAt: Date): Promise<InviteCode>;
  findInviteCode(code: string): Promise<InviteCode | null>;
  getActiveInviteCode(trainerId: number): Promise<InviteCode | null>;
}
