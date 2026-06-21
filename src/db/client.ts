import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('fatbit.db');
export const db = drizzle(expo, { schema });

export async function initDatabase() {
  // Create tables using raw SQL (since we're not using drizzle-kit push in mobile)
  expo.execSync(`
    CREATE TABLE IF NOT EXISTS heart_rate_daily (
      date TEXT PRIMARY KEY,
      resting_hr INTEGER,
      zones TEXT
    );
    CREATE TABLE IF NOT EXISTS heart_rate_intraday (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      bpm INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS steps_daily (
      date TEXT PRIMARY KEY,
      steps INTEGER NOT NULL,
      distance REAL,
      floors INTEGER
    );
    CREATE TABLE IF NOT EXISTS sleep_daily (
      date TEXT PRIMARY KEY,
      duration INTEGER,
      efficiency INTEGER,
      stages TEXT
    );
    CREATE TABLE IF NOT EXISTS spo2_daily (
      date TEXT PRIMARY KEY,
      avg REAL,
      min REAL,
      max REAL
    );
    CREATE TABLE IF NOT EXISTS body_composition (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      weight REAL,
      bmi REAL,
      body_fat REAL,
      muscle_mass REAL,
      source TEXT
    );
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sync_log (
      data_type TEXT PRIMARY KEY,
      last_synced_at TEXT NOT NULL
    );
  `);
}
