import { InferSelectModel } from 'drizzle-orm'
import { works } from '@/lib/db/schema';
import { z } from 'zod';
import { searchSchema } from './[[...route]]/route';


export type Work = InferSelectModel<typeof works>;
export type GetWorksSortKey = 'kudos' | 'comments' | 'words';
export type SearchQueryParams = z.infer<typeof searchSchema>

export interface IGetWorksQuery {
  page: number;
  pageSize: number;
  search: string;
}

export interface IGetWorksResponse {
  works: Work[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
}

export interface IGetWorkByIdResponse {
  work: Work | null;
}