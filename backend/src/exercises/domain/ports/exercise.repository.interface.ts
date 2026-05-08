export const EXERCISE_REPOSITORY = 'EXERCISE_REPOSITORY';

import { Exercise } from '../../../entities/exercise.entity';

export interface IExerciseRepository {
  create(exercise: Partial<Exercise>): Promise<Exercise>;
  findAll(filters?: any): Promise<Exercise[]>;
  findById(id: number): Promise<Exercise | null>;
  update(id: number, data: Partial<Exercise>): Promise<Exercise>;
  findByName(name: string): Promise<Exercise | null>;
}
