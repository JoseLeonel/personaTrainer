import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { EXERCISE_REPOSITORY } from '../domain/ports/exercise.repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: EXERCISE_REPOSITORY,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createExercise', () => {
    it('debe rechazar la creación si el ejercicio ya existe', async () => {
      mockRepo.findByName.mockResolvedValue({ id: 1, name: 'Sentadilla' });

      await expect(
        service.createExercise({
          name: 'Sentadilla',
          primaryMuscleGroup: 'Piernas',
          mainImageUrl: 'http://image.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe rechazar la creación si la cadencia es inválida', async () => {
      mockRepo.findByName.mockResolvedValue(null);

      await expect(
        service.createExercise({
          name: 'Press Banca',
          primaryMuscleGroup: 'Pecho',
          mainImageUrl: 'http://image.com',
          cadence: 'invalida',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe crear exitosamente si la cadencia es válida y el nombre no existe', async () => {
      mockRepo.findByName.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: 1, name: 'Press Banca' });

      const result = await service.createExercise({
        name: 'Press Banca',
        primaryMuscleGroup: 'Pecho',
        mainImageUrl: 'http://image.com',
        cadence: '3-1-1-0',
      });

      expect(result).toBeDefined();
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('toggleStatus', () => {
    it('debe alternar el estado del ejercicio', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, active: true });
      mockRepo.update.mockResolvedValue({ id: 1, active: false });

      await service.toggleStatus(1);

      expect(mockRepo.update).toHaveBeenCalledWith(1, { active: false });
    });
  });
});
