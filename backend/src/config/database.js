import mysql from 'mysql2/promise';
import { env } from './env.js';

const isTest = env.NODE_ENV === 'test';
const targetDatabase = isTest ? env.DB.testDatabase : env.DB.database;

export const pool = mysql.createPool({
  host: env.DB.host,
  port: env.DB.port,
  user: env.DB.user,
  password: env.DB.password,
  database: targetDatabase,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  decimalNumbers: true, // Parse DECIMAL as float/number where appropriate or use BigNumber
  timezone: '+06:00', // Bangladesh Standard Time
});

/**
 * Execute a query with params
 */
export async function query(sql, params = []) {
  const [rows, fields] = await pool.query(sql, params);
  return rows;
}

/**
 * Execute an INSERT/UPDATE/DELETE query with params
 */
export async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

/**
 * Execute a transactional block
 * @param {Function} callback Function accepting a connection
 */
export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Verify database connectivity
 */
export async function ping() {
  const [rows] = await pool.query('SELECT 1 + 1 AS result');
  return rows[0].result === 2;
}
