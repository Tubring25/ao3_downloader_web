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
                    findFirst: vi.fn(),
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
        it('should return a work with all related details when found', async () => {
            const workId = 123;

            const mockDbResult = {
                id: workId,
                title: 'Detailed Mock Work',
                author: 'Mock Author',
                summary: 'Detailed summary',
                chapters: 5,
                words: 5000,
                kudos: 500,
                comments: 50,
                language: 'English',
                rating: 'Mature',
                tags: [
                    { tag: { id: 1, name: 'Fluff' } },
                    { tag: { id: 2, name: 'Angst' } },
                ],
                characters: [
                    { character: { id: 10, name: 'Character A' } },
                    { character: { id: 11, name: 'Character B' } },
                ],
                fandoms: [
                    { fandom: { id: 20, name: 'Fandom X' } },
                ],
                relationships: [
                    { relationship: { id: 30, name: 'Character A/Character B' } },
                ],
                warnings: [
                    { warning: { id: 40, name: 'Major Character Death' } },
                    { warning: { id: 41, name: 'Graphic Depictions Of Violence' } },
                ],
                categories: [
                    { category: { id: 50, name: 'M/M' } },
                ],
            };

            const expectedFlattedWork = {
                id: workId,
                title: 'Detailed Mock Work',
                author: 'Mock Author',
                summary: 'Detailed summary',
                chapters: 5,
                words: 5000,
                kudos: 500,
                comments: 50,
                language: 'English',
                rating: 'Mature',
                tags: ['Fluff', 'Angst'],
                characters: ['Character A', 'Character B'],
                fandoms: ['Fandom X'],
                relationships: ['Character A/Character B'],
                warnings: ['Major Character Death', 'Graphic Depictions Of Violence'],
                categories: ['M/M'],
            };

            mockDb.query.works.findFirst.mockResolvedValue(mockDbResult);

            const result = await getWorkById(mockEnv, workId);

            expect(result).toEqual(expectedFlattedWork);

            // Validate the database call
            expect(mockDb.query.works.findFirst).toHaveBeenCalledWith({
                where: eq(works.id, workId),
                with: {
                    tags: { with: { tag: { columns: { name: true } } } },
                    characters: { with: { character: { columns: { name: true } } } },
                    fandoms: { with: { fandom: { columns: { name: true } } } },
                    relationships: { with: { relationship: { columns: { name: true } } } },
                    warnings: { with: { warning: { columns: { name: true } } } },
                    categories: { with: { category: { columns: { name: true } } } },
                }
            });
        });


        it('should return null when work not found', async () => {
            const workId = 999;

            mockDb.query.works.findFirst.mockResolvedValue(undefined);

            const result = await getWorkById(mockEnv, workId);

            expect(result).toBeNull();

            // Validate the database call
            expect(mockDb.query.works.findFirst).toHaveBeenCalledWith({
                where: eq(works.id, workId),
                with: {
                    tags: { with: { tag: { columns: { name: true } } } },
                    characters: { with: { character: { columns: { name: true } } } },
                    fandoms: { with: { fandom: { columns: { name: true } } } },
                    relationships: { with: { relationship: { columns: { name: true } } } },
                    warnings: { with: { warning: { columns: { name: true } } } },
                    categories: { with: { category: { columns: { name: true } } } },
                }
            });
        });
    })
})
