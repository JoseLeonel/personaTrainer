import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from './src/entities/user.entity';
import { ClientProfile } from './src/entities/client-profile.entity';
import { ProgressPhoto, PhotoType } from './src/entities/progress-photo.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'personatrainer_db',
  entities: [__dirname + '/src/**/*.entity.ts'],
  synchronize: false,
});

async function run() {
  await AppDataSource.initialize();
  
  // 1. Find the trainer (assuming ID 1 exists, since currentTrainerId defaults to 1)
  const trainer = await AppDataSource.getRepository(User).findOne({ where: { id: 1 } });
  
  // 2. Create Profile
  const profile = new ClientProfile();
  profile.currentWeight = 85.5;
  profile.height = 180;
  profile.mainGoal = 'GAIN_MUSCLE' as any;
  profile.experienceLevel = 'INTERMEDIATE' as any;
  profile.dietType = 'Normal';
  profile.trainingDaysCount = 45;
  profile.initialBodyFat = 20;
  profile.bodyFat = 18;
  profile.servicePrice = 30000;
  profile.chargeType = 'MONTHLY' as any;
  profile.photoUrl = 'https://i.pravatar.cc/150?u=a042581f4e29026704d';

  await AppDataSource.getRepository(ClientProfile).save(profile);

  // 3. Create User
  const user = new User();
  user.email = `cliente-${Date.now()}@example.com`;
  user.password = 'password123';
  user.firstName = 'Carlos';
  user.lastName = 'Mendoza';
  user.role = UserRole.CLIENT;
  user.status = UserStatus.ACTIVE;
  user.trainer = trainer as User;
  user.profile = profile;
  // Setting a past nextPaymentDate so he shows up as Defaulter (pending payment)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2);
  user.nextPaymentDate = pastDate;

  await AppDataSource.getRepository(User).save(user);

  // 4. Create Progress Photos
  const photoRepo = AppDataSource.getRepository(ProgressPhoto);
  
  const initialPhotoUpper = new ProgressPhoto();
  initialPhotoUpper.client = user;
  initialPhotoUpper.photoType = PhotoType.UPPER_BODY;
  initialPhotoUpper.filePath = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Dummy Before
  // Set date artificially in the past
  initialPhotoUpper.createdAt = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000); 

  const initialPhotoLower = new ProgressPhoto();
  initialPhotoLower.client = user;
  initialPhotoLower.photoType = PhotoType.LOWER_BODY;
  initialPhotoLower.filePath = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Dummy Before
  initialPhotoLower.createdAt = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);

  const currentPhotoUpper = new ProgressPhoto();
  currentPhotoUpper.client = user;
  currentPhotoUpper.photoType = PhotoType.UPPER_BODY;
  currentPhotoUpper.filePath = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Dummy After
  
  await photoRepo.save([initialPhotoUpper, initialPhotoLower, currentPhotoUpper]);

  console.log(`Client ${user.firstName} ${user.lastName} created successfully (ID: ${user.id}).`);
  process.exit(0);
}

run().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
