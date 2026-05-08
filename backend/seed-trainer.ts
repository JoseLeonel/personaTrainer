import { Client } from 'pg';

async function seed() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'personatrainer_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

  try {
    await client.connect();
    
    // Verificar si el esquema está sincronizado y la tabla existe
    const res = await client.query(`
      INSERT INTO "user" ("firstName", "lastName", "email", "role", "status", "paymentStatus") 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, "firstName", "lastName", email;
    `, ['Enrique', 'Entrenador', 'enrique@example.com', 'TRAINER', 'ACTIVE', 'PAID']);
    
    console.log('✅ Entrenador dummy Enrique agregado con éxito:');
    console.log(res.rows[0]);
  } catch (err) {
    console.error('❌ Error agregando al entrenador:', err);
  } finally {
    await client.end();
  }
}

seed();
