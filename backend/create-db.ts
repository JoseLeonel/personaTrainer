import { Client } from 'pg';

async function setup() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

  try {
    await client.connect();
    // Try to create db
    await client.query('CREATE DATABASE personatrainer_db;');
    console.log('Database created');
  } catch (err) {
    console.log(err.message);
  } finally {
    await client.end();
  }
}

setup();
