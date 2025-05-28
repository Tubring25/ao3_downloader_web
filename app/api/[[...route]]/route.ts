import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getWorkById, getWorksList } from '../works/service';
import { createComment, getWorkComments, voteComment } from '../comments/service'; // Add this import
import { D1Database } from '@cloudflare/workers-types';

// export const runtime = 'edge';

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')
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
  sortBy: z.enum(['kudos', 'comments', 'words', 'hits']).default('kudos'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  // pagination
  page: z.string().default('1'),
  pageSize: z.string().default('10'),
})

// Add comment schemas
const getCommentsSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  pageSize: z.string().optional().transform(val => val ? parseInt(val) : 10),
  sortBy: z.enum(['createdAt', 'upvotes']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

const createCommentSchema = z.object({
  workId: z.number(),
  content: z.string().min(1).max(1000),
  authorName: z.string().min(1).max(50),
});

const voteCommentSchema = z.object({
  workId: z.number(),
  commentId: z.number(),
  voteType: z.number().refine(val => val === 1 || val === -1, {
    message: 'voteType must be 1 (upvote) or -1 (downvote)',
  }),
});


// === Works Routes ===
const worksApp = new Hono<{ Bindings: Bindings }>()
// get all works with pagination
worksApp.get('/', zValidator('query', searchSchema), async (c) => {
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
worksApp.get('/:id', async (c) => { // Change this from app.get to worksRoutes.get
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

app.route('/works', worksApp);

// === Comments Routes ===
const commentsApp = new Hono<{ Bindings: Bindings }>()

// Get comments for a work
commentsApp.get('/works/:workId', zValidator('query', getCommentsSchema), async (c) => {
  try {
    const params = c.req.valid('query');
    const workIdString = c.req.param('workId');

    if (!workIdString) {
      return c.json({
        ok: false,
        message: 'Work ID is required',
        data: null
      }, 400)
    }

    const workId = parseInt(workIdString)

    if (isNaN(workId)) {
      return c.json({
        ok: false,
        message: 'Invalid work ID',
        data: null
      }, 400)
    }

    const commentsResult = await getWorkComments(c.env, {
      ...params,
      workId
    });

    return c.json({
      ok: true,
      message: commentsResult.comments.length > 0 ? 'success' : 'No comments found',
      data: commentsResult
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to fetch comments',
      data: null
    }, 500);
  }
});

// Create a new comment
commentsApp.post('/', zValidator('json', createCommentSchema), async (c) => {
  try {
    const commentData = c.req.valid('json');

    const newComment = await createComment(c.env, commentData);

    return c.json({
      ok: true,
      message: 'Comment created successfully',
      data: newComment
    }, 201);
  } catch (error) {
    console.error('Error creating comment:', error);
    return c.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to create comment',
      data: null
    }, 500);
  }
});

// Vote on a comment
commentsApp.post('/vote', zValidator('json', voteCommentSchema), async (c) => {
  try {
    const voteData = c.req.valid('json');

    const result = await voteComment(c.env, voteData);

    return c.json({
      ok: result.success,
      message: result.message,
      data: null
    }, result.success ? 200 : 400);
  } catch (error) {
    console.error('Error voting on comment:', error);
    return c.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to vote on comment',
      data: null
    }, 500);
  }
});

app.route('/comments', commentsApp);

export const GET = handle(app)
export const POST = handle(app) // Add this to handle POST requests
export { app }