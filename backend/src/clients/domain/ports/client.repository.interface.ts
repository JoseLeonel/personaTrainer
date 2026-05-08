import { User, UserStatus } from '../../../entities/user.entity';

export const I_CLIENT_REPOSITORY = 'IClientRepository';

export interface IClientRepository {
  findAllClients(): Promise<User[]>;
  findTrainerClients(trainerId: number, filters: any): Promise<{ data: User[], total: number }>;
  createClient(clientData: Partial<User>): Promise<User>;
  getClientById(id: number): Promise<User | null>;
  findPendingClients(): Promise<User[]>;
  updateClientStatus(id: number, status: UserStatus): Promise<User>;
  saveProgressPhoto(clientId: number, photoType: string, filePath: string): Promise<any>;
  getProgressPhotos(clientId: number): Promise<any[]>;
}
