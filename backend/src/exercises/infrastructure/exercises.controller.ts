import { Controller, Get, Post, Body, Put, Param, Patch, Query } from '@nestjs/common';
import { ExercisesService } from '../application/exercises.service';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { UpdateExerciseDto } from '../dto/update-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.createExercise(createExerciseDto);
  }

  @Get()
  findAll(@Query() query: any) {
    // Si queremos incluir inactivos, mandar ?active=null desde frontend
    // Si enviamos ?muscleGroup=Espalda se filtrará por Espalda
    const filters = {
      active: query.active === 'false' ? false : (query.active === 'all' ? null : true),
      primaryMuscleGroup: query.primaryMuscleGroup,
      name: query.name,
      limit: query.limit ? parseInt(query.limit) : undefined,
      offset: query.offset ? parseInt(query.offset) : undefined,
    };
    return this.exercisesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exercisesService.updateExercise(+id, updateExerciseDto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.exercisesService.toggleStatus(+id);
  }
}
