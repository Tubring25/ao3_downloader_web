import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getDb } from '@/lib/db'
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getWorkById, getWorksList } from '../works/service';

// export const runtime = 'edge';

// create a new Hono instance
export const app = new Hono().basePath('/api/works')
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

// config the proxy
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  // headers: ['Content-Type', 'Authorization'],
}));

export const searchSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isSingleCharacter: z.boolean().optional(),
  rating: z.string().optional(),
  keyword: z.string().optional(),
  // sort:
  sortBy: z.enum(['kudos', 'comments', 'words']).default('kudos'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  // pagination
  page: z.string().default('1'),
  pageSize: z.string().default('10'),
})

// get all works with pagination
app.get('/', zValidator('query', searchSchema), async (c) => {
  try {
    const queryParams = c.req.valid('query')
    const worksListResult = await getWorksList(c.env, queryParams)

    return c.json({
      ok: true,
      message: worksListResult.pagination.total > 0 ? 'success' : 'No works found',
      data: worksListResult,
    })
  } catch (error) {
    console.error('Error fetching works list:', error)
    return c.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to fetch works list',
      data: null,
    }, 500)
  }
})

// get single work detail
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    
    if (isNaN(id)) {
      return c.json({
        ok: false,
        message: 'Invalid work ID',
        data: null
      }, 400)
    }
    
    const work = await getWorkById(c.env, id)
    
    return c.json({
      ok: true,
      message: work ? 'success' : 'Work not found',
      data: work
    })
  } catch (error) {
    console.error('Error fetching work:', error)
    return c.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to fetch work',
      data: null
    }, 500)
  }
})

export const GET = handle(app)