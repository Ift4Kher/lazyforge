import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrationForDb(databaseName) {
  console.log(`[MIGRATE] Running schema migration on database: ${databaseName}...`);

  // Connect without DB to ensure database exists
  const rootConn = await mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    multipleStatements: true,
  });

  await rootConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await rootConn.end();

  // Connect to target database with multipleStatements enabled
  const dbConn = await mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: databaseName,
    multipleStatements: true,
  });

  const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf-8');
  await dbConn.query(schemaSql);
  await dbConn.end();

  console.log(`[MIGRATE SUCCESS] Schema migration applied successfully to: ${databaseName}`);
}

async function main() {
  try {
    await runMigrationForDb(env.DB.database);
    if (env.DB.testDatabase && env.DB.testDatabase !== env.DB.database) {
      await runMigrationForDb(env.DB.testDatabase);
    }
    process.exit(0);
  } catch (err) {
    console.error('[MIGRATE ERROR]', err);
    process.exit(1);
  }
}

main();
