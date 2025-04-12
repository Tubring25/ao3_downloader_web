import { describe, it, expect, beforeEach, vi } from 'vitest';
import { app } from '@/app/api/[[...route]]/route'
import * as workService from '@/app/api/works/service';

// mock the workService module
vi.mock('@/app/api/works/service', () => ({
    getWorksList: vi.fn(),
    getWorkById: vi.fn(),
}));

describe('Works API Routes', () => {
    const mockEnv = { DB: 'test' };

    beforeEach(() => {
        vi.resetAllMocks();
        vi.stubGlobal('process', {
            env: {
                env: { DATABASE_URL: 'test' }
            }
        })
    })

    describe('GET /api/works', () => {
        it('should return works list with pagination', async () => {
            // mock the response from service
            const mockResponse = {
                works: [{ id: 1, title: 'Test Work' }],
                pagination: { page: '1', pageSize: '10', total: 1, totalPages: 1 }
            };

            (workService.getWorksList as any).mockResolvedValue(mockResponse);

            // make the request 
            const req = new Request('http://localhost/api/works?page=1&pageSize=10');
            const c = { req, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: (key: string) => {
                    return { page: '1', pageSize: '10' }
                },
                writable: true,
            })

            const res = await app.fetch(req, c)
            const data = await res.json()

            expect(res.status).toBe(200);
            expect(data).toHaveProperty('ok', true);
            expect(data).toHaveProperty('message', 'success');
            expect(data).toHaveProperty('data', mockResponse);

            // verify the service was called
            expect(workService.getWorksList).toHaveBeenCalled();
        })

        it('should return empty works list when no works found', async () => {
            const mockResponse = {
                works: [],
                pagination: { page: '1', pageSize: '10', total: 0, totalPages: 0 }
            };
            (workService.getWorksList as any).mockResolvedValue(mockResponse);

            const req = new Request('http://localhost/api/works')
            const c = { req, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: () => {
                    return { page: '1', pageSize: '10' }
                },
                writable: true,
            })

            const res = await app.fetch(req, c)
            const data = await res.json()

            expect(res.status).toBe(200);
            expect(data).toHaveProperty('ok', true);
            expect(data).toHaveProperty('message', 'No works found');
        })

        it('should handle errors properly', async () => {
            (workService.getWorksList as any).mockRejectedValue(new Error('Database error'));

            const req = new Request('http://localhost/api/works')
            const c = { req, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: () => {
                    return { page: '1', pageSize: '10' }
                }
                ,
                writable: true,
            })

            const res = await app.fetch(req, c)
            const data = await res.json()

            expect(res.status).toBe(500);
            expect(data).toHaveProperty('ok', false);
            expect(data).toHaveProperty('message', 'Database error');
        })
    })


    describe('GET /api/works/:id', () => {
        it('should return work by ID', async () => {
            const mockWork = { id: 123, title: 'Test Work' };
            (workService.getWorkById as any).mockResolvedValue(mockWork);

            const req = new Request('http://localhost/api/works/123')
            const c = { req, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: () => {
                    return { id: '123' }
                },
                writable: true,
            })

            const res = await app.fetch(req, c)
            const data = await res.json()
            expect(res.status).toBe(200);
            expect(data).toHaveProperty('ok', true);
            expect(data).toHaveProperty('message', 'success');
            expect(data).toHaveProperty('data', mockWork);
            expect(workService.getWorkById).toHaveBeenCalled();
        })

        it('should return not found when work not found', async () => {
            (workService.getWorkById as any).mockResolvedValue(null);

            const req = new Request('http://localhost/api/works/123')
            const c = { req, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: () => {
                    return { id: '123' }
                },
                writable: true,
            })

            const res = await app.fetch(req, c)
            const data = await res.json()
            
            expect(res.status).toBe(200);
            expect(data).toHaveProperty('ok', true);
            expect(data).toHaveProperty('message', 'Work not found');
        })

        it('should handle invalid ID', async () => {
            const request = new Request('http://localhost/api/works/invalid-id')
            const c = { req: request, env: mockEnv } as any
            Object.defineProperty(c.req, 'valid', {
                value: () => {
                    return { id: 'invalid-id' }
                },
                writable: true,
            })
            const res = await app.fetch(request, c)
            const data = await res.json()

            expect(res.status).toBe(400);
            expect(data).toHaveProperty('ok', false);
            expect(data).toHaveProperty('message', 'Invalid work ID');
        })
    })
})

