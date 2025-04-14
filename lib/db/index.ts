import { drizzle as drizzle_d1 } from 'drizzle-orm/d1'
import { drizzle as drizzle_sqlite } from 'drizzle-orm/better-sqlite3';
import { Env } from '../utils'
import Database from 'better-sqlite3';
import * as schema from './schema';

export const getDb = (env: Env) => {
  if(typeof env?.DB !== 'undefined') {
    return drizzle_d1(env.DB)
  }

  const sqlite = new Database('./local.db');
  return drizzle_sqlite(sqlite, { schema });
}