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
            query: {
                works: {
                    findMany: vi.fn(),
                },
            },
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
    const createMockWork = (overrides = {}, warningNames = ['None']) => ({
        id: 1,
        title: 'Mock Work',
        author: 'Mock Author',
        summary: 'Mock summary',
        chapters: 1,
        words: 1000,
        kudos: 100,
        comments: 10,
        rating: 'General',
        warnings: warningNames.map(name => ({ warning: { name } })),
        ...overrides
    })

    const createFlattedMockWork = (overrides = {}, warningNames = ['None']) => ({
        id: 1,
        title: 'Mock Work',
        author: 'Mock Author',
        summary: 'Mock summary',
        chapters: 1,
        words: 1000,
        kudos: 100,
        comments: 10,
        rating: 'General',
        warnings: warningNames,
        ...overrides
    })

    let mockDb: { offset: any; select: any; from: any; orderBy: any; limit: any; get: any; where: any; }
    let mockEnv = { DB: 'test' }

    beforeEach(() => {
        vi.resetAllMocks();
        mockDb = createMockDb();
        (dbModule.getDb as any).mockReturnValue(mockDb);
    });

    describe('getWorksList', () => {
        it('should return works list with pagination', async () => {
            const mockWorksData = [
                createMockWork({ id: 1 }),
                createMockWork({ id: 2 }, ['Violence']),
            ];

            const mockTotalCount = [{ count: 10 }];

            mockDb.query.works.findMany.mockResolvedValue(mockWorksData);
            mockDb.select.mockImplementation((selector: any) => {
                if (selector && typeof selector === 'object' && 'count' in selector) {
                    const fromMock = vi.fn().mockReturnThis();
                    const whereMock = vi.fn().mockResolvedValue(mockTotalCount);
                    const mockChain = { from: fromMock, where: whereMock };
                    fromMock.mockReturnValue(mockChain);
                    return mockChain;
                }
                 return mockDb;
             });
 
             const params = {
                 page: '1',
                 pageSize: '5',
                 sortBy: 'kudos',
                 sortOrder: 'desc'
             } as const; // Ensure literal types are inferred
 
             const mockFlattedWorks = [
                createFlattedMockWork({ id: 1 }),
                createFlattedMockWork({ id: 2 }, ['Violence']),
            ];

            const mockWorks = {
                works: mockFlattedWorks,
                pagination: {
                    page: 1,
                    pageSize: 5,
                    total: 10, 
                    totalPages: 2,
                }
            };
    
            const result = await getWorksList(mockEnv, params);
            // validate the query result
            expect(result).toEqual(mockWorks)

            // validate the database calls
            expect(mockDb.select).toHaveBeenCalled()
            const selectCall = mockDb.select.mock.calls.find(call => call[0] && call[0].count);
            const fromMockCall = (mockDb.select as any).mock.results[mockDb.select.mock.calls.indexOf(selectCall!)].value.from as any;
            expect(fromMockCall).toHaveBeenCalledWith(works);
        })

        it('should apply correct sort order', async () => {
            const mockWorksData = [
                createMockWork({ id: 1 }),
                createMockWork({ id: 2 }, ['Violence']),
            ];

            const mockTotalCount = [{ count: 10 }];

            mockDb.query.works.findMany.mockResolvedValue(mockWorksData);
            mockDb.offset.mockResolvedValue([])
            mockDb.select.mockImplementation((selector: any) => {
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

            expect(mockDb.query.works.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    orderBy: works.kudos
                })
            );
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
