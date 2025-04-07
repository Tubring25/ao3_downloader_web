import { describe, expect, it, beforeEach, vi } from 'vitest';
import { buildWhereConditions } from '@/app/api/works/utils';
import { works } from '@/lib/db/schema';
import { and, eq, like, or } from 'drizzle-orm';
import { SearchQueryParams } from '@/app/api/types';

describe('Work Utils', () => {
    describe('buildWhereConditions', () => {
        let commonParams:SearchQueryParams = { page: '1', pageSize: '10', sortBy: 'kudos', sortOrder: 'asc' };
        beforeEach(() => {
            vi.clearAllMocks(); 
        })
        it('should return undefined when no parameters are provided', () => {
            const params = { ...commonParams };
            const result = buildWhereConditions(params);
            expect(result).toBeUndefined();
        })
        it('should build title condition', () => {
            const params = { ...commonParams, title: 'test' };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(like(works.title, '%test%')));
        })
        it('should build author condition', () => {
            const params = { ...commonParams, author: 'author' };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(like(works.author, '%author%')));
        })
        it('should build isSingleCharacter condition', () => {
            const params = { ...commonParams, isSingleCharacter: true };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(eq(works.chapters, 1)));
        })
        it('should build rating condition', () => {
            const params = { ...commonParams, rating: 'Explicit' };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(eq(works.rating, 'Explicit')));  
        })
        it('should build keyword condition', () => {
            const params = { ...commonParams, keyword: 'keyword' };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(or(
                like(works.title, '%keyword%'),
                like(works.summary, '%keyword%')
            )));
        })
        it('should build multiple conditions', () => {
            const params = { ...commonParams, title: 'test', author: 'author', isSingleCharacter: true, rating: 'Explicit', keyword: 'keyword' };
            const result = buildWhereConditions(params);
            expect(result).toEqual(and(
                like(works.title, '%test%'),
                like(works.author, '%author%'),
                eq(works.chapters, 1),
                eq(works.rating, 'Explicit'),
                or(
                    like(works.title, '%keyword%'),
                    like(works.summary, '%keyword%')
                )
            ));
        })
    })
})