import { InferSelectModel } from 'drizzle-orm'
import { works } from '@/lib/db/schema';
import { z } from 'zod';
import { searchSchema } from './[[...route]]/route';


export type Work = InferSelectModel<typeof works> & {
  fandoms: string[];
  characters: string[];
  relationships: string[];
  tags: string[];
  categories: string[];
  warnings: Warning[];
  rating: Rating;
};
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
  warnings: string[];
  fandoms: string[];
  characters: string[];
  relationships: string[];
  tags: string[];
  categories: string[];
}

export type Rating = 'General Audiences' | 'Teen And Up Audiences' | 'Mature' | 'Explicit' | 'Not Rated';

export type Warning = 
  'Creator Chose Not To Use Archive Warnings' | 
  'Graphic Depictions Of Violence' | 
  'Major Character Death' | 
  'Rape/Non-Con' | 
  'Underage Sex' | 
  'No Archive Warnings Apply';
