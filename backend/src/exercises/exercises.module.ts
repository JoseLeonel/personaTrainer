import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './infrastructure/exercises.controller';
import { ExercisesService } from './application/exercises.service';
import { ExerciseRepository } from './infrastructure/adapters/exercise.repository';
import { EXERCISE_REPOSITORY } from './domain/ports/exercise.repository.interface';
import { Exercise } from '../entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExercisesController],
  providers: [
    ExercisesService,
    {
      provide: EXERCISE_REPOSITORY,
      useClass: ExerciseRepository,
    },
  ],
  exports: [ExercisesService],
})
export class ExercisesModule {}
