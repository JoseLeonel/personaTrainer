import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './entities/user.entity';
import { ClientProfile } from './entities/client-profile.entity';
import { Exercise } from './entities/exercise.entity';
import { WeeklyPlan } from './entities/weekly-plan.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutExercise } from './entities/workout-exercise.entity';
import { Set } from './entities/set.entity';
import { Measurement } from './entities/measurement.entity';
import { DailyLog } from './entities/daily-log.entity';
import { SystemParameter } from './entities/system-parameter.entity';
import { InviteCode } from './entities/invite-code.entity';
import { ProgressPhoto } from './entities/progress-photo.entity';

// Modules
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { PaymentsModule } from './payments/payments.module';
import { TrainerDashboardModule } from './trainer-dashboard/trainer-dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'personatrainer_db',
      entities: [User, ClientProfile, Exercise, WeeklyPlan, Workout, WorkoutExercise, Set, Measurement, DailyLog, SystemParameter, InviteCode, ProgressPhoto],
      autoLoadEntities: true,
      synchronize: true, // Auto-sync in dev only
    }),
    ClientsModule,
    AuthModule,
    ExercisesModule,
    PaymentsModule,
    TrainerDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
