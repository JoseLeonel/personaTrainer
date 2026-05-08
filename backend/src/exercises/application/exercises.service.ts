import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { EXERCISE_REPOSITORY } from '../domain/ports/exercise.repository.interface';
import type { IExerciseRepository } from '../domain/ports/exercise.repository.interface';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';
import { Exercise } from '../../entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: IExerciseRepository,
  ) {}

  async createExercise(createDto: CreateExerciseDto): Promise<Exercise> {
    // RN-14: No duplicar ejercicios activos con mismo nombre
    const existing = await this.exerciseRepository.findByName(createDto.name);
    if (existing) {
      throw new BadRequestException(`El ejercicio '${createDto.name}' ya existe y está activo.`);
    }

    // RN-14 Validaciones (adicionales a las de class-validator)
    this.validateCadence(createDto.cadence);

    return this.exerciseRepository.create(createDto);
  }

  async findAll(filters?: any): Promise<Exercise[]> {
    return this.exerciseRepository.findAll(filters);
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findById(id);
    if (!exercise) {
      throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
    }
    return exercise;
  }

  async updateExercise(id: number, updateDto: UpdateExerciseDto): Promise<Exercise> {
    await this.findOne(id); // Verifica si existe

    if (updateDto.name) {
      const existing = await this.exerciseRepository.findByName(updateDto.name);
      if (existing && existing.id !== id) {
        throw new BadRequestException(`El ejercicio '${updateDto.name}' ya existe y está activo.`);
      }
    }

    if (updateDto.cadence !== undefined) {
      this.validateCadence(updateDto.cadence);
    }

    return this.exerciseRepository.update(id, updateDto);
  }

  async toggleStatus(id: number): Promise<Exercise> {
    const exercise = await this.findOne(id);
    // RN-01: Al inactivar, se respeta la lógica de que no aparece en nuevas rutinas 
    // porque findAll() por defecto filtra active=true.
    return this.exerciseRepository.update(id, { active: !exercise.active });
  }

  private validateCadence(cadence?: string) {
    if (!cadence) return; // Puede ser nulo
    // RN-03 / RN-14: Cadencia en formato Ej: 3-1-1-0
    const regex = /^\d+-\d+-\d+-\d+$/;
    if (!regex.test(cadence)) {
      throw new BadRequestException(`La cadencia debe tener el formato Excéntrica-Pausa-Concéntrica-Pausa (Ej: 3-1-1-0)`);
    }
  }
}
