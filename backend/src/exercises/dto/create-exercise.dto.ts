export class CreateExerciseDto {
  name: string;
  primaryMuscleGroup: string;
  mainImageUrl: string; // Obligatorio según RN-02
  
  // Opcionales
  secondaryMuscleGroup?: string;
  exerciseType?: string;
  difficultyLevel?: string;
  equipment?: string;
  description?: string;
  executionInstructions?: string;
  commonMistakes?: string;
  
  // Técnica
  sets?: number;
  repetitions?: string;
  cadence?: string;
  rir?: string;
  restSeconds?: number;
  timerEnabled?: boolean;
  
  // Multimedia adicionales
  galleryImages?: string[];
  videoUrl?: string;
  externalVideoUrl?: string;
  thumbnailUrl?: string;
}
