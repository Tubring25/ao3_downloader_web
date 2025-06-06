
import { createComment, getWorkComments, voteComment } from '@/app/api/comments/service';
import * as dbModule from '@/lib/db';
import { workComments } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock database module
vi.mock('@/lib/db', () => ({
  getDb: vi.fn()
}))

describe('Comment Service', () => {
  // Mock database instance
  const createMockDb = () => ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    execute: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  })

  // Mock comment data
  const createMockComment = (overrides = {}) => ({
    id: 1,
    workId: 1,
    content: 'Test comment content',
    authorName: 'Test Author',
    upvotes: 5,
    downvotes: 2,
    createdAt: new Date('2024-01-01'),
    isHidden: 0,
    ...overrides,
  })

  let mockDb: ReturnType<typeof createMockDb>;
  const mockEnv = { DB: 'test' };

  beforeEach(() => {
    vi.resetAllMocks();
    mockDb = createMockDb();
    (dbModule.getDb as any).mockReturnValue(mockDb);
  });

  describe('getWorkComments', () => {
    it('should return paginated comments for a work', async () => {
      const mockComments = [
        createMockComment({ id: 1 }),
        createMockComment({ id: 2, content: 'Second comment' }),
        createMockComment({ id: 3, content: 'Third comment' }),
      ]

      const mockTotalCount = [{ count: 15 }];

      // Mock the count query
      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockTotalCount))
      // Mock the comments query
      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockComments))

      const params = {
        workId: 1,
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      }

      const result = await getWorkComments(mockEnv, params);

      expect(result).toEqual({
        comments: mockComments,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 15,
          totalPages: 2,
        },
      });

      // Verify database calls
      expect(mockDb.select).toHaveBeenCalledTimes(2);
      expect(mockDb.from).toHaveBeenCalledWith(workComments);
      expect(mockDb.where).toHaveBeenCalled()
      expect(mockDb.execute).toHaveBeenCalledTimes(2);
    })

    it('should apply correct sorting by upvotes', async () => {
      const mockComments = [
        createMockComment({ id: 1, upvotes: 10, downvotes: 2 }),
        createMockComment({ id: 2, upvotes: 5, downvotes: 1 }),
        createMockComment({ id: 3, upvotes: 8, downvotes: 3 }),
      ]

      const mockTotalCount = [{ count: 3 }];

      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockTotalCount))
      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockComments))

      const params = {
        workId: 1,
        page: 1,
        pageSize: 10,
        sortBy: 'upvotes' as const,
        sortOrder: 'desc' as const,
      }

      await getWorkComments(mockEnv, params)

      expect(mockDb.orderBy).toHaveBeenCalled()
    })

    it('should filter hidden comments', async () => {
      const mockComments = [createMockComment()];
      const mockTotalCount = [{ count: 1 }];

      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockTotalCount))
      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockComments))

      const params = {
        workId: 1,
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      }

      await getWorkComments(mockEnv, params)

      expect(mockDb.where).toHaveBeenCalledWith(
        and(
          eq(workComments.workId, 1),
          eq(workComments.isHidden, 0),
        )
      )
    })

    it('should handle pagination correctly', async () => {
      const mockComments = Array.from({ length: 15 }, (_, i) => createMockComment({ id: i + 1 }));
      const mockTotalCount = [{ count: 15 }];

      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockTotalCount))
      mockDb.execute.mockImplementationOnce(() => Promise.resolve(mockComments))

      const params = {
        workId: 1,
        page: 2,
        pageSize: 10,
        sortBy: 'createdAt' as const,
      }

      await getWorkComments(mockEnv, params)

      expect(mockDb.offset).toHaveBeenCalledWith(10)
      expect(mockDb.limit).toHaveBeenCalledWith(10)
    })
  })

  describe('createComment', () => {

    it('should create a comment successfully', async () => {
      const newComment = createMockComment()
      mockDb.returning.mockResolvedValue([newComment])

      const commentData = {
        workId: 1,
        content: 'Test comment content',
        authorName: 'Test Author',
      }

      const result = await createComment(mockEnv, commentData)

      expect(result).toEqual(newComment)
      expect(mockDb.insert).toHaveBeenCalledWith(workComments)
      expect(mockDb.values).toHaveBeenCalledWith({
        ...commentData,
        upvotes: 0,
        downvotes: 0,
        isHidden: 0,
        createdAt: expect.any(Date),
      })
      expect(mockDb.returning).toHaveBeenCalled()
    })

    it('should handle empty author name by using provided name', async () => {
      const newComment = createMockComment({ authorName: 'Anonymous' });
      mockDb.returning.mockResolvedValue([newComment])

      const commentData = {
        workId: 1,
        content: 'Test comment content',
        authorName: 'Anonymous',
      }

      await createComment(mockEnv, commentData)

      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          authorName: 'Anonymous',
        })
      )
    })
  })

  describe('voteComment', () => {

    it('should handle first-time upvote correctly', async () => {
      const existingComment = createMockComment({ upvotes: 5, downvotes: 2 })
      mockDb.execute.mockResolvedValueOnce([existingComment])
      mockDb.execute.mockResolvedValueOnce(undefined)

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 1,
        proVoteType: undefined
      }

      const result = await voteComment(mockEnv, voteData)

      expect(result).toEqual({
        success: true,
        message: 'Vote updated successfully',
      })

      expect(mockDb.set).toHaveBeenCalledWith({
        upvotes: 6, // 5 + 1
        downvotes: 2, // unchanged
      });
    })

    it('should unhide comment when downvotes go below 10', async () => {
      const existingComment = createMockComment({ upvotes: 1, downvotes: 10, isHidden: 1 });
      mockDb.execute.mockResolvedValueOnce([existingComment]);
      mockDb.execute.mockResolvedValueOnce(undefined);

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 0, // unvote
        prevVoteType: -1, // was downvoted
      };

      await voteComment(mockEnv, voteData);

      expect(mockDb.set).toHaveBeenCalledWith({
        upvotes: 1,
        downvotes: 9, // 10 - 1
        isHidden: 0, // should be unhidden now
      });
    });

    it('should return error when comment not found', async () => {
      mockDb.execute.mockResolvedValueOnce([])

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 1,
        prevVoteType: undefined
      }

      const result = await voteComment(mockEnv, voteData)

      expect(result).toEqual({
        success: false,
        message: 'Comment not found',
      })

    })

    it('should ensure votes never go below 0', async () => {
      const existingComment = createMockComment({ upvotes: 0, downvotes: 0 })
      mockDb.execute.mockResolvedValueOnce([existingComment])
      mockDb.execute.mockResolvedValueOnce(undefined)

      const voteData = {
        workId: 1,
        commentId: 1,
        newVoteType: 0,
        prevVoteType: 1
      }

      const result = await voteComment(mockEnv, voteData)

      expect(mockDb.set).toHaveBeenCalledWith({
        upvotes: 0, // Math.max(0, 0 - 1) = 0
        downvotes: 0,
      });
    })
  })
})