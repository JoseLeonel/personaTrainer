const http = require('http');

const exercises = [
  // PECHO
  {
    name: 'Press de Banca Plano (Barra)',
    primaryMuscleGroup: 'Pecho',
    secondaryMuscleGroup: 'Tríceps, Hombros',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Intermedio',
    equipment: 'Barra, Banco Plano',
    description: 'Ejercicio compuesto fundamental para el desarrollo del pectoral.',
    executionInstructions: '1. Acuéstate en el banco. 2. Agarra la barra un poco más ancho que los hombros. 3. Baja la barra hasta el pecho. 4. Empuja hacia arriba.',
    commonMistakes: 'Rebotar la barra en el pecho, levantar la cadera del banco.',
    sets: 4,
    repetitions: '8-12',
    cadence: '3-1-1-0',
    rir: '2',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Flexiones de Pecho (Push-ups)',
    primaryMuscleGroup: 'Pecho',
    secondaryMuscleGroup: 'Tríceps, Core',
    exerciseType: 'Funcional',
    difficultyLevel: 'Principiante',
    equipment: 'Peso Corporal',
    description: 'Ejercicio funcional clásico para fuerza del tren superior.',
    executionInstructions: '1. Posición de plancha alta. 2. Baja flexionando los codos. 3. Empuja el suelo para subir.',
    commonMistakes: 'Dejar caer la cadera, abrir los codos en forma de T.',
    sets: 3,
    repetitions: 'Al fallo',
    cadence: '2-0-1-0',
    rir: '1',
    restSeconds: 60,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800', // reused image for context
    active: true
  },

  // ESPALDA
  {
    name: 'Dominadas (Pull-ups)',
    primaryMuscleGroup: 'Espalda',
    secondaryMuscleGroup: 'Bíceps, Antebrazos',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Avanzado',
    equipment: 'Barra de dominadas',
    description: 'Ejercicio de tracción con peso corporal para desarrollar la amplitud de la espalda.',
    executionInstructions: '1. Cuelga de la barra con agarre prono. 2. Saca pecho y tracciona hasta que la barbilla pase la barra. 3. Desciende controladamente.',
    commonMistakes: 'Usar impulso (kipping) excesivo, no realizar el rango de movimiento completo.',
    sets: 3,
    repetitions: 'Al fallo (RIR 1)',
    cadence: '2-0-1-1',
    rir: '1',
    restSeconds: 120,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Jalón al Pecho en Polea',
    primaryMuscleGroup: 'Espalda',
    secondaryMuscleGroup: 'Bíceps',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Principiante',
    equipment: 'Máquina de Poleas',
    description: 'Excelente alternativa a las dominadas para desarrollar el dorsal ancho.',
    executionInstructions: '1. Siéntate ajustando los rodillos. 2. Agarre amplio. 3. Tracciona la barra hacia el pecho superior. 4. Retorna lento.',
    commonMistakes: 'Llevar la barra tras la nuca, usar demasiado impulso con el torso.',
    sets: 4,
    repetitions: '10-12',
    cadence: '3-0-1-1',
    rir: '2',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800', // reused
    active: true
  },

  // PIERNAS
  {
    name: 'Sentadilla Libre (Barbell Squat)',
    primaryMuscleGroup: 'Piernas',
    secondaryMuscleGroup: 'Glúteos, Core',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Avanzado',
    equipment: 'Barra, Rack de Sentadillas',
    description: 'El rey de los ejercicios de piernas para ganar masa muscular y fuerza general.',
    executionInstructions: '1. Coloca la barra en los trapecios. 2. Pies a la anchura de los hombros. 3. Desciende llevando la cadera atrás como si te sentaras. 4. Rompe el paralelo y sube.',
    commonMistakes: 'Juntar las rodillas al subir (valgo), levantar los talones, redondear la espalda.',
    sets: 4,
    repetitions: '6-10',
    cadence: '3-1-1-0',
    rir: '2',
    restSeconds: 150,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Peso Muerto Convencional (Deadlift)',
    primaryMuscleGroup: 'Piernas',
    secondaryMuscleGroup: 'Espalda Baja, Glúteos',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Avanzado',
    equipment: 'Barra, Discos Bumper',
    description: 'Construye fuerza masiva en toda la cadena posterior.',
    executionInstructions: '1. Barra sobre la mitad del pie. 2. Agarra la barra, cadera alta. 3. Saca pecho y empuja el piso con las piernas hasta quedar erguido.',
    commonMistakes: 'Espalda en forma de gato (redondeada), la barra muy lejos de las espinillas.',
    sets: 3,
    repetitions: '5-8',
    cadence: '2-1-1-0',
    rir: '2',
    restSeconds: 180,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Zancadas Alternadas (Lunges)',
    primaryMuscleGroup: 'Piernas',
    secondaryMuscleGroup: 'Glúteos',
    exerciseType: 'Funcional',
    difficultyLevel: 'Intermedio',
    equipment: 'Mancuernas / Peso Corporal',
    description: 'Trabajo unilateral excelente para balance y fuerza de piernas.',
    executionInstructions: '1. Da un paso largo adelante. 2. Baja hasta que la rodilla trasera roce el suelo. 3. Empuja hacia atrás a la posición inicial.',
    commonMistakes: 'Paso muy corto, dejar que la rodilla pase excesivamente la punta del pie con mala postura.',
    sets: 3,
    repetitions: '12 por pierna',
    cadence: '2-0-1-0',
    rir: '1',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&q=80&w=800',
    active: true
  },

  // HOMBROS
  {
    name: 'Press Militar con Mancuernas',
    primaryMuscleGroup: 'Hombros',
    secondaryMuscleGroup: 'Tríceps',
    exerciseType: 'Hipertrofia',
    difficultyLevel: 'Intermedio',
    equipment: 'Mancuernas, Banco',
    description: 'Movimiento de empuje vertical para el desarrollo de los deltoides.',
    executionInstructions: '1. Siéntate en un banco con respaldo vertical. 2. Sube las mancuernas a la altura de los hombros. 3. Empuja hacia arriba hasta estirar los brazos.',
    commonMistakes: 'Arquear demasiado la espalda baja, no bajar las mancuernas lo suficiente.',
    sets: 3,
    repetitions: '10-15',
    cadence: '2-0-1-0',
    rir: '1',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Elevaciones Laterales',
    primaryMuscleGroup: 'Hombros',
    secondaryMuscleGroup: 'Trapecio',
    exerciseType: 'Aislamiento',
    difficultyLevel: 'Principiante',
    equipment: 'Mancuernas',
    description: 'El mejor ejercicio para aislar la cabeza lateral del deltoides.',
    executionInstructions: '1. De pie con mancuernas a los lados. 2. Eleva los brazos lateralmente hasta la paralela con el piso. 3. Desciende controlado.',
    commonMistakes: 'Usar peso excesivo, balancear el torso, encoger los trapecios.',
    sets: 4,
    repetitions: '15-20',
    cadence: '2-0-1-1',
    rir: '0',
    restSeconds: 60,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    active: true
  },

  // BRAZOS
  {
    name: 'Curl de Bíceps con Barra',
    primaryMuscleGroup: 'Brazos',
    secondaryMuscleGroup: 'Antebrazos',
    exerciseType: 'Fuerza',
    difficultyLevel: 'Intermedio',
    equipment: 'Barra Recta / EZ',
    description: 'Constructor de masa principal para los bíceps.',
    executionInstructions: '1. De pie, agarre supino a la anchura de hombros. 2. Flexiona los codos subiendo la barra. 3. Baja de forma controlada.',
    commonMistakes: 'Codos que se mueven hacia adelante o atrás, usar la espalda baja para subir.',
    sets: 3,
    repetitions: '10-12',
    cadence: '3-0-1-1',
    rir: '1',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Extensión de Tríceps en Polea Alta',
    primaryMuscleGroup: 'Brazos',
    secondaryMuscleGroup: 'Ninguno',
    exerciseType: 'Aislamiento',
    difficultyLevel: 'Principiante',
    equipment: 'Polea, Cuerda o Barra Recta',
    description: 'Aisla los tríceps con tensión constante.',
    executionInstructions: '1. Agarra la polea, codos pegados a los costados. 2. Extiende los brazos hacia abajo hasta bloquear los codos. 3. Sube controlado.',
    commonMistakes: 'Separar los codos de los costados del cuerpo.',
    sets: 4,
    repetitions: '12-15',
    cadence: '2-0-1-1',
    rir: '1',
    restSeconds: 60,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
    active: true
  },

  // CORE & FUNCIONAL
  {
    name: 'Kettlebell Swings',
    primaryMuscleGroup: 'Core',
    secondaryMuscleGroup: 'Glúteos, Hombros',
    exerciseType: 'Metabólico',
    difficultyLevel: 'Intermedio',
    equipment: 'Pesa Rusa (Kettlebell)',
    description: 'Ejercicio de potencia balística excelente para cardio y cadena posterior.',
    executionInstructions: '1. Piernas abiertas, flexión de cadera hacia atrás. 2. Empuja la cadera hacia adelante con explosividad para elevar la pesa rusa. 3. Deja que caiga guiando el movimiento.',
    commonMistakes: 'Hacer una sentadilla en lugar de un bisagra de cadera, usar los brazos para levantar el peso.',
    sets: 4,
    repetitions: '20',
    cadence: '1-0-1-0',
    rir: '2',
    restSeconds: 60,
    timerEnabled: false,
    mainImageUrl: 'https://images.unsplash.com/photo-1566241477600-ac0244c70133?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Box Jumps (Saltos al Cajón)',
    primaryMuscleGroup: 'Piernas',
    secondaryMuscleGroup: 'Cardio',
    exerciseType: 'Pliométrico',
    difficultyLevel: 'Intermedio',
    equipment: 'Cajón Pliométrico',
    description: 'Desarrolla potencia explosiva en el tren inferior.',
    executionInstructions: '1. Párate frente al cajón. 2. Flexiona cadera y brazos atrás. 3. Salta explosivamente y aterriza suave en el cajón.',
    commonMistakes: 'Aterrizar con las piernas rectas o rodillas en valgo.',
    sets: 3,
    repetitions: '8-10',
    cadence: '0-0-1-0',
    rir: '2',
    restSeconds: 90,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Plancha Abdominal (Plank)',
    primaryMuscleGroup: 'Core',
    secondaryMuscleGroup: 'Hombros',
    exerciseType: 'Isométrico',
    difficultyLevel: 'Principiante',
    equipment: 'Colchoneta',
    description: 'Ejercicio isométrico para fortalecer toda la faja abdominal.',
    executionInstructions: '1. Apoya los antebrazos y las puntas de los pies. 2. Mantén el cuerpo en línea recta activando glúteos y abdomen. 3. Respira de forma controlada.',
    commonMistakes: 'Dejar caer la cadera, mirar hacia arriba tensionando el cuello.',
    sets: 3,
    repetitions: '1 min',
    cadence: '0-0-0-0',
    rir: '0',
    restSeconds: 60,
    timerEnabled: true,
    mainImageUrl: 'https://images.unsplash.com/photo-1566241477600-ac0244c70133?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    name: 'Burpees',
    primaryMuscleGroup: 'Cardio',
    secondaryMuscleGroup: 'Cuerpo Completo',
    exerciseType: 'Metabólico',
    difficultyLevel: 'Avanzado',
    equipment: 'Peso Corporal',
    description: 'Ejercicio de alta intensidad que combina sentadilla, flexión y salto.',
    executionInstructions: '1. Desde pie, baja a sentadilla y apoya las manos. 2. Salta atrás a posición de plancha y haz una flexión. 3. Salta adelante y levántate con un salto explosivo.',
    commonMistakes: 'Hundir la zona lumbar en la flexión, aterrizar fuerte sobre las rodillas.',
    sets: 4,
    repetitions: '15-20',
    cadence: '1-0-1-0',
    rir: '1',
    restSeconds: 45,
    timerEnabled: false,
    mainImageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    active: true
  }
];

const seed = async () => {
  for (const ex of exercises) {
    const postData = JSON.stringify(ex);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/exercises',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            console.log(`✅ Creado: ${ex.name}`);
          } else {
            // Ignorar errores de duplicados para que el script sea seguro de re-ejecutar
            if (data.includes('ya existe')) {
               console.log(`⚠️  Saltado (Ya existe): ${ex.name}`);
            } else {
               console.log(`❌ Error: ${ex.name} - ${data}`);
            }
          }
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error(`Problema de conexión: ${e.message}`);
        resolve(); // Continue even if error
      });

      req.write(postData);
      req.end();
    });
  }
};

seed().then(() => console.log('Carga de datos finalizada.'));
