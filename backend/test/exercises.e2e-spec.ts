import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ExercisesController (e2e)', () => {
  let app: INestApplication;
  let createdExerciseId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/exercises (POST) - Insert', async () => {
    const newExercise = {
      name: 'Test E2E Ejercicio',
      primaryMuscleGroup: 'Pecho',
      mainImageUrl: 'http://test.com/image.jpg',
      sets: 4,
      repetitions: '8-10',
      cadence: '3-1-1-0',
      restSeconds: 120,
    };

    const response = await request(app.getHttpServer())
      .post('/exercises')
      .send(newExercise)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual(newExercise.name);
    
    // Save id for next tests
    createdExerciseId = response.body.id;
  });

  it('/exercises (POST) - Prevent Duplicate Insert', async () => {
    const duplicateExercise = {
      name: 'Test E2E Ejercicio',
      primaryMuscleGroup: 'Espalda',
      mainImageUrl: 'http://test.com/image2.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/exercises')
      .send(duplicateExercise)
      .expect(400);

    expect(response.body.message).toContain('ya existe y está activo');
  });

  it('/exercises/:id (PUT) - Modify', async () => {
    const modifyExercise = {
      name: 'Test E2E Ejercicio Modificado',
      primaryMuscleGroup: 'Hombros',
      sets: 5,
      repetitions: '10-15',
    };

    const response = await request(app.getHttpServer())
      .put(`/exercises/${createdExerciseId}`)
      .send(modifyExercise)
      .expect(200);

    expect(response.body.name).toEqual(modifyExercise.name);
    expect(response.body.primaryMuscleGroup).toEqual(modifyExercise.primaryMuscleGroup);
    expect(response.body.sets).toEqual(modifyExercise.sets);
  });

  it('/exercises/:id (GET) - Verify Modify', async () => {
    const response = await request(app.getHttpServer())
      .get(`/exercises/${createdExerciseId}`)
      .expect(200);

    expect(response.body.name).toEqual('Test E2E Ejercicio Modificado');
    expect(response.body.active).toBe(true);
  });

  it('/exercises/:id/status (PATCH) - Eliminar (Logical Delete)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/exercises/${createdExerciseId}/status`)
      .expect(200);

    // It should toggle to false
    expect(response.body.active).toBe(false);
  });

  it('/exercises (GET) - Verify List does not include inactive by default', async () => {
    const response = await request(app.getHttpServer())
      .get('/exercises')
      .expect(200);

    // Filter active items and make sure the inactive one is not there
    const found = response.body.find((ex: any) => ex.id === createdExerciseId);
    expect(found).toBeUndefined();
  });
});
