import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getDb } from '@/lib/db'
import { works } from '@/lib/db/schema'
import { count, eq, like } from 'drizzle-orm'
import { Env, getPaginatedData } from '@/lib/utils'

// create a new Hono instance
const app = new Hono<{Bindings: Env}>()

// config the proxy
app.use('*', cors());

// get all works with pagination
app.get('/', async (c) => {
  const db = getDb(c.env)
  const page = parseInt(c.req.query('page') || '1')
  const pageSize = parseInt(c.req.query('pageSize') || '10')
  const search = c.req.query('search') || ''

  const offset = (page - 1) * pageSize

  const baseQuery = db.select().from(works);
  const baseCountQuery = db.select({ value: count() }).from(works);

  const searchTerm = search ? `%${search}%` : undefined;
  const finalQuery = searchTerm 
    ? baseQuery.where(like(works.title, searchTerm)).limit(pageSize).offset(offset)
    : baseQuery.limit(pageSize).offset(offset);

  const finalCountQuery = searchTerm
    ? baseCountQuery.where(like(works.title, searchTerm))
    : baseCountQuery;

  // fetch data
  const result = await getPaginatedData(
    () => finalQuery,
    async () => {
      const result = await finalCountQuery;
      return result[0]?.value || 0
    },
    page,
    pageSize
  )

  return c.json(result)
})

// get single work detail
app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const db = getDb(c.env)

  const work = await db.select().from(works).where(eq(works.id, id)).get()

  if(!work) {
    return c.json({ error: 'Work not found' }, 404)
  }

  return c.json(work)
})

export const GET = handle(app)