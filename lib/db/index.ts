import { drizzle } from 'drizzle-orm/d1'
import { Env } from '../utils'
import * as schema from './schema'

export const getDb = (env: Env) => {
  return drizzle(env.D1, { schema })
}