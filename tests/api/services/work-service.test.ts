import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWorksList, getWorkById } from '@/app/api/works/service';
import * as dbModule from '@/lib/db';
import { works } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// mock the database module
vi.mock('@/lib/db', () => ({
    getDb: vi.fn(),
}));

describe('Work Service', () => {
    // mock the database instance
    const createMockDb = () => {
        return {
            select: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockReturnThis(),
            get: vi.fn(),
        }
    }

    // mock the works data
    const createMockWork = (overrides = {}) => ({
        id: 1,
        title: 'Mock Work',
        author: 'Mock Author',
        summary: 'Mock summary',
        chapters: 1,
        words: 1000,
        kudos: 100,
        comments: 10,
        rating: 'General',
        ...overrides
    })

    let mockDb
    let mockEnv = { DB: 'test' }

    beforeEach(() => {
        vi.resetAllMocks();
        mockDb = createMockDb();
        (dbModule.getDb as any).mockReturnValue(mockDb);
    });

    describe('getWorksList', () => {
        it('should return works list with pagination', async () => {
            const mockWorks = {
                pagination: {
                    page: 1,
                    pageSize: 5,
                    total: 10,
                    totalPages: 2
                },
                works: [createMockWork(), createMockWork({ id: 2 })],
            }
            mockDb.offset.mockResolvedValue([... [createMockWork(), createMockWork({ id: 2 })]])

            mockDb.select.mockImplementation((selector) => {
                if (selector && typeof selector === 'object' && 'count' in selector) {
                    return {
                        from: () => ({
                            where: () => Promise.resolve([{ count: 10 }])
                        })
                    }
                }
                return mockDb
            })

            const params = {
                page: '1',
                pageSize: '5',
                sortBy: 'kudos',
                sortOrder: 'desc'
            };
    
            const result = await getWorksList(mockEnv, params);
            // validate the query result
            expect(result).toEqual(mockWorks)

            // validate the database calls
            expect(mockDb.select).toHaveBeenCalled()
            expect(mockDb.from).toHaveBeenCalledWith(works)
            expect(mockDb.orderBy).toHaveBeenCalledWith(desc(works.kudos))
            expect(mockDb.limit).toHaveBeenCalledWith(5)
            expect(mockDb.offset).toHaveBeenCalledWith(0)
        })

        it('should apply correct sort order', async () => {
            mockDb.offset.mockResolvedValue([])
            mockDb.select.mockImplementation((selector) => {
                if (selector && typeof selector === 'object' && 'count' in selector) {
                    return {
                        from: () => ({
                            where: () => Promise.resolve([{ count: 10 }])
                        })
                    }
                }
                return mockDb
            })

            await getWorksList(mockEnv, {
                page: '1',
                pageSize: '5',
                sortBy: 'kudos',
                sortOrder: 'asc'
            });

            expect(mockDb.orderBy).toHaveBeenCalledWith(works.kudos)
        })
    })

    describe('getWorkById', () => {
        it('should return a work when found', async () => {
            const mockWork = createMockWork({ id: 123 });
            mockDb.get.mockResolvedValue(mockWork);

            const result = await getWorkById(mockEnv, 123);
            expect(result).toEqual(mockWork);
            expect(mockDb.select).toHaveBeenCalled()
            expect(mockDb.from).toHaveBeenCalledWith(works);
            expect(mockDb.where).toHaveBeenCalledWith(eq(works.id, 123));
            expect(mockDb.get).toHaveBeenCalled();
        })

        it('should return null when work not found', async () => {
            mockDb.get.mockResolvedValue(null);

            const result = await getWorkById(mockEnv, 999);
            expect(result).toBeNull();
            expect(mockDb.select).toHaveBeenCalled()
            expect(mockDb.from).toHaveBeenCalledWith(works);
            expect(mockDb.where).toHaveBeenCalledWith(eq(works.id, 999));
            expect(mockDb.get).toHaveBeenCalled();
        })
    })
})