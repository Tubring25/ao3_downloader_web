import { InferSelectModel } from 'drizzle-orm'
import { workComments, works } from '@/lib/db/schema';
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

export type WorkComment = InferSelectModel<typeof workComments> & {
  voteStatus?: number;
}

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

export interface ICreateCommentRequest {
  workId: number;
  content: string;
  authorName: string;
}

export interface IVoteCommentRequest {
  workId: number;
  commentId: number;
  newVoteType: number; // 1 for upvote, -1 for downvote
  prevVoteType: number | undefined; // 1 for upvote, -1 for downvote
}

export interface IGetCommentsQuery {
  workId: number;
  page: number;
  pageSize: number;
  sortBy: 'createdAt' | 'upvotes';
  sortOrder: 'asc' | 'desc';
}

export interface IGetCommentsResponse {
  comments: WorkComment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
}

export interface IGetCommentsResponse {
  comments: WorkComment[];
}

export type Rating = 'General Audiences' | 'Teen And Up Audiences' | 'Mature' | 'Explicit' | 'Not Rated';

export type Warning =
  'Creator Chose Not To Use Archive Warnings' |
  'Graphic Depictions Of Violence' |
  'Major Character Death' |
  'Rape/Non-Con' |
  'Underage Sex' |
  'No Archive Warnings Apply';
