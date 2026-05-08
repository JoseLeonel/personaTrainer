const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres', // default password
    port: 5432,
    database: 'postgres', // connect to default db first
  });

  try {
    await client.connect();
    console.log('Connected to default postgres database.');
    
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'personatrainer_db'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE personatrainer_db');
      console.log('Database personatrainer_db created successfully.');
    } else {
      console.log('Database personatrainer_db already exists.');
    }
  } catch (err) {
    console.error('Error creating database', err);
  } finally {
    await client.end();
  }
}

createDatabase();
