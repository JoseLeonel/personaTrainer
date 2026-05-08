import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../../../entities/exercise.entity';
import { IExerciseRepository } from '../../domain/ports/exercise.repository.interface';

@Injectable()
export class ExerciseRepository implements IExerciseRepository {
  constructor(
    @InjectRepository(Exercise)
    private readonly repository: Repository<Exercise>,
  ) {}

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const newExercise = this.repository.create(exercise);
    return this.repository.save(newExercise);
  }

  async findAll(filters?: any): Promise<Exercise[]> {
    const query = this.repository.createQueryBuilder('exercise');
    
    // Default to active exercises if not specified
    if (!filters || filters.active === undefined) {
      query.andWhere('exercise.active = :active', { active: true });
    } else if (filters.active !== null) {
      query.andWhere('exercise.active = :active', { active: filters.active });
    }

    if (filters?.primaryMuscleGroup) {
      query.andWhere('exercise.primaryMuscleGroup = :muscle', { muscle: filters.primaryMuscleGroup });
    }
    
    if (filters?.name) {
      query.andWhere('exercise.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters?.limit) {
      query.take(filters.limit);
    }

    if (filters?.offset) {
      query.skip(filters.offset);
    }
    
    query.orderBy('exercise.name', 'ASC');
    return query.getMany();
  }

  async findById(id: number): Promise<Exercise | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Exercise | null> {
    return this.repository.findOne({ where: { name, active: true } });
  }

  async update(id: number, data: Partial<Exercise>): Promise<Exercise> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } }) as Promise<Exercise>;
  }
}
