import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const heartRateDaily = sqliteTable('heart_rate_daily', {
  date: text('date').primaryKey(),        // YYYY-MM-DD
  restingHr: integer('resting_hr'),
  zones: text('zones'),                   // JSON string of HeartRateZone[]
});

export const heartRateIntraday = sqliteTable('heart_rate_intraday', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timestamp: text('timestamp').notNull(), // ISO 8601
  bpm: integer('bpm').notNull(),
});

export const stepsDaily = sqliteTable('steps_daily', {
  date: text('date').primaryKey(),
  steps: integer('steps').notNull(),
  distance: real('distance'),             // km
  floors: integer('floors'),
});

export const sleepDaily = sqliteTable('sleep_daily', {
  date: text('date').primaryKey(),
  duration: integer('duration'),          // total minutes
  efficiency: integer('efficiency'),       // percentage
  stages: text('stages'),                 // JSON string {deep, light, rem, wake}
});

export const spo2Daily = sqliteTable('spo2_daily', {
  date: text('date').primaryKey(),
  avg: real('avg'),
  min: real('min'),
  max: real('max'),
});

export const bodyComposition = sqliteTable('body_composition', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  weight: real('weight'),                 // kg
  bmi: real('bmi'),
  bodyFat: real('body_fat'),              // percentage
  muscleMass: real('muscle_mass'),        // kg
  source: text('source'),                 // 'renpho' | 'google_fit' | 'manual'
});

export const meals = sqliteTable('meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  name: text('name').notNull(),
  calories: integer('calories').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
});

export const syncLog = sqliteTable('sync_log', {
  dataType: text('data_type').primaryKey(),
  lastSyncedAt: text('last_synced_at').notNull(),
});

export const battleState = sqliteTable('battle_state', {
  id: text('id').primaryKey(),                       // always 'current'
  enemyId: text('enemy_id').notNull(),
  enemyCurrentHp: integer('enemy_current_hp').notNull(),
  enemyMaxHp: integer('enemy_max_hp').notNull(),
  totalDefeated: integer('total_defeated').notNull().default(0),
  totalDamageAllTime: integer('total_damage_all_time').notNull().default(0),
  lastDamageDate: text('last_damage_date'),           // YYYY-MM-DD
  damageDealToday: integer('damage_dealt_today').notNull().default(0),
  healingReceivedToday: integer('healing_received_today').notNull().default(0),
});

export const battleLog = sqliteTable('battle_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  enemyId: text('enemy_id').notNull(),
  enemyMaxHp: integer('enemy_max_hp').notNull(),
  defeatedAt: text('defeated_at').notNull(),           // ISO 8601
});
