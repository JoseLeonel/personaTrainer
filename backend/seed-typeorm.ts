import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus, PaymentStatus } from './src/entities/user.entity';
import { ClientProfile } from './src/entities/client-profile.entity';
import { Exercise } from './src/entities/exercise.entity';
import { WeeklyPlan } from './src/entities/weekly-plan.entity';
import { Workout } from './src/entities/workout.entity';
import { WorkoutExercise } from './src/entities/workout-exercise.entity';
import { Set } from './src/entities/set.entity';
import { Measurement } from './src/entities/measurement.entity';
import { DailyLog } from './src/entities/daily-log.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'personatrainer_db',
  entities: [User, ClientProfile, Exercise, WeeklyPlan, Workout, WorkoutExercise, Set, Measurement, DailyLog],
  synchronize: true, // This will create the tables automatically
});

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Base de datos conectada y sincronizada.');

    const userRepository = AppDataSource.getRepository(User);

    const exists = await userRepository.findOneBy({ email: 'enrique@example.com' });
    if (exists) {
      console.log('⚠️ El entrenador Enrique ya existe.');
      return;
    }

    const trainer = userRepository.create({
      firstName: 'Enrique',
      lastName: 'Entrenador',
      email: 'enrique@example.com',
      role: UserRole.TRAINER,
      status: UserStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
    });

    await userRepository.save(trainer);
    console.log('✅ Entrenador dummy Enrique agregado con éxito:', trainer);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

run();
