import { describe, it, expect, beforeEach, vi } from "vitest";
import { app } from '@/app/api/[[...route]]/route'
import * as commentService from '@/app/api/comments/service'
import PagesManifestPlugin from "next/dist/build/webpack/plugins/pages-manifest-plugin";

// mock the commentService module
vi.mock('@/app/api/comments/service', () => ({
  getWorkComments: vi.fn(),
  createComment: vi.fn(),
  voteComment: vi.fn(),
}));

describe('Comments API Routes', () => {
  const mockEnv = { DB: 'test' };

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/comments/works/:workId', () => {
    it('should return comments for a work successfully', async () => {
      const mockComments = {
        comments: [
          {
            id: 1,
            workId: 1,
            content: 'Test comment',
            authorName: 'Test Author',
            upvotes: 5,
            downvotes: 1,
            createdAt: String(new Date('2024-01-01')),
            isHidden: 0,
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        },
      };

      vi.mocked(commentService.getWorkComments).mockResolvedValue(mockComments);

      const req = new Request('http://localhost/api/comments/works/1?page=1&pageSize=10');
      const c = { req, env: mockEnv };

      // Mock the request validation
      Object.defineProperty(c.req, 'valid', {
        value: () => ({
          page: 1,
          pageSize: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        writable: true,
      });

      // Mock the param method
      Object.defineProperty(c.req, 'param', {
        value: (key: string) => key === 'workId' ? '1' : undefined,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveProperty('ok', true);
      expect(data).toHaveProperty('message', 'success');
      expect(data).toHaveProperty('data', mockComments);
    });

    it('should return empty comments when no comments found', async () => {
      const mockEmptyResponse = {
        comments: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      };

      (commentService.getWorkComments as any).mockResolvedValue(mockEmptyResponse);

      const req = new Request('http://localhost/api/comments/works/1')
      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => ({
          page: 1,
          pageSize: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        writable: true,
      });

      Object.defineProperty(c.req, 'param', {
        value: (key: string) => key === 'workId' ? '1' : undefined,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveProperty('ok', true);
      expect(data).toHaveProperty('message', 'No comments found');
    })

    it('should handle invalid workId', async () => {
      const req = new Request('http://localhost/api/comments/works/invalid')
      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => ({
          page: 1,
          pageSize: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        writable: true,
      });

      Object.defineProperty(c.req, 'param', {
        value: (value: string) => value === 'workId' ? 'invalid' : undefined,
        writable: true,
      })

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toHaveProperty('ok', false);
      expect(data).toHaveProperty('message', 'Invalid work ID');
    })

    it('should handle service errors', async () => {
      (commentService.getWorkComments as any).mockRejectedValue(new Error('Database error'))

      const req = new Request('http://localhost/api/comments/works/1')
      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => ({
          page: 1,
          pageSize: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }),
        writable: true,
      });

      Object.defineProperty(c.req, 'param', {
        value: (key: string) => key === 'workId' ? '1' : undefined,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toHaveProperty('ok', false);
      expect(data).toHaveProperty('message', 'Database error');
    })
  })

  describe('POST /api/comments', () => {
    it('should create a new comment successfully', async () => {
      const mockComment = {
        id: 1,
        workId: 1,
        content: 'New comment',
        authorName: 'Test Author',
        upvotes: 0,
        downvotes: 0,
        createdAt: String(new Date('2024-01-01')),
        isHidden: 0,
      };

      (commentService.createComment as any).mockResolvedValue(mockComment)

      const commentData = {
        workId: 1,
        authorName: 'Test Author',
        content: 'New comment',
      }

      const req = new Request('http://localhost/api/comments', {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => commentData,
        writable: true
      })

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data).toHaveProperty('ok', true);
      expect(data).toHaveProperty('message', 'Comment created successfully');
      expect(data).toHaveProperty('data', mockComment);
    })

    it('should handle creation errors', async () => {
      (commentService.createComment as any).mockRejectedValue(new Error('Creation failed'));

      const commentData = {
        workId: 1,
        content: 'New comment',
        authorName: 'Test Author',
      };

      const req = new Request('http://localhost/api/comments', {
        method: 'POST',
        body: JSON.stringify(commentData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const res = await app.fetch(req, mockEnv);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toHaveProperty('ok', false);
      expect(data).toHaveProperty('message', 'Creation failed');
    });
  })

  describe('POST /api/comments/vote', () => {
    it('should vote on a comment successfully', async () => {
      const mockResult = {
        success: true,
        message: 'Vote updated successfully'
      };

      (commentService.voteComment as any).mockResolvedValue(mockResult);

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 1,
        prevVoteType: undefined,
      }

      const req = new Request('http://localhost/api/comments/vote', {
        method: 'POST',
        body: JSON.stringify(voteData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => voteData,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveProperty('ok', true);
      expect(data).toHaveProperty('message', 'Vote updated successfully');
    })

    it('should handle vote failure', async () => {
      const mockResult = {
        success: false,
        message: 'Comment not found'
      };

      (commentService.voteComment as any).mockResolvedValue(mockResult);

      const voteData = {
        workId: 1,
        commentId: 999,
        newVoteType: 1,
        prevVoteType: undefined,
      }

      const req = new Request('http://localhost/api/comments/vote', {
        method: 'POST',
        body: JSON.stringify(voteData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => voteData,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toHaveProperty('ok', false);
      expect(data).toHaveProperty('message', 'Comment not found');
    })

    it('should handle voting errors', async () => {
      (commentService.voteComment as any).mockRejectedValue(new Error('Vote failed'));

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 1,
        prevVoteType: undefined,
      }

      const req = new Request('http://localhost/api/comments/vote', {
        method: 'POST',
        body: JSON.stringify(voteData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const c = { req, env: mockEnv } as any

      Object.defineProperty(c.req, 'valid', {
        value: () => voteData,
        writable: true,
      });

      const res = await app.fetch(req, c);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toHaveProperty('ok', false);
      expect(data).toHaveProperty('message', 'Vote failed');
    })
  })
})